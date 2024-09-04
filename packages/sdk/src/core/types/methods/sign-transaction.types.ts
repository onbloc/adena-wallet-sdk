import { SingTransaction, TransactionData } from '../transaction.types';
import { WalletResponse } from '../wallet.types';

export interface SignTransactionOptions {
  transactionData: TransactionData;
}

export type SignTransactionResponse = WalletResponse<SingTransaction>;
