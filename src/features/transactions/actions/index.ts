"use server";

import { Result, ok, err, internalError, conflictError } from "../../../shared/lib/result";
import { logger } from "../../../shared/lib/logger";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory, CircuitBreakerOpenError } from "../../../shared/lib/circuit-breaker";
import { getCreateTransactionSchema, CreateTransactionInput } from "../schemas";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { db } from "../../../shared/lib/db";
import { transactions } from "../schema.db";
import { contacts } from "../../contacts/schema.db";
import { desc, eq, sql } from "drizzle-orm";

// Obtenemos una instancia global del Circuit Breaker para la Base de Datos
const dbBreaker = CircuitBreakerFactory.database("main-db");

export async function getTransactions(): Promise<Result<any[]>> {
  try {
    const result = await dbBreaker.execute(async () => {
      return await db.query.transactions.findMany({
        with: {
          contact: true,
        },
        orderBy: [desc(transactions.createdAt)]
      });
    });
    return ok(result);
  } catch (error: any) {
    return err(internalError("Error fetching transactions", { details: error.message }));
  }
}

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
      return await db.transaction(async (tx) => {
        // Inserción real con Drizzle ORM a PostgreSQL
        const [inserted] = await tx.insert(transactions).values({
          amount: validData.amount.toString(),
          currency: validData.currency,
          cbu: validData.cbu,
          description: validData.description,
          status: "completed",
          contactId: validData.contactId,
          sourceAccountId: validData.sourceAccountId,
          destinationAccountId: validData.destinationAccountId,
        }).returning();

        // 3. Si hay un contacto, actualizar su fecha de último uso (ACID)
        if (validData.contactId) {
          await tx.update(contacts)
            .set({ lastUsedAt: sql`now()` })
            .where(eq(contacts.id, validData.contactId));
        }
        
        return inserted;
      });
    });
    
    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    console.error(">>> DB ERROR DEBUG (TRANSACTIONS) <<<", error);
    
    const errorMessage = error.message || "";
    const errorDetail = error.detail || "";
    const errorCause = (error.cause as any);
    const errorCauseMessage = errorCause?.message || "";
    const errorCauseCode = errorCause?.code || "";
    
    const fullErrorSearch = `${errorMessage} ${errorDetail} ${errorCauseMessage} ${errorCauseCode}`.toLowerCase();

    if (error instanceof CircuitBreakerOpenError) {
      return err(internalError(dict.transactions.errorMessage, { circuitStatus: "OPEN" }));
    }

    if (
      error.code === "23505" || 
      errorCauseCode === "23505" ||
      fullErrorSearch.includes("unique constraint") || 
      fullErrorSearch.includes("already exists") ||
      fullErrorSearch.includes("duplicate")
    ) { 
      return err(conflictError(dict.transactions.uniqueCbuError || "A transaction with this CBU already exists", "cbu"));
    }

    return err(internalError(dict.transactions.errorMessage, { 
      technical: errorMessage,
      detail: errorDetail,
      cause: errorCauseMessage,
      dbCode: error.code || errorCauseCode
    }));
  }
}
