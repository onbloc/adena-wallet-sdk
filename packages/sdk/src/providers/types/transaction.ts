import { MsgAddPackage, MsgCall, MsgSend } from '@gnolang/gno-js-client';
import { MsgRun } from '@gnolang/gno-js-client/bin/proto/gno/vm';

export type MessageType = '/bank.MsgSend' | '/vm.m_call' | '/vm.m_addpkg' | '/vm.m_run';

export type MessageValue = MsgAddPackage | MsgCall | MsgSend | MsgRun;

export enum BroadcastType {
  SYNC = 'SYNC',
  COMMIT = 'COMMIT',
}

export type TransactionMessage = {
  type: MessageType;
  value: MessageValue;
};

export interface TransactionData {
  messages: TransactionMessage[];
  gasFee: number;
  gasWanted: number;
  memo?: string;
}

export interface SignTransactionData {
  document: SignDocument;
  signature: Signature;
}

export interface SignDocument {
  msgs: TransactionMessage[];
  fee: {
    amount: { amount: string; denom: string }[];
    gas: string;
  };
  chain_id: string;
  memo: string;
  account_number: string;
  sequence: string;
}

export interface Signature {
  pubKey: {
    typeUrl: string;
    value: string;
  };
  signature: string;
}

export interface SingTransaction {
  encodedTransaction: string;
}

interface TransactionEvent {
  '@type': string;
  type: string;
  attrs: Record<string, string>[];
  pkg_path: string;
  func: string;
}

interface TransactionResultResponseBase {
  Error: { log: string } | null;
  Data: string;
  Events: TransactionEvent[];
  Log: string;
  Info: string;
}

interface TransactionResultResponse {
  ResponseBase: TransactionResultResponseBase;
  GasWanted: string;
  GasUsed: string;
}

export interface TransactionResult {
  hash: string;
}

export interface TransactionResultSync extends TransactionResult {
  data?: string;
  log?: string;
}

export interface TransactionResultCommit extends TransactionResult {
  check_tx?: TransactionResultResponse;
  deliver_tx?: TransactionResultResponse;
}
