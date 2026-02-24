import { pgTable, text, timestamp, decimal, uuid, varchar } from 'drizzle-orm/pg-core';
import { contacts } from '../contacts/schema.db';
import { relations } from 'drizzle-orm';

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('ARS').notNull(),
  cbu: varchar('cbu', { length: 22 }), 
  description: varchar('description', { length: 255 }),
  status: varchar('status', { length: 50 }).default('completed').notNull(),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'restrict' }),
  sourceAccountId: uuid('source_account_id'), 
  destinationAccountId: uuid('destination_account_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  contact: one(contacts, {
    fields: [transactions.contactId],
    references: [contacts.id],
  }),
}));
