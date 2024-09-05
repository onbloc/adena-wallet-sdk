import { Tx } from '@gnolang/tm2-js-client';
import { BroadcastType, TransactionResult, TransactionResultCommit, TransactionResultSync } from '../transaction.types';
import { WalletResponse } from '../wallet.types';

export interface BroadcastTransactionOptions {
  tx: Tx;
  broadcastType?: BroadcastType;
}

export type BroadcastTransactionResponse = WalletResponse<
  TransactionResult | TransactionResultSync | TransactionResultCommit
>;
