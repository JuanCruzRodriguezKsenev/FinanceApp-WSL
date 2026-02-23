# Bank Accounts Feature 🏦

## Responsibility
Allows users to register and manage their traditional bank accounts (CBU/Alias).

## Core Logic
- **Server Action**: `addBankAccount` - Uses Drizzle to persist account data.
- **Resilience**: Protected by `bank-accounts-db` Circuit Breaker.
- **Validation**: Validates CBU format and Alias uniqueness (implied).

## UI Components
- `BankAccountForm`: Leverages React 19 `formAction` for native-like performance and progressive enhancement.

## Schema
- `cbu`: Unique 22-digit identifier.
- `alias`: Human-readable identifier.
- `bankName`: Name of the financial institution.
