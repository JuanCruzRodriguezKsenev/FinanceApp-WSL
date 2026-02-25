import { db } from "../../../shared/lib/db";
import { bankAccounts } from "../schema.db";
import { financialTargets } from "../../goals/schema.db";
import { desc, sql, eq } from "drizzle-orm";
import type { AddBankAccountInput } from "../schemas";

export const bankAccountRepository = {
  async findAllWithLockedBalance() {
    return await db.select({
      id: bankAccounts.id,
      cbu: bankAccounts.cbu,
      alias: bankAccounts.alias,
      bankName: bankAccounts.bankName,
      balance: bankAccounts.balance,
      currency: bankAccounts.currency,
      locked: sql<string>`(SELECT COALESCE(SUM(${financialTargets.currentAmount}), 0) FROM ${financialTargets} WHERE ${financialTargets.bankAccountId} = ${bankAccounts.id})`
    })
    .from(bankAccounts)
    .where(eq(bankAccounts.isActive, true))
    .orderBy(desc(bankAccounts.createdAt));
  },

  async create(validData: AddBankAccountInput) {
    const [inserted] = await db.insert(bankAccounts).values({
      cbu: validData.cbu,
      alias: validData.alias,
      bankName: validData.bankName,
      balance: validData.balance.toString(),
      currency: validData.currency,
    }).returning();
    
    return inserted;
  }
};
