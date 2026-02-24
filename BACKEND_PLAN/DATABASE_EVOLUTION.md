# Database Evolution: Drizzle Schema Design

## 1. Contacts and ContactMethods
Support for "Who did I pay?" or "Who paid me?" with saved account details.

```typescript
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  alias: text('alias'),
  lastUsedAt: timestamp('last_used_at'),
});

export const contactMethods = pgTable('contact_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'CBU', 'CVU', 'Alias', 'WalletAddress'
  value: text('value').notNull(),
  label: text('label'), // e.g., 'Mercado Pago Account'
}, (table) => [
  unique('contact_value_unique').on(table.value),
]);
```
*ACID Note: Using 'cascade' for contact methods but 'restrict' for transactions to ensure history is preserved.*

## 2. FinancialTargets (Goals & Reserves)
Money deducted from actual balances but logically separated.

```typescript
export const financialTargets = pgTable('financial_targets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  targetAmount: numeric('target_amount').notNull(),
  currentAmount: numeric('current_amount').default('0'),
  currency: text('currency').notNull(), // ARS, USD
  linkedAccountId: uuid('linked_account_id').references(() => accounts.id),
  type: text('type').notNull(), // 'GOAL', 'RESERVE'
});
```
*Logic: When $X is allocated to a reserve, the "Available Balance" of `linkedAccountId` is calculated as `actualBalance - currentAmount`.*

## 3. Wealth Management: Assets & Liabilities
```typescript
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'Real Estate', 'Stock', 'Cash', 'Debt'
  valuation: numeric('valuation').notNull(),
  currency: text('currency').notNull(),
  ticker: text('ticker'),
  providerId: text('provider_id').default('manual'),
});
```

## 4. Credit Cards
```typescript
export const creditCards = pgTable('credit_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  limit: numeric('limit'),
  currency: text('currency').notNull(),
  closingDay: integer('closing_day'),
  dueDay: integer('due_day'),
  autoDebitAccountId: uuid('auto_debit_account_id').references(() => accounts.id),
});
```

## 5. Transaction Refactoring
Support for source/destination relations (Transfers, Payments).

```typescript
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: numeric('amount').notNull(),
  currency: text('currency').notNull(),
  sourceId: uuid('source_id'), // Account or Credit Card
  destinationId: uuid('destination_id'), // Account, Contact, or Category
  status: text('status').default('confirmed'), // 'pending_review', 'confirmed'
  isRecurring: boolean('is_recurring').default(false),
  metadata: jsonb('metadata'),
});
```
