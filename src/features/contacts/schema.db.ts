import { pgTable, text, timestamp, uuid, unique, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  alias: text('alias'),
  email: text('email'),
  isActive: boolean('is_active').default(true).notNull(),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contactMethods = pgTable('contact_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // 'CBU', 'CVU', 'Alias', 'WalletAddress'
  value: text('value').notNull(),
  label: text('label'), // e.g., 'Main Bank Account', 'Mercado Pago'
  isDefault: boolean('is_default').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  unique('contact_methods_value_unique').on(table.value),
]);

export const contactsRelations = relations(contacts, ({ many }) => ({
  methods: many(contactMethods),
}));

export const contactMethodsRelations = relations(contactMethods, ({ one }) => ({
  contact: one(contacts, {
    fields: [contactMethods.contactId],
    references: [contacts.id],
  }),
}));
