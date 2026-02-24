"use server";

import { Result, ok, err, internalError } from "../../../shared/lib/result";
import { logger } from "../../../shared/lib/logger";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory, CircuitBreakerOpenError } from "../../../shared/lib/circuit-breaker";
import { getAddBankAccountSchema, AddBankAccountInput } from "../schemas";
import { cookies } from "next/headers";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { db } from "../../../shared/lib/db";
import { bankAccounts } from "../schema.db";
import { desc } from "drizzle-orm";

const dbBreaker = CircuitBreakerFactory.database("bank-accounts-db");

export async function getBankAccounts(): Promise<Result<any[]>> {
  try {
    const result = await dbBreaker.execute(async () => {
      return await db.select().from(bankAccounts).orderBy(desc(bankAccounts.createdAt));
    });
    return ok(result);
  } catch (error: any) {
    return err(internalError("Error fetching bank accounts", { details: error.message }));
  }
}

export async function addBankAccount(input: unknown): Promise<Result<any>> {
  const cookieStore = await cookies();
  const currentLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const dict = await getDictionary(currentLocale);

  // Intentamos obtener el diccionario de bankAccounts o usamos fallback si no existe aún en los diccionarios
  const baDict = (dict as any).bankAccounts || {};
  
  const localizedSchema = getAddBankAccountSchema(baDict);
  const validation = await validateSchema(input, localizedSchema);
  
  if (!validation.isOk) return err(validation.error);

  const validData = validation.value as AddBankAccountInput;

  try {
    const result = await dbBreaker.execute(async () => {
      // Dejamos que la DB genere el ID para mayor compatibilidad con defaults
      const [inserted] = await db.insert(bankAccounts).values({
        cbu: validData.cbu,
        alias: validData.alias,
        bankName: validData.bankName,
      }).returning();
      
      return inserted;
    });
    
    return ok(result);
  } catch (error: any) {
    // CAPTURA TOTAL: Logueamos el objeto error completo a la consola para ver propiedades ocultas
    console.error(">>> DB ERROR DEBUG START <<<");
    console.error("Code:", error.code);
    console.error("Detail:", error.detail);
    console.error("Hint:", error.hint);
    console.error("Message:", error.message);
    console.error("Object:", error);
    console.error(">>> DB ERROR DEBUG END <<<");

    if (error instanceof CircuitBreakerOpenError) {
      return err(internalError(baDict.errorMessage || "Database temporarily unavailable", { circuitStatus: "OPEN" }));
    }

    const errorMessage = error.message || "";
    const errorDetail = error.detail || "";
    
    // Detección mejorada de duplicados (Postgres code 23505)
    if (
      error.code === "23505" || 
      errorMessage.toLowerCase().includes("unique") || 
      errorDetail.toLowerCase().includes("already exists") ||
      errorMessage.toLowerCase().includes("already exists") ||
      errorMessage.toLowerCase().includes("duplicate")
    ) { 
      return err(internalError(baDict.uniqueCbuError || "A bank account with this CBU already exists"));
    }

    // Si nada de lo anterior coincide, devolvemos el detalle técnico para el frontend (SOLO EN DESARROLLO/DEBUG)
    return err(internalError(baDict.errorMessage || "An error occurred while adding the bank account", { 
      technical: errorMessage,
      detail: errorDetail,
      dbCode: error.code
    }));
  }
}
