import { WalletProvider } from '../providers';
import { BroadcastTransactionOptions, BroadcastTransactionResponse } from '../types/methods';

export const broadcastTransaction = (
  walletProvider: WalletProvider,
  options: BroadcastTransactionOptions
): Promise<BroadcastTransactionResponse> => {
  return walletProvider.broadcastTransaction(options);
};
