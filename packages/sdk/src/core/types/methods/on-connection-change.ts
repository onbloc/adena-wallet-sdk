import { WalletConnectionEvent } from '../wallet.types';

export interface OnConnectionChangeOptions {
  callback: (connection: WalletConnectionEvent) => void;
}

export type OnConnectionChangeResponse = void;
