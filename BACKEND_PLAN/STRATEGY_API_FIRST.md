# Strategy: API-First & Abstraction Layer

## Provider Abstraction Layer
To ensure the system is ready for future integrations (Bank APIs, Investment Platforms), we implement a `Provider` abstraction.

### Interface Definition
- `ProviderID`: Unique identifier (e.g., 'manual', 'galicia_api', 'binance_api').
- `SyncStatus`: `manual` | `synced` | `pending_review`.
- `Metadata`: JSON field to store external IDs, tickers, and provider-specific flags.

## Manual Data with Sync Metadata
Every manual entry (Asset, Transaction, or Price) will include:
- `ticker`: Standardized symbol (e.g., AAPL, USDT, BTC).
- `provider_external_id`: To match records when an API is eventually connected.
- `last_sync_at`: Timestamp of the last successful update.

## Multicurrency Labeling Strategy
The system treats currency as metadata rather than just a formatting choice:
- **Primary Currency**: User's base currency (e.g., USD).
- **Secondary Currency**: Local or alternative currency (e.g., ARS).
- **Labeling**: Transactions and balances will store `original_amount`, `original_currency`, and `exchange_rate_at_runtime` (or snapshot) to allow ARS/USD switching in the UI seamlessly.
