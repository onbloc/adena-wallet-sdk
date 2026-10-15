import { WalletProvider } from '../providers';
import { SignArbitraryOptions, SignArbitraryResponse } from '../types/methods';

export const signArbitrary = (
  walletProvider: WalletProvider,
  options: SignArbitraryOptions
): Promise<SignArbitraryResponse> => {
  return walletProvider.signArbitrary(options);
};
