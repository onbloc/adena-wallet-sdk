import { BroadcastTxCommitResult } from '@gnolang/tm2-js-client';

import { AdenaResponse } from '.';
import { TransactionMessage } from '../../../core';

export type TransactionParams = {
  messages: TransactionMessage[];
  gasFee: number;
  gasWanted: number;
  memo?: string;
};

enum DoContractResponseType {
  TRANSACTION_SENT = 'TRANSACTION_SENT',
}

// TODO: BroadcastTxCommitResult isn't correct in case of a VM call
export type DoContractResponse = AdenaResponse<DoContractResponseType, BroadcastTxCommitResult>;

export type AdenaDoContract = (params: TransactionParams) => Promise<DoContractResponse>;

enum SignTxResponseType {
  SIGN_TX = 'SIGN_TX',
}

type SignTxResponseData = {
  encodedTransaction: string;
};

type SignTxResponse = AdenaResponse<SignTxResponseType, SignTxResponseData>;

export type AdenaSignTx = (params: TransactionParams) => Promise<SignTxResponse>;
