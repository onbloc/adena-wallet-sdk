import { Tx } from '@gnolang/tm2-js-client';
import { SingTransaction } from '../transaction.types';
import { WalletResponse } from '../wallet.types';

export interface SignTransactionOptions {
  tx: Tx;
}

export type SignTransactionResponse = WalletResponse<SingTransaction>;
