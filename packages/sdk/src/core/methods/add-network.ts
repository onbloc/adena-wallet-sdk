import { WalletProvider } from '../providers';
import { AddNetworkOptions, AddNetworkResponse } from '../types/methods';

export const addNetwork = (walletProvider: WalletProvider, options: AddNetworkOptions): Promise<AddNetworkResponse> => {
  return walletProvider.addNetwork(options);
};
