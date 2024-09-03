import { WalletProvider } from '../providers';
import { OnChangeNetworkOptions, OnChangeNetworkResponse } from '../types/methods';

export const onChangeNetwork = (
  walletProvider: WalletProvider,
  options: OnChangeNetworkOptions
): OnChangeNetworkResponse => {
  return walletProvider.onChangeNetwork(options);
};
