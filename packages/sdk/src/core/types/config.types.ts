export interface SDKConfigure extends SDKConnectionConfigure {
  walletDownloadUrl?: string;
}

export interface SDKConnectionConfigure {
  isSession?: boolean;
}
