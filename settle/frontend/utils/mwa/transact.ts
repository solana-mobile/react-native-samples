/**
 * Transaction utilities and smart wrappers for MWA transact()
 * Reduces boilerplate by handling auth automatically
 */

import {
  transact as mwaTransact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { AppIdentity } from './types';
import { isAuthError } from './errors';

/**
 * Options for transact with auth
 */
export interface TransactOptions {
  cluster: string;
  identity: AppIdentity;
  authToken?: string;
  retryOnExpired?: boolean;
}

/**
 * Smart transact wrapper with automatic authorization and retry logic
 *
 * @param operation - Wallet operation to perform
 * @param options - Configuration options
 * @returns Result of the wallet operation
 *
 * @example
 * ```ts
 * const result = await transactWithAuth(
 *   async (wallet) => {
 *     return await wallet.signTransactions({ transactions: [tx] });
 *   },
 *   {
 *     cluster: 'devnet',
 *     identity: APP_IDENTITY,
 *     authToken: cachedToken,
 *     retryOnExpired: true,
 *   }
 * );
 * ```
 */
export async function transactWithAuth<T>(
  operation: (wallet: Web3MobileWallet) => Promise<T>,
  options: TransactOptions
): Promise<T> {
  const { cluster, identity, authToken, retryOnExpired = false } = options;

  try {
    return await mwaTransact(async (wallet: Web3MobileWallet) => {
      // Authorize with cached token if provided, otherwise request fresh auth
      if (authToken) {
        await wallet.reauthorize({
          auth_token: authToken,
          cluster,
          identity,
        });
      } else {
        await wallet.authorize({
          cluster,
          identity,
        });
      }

      // Execute the operation
      return await operation(wallet);
    });
  } catch (error) {
    // Auto-retry on auth error if enabled
    if (retryOnExpired && isAuthError(error)) {
      console.log('[transactWithAuth] Auth token expired, retrying with fresh authorization...');

      return await mwaTransact(async (wallet: Web3MobileWallet) => {
        // Fresh authorization without cached token
        await wallet.authorize({
          cluster,
          identity,
        });

        // Retry the operation
        return await operation(wallet);
      });
    }

    // Not an auth error or retry disabled, rethrow
    throw error;
  }
}

/**
 * Simplified transact for signing operations (auto-enables retry)
 * Most common use case - handles signing with automatic auth and retry
 *
 * @param operation - Signing operation to perform
 * @param options - Configuration options
 * @returns Result of the signing operation
 *
 * @example
 * ```ts
 * const signedTx = await signWithWallet(
 *   async (wallet) => {
 *     const [signed] = await wallet.signTransactions({ transactions: [tx] });
 *     return signed;
 *   },
 *   {
 *     cluster: 'devnet',
 *     identity: APP_IDENTITY,
 *     authToken: cachedToken,
 *   }
 * );
 * ```
 */
export async function signWithWallet<T>(
  operation: (wallet: Web3MobileWallet) => Promise<T>,
  options: Omit<TransactOptions, 'retryOnExpired'>
): Promise<T> {
  return transactWithAuth(operation, {
    ...options,
    retryOnExpired: true, // Always retry for signing operations
  });
}
