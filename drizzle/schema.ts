import { pgTable, unique, uuid, varchar, boolean, timestamp, foreignKey, numeric, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



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

export const transactions = pgTable("transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	amount: numeric({ precision: 12, scale:  2 }).notNull(),
	cbu: varchar({ length: 22 }),
	description: varchar({ length: 255 }),
	status: varchar({ length: 50 }).default('completed').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	currency: text().default('ARS').notNull(),
	contactId: uuid("contact_id"),
	sourceAccountId: uuid("source_account_id"),
	destinationAccountId: uuid("destination_account_id"),
}, (table) => [
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [contacts.id],
			name: "transactions_contact_id_contacts_id_fk"
		}).onDelete("restrict"),
]);

export const contacts = pgTable("contacts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	alias: text(),
	email: text(),
	isActive: boolean("is_active").default(true).notNull(),
	lastUsedAt: timestamp("last_used_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const contactMethods = pgTable("contact_methods", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	contactId: uuid("contact_id").notNull(),
	type: text().notNull(),
	value: text().notNull(),
	label: text(),
	isDefault: boolean("is_default").default(false).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [contacts.id],
			name: "contact_methods_contact_id_contacts_id_fk"
		}).onDelete("cascade"),
	unique("contact_methods_value_unique").on(table.value),
]);
