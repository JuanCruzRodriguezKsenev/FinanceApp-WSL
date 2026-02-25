"use server";

import { Result, ok, err, internalError } from "../../../shared/lib/result";
import { logger } from "../../../shared/lib/logger";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory } from "../../../shared/lib/circuit-breaker";
import { getCreateGoalSchema, CreateGoalInput, getAllocateAmountSchema, AllocateAmountInput } from "../schemas";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { db } from "../../../shared/lib/db";
import { financialTargets } from "../schema.db";
import { desc, eq, sql } from "drizzle-orm";

const dbBreaker = CircuitBreakerFactory.database("goals-db");

/**
 * Obtiene la lista de objetivos y reservas.
 */
export async function getGoals(): Promise<Result<any[]>> {
  try {
    const result = await dbBreaker.execute(async () => {
      return await db.select().from(financialTargets).where(eq(financialTargets.isActive, true)).orderBy(desc(financialTargets.createdAt));
    });
    return ok(result);
  } catch (error: any) {
    return err(internalError("Error fetching goals", { details: error.message }));
  }
}

/**
 * Crea un nuevo objetivo o reserva.
 */
export async function createGoal(input: unknown): Promise<Result<any>> {
  const cookieStore = await cookies();
  const currentLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const dict = await getDictionary(currentLocale);
  const goalsDict = dict.goals;

  const validation = await validateSchema(input, getCreateGoalSchema(goalsDict));
  if (!validation.isOk) return err(validation.error);

  const validData = validation.value as CreateGoalInput;

  try {
    const result = await dbBreaker.execute(async () => {
      const [inserted] = await db.insert(financialTargets).values({
        name: validData.name,
        type: validData.type,
        targetAmount: validData.targetAmount.toString(),
        currency: validData.currency,
        bankAccountId: validData.bankAccountId,
        digitalWalletId: validData.digitalWalletId,
        deadline: validData.deadline ? new Date(validData.deadline) : null,
      }).returning();
      return inserted;
    });

    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    logger.fatal({ breaker: "goals-db", error: error.message }, "Error creating goal");
    return err(internalError(goalsDict.errorMessage, { details: error.message }));
  }
}

/**
 * Destina dinero a un objetivo (ACID Transactional).
 */
export async function allocateMoney(input: unknown): Promise<Result<any>> {
  const cookieStore = await cookies();
  const currentLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const dict = await getDictionary(currentLocale);
  const goalsDict = dict.goals;

  const validation = await validateSchema(input, getAllocateAmountSchema(goalsDict));
  if (!validation.isOk) return err(validation.error);

  const { goalId, amount } = validation.value as AllocateAmountInput;

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Actualizar el monto acumulado del objetivo
      const [updated] = await tx.update(financialTargets)
        .set({ 
          currentAmount: sql`${financialTargets.currentAmount} + ${amount.toString()}`,
          updatedAt: sql`now()`
        })
        .where(eq(financialTargets.id, goalId))
        .returning();

      if (!updated) throw new Error("Goal not found");

      return updated;
    });

    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    return err(internalError("Error allocating money to goal", { details: error.message }));
  }
}
