import { pgTable, text, timestamp, decimal, uuid, varchar } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  cbu: varchar('cbu', { length: 22 }).notNull(),
  description: varchar('description', { length: 255 }),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
