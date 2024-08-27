import {
  Response,
  AccountInfo,
  BroadcastType,
  TransactionData,
  TransactionResult,
  TransactionResultCommit,
  TransactionResultSync,
  SingTransaction,
} from './types';

export interface WalletProvider {
  isConnected: () => Promise<Response<void>>;

  // General
  addEstablish: (name: string) => Promise<Response<void>>;

  getAccount: () => Promise<Response<AccountInfo>>;

  // Network
  switchNetwork: (chainId: string) => Promise<Response<void>>;

  addNetwork: (chainId: string, chainName: string, rpcUrl: string) => Promise<Response<void>>;

  // Transactions
  signTransaction: (transactionData: TransactionData) => Promise<Response<SingTransaction>>;

  broadcastTransaction: (
    transactionData: TransactionData,
    broadcastType?: BroadcastType
  ) => Promise<Response<TransactionResult | TransactionResultSync | TransactionResultCommit>>;

  // Events
  onChangeAccount: (callback: (address: string) => void) => void;

  onChangeNetwork: (callback: (chainId: string) => void) => void;
}
