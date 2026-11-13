export interface SDKConfigure extends SDKConnectionConfigure {
  walletDownloadUrl?: string;
}

export interface SDKConnectionConfigure {
  isSession?: boolean;
}

interface SocialBaseConfigure {
  chainId: string;
  name: string;
  rpcTarget: string;
  network: 'mainnet' | 'testnet';
  clientId: string;
  addressPrefix?: string;
  storageKey?: 'session' | 'local';
}

export interface SocialExtraLoginOptions {
  login_hint?: string;
  domain?: string;
}

export interface SocialGoogleConfigure extends SocialBaseConfigure {
  /**
   * @deprecated Since Web3Auth v11 the OAuth client is configured on the Embedded Wallets dashboard.
   */
  authClientId: string;
  /**
   * @deprecated Since Web3Auth v11 the Google client ID is configured on the Embedded Wallets dashboard.
   */
  googleClientId: string;
  /**
   * Auth Connection ID configured on the Embedded Wallets dashboard (formerly the verifier name).
   */
  verifier: string;
}

export interface SocialTwitterConfigure extends SocialBaseConfigure {
  /**
   * @deprecated Since Web3Auth v11 the OAuth client is configured on the Embedded Wallets dashboard.
   */
  authClientId: string;
  /**
   * Auth Connection ID configured on the Embedded Wallets dashboard (formerly the verifier name).
   */
  verifier: string;
  domain: string;
}

export interface SocialEmailPasswordlessConfigure extends SocialBaseConfigure {
  /**
   * @deprecated Since Web3Auth v11 the OAuth client is configured on the Embedded Wallets dashboard.
   */
  authClientId: string;
  /**
   * Auth Connection ID configured on the Embedded Wallets dashboard (formerly the verifier name).
   */
  verifier: string;
  domain: string;
  email: string;
}

export enum SocialType {
  GOOGLE = 'GOOGLE',
  TWITTER = 'TWITTER',
  EMAIL = 'EMAIL_PASSWORDLESS',
}
