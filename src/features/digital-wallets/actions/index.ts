"use server";

import { Result, ok, err, internalError } from "../../../shared/lib/result";
import { logger } from "../../../shared/lib/logger";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory, CircuitBreakerOpenError } from "../../../shared/lib/circuit-breaker";
import { getAddWalletSchema, AddWalletInput } from "../schemas";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { db } from "../../../shared/lib/db";
import { digitalWallets } from "../schema.db";
import { desc } from "drizzle-orm";

// Resiliencia doble: Un breaker para la DB y otro para la API externa.
const dbBreaker = CircuitBreakerFactory.database("digital-wallets-db");

export async function getDigitalWallets(): Promise<Result<any[]>> {
  try {
    const result = await dbBreaker.execute(async () => {
      return await db.select().from(digitalWallets).orderBy(desc(digitalWallets.createdAt));
    });
    return ok(result);
  } catch (error: any) {
    return err(internalError("Error fetching digital wallets", { details: error.message }));
  }
}
const apiBreaker = CircuitBreakerFactory.externalAPI("payment-gateway");

// Mock de validación con API de pasarela (e.g. MercadoPago / Coelms)
const validateWalletExternal = async (cvu: string, provider: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.85) reject(new Error("External API Timeout"));
      resolve({ valid: true, owner: "User Name" });
    }, 400);
  });
};

export async function addDigitalWallet(input: unknown): Promise<Result<any>> {
  const cookieStore = await cookies();
  const currentLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const dict = await getDictionary(currentLocale);
  const walletDict = (dict as any).digitalWallets || {};
  
  const localizedSchema = getAddWalletSchema(walletDict);
  const validation = await validateSchema(input, localizedSchema);
  
  if (!validation.isOk) return err(validation.error);
  const validData = validation.value as AddWalletInput;

  // 1. Validar la CVU/Billetera en la API Externa protegida por su propio Breaker
  try {
    await apiBreaker.execute(() => validateWalletExternal(validData.cvu, validData.provider));
  } catch (error) {
     if (error instanceof CircuitBreakerOpenError) {
        return err(internalError(walletDict.apiErrorMessage || "Payment gateway unavailable", { circuitStatus: "OPEN" }));
     }
     return err(internalError(walletDict.validationFailed || "Wallet validation failed via External API"));
  }

  // 2. Insertar en la base de datos protegida por el Breaker de DB
  try {
    const result = await dbBreaker.execute(async () => {
      const [inserted] = await db.insert(digitalWallets).values({
        cvu: validData.cvu,
        provider: validData.provider,
      }).returning();
      
      return inserted;
    });
    
    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    console.error(">>> DB ERROR DEBUG (WALLETS) <<<", error);
    
    const errorMessage = error.message || "";
    const errorDetail = error.detail || "";
    
    if (error instanceof CircuitBreakerOpenError) {
      return err(internalError(walletDict.dbErrorMessage || "Database temporarily unavailable", { circuitStatus: "OPEN" }));
    }

    if (
      error.code === "23505" || 
      errorMessage.toLowerCase().includes("unique") || 
      errorDetail.toLowerCase().includes("already exists") ||
      errorMessage.toLowerCase().includes("already exists") ||
      errorMessage.toLowerCase().includes("duplicate")
    ) {
      return err(internalError(walletDict.uniqueCvuError || "A wallet with this CVU is already linked"));
    }

    return err(internalError(walletDict.dbErrorMessage || "An error occurred while adding the wallet", { 
      technical: errorMessage,
      detail: errorDetail,
      dbCode: error.code
    }));
  }
}
