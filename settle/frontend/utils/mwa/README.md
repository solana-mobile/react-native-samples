# MWA Utility Library

Internal utility library to reduce Mobile Wallet Adapter (MWA) boilerplate code.

## Overview

This library provides a simplified, unified API for Solana Mobile Wallet Adapter operations, consolidating common patterns and reducing code duplication.

## Quick Start

### Basic Usage

```typescript
import { useMWA } from '@/utils/mwa';

function MyComponent() {
  const {
    publicKey,
    address,
    connected,
    connect,
    disconnect,
    signTransaction,
    signAndSendTransaction,
    connection,
  } = useMWA();

  return (
    <View>
      <Button onPress={connect}>
        {connected ? `Connected: ${address}` : 'Connect Wallet'}
      </Button>
    </View>
  );
}
```

## API Reference

### Primary Hook: `useMWA()`

Main hook that provides all MWA functionality in one place.

#### Returns

```typescript
{
  // Connection state
  publicKey: PublicKey | null;
  address: string | null;
  connected: boolean;
  accounts: Account[];
  selectedAccount: Account | null;

  // Auth methods
  connect: () => Promise<Account>;
  disconnect: () => Promise<void>;
  selectAccount: (account: Account) => void;

  // Transaction methods
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>;
  signAndSendTransaction: (tx: Transaction) => Promise<string>;

  // Utils
  connection: Connection;
  authorization: Authorization | null;
}
```

#### Examples

**Connect wallet:**
```typescript
const { connect } = useMWA();

const handleConnect = async () => {
  try {
    const account = await connect();
    console.log('Connected:', account.address);
  } catch (error) {
    console.error('Failed to connect:', error);
  }
};
```

**Sign a transaction:**
```typescript
const { signTransaction, publicKey } = useMWA();

const handleSign = async () => {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey!,
      toPubkey: destinationPubkey,
      lamports: 1000000,
    })
  );

  const signedTx = await signTransaction(transaction);
  console.log('Signed:', signedTx);
};
```

**Sign and send:**
```typescript
const { signAndSendTransaction, connection } = useMWA();

const handleSend = async () => {
  const transaction = /* build transaction */;

  const signature = await signAndSendTransaction(transaction);
  await connection.confirmTransaction(signature, 'confirmed');
  console.log('Transaction confirmed:', signature);
};
```

---

### Auth Cache: `AuthCache`

Utilities for managing auth token storage.

```typescript
import { AuthCache } from '@/utils/mwa';

// Get cached token
const token = await AuthCache.getToken();

// Store token
await AuthCache.setToken('token_string');

// Get cached address
const address = await AuthCache.getAddress();

// Store wallet auth (token + address)
await AuthCache.storeWalletAuth('token', 'address');

// Clear all auth data
await AuthCache.clear();
```

---

### Address Utilities

```typescript
import { toBase58, isValidAddress, shortenAddress } from '@/utils/mwa';

// Convert any address format to base58
const base58 = toBase58(uint8ArrayAddress);

// Validate address
if (isValidAddress(addressString)) {
  console.log('Valid address');
}

// Shorten for display
const short = shortenAddress('7xKX...long...address', 4);
// => "7xKX...ress"
```

---

### Error Utilities

```typescript
import {
  isAuthError,
  isUserRejection,
  getErrorMessage,
  getFriendlyErrorMessage,
} from '@/utils/mwa';

try {
  await connect();
} catch (error) {
  if (isAuthError(error)) {
    console.log('Auth expired, retry needed');
  } else if (isUserRejection(error)) {
    console.log('User rejected the connection');
  }

  // Get user-friendly message
  const message = getFriendlyErrorMessage(error);
  Alert.alert('Error', message);
}
```

---

### Advanced: Transact Utilities

For custom wallet operations not covered by `useMWA()`:

```typescript
import { transactWithAuth, signWithWallet } from '@/utils/mwa';
import { APP_IDENTITY, SOLANA_CLUSTER } from '@/constants/wallet';

// Custom operation with auth handling
const result = await transactWithAuth(
  async (wallet) => {
    return await wallet.signMessages({
      messages: [Buffer.from('Hello, Solana!')],
    });
  },
  {
    cluster: SOLANA_CLUSTER,
    identity: APP_IDENTITY,
    authToken: cachedToken,
    retryOnExpired: true,
  }
);

// Simplified for signing (auto-retry enabled)
const signed = await signWithWallet(
  async (wallet) => {
    const [tx] = await wallet.signTransactions({ transactions: [transaction] });
    return tx;
  },
  {
    cluster: SOLANA_CLUSTER,
    identity: APP_IDENTITY,
    authToken: cachedToken,
  }
);
```

---

## Features

### Auto-handling

- ✅ **Auth token caching** - Automatic AsyncStorage persistence
- ✅ **Token expiry detection** - Auto-retry with fresh auth
- ✅ **Address conversion** - Handles base64, Uint8Array, base58
- ✅ **Error classification** - Typed error codes and friendly messages
- ✅ **Session management** - Reauthorization with cached tokens

### Benefits

- **Less boilerplate** - Single hook replaces multiple imports
- **Type safety** - Full TypeScript support
- **Consistent patterns** - Unified API across the app
- **Error handling** - Built-in retry logic and error detection
- **Auto-caching** - Authorization state persists across app restarts

---

## File Structure

```
utils/mwa/
├── index.ts           # Main exports
├── useMWA.ts          # Primary hook
├── auth.ts            # Auth token caching
├── address.ts         # Address conversion
├── errors.ts          # Error handling
├── transact.ts        # Transact wrappers
├── types.ts           # TypeScript types
└── README.md          # This file
```

---

## Migration Guide

### Before (Old Pattern)

```typescript
import { useAuthorization } from '@/components/providers/AuthorizationProvider';
import { useConnection } from '@/components/providers/ConnectionProvider';
import { useMWAWallet } from '@/components/hooks/useMWAWallet';

const { selectedAccount } = useAuthorization();
const connection = useConnection();
const wallet = useMWAWallet();

if (!wallet) return <Text>Connect wallet</Text>;

const signature = await wallet.signAndSendTransaction(tx);
```

### After (New Pattern)

```typescript
import { useMWA } from '@/utils/mwa';

const { connected, signAndSendTransaction } = useMWA();

if (!connected) return <Text>Connect wallet</Text>;

const signature = await signAndSendTransaction(tx);
```

---

## Troubleshooting

### Connection Issues

```typescript
import { isAuthError, getFriendlyErrorMessage } from '@/utils/mwa';

try {
  await connect();
} catch (error) {
  const message = getFriendlyErrorMessage(error);
  Alert.alert('Connection Failed', message);
}
```

### Token Expiry

The library automatically handles token expiry with retry logic. If you need manual control:

```typescript
import { AuthCache } from '@/utils/mwa';

// Clear expired tokens
await AuthCache.clear();

// Then reconnect
await connect();
```

---

## Notes

- **Existing Providers Required**: This library wraps the existing `AuthorizationProvider` and `ConnectionProvider`. Keep those in your app layout.
- **AsyncStorage Keys**: Uses `wallet_auth_token`, `wallet_address`, and `wallet_authorization` keys.
- **Auto-retry**: `signAndSendTransaction()` automatically retries on auth errors.
