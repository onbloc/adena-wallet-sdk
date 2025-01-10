import { Wallet as TM2Wallet } from '@gnolang/tm2-js-client';
import { WalletProvider } from './wallet';
import { GetNetworkResponse } from '../types/methods';

export interface TM2WalletProvider extends WalletProvider {
  connect(): Promise<boolean>;

  disconnect(): Promise<boolean>;

  getWallet(): TM2Wallet | null;

  getNetwork(): Promise<GetNetworkResponse>;
}
