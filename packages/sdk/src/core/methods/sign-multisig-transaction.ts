import { WalletProvider } from '../providers';
import { SignMultisigTransactionOptions, SignMultisigTransactionResponse } from '../types/methods';

export const signMultisigTransaction = (
  walletProvider: WalletProvider,
  options: SignMultisigTransactionOptions
): Promise<SignMultisigTransactionResponse> => {
  return walletProvider.signMultisigTransaction(options);
};
