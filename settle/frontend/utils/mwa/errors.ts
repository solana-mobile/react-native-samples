/**
 * Error handling utilities for MWA operations
 */

/**
 * MWA Error Codes
 */
export enum MWAErrorCode {
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  AUTH_FAILED = 'AUTH_FAILED',
  USER_REJECTED = 'USER_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NO_WALLET = 'NO_WALLET',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class for MWA operations
 */
export class MWAError extends Error {
  constructor(
    message: string,
    public code: MWAErrorCode,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'MWAError';
  }
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

/**
 * Check if error is auth-related (expired or invalid token)
 */
export function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('expired') ||
    message.includes('invalid') ||
    message.includes('auth') ||
    message.includes('unauthorized') ||
    message.includes('cancellationexception')
  );
}

/**
 * Check if error is user rejection
 */
export function isUserRejection(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('user') ||
    message.includes('reject') ||
    message.includes('cancel') ||
    message.includes('declined') ||
    message.includes('-1')
  );
}

/**
 * Check if error is due to no wallet app found
 */
export function isNoWalletError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('no wallet') || message.includes('not found');
}

/**
 * Classify error type
 */
export function classifyError(error: unknown): MWAErrorCode {
  if (isAuthError(error)) return MWAErrorCode.AUTH_EXPIRED;
  if (isUserRejection(error)) return MWAErrorCode.USER_REJECTED;
  if (isNoWalletError(error)) return MWAErrorCode.NO_WALLET;
  return MWAErrorCode.UNKNOWN;
}

/**
 * Get user-friendly error message
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const code = classifyError(error);

  switch (code) {
    case MWAErrorCode.AUTH_EXPIRED:
      return 'Session expired. Please reconnect your wallet.';
    case MWAErrorCode.USER_REJECTED:
      return 'Wallet authorization was declined. Please try again and approve the connection.';
    case MWAErrorCode.NO_WALLET:
      return 'No wallet app found. Please install Phantom, Solflare, or another Solana wallet.';
    default:
      return getErrorMessage(error) || 'An unexpected error occurred';
  }
}
