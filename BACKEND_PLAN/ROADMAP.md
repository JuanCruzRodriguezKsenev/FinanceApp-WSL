# Backend Roadmap

## Phase 1: Contacts & Method Linking [COMPLETED]
- [x] Implement `contacts` and `contact_methods` tables.
- [x] UI for managing frequently paid accounts (ContactForm & List).
- [x] ACID Compliance: Atomic creation of contact + first method.
- [ ] Logic to suggest "Last Used" contact method during transaction creation (Pending Phase 2 integration).

## Phase 2: Transaction Overhaul [COMPLETED]
- [x] Migration to Source/Destination architecture (Relations implemented).
- [x] Support for Transfers between own accounts (Implemented in TransactionForm).
- [x] ACID Compliance: Atomic transaction creation + Contact usage update.
- [x] Multicurrency metadata storage and ARS/USD UI support.

## Phase 3: Goals & Reserves [COMPLETED]
- [x] Implementation of `financial_targets` (Goals/Reserves).
- [x] Virtual balance deduction logic (Available Balance implemented in UI).
- [x] Allocation API endpoints (`allocateMoney`).
- [x] UI for creating and managing goals with progress bars.
- [x] Real balance impact: Transactions now deduct from source and add to destination accounts (ACID).

## Phase 4: Wealth Management
- Assets and Liabilities module.
- Credit Card management (Closing/Due dates and auto-recurrence).
- Net Worth dashboard with historical snapshots.
