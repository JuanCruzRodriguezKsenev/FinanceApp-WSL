import { pgTable, uuid, numeric, varchar, timestamp, unique, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const transactions = pgTable("transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	amount: numeric({ precision: 12, scale:  2 }).notNull(),
	cbu: varchar({ length: 22 }).notNull(),
	description: varchar({ length: 255 }),
	status: varchar({ length: 50 }).default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const bankAccounts = pgTable("bank_accounts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cbu: varchar({ length: 22 }).notNull(),
	alias: varchar({ length: 50 }).notNull(),
	bankName: varchar("bank_name", { length: 100 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("bank_accounts_cbu_unique").on(table.cbu),
]);

export const digitalWallets = pgTable("digital_wallets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cvu: varchar({ length: 22 }).notNull(),
	provider: varchar({ length: 100 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("digital_wallets_cvu_unique").on(table.cvu),
]);
