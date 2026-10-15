import { TxSignPayload } from '@gnolang/tm2-js-client';

/**
 * ADR-036 message type for off-chain data. tm2 registers nothing under the
 * `sign` prefix, so a node cannot decode a transaction carrying it, which is
 * what keeps a signed document from ever being broadcast.
 */
export const ARBITRARY_MSG_TYPE = 'sign/MsgSignData';

/**
 * Upper bound, in UTF-8 bytes, that Adena accepts for `data`. The wallet ships
 * the request to its approval window inside the popup URL, so larger payloads
 * are rejected with `INVALID_FORMAT` rather than truncated.
 */
export const MAX_ARBITRARY_MESSAGE_BYTES = 4096;

export interface ArbitraryMessage {
  type: typeof ARBITRARY_MSG_TYPE;
  value: {
    signer: string;
    /** Base64 of the UTF-8 encoded message */
    data: string;
  };
}

export interface ArbitrarySignature {
  pubKey: {
    /** `/tm.PubKeySecp256k1` */
    typeUrl: string;
    /** Base64 of the compressed Secp256k1 key, not protobuf-wrapped */
    value: string;
  };
  /** Base64 of the 64-byte `r || s` signature */
  signature: string;
}

/**
 * Proof returned by `SignArbitrary`: the exact document that was signed and
 * the signature over it. Hand both to `verifyArbitrarySignature`.
 */
export interface SignedArbitraryData {
  signed: TxSignPayload;
  signature: ArbitrarySignature;
}
