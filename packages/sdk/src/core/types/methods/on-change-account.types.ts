import { WalletResponse } from '../wallet.types';

export interface OnChangeAccountOptions {
  callback: (address: string) => void;
}

export type OnChangeAccountResponse = WalletResponse<void>;
