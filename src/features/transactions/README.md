# Transactions Feature 💸

## Responsibility
Handles the creation and management of financial transfers between accounts.

## Core Logic
- **Server Action**: `createTransaction` - Validates input and executes DB insertion.
- **Resilience**: Wrapped in a `CircuitBreaker` ("main-db").
- **Validation**: Strict Zod schema with localized error messages.

## UI Components
- `TransactionForm`: Uses `useAction` for manual submission handling and immediate feedback.

## Schema
- `amount`: Decimal (stored as string in PG for precision).
- `cbu`: 22-digit string.
- `description`: Optional text.
- `status`: Enum (completed, pending, failed).
