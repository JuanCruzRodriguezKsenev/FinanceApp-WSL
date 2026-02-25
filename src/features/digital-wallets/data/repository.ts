import { db } from "../../../shared/lib/db";
import { digitalWallets } from "../schema.db";
import { financialTargets } from "../../goals/schema.db";
import { desc, sql, eq } from "drizzle-orm";
import type { AddWalletInput } from "../schemas";

export const digitalWalletRepository = {
  async findAllWithLockedBalance() {
    return await db.select({
      id: digitalWallets.id,
      cvu: digitalWallets.cvu,
      provider: digitalWallets.provider,
      balance: digitalWallets.balance,
      currency: digitalWallets.currency,
      locked: sql<string>`(SELECT COALESCE(SUM(${financialTargets.currentAmount}), 0) FROM ${financialTargets} WHERE ${financialTargets.digitalWalletId} = ${digitalWallets.id})`
    })
    .from(digitalWallets)
    .where(eq(digitalWallets.isActive, true))
    .orderBy(desc(digitalWallets.createdAt));
  },

  async create(validData: AddWalletInput) {
    const [inserted] = await db.insert(digitalWallets).values({
      cvu: validData.cvu,
      provider: validData.provider,
      balance: validData.balance.toString(),
      currency: validData.currency,
    }).returning();
    
    return inserted;
  }
};
