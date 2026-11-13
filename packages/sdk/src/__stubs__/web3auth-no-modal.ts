// Jest-only stub for `@web3auth/no-modal`.
//
// v11 transitively pulls in ESM-only packages (e.g. `@metamask/connect-evm`
// ships `.mjs` even for the `require` condition), which Jest's CJS runtime
// cannot load. Unit tests never talk to Web3Auth, so the module is replaced
// with the minimal surface `GnoSocialWalletProvider` touches at import time.
export const AUTH_CONNECTION = {
  GOOGLE: 'google',
  TWITTER: 'twitter',
  EMAIL_PASSWORDLESS: 'email_passwordless',
} as const;

export const CHAIN_NAMESPACES = {
  EIP155: 'eip155',
  SOLANA: 'solana',
  CASPER: 'casper',
  XRPL: 'xrpl',
  OTHER: 'other',
} as const;

export const WALLET_CONNECTORS = {
  AUTH: 'auth',
} as const;

export class Web3AuthNoModal {
  constructor() {
    throw new Error('Web3AuthNoModal is not available in the Jest environment.');
  }
}
