export interface SDKConfigure extends SDKConnectionConfigure {
  walletDownloadUrl?: string;
}

export interface SDKConnectionConfigure {
  isSession?: boolean;
}

export interface SocialConfigure {
  chainId: string;
  rpcTarget: string;
  network: 'mainnet' | 'testnet';
  clientId: string;
  auth: {
    googleName: string;
    googleVerifier: string;
    googleClientId: string;
  };
}
