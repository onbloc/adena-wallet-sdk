import { WalletResponse } from '../wallet.types';

export interface OnChangeNetworkOptions {
  callback: (chainId: string) => void;
}

export type OnChangeNetworkResponse = WalletResponse<void>;
