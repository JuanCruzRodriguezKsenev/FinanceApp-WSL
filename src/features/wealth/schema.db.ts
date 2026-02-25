import { pgTable, text, timestamp, uuid, numeric, boolean, integer } from 'drizzle-orm/pg-core';

// ACTIVO (Inmuebles, Acciones, Cripto, Efectivo)
export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type', { enum: ['REAL_ESTATE', 'STOCKS', 'CASH', 'CRYPTO', 'OTHER'] }).notNull(),
  value: numeric('value', { precision: 15, scale: 2 }).default('0').notNull(),
  currency: text('currency', { enum: ['ARS', 'USD'] }).default('USD').notNull(),
  tickerSymbol: text('ticker_symbol'), // Metadata API-First (ej: AAPL, BTC)
  providerId: text('provider_id'),     // Metadata API-First
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// PASIVOS (Préstamos, Hipotecas, Deudas personales)
export const liabilities = pgTable('liabilities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type', { enum: ['PERSONAL_LOAN', 'MORTGAGE', 'OTHER'] }).notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).default('0').notNull(),
  currency: text('currency', { enum: ['ARS', 'USD'] }).default('ARS').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// TARJETAS DE CRÉDITO
export const creditCards = pgTable('credit_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // ej: "Visa Signature"
  bankName: text('bank_name').notNull(),
  limit: numeric('limit', { precision: 15, scale: 2 }).default('0').notNull(),
  currency: text('currency', { enum: ['ARS', 'USD'] }).default('ARS').notNull(),
  closingDay: integer('closing_day'), // Día del mes (1-31)
  dueDay: integer('due_day'),         // Día del mes (1-31)
  autoDebit: boolean('auto_debit').default(false).notNull(),
  currentBalance: numeric('current_balance', { precision: 15, scale: 2 }).default('0').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
