/**
 * Shared TypeScript types for MWA utilities
 */

import { PublicKey } from '@solana/web3.js';

/**
 * Account represents a wallet account with its public key
 */
export interface Account {
  address: string; // base58 encoded
  label?: string;
  publicKey: PublicKey;
}

/**
 * Authorization state containing auth token and selected account
 */
export type Authorization = Readonly<{
  accounts: Account[];
  authToken: string;
  selectedAccount: Account;
}>;

/**
 * App identity for wallet authorization
 */
export interface AppIdentity {
  name: string;
  uri: string;
  icon: string;
}

/**
 * MWA configuration options
 */
export interface MWAConfig {
  cluster: 'devnet' | 'testnet' | 'mainnet-beta';
  identity: AppIdentity;
}
