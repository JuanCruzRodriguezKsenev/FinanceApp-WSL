import { db } from "../db";
import { financialTargets } from "../../../features/goals/schema.db";
import { eq, sql } from "drizzle-orm";

/**
 * Calcula el monto total "bloqueado" en reservas y objetivos para una cuenta específica.
 */
export async function getLockedBalance(accountId: string): Promise<number> {
  const result = await db.select({
    total: sql<string>`sum(current_amount)`
  })
  .from(financialTargets)
  .where(eq(financialTargets.bankAccountId, accountId)) // O digitalWalletId
  .execute();

  return Number(result[0]?.total || 0);
}

/**
 * Estructura para representar un balance consolidado.
 */
export interface ConsolidatedBalance {
  total: number;
  locked: number;
  available: number;
  currency: string;
}

// Nota: En una implementación real, sumaríamos las transacciones para obtener el total real.
// Por ahora, como los balances de cuentas son estáticos o manuales, este servicio
// servirá como bridge para la visualización.
