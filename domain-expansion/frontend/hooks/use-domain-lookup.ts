import { useState } from 'react';
import { TldParser } from '@onsol/tldparser';
import { PublicKey } from '@solana/web3.js';
import { useConnection } from '@/components/solana/solana-provider';

export type SearchMode = 'domain' | 'pubkey';

export interface DomainLookupResult {
  input: string;
  result: string | null;
  error: string | null;
  isLoading: boolean;
}

export function useDomainLookup() {
  const connection = useConnection();
  const [result, setResult] = useState<DomainLookupResult>({
    input: '',
    result: null,
    error: null,
    isLoading: false,
  });

  const searchDomain = async (domain: string) => {
    setResult({ input: domain, result: null, error: null, isLoading: true });

    try {
      console.log('[Domain Lookup] Creating TldParser...');
      // Explicitly specify 'solana' chain for the parser
      const parser = new TldParser(connection, 'solana');
      console.log('[Domain Lookup] Parser created, calling getOwnerFromDomainTld...');
      console.log('[Domain Lookup] Domain input:', domain);

      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after 10s')), 10000)
      );

      const owner = await Promise.race([
        parser.getOwnerFromDomainTld(domain),
        timeoutPromise
      ]) as PublicKey | string | undefined;

      console.log('[Domain Lookup] Owner result:', owner);

      if (owner) {
        const ownerAddress = typeof owner === 'string' ? owner : (owner as PublicKey).toBase58();
        setResult({
          input: domain,
          result: ownerAddress,
          error: null,
          isLoading: false,
        });
      } else {
        setResult({
          input: domain,
          result: null,
          error: 'Domain not found',
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('[Domain Lookup] Error caught:', error);
      console.error('[Domain Lookup] Error stack:', error.stack);
      setResult({
        input: domain,
        result: null,
        error: error.message || 'Failed to lookup domain',
        isLoading: false,
      });
    }
  };

  const searchPublicKey = async (pubkey: string) => {
    setResult({ input: pubkey, result: null, error: null, isLoading: true });

    try {
      console.log('[Reverse Lookup] Creating TldParser...');
      // Explicitly specify 'solana' chain for the parser
      const parser = new TldParser(connection);
      console.log('[Reverse Lookup] Parser created');

      console.log('[Reverse Lookup] Creating PublicKey from:', pubkey);
      const publicKey = new PublicKey(pubkey);
      console.log('[Reverse Lookup] PublicKey created:', publicKey.toBase58());

      console.log('[Reverse Lookup] Calling getParsedAllUserDomainsFromTld for .skr...');

      // Add timeout wrapper - the Promise never resolves in React Native
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Reverse lookup timed out - library may not support React Native')), 10000)
      );

      // Only search .skr TLD
      const domains = await Promise.race([
        parser.getParsedAllUserDomainsFromTld(publicKey, 'skr'),
        timeoutPromise
      ]);
      console.log('[Reverse Lookup] Result:', domains);

      if (domains && domains.length > 0) {
        // Get the first domain's name
        const domainName = domains[0].domain;
        console.log('[Reverse Lookup] Found domain:', domainName);
        setResult({
          input: pubkey,
          result: domainName,
          error: null,
          isLoading: false,
        });
      } else {
        console.log('[Reverse Lookup] No domains found');
        setResult({
          input: pubkey,
          result: null,
          error: 'No .skr domains found for this public key',
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('[Reverse Lookup] Error caught:', error);
      console.error('[Reverse Lookup] Error stack:', error.stack);
      setResult({
        input: pubkey,
        result: null,
        error: error.message || 'Failed to lookup public key',
        isLoading: false,
      });
    }
  };

  const reset = () => {
    setResult({
      input: '',
      result: null,
      error: null,
      isLoading: false,
    });
  };

  return {
    result,
    searchDomain,
    searchPublicKey,
    reset,
  };
}
