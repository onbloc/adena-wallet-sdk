import { WalletProvider } from '../providers';
import { OnChangeAccountOptions, OnChangeAccountResponse } from '../types/methods';

export const onChangeAccount = (
  walletProvider: WalletProvider,
  options: OnChangeAccountOptions
): OnChangeAccountResponse => {
  return walletProvider.onChangeAccount(options);
};
