/**
 * Address conversion utilities for Solana addresses
 * Handles conversion between base64, Uint8Array, and base58 formats
 */

import { PublicKey } from '@solana/web3.js';

/**
 * Convert various address formats to base58 string
 * Handles: Uint8Array, base64 string, and existing base58 string
 *
 * @param address - Address in any format (Uint8Array, base64, base58)
 * @returns Base58 encoded address string
 * @throws Error if address format is invalid
 */
export function toBase58(address: any): string {
  try {
    // If it's a Uint8Array or array-like, convert directly
    if (address instanceof Uint8Array || Array.isArray(address)) {
      const pubkey = new PublicKey(address);
      return pubkey.toBase58();
    }

    // If it's a string
    if (typeof address === 'string') {
      // Check if it looks like base64 (contains +, /, or =)
      if (address.includes('+') || address.includes('/') || address.includes('=')) {
        // Decode base64 to Uint8Array
        const binaryString = atob(address);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const pubkey = new PublicKey(bytes);
        return pubkey.toBase58();
      }
      // Otherwise assume it's already base58, validate it
      const pubkey = new PublicKey(address);
      return pubkey.toBase58();
    }

    throw new Error(`Unsupported address format: ${typeof address}`);
  } catch (error) {
    console.error('Error converting address to base58:', error, 'Address:', address);
    throw new Error('Invalid wallet address format');
  }
}

/**
 * Validate if a string is a valid Solana address
 *
 * @param address - Address string to validate
 * @returns true if valid, false otherwise
 */
export function isValidAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert address to PublicKey object
 *
 * @param address - Address in any format (Uint8Array, base64, base58)
 * @returns PublicKey object
 * @throws Error if address format is invalid
 */
export function toPublicKey(address: any): PublicKey {
  const base58 = toBase58(address);
  return new PublicKey(base58);
}

/**
 * Shorten address for display (first 4 and last 4 characters)
 *
 * @param address - Base58 address string
 * @param chars - Number of characters to show on each end (default: 4)
 * @returns Shortened address string (e.g., "Ab1c...Xy9z")
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2) {
    return address;
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
