"use server";

import { Result, ok, err, internalError } from "../../../shared/lib/result";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory, CircuitBreakerOpenError } from "../../../shared/lib/circuit-breaker";
import { getCreateTransactionSchema, CreateTransactionInput } from "../schemas";
import { cookies } from "next/headers";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { db } from "../../../shared/lib/db";
import { transactions } from "../schema.db";

// Obtenemos una instancia global del Circuit Breaker para la Base de Datos
const dbBreaker = CircuitBreakerFactory.database("main-db");

export async function createTransaction(input: unknown): Promise<Result<any>> {
  // Obtenemos el diccionario del idioma actual de la petición (Server Action)
  const cookieStore = await cookies();
  const currentLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const dict = await getDictionary(currentLocale);

  // 1. Validar la entrada con Zod asíncronamente (con mensajes localizados)
  const localizedSchema = getCreateTransactionSchema(dict.transactions);
  const validation = await validateSchema(input, localizedSchema);
  
  if (!validation.isOk) return err(validation.error);

  const validData = validation.value as CreateTransactionInput;

  // 2. Ejecutar la operación de base de datos protegida
  try {
    const result = await dbBreaker.execute(async () => {
      // Inserción real con Drizzle ORM a PostgreSQL
      const [inserted] = await db.insert(transactions).values({
        amount: validData.amount.toString(), // numeric decimal in pg maps to string or number, string is safer
        cbu: validData.cbu,
        description: validData.description,
        status: "completed" // asumiendo flujo sincrono ideal
      }).returning();
      
      return inserted;
    });
    
    return ok(result);
  } catch (error) {
    if (error instanceof CircuitBreakerOpenError) {
      return err(internalError(dict.transactions.errorMessage, { circuitStatus: "OPEN" }));
    }
    return err(internalError(dict.transactions.errorMessage, { 
      details: error instanceof Error ? error.message : "Unknown" 
    }));
  }
}
