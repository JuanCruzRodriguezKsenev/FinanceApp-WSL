import { pgTable, text, timestamp, uuid, varchar, boolean, numeric } from 'drizzle-orm/pg-core';

export const bankAccounts = pgTable('bank_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  cbu: varchar('cbu', { length: 22 }).notNull().unique(),
  alias: varchar('alias', { length: 50 }).notNull(),
  bankName: varchar('bank_name', { length: 100 }).notNull(),
  balance: numeric('balance', { precision: 12, scale: 2 }).default('0').notNull(),
  currency: text('currency', { enum: ['ARS', 'USD'] }).default('ARS').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
