import { WalletResponse } from '../wallet.types';

export interface AddNetworkOptions {
  chainId: string;
  chainName: string;
  rpcUrl: string;
}

export type AddNetworkResponse = WalletResponse<void>;
