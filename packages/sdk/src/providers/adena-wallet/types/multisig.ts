import { BroadcastTxCommitResult } from '@gnolang/tm2-js-client';

import { AdenaResponse } from './common';

/**
 * Common
 */
type Fee = {
  amount: { amount: string; denom: string }[];
  gas: string;
};

type Signature = {
  pub_key: {
    type: string;
    value: string;
  };
  signature: string;
};

type MultisigConfig = {
  signers: string[];
  threshold: number;
  noSort: boolean;
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
  memo: string;
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
  multisigSignatures?: Signature[];
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
  signedDocument: CreateMultisigTransactionResponseData;
  addedSignature: Signature;
};

enum SignMultisigTransactionResponseType {
  SIGN_MULTISIG_TRANSACTION = 'SIGN_MULTISIG_TRANSACTION',
}

export type SignMultisigTransactionResponse = AdenaResponse<
  SignMultisigTransactionResponseType,
  SignMultisigTransactionResponseData
>;

export type AdenaSignMultisigTransaction = (
  tx: CreateMultisigTransactionResponseData
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
  tx: CreateMultisigTransactionResponseData
) => Promise<BroadcastMultisigTransactionResopnse>;
