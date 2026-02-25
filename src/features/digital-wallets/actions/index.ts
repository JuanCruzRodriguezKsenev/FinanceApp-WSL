"use server";

import { Result, ok, err, internalError, conflictError } from "../../../shared/lib/result";
import { logger } from "../../../shared/lib/logger";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory, CircuitBreakerOpenError } from "../../../shared/lib/circuit-breaker";
import { getAddWalletSchema, AddWalletInput } from "../schemas";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { digitalWalletRepository } from "../data/repository";

// Resiliencia doble: Un breaker para la DB y otro para la API externa.
const dbBreaker = CircuitBreakerFactory.database("digital-wallets-db");

export async function getDigitalWallets(): Promise<Result<any[]>> {
  try {
    const result = await dbBreaker.execute(async () => {
      return await digitalWalletRepository.findAllWithLockedBalance();
    });
    return ok(result);
  } catch (error: any) {
    console.error("DEBUG: Wallet Fetch Error Object:");
    console.dir(error, { depth: null });
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
      return await digitalWalletRepository.create(validData);
    });
    
    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    console.error(">>> DB ERROR DEBUG (WALLETS) <<<", error);
    
    const errorMessage = error.message || "";
    const errorDetail = error.detail || "";
    const errorCause = (error.cause as any);
    const errorCauseMessage = errorCause?.message || "";
    const errorCauseCode = errorCause?.code || "";
    
    const fullErrorSearch = `${errorMessage} ${errorDetail} ${errorCauseMessage} ${errorCauseCode}`.toLowerCase();
    
    if (error instanceof CircuitBreakerOpenError) {
      return err(internalError(walletDict.dbErrorMessage || "Database temporarily unavailable", { circuitStatus: "OPEN" }));
    }

    if (
      error.code === "23505" || 
      errorCauseCode === "23505" ||
      fullErrorSearch.includes("unique constraint") || 
      fullErrorSearch.includes("already exists") ||
      fullErrorSearch.includes("duplicate")
    ) {
      return err(conflictError(walletDict.uniqueCvuError || "A wallet with this CVU is already linked", "cvu"));
    }

    return err(internalError(walletDict.dbErrorMessage || "An error occurred while adding the wallet", { 
      technical: errorMessage,
      detail: errorDetail,
      cause: errorCauseMessage,
      dbCode: error.code || errorCauseCode
    }));
  }
}
