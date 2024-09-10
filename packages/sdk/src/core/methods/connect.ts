import { ConnectionManager } from '../connection';
import { ConnectOptions, ConnectResponse } from '../types/methods';
import { isTM2WalletProvider } from '../utils/provider.utils';

export const connect = async (
  connectionManager: ConnectionManager,
  connectionOptions: ConnectOptions = {}
): Promise<ConnectResponse> => {
  try {
    await connectionManager.connectWallet();
  } catch (e) {
    const openWalletLink =
      !isTM2WalletProvider(connectionManager.getWalletProvider()) && !!connectionOptions.walletDownloadUrl;
    if (openWalletLink) {
      openLink(connectionOptions.walletDownloadUrl!);
    } else {
      console.error((e as Error).message);
    }
  }
};

export const openLink = (url: string): void => {
  open(url, '_blank');
};
