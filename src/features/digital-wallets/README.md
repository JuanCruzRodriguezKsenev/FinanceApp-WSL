# Digital Wallets Feature 📱

## Responsibility
Integration with Fintech providers and virtual wallets (CVU).

## Core Logic
- **Server Action**: `addDigitalWallet` - Implements a **Double Circuit Breaker** pattern.
- **External Resilience**: `payment-gateway` breaker for third-party API validation.
- **Database Resilience**: `digital-wallets-db` breaker for persistence.

## UI Components
- `DigitalWalletForm`: Uses `useFormAction` for robust state management during external API calls.

## Schema
- `cvu`: Unique 22-digit identifier for virtual accounts.
- `provider`: Wallet provider name (e.g., MercadoPago, Ualá).
