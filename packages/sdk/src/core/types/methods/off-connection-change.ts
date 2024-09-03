import { WalletConnectionEvent } from '../wallet.types';

export interface OffConnectionChangeOptions {
  callback: (connection: WalletConnectionEvent) => void;
}

export type OffConnectionChangeResponse = void;
