import { MsgAddPackage, MsgCall, MsgEndpoint, MsgRun, MsgSend } from '@gnolang/gno-js-client';

export type TransactionMessageType = '/bank.MsgSend' | '/vm.m_call' | '/vm.m_addpkg' | '/vm.m_run';

export type TransactionMessageValue = MsgAddPackage | MsgCall | MsgSend | MsgRun;

export enum BroadcastType {
  SYNC = 'SYNC',
  COMMIT = 'COMMIT',
}
export interface AddPackageMessage {
  type: MsgEndpoint.MSG_ADD_PKG;
  value: MsgAddPackage;
}

export interface MsgCallMessage {
  type: MsgEndpoint.MSG_CALL;
  value: MsgCall;
}

export interface MsgSendMessage {
  type: MsgEndpoint.MSG_SEND;
  value: MsgSend;
}

export interface MsgRunMessage {
  type: MsgEndpoint.MSG_RUN;
  value: MsgRun;
}

export type TransactionMessage = AddPackageMessage | MsgCallMessage | MsgSendMessage | MsgRunMessage;

export interface TransactionData {
  messages: TransactionMessage[];
  gasFee: number;
  gasWanted: number;
  memo?: string;
}

export interface SignTransactionData {
  document: SignedDocument;
  signature: Signature;
}

export interface SignedDocument {
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

export interface SignDocument {
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
