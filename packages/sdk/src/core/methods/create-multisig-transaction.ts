import { WalletProvider } from '../providers';
import { CreateMultisigTransactionOptions, CreateMultisigTransactionResponse } from '../types/methods';

export const createMultisigTransaction = (
  walletProvider: WalletProvider,
  options: CreateMultisigTransactionOptions
): Promise<CreateMultisigTransactionResponse> => {
  return walletProvider.createMultisigTransaction(options);
};
