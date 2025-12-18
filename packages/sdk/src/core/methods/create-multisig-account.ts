import { WalletProvider } from '../providers';
import { CreateMultisigAccountOptions, CreateMultisigAccountResponse } from '../types/methods';

export const createMultisigAccount = (
  walletProvider: WalletProvider,
  options: CreateMultisigAccountOptions
): Promise<CreateMultisigAccountResponse> => {
  return walletProvider.createMultisigAccount(options);
};
