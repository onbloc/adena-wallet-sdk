import { WalletProvider } from './wallet';

export interface TM2WalletProvider extends WalletProvider {
  connect(): Promise<boolean>;

  disconnect(): Promise<boolean>;
}
