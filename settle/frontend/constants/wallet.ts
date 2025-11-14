/**
 * Wallet configuration for Solana Mobile Wallet Adapter
 */

export const APP_IDENTITY = {
  name: 'Settle',
  uri: 'https://settle.app',
  icon: 'favicon.ico',
};

// Valid cluster values: 'devnet', 'testnet', 'mainnet-beta'
export const SOLANA_CLUSTER = (process.env.EXPO_PUBLIC_SOLANA_CLUSTER || 'devnet') as 'devnet' | 'testnet' | 'mainnet-beta';

// Solana RPC endpoint
export const SOLANA_RPC_ENDPOINT = process.env.EXPO_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
