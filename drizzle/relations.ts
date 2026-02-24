import { relations } from "drizzle-orm/relations";
import { contacts, transactions, contactMethods } from "./schema";

export const transactionsRelations = relations(transactions, ({one}) => ({
	contact: one(contacts, {
		fields: [transactions.contactId],
		references: [contacts.id]
	}),
}));

export const contactsRelations = relations(contacts, ({many}) => ({
	transactions: many(transactions),
	contactMethods: many(contactMethods),
}));

export const contactMethodsRelations = relations(contactMethods, ({one}) => ({
	contact: one(contacts, {
		fields: [contactMethods.contactId],
		references: [contacts.id]
	}),
}));