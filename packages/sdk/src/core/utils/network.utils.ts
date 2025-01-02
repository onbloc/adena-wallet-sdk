import { AddNetworkOptions } from '../types/methods';

/**
 * Validate the network input.
 * @param options - Options for adding a network
 * @param options.chainId
 * @param options.chainName
 * @param options.rpcUrl
 * @returns {boolean} true if all required fields are present and the RPC URL contains no spaces, false otherwise
 */
export const validateNetworkInput = (options: AddNetworkOptions): boolean => {
  const { chainId, chainName, rpcUrl } = options;

  if (!chainId || !chainName || !rpcUrl) {
    return false;
  }

  return !rpcUrl.match(/\s/g);
};

/**
 * Normalize the RPC URL
 * Removes trailing slash(/) from the URL
 *
 * @param rpcUrl - RPC URL to normalize
 * @returns {string} RPC URL with trailing slash removed
 *
 * @example
 * const normalizedUrl = normalizeRpcUrl("https://example.com/");
 * returns: "https://example.com"
 */
export const normalizeRpcUrl = (rpcUrl: string): string => {
  return rpcUrl.replace(/\/$/, '');
};
