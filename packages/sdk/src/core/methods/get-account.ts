import { WalletProvider } from '../providers';
import { GetAccountResponse } from '../types/methods';

export const getAccount = (walletProvider: WalletProvider): Promise<GetAccountResponse> => {
  return walletProvider.getAccount();
};
