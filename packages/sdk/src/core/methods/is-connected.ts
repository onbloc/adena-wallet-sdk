import { WalletProvider } from '../providers';
import { IsConnectedResponse } from '../types/methods';

export const isConnected = (walletProvider: WalletProvider): Promise<IsConnectedResponse> => {
  return walletProvider.isConnected();
};
