import {
  BroadcastType,
  TransactionData,
  TransactionResult,
  TransactionResultCommit,
  TransactionResultSync,
} from '../transaction.types';
import { WalletResponse } from '../wallet.types';

export interface BroadcastTransactionOptions {
  transactionData: TransactionData;
  broadcastType?: BroadcastType;
}

export type BroadcastTransactionResponse = WalletResponse<
  TransactionResult | TransactionResultSync | TransactionResultCommit
>;
