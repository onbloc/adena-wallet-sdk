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
}

export interface SocialGoogleConfigure extends SocialBaseConfigure {
  authClientId: string;
  googleClientId: string;
  verifier: string;
}

export interface SocialTwitterConfigure extends SocialBaseConfigure {
  authClientId: string;
  verifier: string;
  domain: string;
}

export interface SocialCustomConfigure extends SocialBaseConfigure {
  authClientId: string;
  verifier: string;
  domain: string;
}

export enum SocialType {
  GOOGLE = 'GOOGLE',
  TWITTER = 'TWITTER',
  EMAIL = 'EMAIL',
}
