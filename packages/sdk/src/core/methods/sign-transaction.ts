import { WalletProvider } from '../providers';
import { SignTransactionOptions, SignTransactionResponse } from '../types/methods';

export const signTransaction = (
  walletProvider: WalletProvider,
  options: SignTransactionOptions
): Promise<SignTransactionResponse> => {
  return walletProvider.signTransaction(options);
};
