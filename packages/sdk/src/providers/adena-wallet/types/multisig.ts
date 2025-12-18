/* eslint-disable */
import { BroadcastTxCommitResult } from '@gnolang/tm2-js-client';

import { AdenaResponse } from './common';

/**
 * Common
 */
type Fee = {
  amount: { amount: string; denom: string }[];
  gas: string;
};

type MultisigConfig = {
  signers: string[];
  threshold: number;
  noSort: boolean;
};

export type MultisigSignature = {
  pub_key: {
    type: string;
    value: string;
  };
  signature: string;
};

/**
 * CreateMultisigAccount
 */
export type CreateMultisigAccountParams = {
  signers: string[];
  threshold: number;
  noSort?: boolean;
};

enum CreateMultisigAccountResponseType {
  CREATE_MULTISIG_ACCOUNT = 'CREATE_MULTISIG_ACCOUNT',
}

export type CreateMultisigAccountResponseData = {
  multisigConfig: MultisigConfig;
  multisigAddress: string;
};

export type CreateMultisigAccountResponse = AdenaResponse<
  CreateMultisigAccountResponseType,
  CreateMultisigAccountResponseData
>;

export type AdenaCreateMultisigAccount = (
  params: CreateMultisigAccountParams
) => Promise<CreateMultisigAccountResponse>;

/**
 * CreateMultisigTransaction
 */
export type CreateMultisigTransactionParams = {
  chain_id: string;
  msgs: any[];
  fee: Fee;
  memo?: string;
  accountNumber?: string;
  sequence?: string;
};

export type MultisigTransactionResponseTx = {
  msg: any[];
  fee: {
    gas_wanted: string;
    gas_fee: string;
  };
  signatures: string[] | null;
  memo: string;
};

export type CreateMultisigTransactionResponseData = {
  tx: MultisigTransactionResponseTx;
  chainId: string;
  accountNumber: string;
  sequence: string;
};

enum CreateMultisigTransactionResponseType {
  CREATE_MULTISIG_TRANSACTION = 'CREATE_MULTISIG_TRANSACTION',
}

export type CreateMultisigTransactionResponse = AdenaResponse<
  CreateMultisigTransactionResponseType,
  CreateMultisigTransactionResponseData
>;

export type AdenaCreateMultisigTransaction = (
  params: CreateMultisigTransactionParams
) => Promise<CreateMultisigTransactionResponse>;

/**
 * SignMultisigTransaction
 */
export type SignMultisigTransactionResponseData = {
  result: {
    multisigDocument: CreateMultisigTransactionResponseData;
    multisigSignatures: MultisigSignature[];
  };
  signature: MultisigSignature;
};

enum SignMultisigTransactionResponseType {
  SIGN_MULTISIG_TRANSACTION = 'SIGN_MULTISIG_TRANSACTION',
}

export type SignMultisigTransactionResponse = AdenaResponse<
  SignMultisigTransactionResponseType,
  SignMultisigTransactionResponseData
>;

export type AdenaSignMultisigTransaction = (
  multisigDocument: CreateMultisigTransactionResponseData,
  multisigSignatures?: MultisigSignature[]
) => Promise<SignMultisigTransactionResponse>;

/**
 * BroadcastMultisigTransaction
 */
enum BroadcastMultisigTransactionResponseType {
  BROADCAST_MULTISIG_TRANSACTION = 'BROADCAST_MULTISIG_TRANSACTION',
}

export type BroadcastMultisigTransactionResopnse = AdenaResponse<
  BroadcastMultisigTransactionResponseType,
  BroadcastTxCommitResult
>;

export type AdenaBroadcastMultisigTransaction = (
  multisigDocument: CreateMultisigTransactionResponseData,
  multisigSignatures: MultisigSignature[]
) => Promise<BroadcastMultisigTransactionResopnse>;
