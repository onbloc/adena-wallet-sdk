import { WalletResponse } from '../wallet.types';

export interface SwitchNetworkOptions {
  chainId: string;
}

export type SwitchNetworkResponse = WalletResponse<void>;
