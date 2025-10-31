import { Tx } from '@gnolang/tm2-js-client';
import { SignDocument } from '../transaction.types';
import { WalletResponse } from '../wallet.types';

export interface SignDocumentOptions {
  tx: Tx;
}

export type SignDocumentResponse = WalletResponse<SignDocument>;
