import { encodeSecp256k1Pubkey, pubkeyToAddress } from '@cosmjs/amino';
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto';
import { fromBase64, fromBech32, toBase64, toUtf8 } from '@cosmjs/encoding';
import {
  Secp256k1PubKeyType,
  TxSignPayload,
  encodeCharacterSet,
  sortedJsonStringify,
  stringToUTF8,
} from '@gnolang/tm2-js-client';

import { ARBITRARY_MSG_TYPE, ArbitraryMessage, SignedArbitraryData } from '../types/arbitrary.types';

// Half the Secp256k1 group order. tm2 and the Cosmos SDK both reject a
// signature whose `s` lies above it, so a proof keeps a single valid encoding.
const SECP256K1_HALF_ORDER = BigInt('0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0');

const SECP256K1_SIGNATURE_LENGTH = 64;

// BIP-173 length limit. Passed explicitly: `fromBech32` defaults to `Infinity`,
// which the bundled `@scure/base` rejects as a non-integer.
const BECH32_MAX_LENGTH = 90;

export interface ArbitrarySignDocContent {
  chainId: string;
  signer: string;
  data: string;
}

export interface VerifyArbitrarySignatureOptions {
  /** Address the proof must be issued by */
  signer?: string;
  /** Network the proof must be bound to. Cosmos ADR-036 wallets sign with an empty chain id */
  chainId?: string;
  /** Exact message, typically including a server-issued nonce, that must have been signed */
  data?: string;
}

/**
 * Builds the ADR-036 document signed by `SignArbitrary`.
 *
 * Account number, sequence and gas are fixed at zero and the fee carries no
 * coins, so the document is a pure function of (chainId, signer, data). Adena
 * binds the connected network's chain id; pass `''` for the plain Cosmos form.
 */
export function makeArbitrarySignDoc(chainId: string, signer: string, data: string): TxSignPayload {
  const message: ArbitraryMessage = {
    type: ARBITRARY_MSG_TYPE,
    value: {
      signer,
      data: toBase64(toUtf8(data)),
    },
  };

  return {
    chain_id: chainId,
    account_number: '0',
    sequence: '0',
    fee: {
      amount: [],
      gas: '0',
    },
    msgs: [message],
    memo: '',
  };
}

/**
 * Serializes a sign document into the bytes that are hashed and signed: keys
 * sorted, `<`, `>` and `&` escaped as Go's JSON encoder does, then UTF-8.
 * Byte-identical to `serializeSignDoc` from `@cosmjs/amino`.
 */
export function getArbitrarySignBytes(doc: TxSignPayload): Uint8Array {
  return stringToUTF8(encodeCharacterSet(sortedJsonStringify(doc)));
}

/**
 * Reads the chain id, signer and decoded message out of an ADR-036 document.
 * Returns `null` when the document is not a single `sign/MsgSignData` message
 * carrying UTF-8 data.
 */
export function parseArbitrarySignDoc(doc: unknown): ArbitrarySignDocContent | null {
  if (!isRecord(doc) || typeof doc.chain_id !== 'string' || !Array.isArray(doc.msgs) || doc.msgs.length !== 1) {
    return null;
  }

  const message = doc.msgs[0];
  if (!isRecord(message) || message.type !== ARBITRARY_MSG_TYPE || !isRecord(message.value)) {
    return null;
  }

  const { signer, data } = message.value;
  if (typeof signer !== 'string' || typeof data !== 'string') {
    return null;
  }

  try {
    return {
      chainId: doc.chain_id,
      signer,
      data: decodeUtf8(fromBase64(data)),
    };
  } catch {
    return null;
  }
}

/**
 * Verifies a `SignArbitrary` proof according to ADR-036.
 *
 * The proof is accepted only when the public key derives the signer address,
 * the document is the canonical ADR-036 form (any other field, fee, sequence or
 * extra message makes it fail), and the signature is a valid low-S Secp256k1
 * signature over it. Each field given in `expected` must match as well; pin at
 * least `signer`, `chainId` and a nonce-bearing `data` to prevent replay.
 *
 * Never throws: malformed input resolves to `false`.
 */
export async function verifyArbitrarySignature(
  proof: SignedArbitraryData,
  expected: VerifyArbitrarySignatureOptions = {}
): Promise<boolean> {
  try {
    const content = parseArbitrarySignDoc(proof?.signed);
    if (!content) {
      return false;
    }

    if (
      (expected.signer !== undefined && expected.signer !== content.signer) ||
      (expected.chainId !== undefined && expected.chainId !== content.chainId) ||
      (expected.data !== undefined && expected.data !== content.data)
    ) {
      return false;
    }

    const { pubKey, signature } = proof.signature;
    if (pubKey.typeUrl !== Secp256k1PubKeyType) {
      return false;
    }

    const publicKey = Secp256k1.compressPubkey(fromBase64(pubKey.value));
    const prefix = fromBech32(content.signer, BECH32_MAX_LENGTH).prefix;
    if (pubkeyToAddress(encodeSecp256k1Pubkey(publicKey), prefix) !== content.signer) {
      return false;
    }

    const signatureBytes = fromBase64(signature);
    if (signatureBytes.length !== SECP256K1_SIGNATURE_LENGTH || !isLowS(signatureBytes)) {
      return false;
    }

    // Verify against a rebuilt document rather than the one supplied, so the
    // signature only counts if it covers exactly the canonical form.
    const signBytes = getArbitrarySignBytes(makeArbitrarySignDoc(content.chainId, content.signer, content.data));

    return Secp256k1.verifySignature(Secp256k1Signature.fromFixedLength(signatureBytes), sha256(signBytes), publicKey);
  } catch {
    return false;
  }
}

// Strict, and keeps a leading U+FEFF: `fromUtf8` would strip it while
// `toUtf8` encodes it, so a BOM-prefixed message could never be rebuilt.
function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
}

function isLowS(signature: Uint8Array): boolean {
  const s = signature.slice(32);
  const value = BigInt('0x' + Array.from(s, (byte) => byte.toString(16).padStart(2, '0')).join(''));
  return value <= SECP256K1_HALF_ORDER;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
