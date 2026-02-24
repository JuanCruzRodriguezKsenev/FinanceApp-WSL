# Architecture & Integration

## Vertical Slice Communication
Each slice (e.g., Transactions, Accounts, Wealth) is self-contained but communicates through:
1.  **Shared Types**: Core entities (Account, Transaction) defined in a shared domain.
2.  **Transactional Services**: Cross-slice operations use a single DB transaction context to maintain ACID compliance.
3.  **Event Bus (Internal)**: To trigger side effects like "Update Net Worth" when a transaction is confirmed.

## Automated Recurrence Logic
### Credit Cards
- **Monthly Placeholder**: On the `closingDay`, the system generates a "Pending Review" transaction for the full statement amount.
- **Auto-Debit**: Links the statement payment to the `autoDebitAccountId` on the `dueDay`.
- **Revision Status**: Transactions remains `pending_review` until the user confirms the statement amount manually.

### Monthly Placeholders
- For fixed expenses (Rent, Internet), placeholders are created at the start of the month to provide a "Projected Balance".

## Net Worth Calculation Engine
The engine aggregates:
1.  **Liquid Assets**: Sum of all Bank/Wallet Account balances.
2.  **Investments**: Assets with `ticker` updated via price service (or manual).
3.  **Fixed Assets**: Real Estate, Vehicles (manual valuation).
4.  **Liabilities**: Credit card debt (current statement + unbilled) and explicit Loans.

**Formula**: `Total Assets (Converted to Base Currency) - Total Liabilities = Net Worth`.
*Metadata labels (ARS/USD) allow switching the calculation view instantly.*
