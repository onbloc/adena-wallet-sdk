import { BroadcastTxCommitResult } from '@gnolang/tm2-js-client';

import { AdenaResponse } from '.';
import { TransactionMessage } from '../../../core';

export type TransactionParams = {
  messages: TransactionMessage[];
  gasFee: number;
  gasWanted: number;
  memo?: string;
  /**
   * Pins the transaction to a specific network, instead of whichever one the
   * wallet currently has selected.
   */
  networkInfo?: {
    chainId: string;
    rpcUrl: string;
  };
};

/**
 * Controls the wallet UI that accompanies a broadcast.
 */
export type ContractOptions = {
  withNotification?: boolean;
  isVisibleResult?: boolean;
};

enum DoContractResponseType {
  TRANSACTION_SENT = 'TRANSACTION_SENT',
}

// TODO: BroadcastTxCommitResult isn't correct in case of a VM call
export type DoContractResponse = AdenaResponse<DoContractResponseType, BroadcastTxCommitResult>;

export type AdenaDoContract = (
  params: TransactionParams,
  options?: ContractOptions | boolean
) => Promise<DoContractResponse>;

enum SignTxResponseType {
  SIGN_TX = 'SIGN_TX',
}

type SignTxResponseData = {
  encodedTransaction: string;
};

type SignTxResponse = AdenaResponse<SignTxResponseType, SignTxResponseData>;

export type AdenaSignTx = (params: TransactionParams) => Promise<SignTxResponse>;

/**
 * Signs a transaction as an amino document. The wallet returns the raw amino
 * payload, so the shape is left to the caller.
 */
export type AdenaSign = (params: TransactionParams) => Promise<AdenaResponse<string, unknown>>;
