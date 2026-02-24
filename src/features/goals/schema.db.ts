import { pgTable, text, timestamp, uuid, numeric, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { bankAccounts } from '../bank-accounts/schema.db';
import { digitalWallets } from '../digital-wallets/schema.db';

export const financialTargets = pgTable('financial_targets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type', { enum: ['GOAL', 'RESERVE'] }).notNull(),
  targetAmount: numeric('target_amount', { precision: 12, scale: 2 }).notNull(),
  currentAmount: numeric('current_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  currency: text('currency', { enum: ['ARS', 'USD'] }).default('ARS').notNull(),
  
  // Link to either a bank account or a digital wallet
  bankAccountId: uuid('bank_account_id').references(() => bankAccounts.id, { onDelete: 'set null' }),
  digitalWalletId: uuid('digital_wallet_id').references(() => digitalWallets.id, { onDelete: 'set null' }),
  
  isActive: boolean('is_active').default(true).notNull(),
  deadline: timestamp('deadline'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const financialTargetsRelations = relations(financialTargets, ({ one }) => ({
  bankAccount: one(bankAccounts, {
    fields: [financialTargets.bankAccountId],
    references: [bankAccounts.id],
  }),
  digitalWallet: one(digitalWallets, {
    fields: [financialTargets.digitalWalletId],
    references: [digitalWallets.id],
  }),
}));
