"use server";

import { Result, ok, err, internalError } from "../../../shared/lib/result";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory, CircuitBreakerOpenError } from "../../../shared/lib/circuit-breaker";
import { getAddBankAccountSchema, AddBankAccountInput } from "../schemas";
import { cookies } from "next/headers";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { db } from "../../../shared/lib/db";
import { bankAccounts } from "../schema.db";

const dbBreaker = CircuitBreakerFactory.database("bank-accounts-db");

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
      const [inserted] = await db.insert(bankAccounts).values({
        cbu: validData.cbu,
        alias: validData.alias,
        bankName: validData.bankName,
      }).returning();
      
      return inserted;
    });
    
    return ok(result);
  } catch (error) {
    if (error instanceof CircuitBreakerOpenError) {
      return err(internalError(baDict.errorMessage || "Database temporarily unavailable", { circuitStatus: "OPEN" }));
    }
    return err(internalError(baDict.errorMessage || "An error occurred while adding the bank account", { 
      details: error instanceof Error ? error.message : "Unknown" 
    }));
  }
}
