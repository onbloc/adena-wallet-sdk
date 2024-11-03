import { WalletProvider } from '../providers';
import { GetNetworkResponse } from '../types/methods';

export const getNetwork = (walletProvider: WalletProvider): Promise<GetNetworkResponse> => {
  return walletProvider.getNetwork();
};
