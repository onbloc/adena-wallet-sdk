import { WalletResponse } from '../wallet.types';

export interface AddEstablishOptions {
  siteName?: string;
  /**
   * Optional chainId or list of chainIds to request access for in a single
   * approval. May mix supported chainGroups (e.g. Gno + AtomOne); chains
   * outside the wallet's supported set are rejected. When omitted, the
   * wallet falls back to the legacy behavior of approving the currently
   * active chainGroup.
   */
  chainIds?: string | string[];
}

export type AddEstablishResponse = WalletResponse<boolean>;
