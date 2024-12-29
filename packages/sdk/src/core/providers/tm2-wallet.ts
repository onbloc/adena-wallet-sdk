import { Wallet as TM2Wallet } from '@gnolang/tm2-js-client';
import { WalletProvider } from './wallet';

export interface TM2WalletProvider extends WalletProvider {
  connect(rpcUrl?: string): Promise<boolean>;

  disconnect(): Promise<boolean>;

  getWallet(): TM2Wallet | null;
}
