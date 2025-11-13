/**
 * Wallet service for Solana Mobile Wallet Adapter
 */

import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import { APP_IDENTITY, SOLANA_CLUSTER } from '@/constants/wallet';
import { toBase58, getFriendlyErrorMessage, isAuthError } from '@/utils/mwa';

export interface WalletAuthResult {
  pubkey: string;
  authToken: string;
  walletUriBase: string | null;
  accounts: Array<{
    address: string;
    label?: string;
  }>;
}


/**
 * Authorize wallet - Opens wallet app and requests authorization
 * This will show the wallet approval dialog to the user
 */
export const authorizeWallet = async (): Promise<WalletAuthResult> => {
  try {
    const authorizationResult = await transact(async (wallet: Web3MobileWallet) => {
      return await wallet.authorize({
        cluster: SOLANA_CLUSTER,
        identity: APP_IDENTITY,
      });
    });

    // Validate we have accounts
    if (!authorizationResult.accounts || authorizationResult.accounts.length === 0) {
      throw new Error('No wallet accounts found. Please ensure your wallet is set up correctly.');
    }

    // Extract and convert the first account's pubkey to base58
    const pubkey = toBase58(authorizationResult.accounts[0].address);
    const authToken = authorizationResult.auth_token;
    const walletUriBase = authorizationResult.wallet_uri_base;

    console.log('Wallet authorized with base58 pubkey:', pubkey);

    return {
      pubkey,
      authToken,
      walletUriBase,
      accounts: authorizationResult.accounts.map(acc => ({
        address: toBase58(acc.address),
        label: acc.label,
      })),
    };
  } catch (error: any) {
    console.error('Wallet authorization error:', error);
    throw new Error(getFriendlyErrorMessage(error));
  }
};

/**
 * Reauthorize wallet with cached auth token
 * This skips the approval dialog if the token is still valid
 */
export const reauthorizeWallet = async (cachedAuthToken: string): Promise<WalletAuthResult> => {
  try {
    const authorizationResult = await transact(async (wallet: Web3MobileWallet) => {
      return await wallet.authorize({
        cluster: SOLANA_CLUSTER,
        identity: APP_IDENTITY,
        auth_token: cachedAuthToken,
      });
    });

    // Validate we have accounts
    if (!authorizationResult.accounts || authorizationResult.accounts.length === 0) {
      throw new Error('No wallet accounts found. Please ensure your wallet is set up correctly.');
    }

    // Extract and convert the first account's pubkey to base58
    const pubkey = toBase58(authorizationResult.accounts[0].address);
    const authToken = authorizationResult.auth_token;
    const walletUriBase = authorizationResult.wallet_uri_base;

    console.log('Wallet reauthorized with base58 pubkey:', pubkey);

    return {
      pubkey,
      authToken,
      walletUriBase,
      accounts: authorizationResult.accounts.map(acc => ({
        address: toBase58(acc.address),
        label: acc.label,
      })),
    };
  } catch (error: any) {
    console.error('Wallet reauthorization error:', error);
    throw new Error(getFriendlyErrorMessage(error));
  }
};

/**
 * Disconnect wallet - Deauthorize and invalidate the auth token
 */
export const disconnectWallet = async (authToken: string): Promise<void> => {
  try {
    await transact(async (wallet: Web3MobileWallet) => {
      await wallet.deauthorize({
        auth_token: authToken,
      });
    });
  } catch (error: any) {
    console.error('Wallet disconnect error:', error);
    // Don't throw - we still want to clear local cache even if deauth fails
  }
};
