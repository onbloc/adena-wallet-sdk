import { WalletResponse } from '../../../core/types/wallet.types';

export type CosmosBroadcastMode = 'sync' | 'async' | 'block';

export interface CosmosKey {
  name: string;
  algo: string;
  pubKey: Uint8Array;
  address: Uint8Array;
  bech32Address: string;
  isNanoLedger: boolean;
}

export interface CosmosStdFee {
  amount: readonly { denom: string; amount: string }[];
  gas: string;
  granter?: string;
  payer?: string;
}

export interface CosmosAminoMsg {
  type: string;
  value: unknown;
}

export interface CosmosStdSignDoc {
  readonly chain_id: string;
  readonly account_number: string;
  readonly sequence: string;
  readonly fee: CosmosStdFee;
  readonly msgs: readonly CosmosAminoMsg[];
  readonly memo: string;
}

export interface CosmosStdSignature {
  pub_key: { type: string; value: string };
  signature: string;
}

export interface CosmosAminoSignResponse {
  readonly signed: CosmosStdSignDoc;
  readonly signature: CosmosStdSignature;
}

export interface CosmosSignDoc {
  bodyBytes: Uint8Array;
  authInfoBytes: Uint8Array;
  chainId: string;
  accountNumber: bigint;
}

export interface CosmosDirectSignResponse {
  readonly signed: CosmosSignDoc;
  readonly signature: CosmosStdSignature;
}

export interface CosmosSendTxResult {
  txhash: string;
  code: number;
  rawLog: string;
  height: number;
}

export interface CosmosAccountData {
  readonly address: string;
  readonly algo: 'secp256k1' | 'ed25519' | 'sr25519';
  readonly pubkey: Uint8Array;
}

export interface CosmosOfflineAminoSigner {
  getAccounts(): Promise<readonly CosmosAccountData[]>;
  signAmino(signerAddress: string, signDoc: CosmosStdSignDoc): Promise<CosmosAminoSignResponse>;
}

export interface CosmosOfflineDirectSigner {
  getAccounts(): Promise<readonly CosmosAccountData[]>;
  signDirect(signerAddress: string, signDoc: CosmosSignDoc): Promise<CosmosDirectSignResponse>;
}

export type EnableCosmosResponse = WalletResponse<void>;
export type GetCosmosKeyResponse = WalletResponse<CosmosKey>;
export type SignCosmosAminoResponse = WalletResponse<CosmosAminoSignResponse>;
export type SignCosmosDirectResponse = WalletResponse<CosmosDirectSignResponse>;
export type SendCosmosTxResponse = WalletResponse<CosmosSendTxResult>;

/**
 * Cosmos sub-namespace exposed at `window.adena.cosmos`. Mirrors Gno's flat
 * API: `enable` / `getKey` / `signAmino` / `signDirect` / `sendTx` resolve
 * with the `WalletResponse` wrapper (`{ status, type, code, message, data }`)
 * — including on failure. `getOfflineSigner*` follow the CosmJS
 * `OfflineSigner` contract instead, returning bare values and throwing on
 * failure so libraries like `SigningStargateClient` work unchanged.
 */
export interface AdenaCosmos {
  version: string;
  enable(chainIds: string | string[]): Promise<EnableCosmosResponse>;
  getKey(chainId: string): Promise<GetCosmosKeyResponse>;
  signAmino(chainId: string, signer: string, signDoc: CosmosStdSignDoc): Promise<SignCosmosAminoResponse>;
  signDirect(chainId: string, signer: string, signDoc: CosmosSignDoc): Promise<SignCosmosDirectResponse>;
  sendTx(chainId: string, tx: Uint8Array, mode: CosmosBroadcastMode): Promise<SendCosmosTxResponse>;
  getOfflineSigner(chainId: string): CosmosOfflineAminoSigner & CosmosOfflineDirectSigner;
  getOfflineSignerOnlyAmino(chainId: string): CosmosOfflineAminoSigner;
  /**
   * Keplr-compatible: resolves to an amino-only signer for Ledger accounts
   * and the full amino+direct signer otherwise. Async because the wallet
   * resolves `isNanoLedger` via `getKey` before choosing the signer kind.
   */
  getOfflineSignerAuto(
    chainId: string
  ): Promise<CosmosOfflineAminoSigner | (CosmosOfflineAminoSigner & CosmosOfflineDirectSigner)>;
}
