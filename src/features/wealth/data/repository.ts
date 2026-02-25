import { db } from "../../../shared/lib/db";
import { assets, liabilities, creditCards } from "../schema.db";
import { desc, eq } from "drizzle-orm";
import type { AssetInput, LiabilityInput, CreditCardInput } from "../schemas";

export const wealthRepository = {
  // --- ASSETS ---
  async getAssets() {
    return await db.select().from(assets).where(eq(assets.isActive, true)).orderBy(desc(assets.createdAt));
  },
  
  async createAsset(data: AssetInput) {
    const [inserted] = await db.insert(assets).values({
      name: data.name,
      type: data.type,
      value: data.value.toString(),
      currency: data.currency,
      tickerSymbol: data.tickerSymbol || null,
    }).returning();
    return inserted;
  },

  // --- LIABILITIES ---
  async getLiabilities() {
    return await db.select().from(liabilities).where(eq(liabilities.isActive, true)).orderBy(desc(liabilities.createdAt));
  },

  async createLiability(data: LiabilityInput) {
    const [inserted] = await db.insert(liabilities).values({
      name: data.name,
      type: data.type,
      amount: data.amount.toString(),
      currency: data.currency,
    }).returning();
    return inserted;
  },

  // --- CREDIT CARDS ---
  async getCreditCards() {
    return await db.select().from(creditCards).where(eq(creditCards.isActive, true)).orderBy(desc(creditCards.createdAt));
  },

  async createCreditCard(data: CreditCardInput) {
    const [inserted] = await db.insert(creditCards).values({
      name: data.name,
      bankName: data.bankName,
      limit: data.limit.toString(),
      currency: data.currency,
      closingDay: data.closingDay || null,
      dueDay: data.dueDay || null,
      autoDebit: data.autoDebit,
      currentBalance: data.currentBalance.toString(),
    }).returning();
    return inserted;
  }
};
