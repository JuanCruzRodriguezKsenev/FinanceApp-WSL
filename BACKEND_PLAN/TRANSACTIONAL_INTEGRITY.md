# 🛡️ Transactional Integrity & ACID Compliance

To ensure the reliability of the finance system, all state changes involving money movement or complex relationship updates must adhere to ACID principles.

## 1. Atomicity: The "All or Nothing" Rule
We use Drizzle's database transactions to ensure that multi-step operations are atomic.

### Critical Atomic Scenarios:
- **Transfer between accounts:**
  1. Deduct from Source Account.
  2. Add to Destination Account.
  3. Log Transaction record.
- **Allocation to Reserve:**
  1. Update `current_amount` in `financial_targets`.
  2. (Optional) Deduct from Account if using hard-allocation logic.
  3. Create internal ledger entry.

**Implementation Pattern:**
```typescript
await db.transaction(async (tx) => {
  try {
    await tx.update(accounts).set(...).where(...);
    await tx.insert(transactions).values(...);
  } catch (error) {
    tx.rollback(); // Explicit rollback if using manual tx, Drizzle does it on error
    throw error;
  }
});
```

## 2. Consistency: Integrity Constraints
The database is the final guardian of data validity.
- **Foreign Keys:** All relations (`contact_id`, `source_id`, etc.) must have `REFERENCES` with `ON DELETE RESTRICT` for financial auditability.
- **Check Constraints:** 
  - `amount > 0` in transactions.
  - `current_amount <= target_amount` for goals (optional business logic).
  - Valid currency enums ('ARS', 'USD').

## 3. Isolation: Concurrency Control
To prevent "Double Spending" or race conditions:
- **Row-level Locking:** Use `SELECT ... FOR UPDATE` when reading a balance that is about to be modified.
- **Transaction Levels:** Default to `READ COMMITTED`, but use `SERIALIZABLE` for sensitive Net Worth calculations involving historical snapshots.

## 4. Durability: Guaranteed Persistence
Leveraging Neon's (PostgreSQL) write-ahead logging (WAL) ensuring that once a Server Action returns an `Ok` result, the data is physically stored and survives server crashes.

## 5. Result Pattern Integration
Transactions will be wrapped in our functional `Result` pattern:
- **Success:** Returns `Ok<Data>`.
- **Failure:** Any error inside the transaction triggers a rollback and returns an `Err<AppError>` with technical details logged for debugging.
