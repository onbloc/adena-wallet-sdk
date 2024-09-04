import { WalletProvider } from '../providers';
import { SwitchNetworkOptions, SwitchNetworkResponse } from '../types/methods';

export const switchNetwork = (
  walletProvider: WalletProvider,
  options: SwitchNetworkOptions
): Promise<SwitchNetworkResponse> => {
  return walletProvider.switchNetwork(options);
};
