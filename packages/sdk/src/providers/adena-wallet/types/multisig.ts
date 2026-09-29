import { BroadcastTxCommitResult } from '@gnolang/tm2-js-client';

import { TransactionMessage } from '../../../core';
import { AdenaResponse } from './common';
import { ContractOptions } from './transactions';

/**
 * Common
 */
export type MultisigConfig = {
  signers: string[];
  threshold: number;
  noSort: boolean;
};

/**
 * A single signer's signature over a multisig document. Note the amino `@type`
 * key — this is the JSON shape Adena returns, not the protobuf one.
 */
export type MultisigSignature = {
  pub_key: {
    '@type': string;
    value: string;
  };
  signature: string;
};

/**
 * Amino JSON shape of a transaction message inside a multisig document. The
 * message type lives under `@type` here, unlike the `{ type, value }` shape
 * used when submitting messages.
 */
export type MultisigRawMessage = {
  '@type': string;
  [key: string]: unknown;
};

/**
 * Amino JSON transaction carried by a multisig document, `RawTx` on the wallet
 * side. `signatures` is null until the document has been signed.
 */
export type MultisigRawTransaction = {
  msg: MultisigRawMessage[];
  fee: {
    gas_wanted: string;
    gas_fee: string;
  };
  signatures: MultisigSignature[] | null;
  memo: string;
};

/**
 * An unsigned or partially signed multisig transaction, together with the
 * account context it has to be signed against.
 */
export type MultisigTransactionDocument = {
  tx: MultisigRawTransaction;
  chainId: string;
  accountNumber: string;
  sequence: string;
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
  messages: TransactionMessage[];
  fee: {
    gasFee: string;
    gasWanted: string;
  };
  memo?: string;
  networkInfo?: {
    chainId: string;
    rpcUrl: string;
  };
};

export type CreateMultisigTransactionResponseData = {
  tx: MultisigRawTransaction;
};

enum CreateMultisigTransactionResponseType {
  CREATE_MULTISIG_TRANSACTION = 'CREATE_MULTISIG_TRANSACTION',
}

export type CreateMultisigTransactionResponse = AdenaResponse<
  CreateMultisigTransactionResponseType,
  CreateMultisigTransactionResponseData
>;

export type AdenaCreateMultisigTransaction = (
  params: CreateMultisigTransactionParams,
  withSaveFile?: boolean
) => Promise<CreateMultisigTransactionResponse>;

/**
 * SignMultisigTransaction
 */
export type SignMultisigTransactionResponseData = {
  result: {
    multisigDocument: MultisigTransactionDocument;
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
  multisigDocument: MultisigTransactionDocument,
  multisigSignatures?: MultisigSignature[],
  withSaveFile?: boolean
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
  multisigDocument: MultisigTransactionDocument,
  multisigSignatures?: MultisigSignature[],
  options?: ContractOptions
) => Promise<BroadcastMultisigTransactionResopnse>;
