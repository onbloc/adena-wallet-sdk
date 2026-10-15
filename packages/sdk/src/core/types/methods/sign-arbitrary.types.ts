import { SignedArbitraryData } from '../arbitrary.types';
import { WalletResponse } from '../wallet.types';

export interface SignArbitraryOptions {
  /** Address expected to sign; the wallet refuses with ACCOUNT_MISMATCH otherwise */
  signer: string;
  /** UTF-8 text shown to the user and signed as-is */
  data: string;
}

export type SignArbitraryResponse = WalletResponse<SignedArbitraryData>;
