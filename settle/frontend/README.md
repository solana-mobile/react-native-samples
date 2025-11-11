# Settle - Web3 Expense Splitting App

> An expense splitting application with Solana wallet integration. Login with wallet, add friends, create groups, split expenses, and pay using SOL transfers.

**Tech Stack:** React Native, Expo Router, Solana Mobile Wallet Adapter, Web3.js

📖 **[View Technical Deep Dive →](TECHNICAL-GUIDE.md)**

## Features

- 🔐 Connect Solana wallet via Mobile Wallet Adapter
- 👥 Add friends via phone number or public key
- 🏷️ Create groups and split expenses
- 💸 Send SOL payments with automatic USD conversion
- 📊 View transaction history with Solscan integration

---

## Quick Start

### Prerequisites

- Android device or emulator
- Node.js 18+
- [Mock MWA Wallet](https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/examples/example-clientlib-ktx) installed

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Running the App

```bash
# Generate native projects
npx expo prebuild --clean

# Run on Android
npx expo run:android
```

---

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```bash
# API Configuration
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# Solana Configuration
EXPO_PUBLIC_SOLANA_CLUSTER=devnet
EXPO_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
```

**For Production (Mainnet):**
```bash
EXPO_PUBLIC_SOLANA_CLUSTER=mainnet-beta
EXPO_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

### Critical Setup: Crypto Polyfill

React Native requires a crypto polyfill for Solana Web3.js. **Import it first** in [app/_layout.tsx](app/_layout.tsx):

```typescript
// MUST be imported FIRST, before any @solana/web3.js imports
import 'react-native-get-random-values';
```

**Why?** Solana Web3.js uses `crypto.getRandomValues()` for transaction IDs. Without this, you'll get:
```
Error: crypto.getRandomValues() not supported
```

---

## Project Structure

```
settle/frontend/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation (groups, friends, activity, account)
│   ├── _layout.tsx          # Root layout (crypto polyfill here!)
│   ├── login.tsx            # Wallet login screen
│   ├── add-expense.tsx      # Add expense screen
│   └── settle-up.tsx        # Payment screen
├── solana/                  # Web3 integration ⭐
│   ├── wallet.ts            # Wallet connection & authorization
│   └── transaction.ts       # SOL transfers & transactions
├── apis/                    # API client functions
│   └── auth.ts              # Wallet session persistence
├── components/              # Reusable components
│   ├── providers/           # React context providers
│   └── hooks/               # Custom hooks
├── constants/               # App constants
│   └── wallet.ts            # Solana configuration
└── utils/                   # Utility functions
```

---

## Key Concepts

### Wallet Connection
Uses Mobile Wallet Adapter's `transact()` API to handle wallet authorization. Auth tokens are cached for silent reauthorization.

**Why cache tokens?** Creates web2-like UX while maintaining web3 security. Users aren't prompted every time.

**Files:** [solana/wallet.ts](solana/wallet.ts), [apis/auth.ts](apis/auth.ts)

### Address Encoding
Wallet adapter returns addresses in **base64**, but Solana uses **base58**. All addresses are converted to base58 before storing.

**Why base58?** No ambiguous characters (0, O, I, l), URL-safe, human-readable. Blockchain standard.

**Files:** [solana/wallet.ts](solana/wallet.ts) - `toBase58String()` helper

### Transaction Signing
SOL payments with automatic USD-to-SOL conversion using CoinGecko API. Includes auto-reauthorization if auth token expires.

**Flow:**
1. Validate addresses
2. Convert USD to SOL using live price
3. Get recent blockhash
4. Create transfer instruction
5. Sign and send via wallet
6. Wait for confirmation

**Files:** [solana/transaction.ts](solana/transaction.ts)

### Session Persistence
Auth tokens are stored in AsyncStorage (**not** private keys). Private keys never leave the wallet app.

**What we store:** ✅ Auth token (revocable), ✅ Public address (not sensitive)
**What we DON'T store:** ❌ Private keys, ❌ Seed phrases

**Files:** [apis/auth.ts](apis/auth.ts)

---

## Common Issues

### Error: "crypto.getRandomValues() not supported"

**Solution:**
1. Install: `npm install react-native-get-random-values`
2. Import as **first line** in [app/_layout.tsx](app/_layout.tsx)
3. Rebuild: `npx expo prebuild --clean && npx expo run:android`

### Error: "Non-base58 character"

**Solution:** Address is in base64 format. Use `toBase58String()` helper in [solana/wallet.ts](solana/wallet.ts).

### Error: "Transaction expired"

**Solution:** Blockhash is too old (>150 blocks). Get fresh blockhash before each transaction (already implemented).

### Wallet popup doesn't appear

**Solution:** Native module not linked. Run `npx expo prebuild --clean` and rebuild.

---

## Documentation

- **[TECHNICAL-GUIDE.md](TECHNICAL-GUIDE.md)** - Comprehensive guide explaining all implementation details
- **[Backend README](../backend/README.md)** - API server documentation

---

## Resources

### Official Documentation
- [Solana Mobile Docs](https://docs.solanamobile.com/react-native/overview)
- [Mobile Wallet Adapter Spec](https://github.com/solana-mobile/mobile-wallet-adapter)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)

### Developer Tools
- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- [Solana Faucet](https://faucet.solana.com/)
- [Solana Cookbook](https://solanacookbook.com/)

### Sample Apps
- [Solana Mobile dApp Scaffold](https://github.com/solana-mobile/solana-mobile-dapp-scaffold)
- [Mobile Wallet Adapter Example](https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/examples)
