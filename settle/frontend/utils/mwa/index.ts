/**
 * MWA Utility Library
 *
 * Internal utility library to reduce Mobile Wallet Adapter boilerplate.
 * Provides a simplified, unified API for wallet operations.
 *
 * @example
 * ```tsx
 * import { useMWA } from '@/utils/mwa';
 *
 * function MyComponent() {
 *   const { publicKey, connect, signTransaction } = useMWA();
 *
 *   return (
 *     <Button onPress={connect}>
 *       {publicKey ? `Connected: ${publicKey.toBase58()}` : 'Connect Wallet'}
 *     </Button>
 *   );
 * }
 * ```
 */

// Primary hook
export { useMWA } from './useMWA';
export type { MWAHook } from './useMWA';

// Auth utilities
export { AuthCache } from './auth';

// Address utilities
export { toBase58, isValidAddress, toPublicKey, shortenAddress } from './address';

// Error utilities
export {
  isAuthError,
  isUserRejection,
  isNoWalletError,
  getErrorMessage,
  getFriendlyErrorMessage,
  classifyError,
  MWAError,
  MWAErrorCode,
} from './errors';

// Transact utilities
export { transactWithAuth, signWithWallet } from './transact';
export type { TransactOptions } from './transact';

// Types
export type { Account, Authorization, AppIdentity, MWAConfig } from './types';
