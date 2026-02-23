import { pgTable, timestamp, uuid, varchar, boolean } from 'drizzle-orm/pg-core';

export const digitalWallets = pgTable('digital_wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  cvu: varchar('cvu', { length: 22 }).notNull().unique(),
  provider: varchar('provider', { length: 100 }).notNull(), // e.g. MercadoPago, Uala
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
