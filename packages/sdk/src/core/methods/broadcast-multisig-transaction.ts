import { WalletProvider } from '../providers';
import { BroadcastMultisigTransactionOptions, BroadcastMultisigTransactionResponse } from '../types/methods';

export const broadcastMultisigTransaction = (
  walletProvider: WalletProvider,
  options: BroadcastMultisigTransactionOptions
): Promise<BroadcastMultisigTransactionResponse> => {
  return walletProvider.broadcastMultisigTransaction(options);
};
