import { WalletResponse } from '../wallet.types';

export interface AddEstablishOptions {
  siteName?: string;
}

export type AddEstablishResponse = WalletResponse<boolean>;
