import { db } from "../../../shared/lib/db";
import { transactions } from "../schema.db";
import { contacts } from "../../contacts/schema.db";
import { bankAccounts } from "../../bank-accounts/schema.db";
import { digitalWallets } from "../../digital-wallets/schema.db";
import { desc, eq, sql } from "drizzle-orm";
import type { CreateTransactionInput } from "../schemas";

/**
 * Data Access Layer para Transacciones.
 * Abstrae las consultas SQL directas de la capa de casos de uso (Server Actions).
 */
export const transactionRepository = {
  /**
   * Obtiene todas las transacciones ordenadas por fecha de creación descendente.
   */
  async findAll() {
    return await db.query.transactions.findMany({
      with: {
        contact: true,
      },
      orderBy: [desc(transactions.createdAt)]
    });
  },

  /**
   * Crea una transacción y actualiza los saldos correspondientes.
   * IMPORTANTE: Esta función debe ejecutarse dentro de un bloque `db.transaction()` o similar
   * para garantizar la atomicidad (ACID). Para ello, recibe el objeto `tx` de Drizzle.
   * 
   * @param validData Datos validados de la transacción
   * @param tx Objeto de transacción de Drizzle
   */
  async createWithBalances(validData: CreateTransactionInput, tx: any) {
    // 1. Descontar de la cuenta origen
    if (validData.sourceAccountId) {
      // Intentamos en bancos
      const [updatedBank] = await tx.update(bankAccounts)
        .set({ balance: sql`${bankAccounts.balance} - ${validData.amount.toString()}` })
        .where(eq(bankAccounts.id, validData.sourceAccountId))
        .returning();
      
      if (!updatedBank) {
        // Intentamos en billeteras
        await tx.update(digitalWallets)
          .set({ balance: sql`${digitalWallets.balance} - ${validData.amount.toString()}` })
          .where(eq(digitalWallets.id, validData.sourceAccountId));
      }
    }

    // 2. Sumar a la cuenta destino (si es una transferencia propia)
    if (validData.destinationAccountId) {
       const [updatedBankDest] = await tx.update(bankAccounts)
        .set({ balance: sql`${bankAccounts.balance} + ${validData.amount.toString()}` })
        .where(eq(bankAccounts.id, validData.destinationAccountId))
        .returning();
      
      if (!updatedBankDest) {
        await tx.update(digitalWallets)
          .set({ balance: sql`${digitalWallets.balance} + ${validData.amount.toString()}` })
          .where(eq(digitalWallets.id, validData.destinationAccountId));
      }
    }

    // 3. Inserción real de la transacción
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

    // 4. Si hay un contacto, actualizar su fecha de último uso
    if (validData.contactId) {
      await tx.update(contacts)
        .set({ lastUsedAt: sql`now()` })
        .where(eq(contacts.id, validData.contactId));
    }
    
    return inserted;
  }
};
