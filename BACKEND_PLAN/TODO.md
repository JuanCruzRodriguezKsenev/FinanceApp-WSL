# Backend TODO List

## High Priority
- [x] Refactor `transactions` table to use `source_id` and `destination_id`.
- [ ] Implement `Available Balance` logic to subtract `Reserves` from total account balance.
- [x] Add `currency_label` (ARS/USD) to all financial records.
- [x] Create API endpoint for `Contacts` with "Smart Selection" (order by `last_used_at`).
- [x] **Transactional Audit:** Review all new schemas for strict FK constraints and check rules.
- [x] **Implementation of `db.transaction`:** Applied atomic blocks to the `createContact` action.

## Medium Priority
- [ ] Setup Credit Card statement auto-generation logic (Cron or Worker).
- [ ] Implement "Pending Review" status for automated transactions.
- [ ] Add `ticker` and `provider_id` fields to Assets for future API sync.
- [ ] Net Worth engine: Create a service that calculates totals across all categories.

## Low Priority
- [ ] Historical snapshots of Net Worth for charting.
- [ ] Bulk import for "Contact Methods" from CSV/Manual list.
- [ ] Multi-provider price service (fetching USD/ARS exchange rates and Stock prices).
