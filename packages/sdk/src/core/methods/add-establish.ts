import { WalletProvider } from '../providers';
import { AddEstablishOptions, AddEstablishResponse } from '../types/methods';

export const addEstablish = (
  walletProvider: WalletProvider,
  options: AddEstablishOptions
): Promise<AddEstablishResponse> => {
  return walletProvider.addEstablish(options);
};
