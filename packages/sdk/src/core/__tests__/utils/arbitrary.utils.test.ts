import { serializeSignDoc, StdSignDoc } from '@cosmjs/amino';
import { fromBase64, fromUtf8, toBase64 } from '@cosmjs/encoding';
import { Secp256k1PubKeyType, Wallet } from '@gnolang/tm2-js-client';

import { ARBITRARY_MSG_TYPE, SignedArbitraryData } from '../../types';
import {
  getArbitrarySignBytes,
  makeArbitrarySignDoc,
  parseArbitrarySignDoc,
  verifyArbitrarySignature,
} from '../../utils';

// Same fixture adena-module uses for its SignArbitrary spec, so both sides of
// the wire are pinned to one known key.
const MNEMONIC =
  'source bonus chronic canvas draft south burst lottery vacant surface solve popular case indicate oppose farm nothing bullet exhibit title speed wink action roast';
const SIGNER = 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5';
const OTHER_MNEMONIC = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const CHAIN_ID = 'gnoland-1';

const SECP256K1_ORDER = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');

async function sign(mnemonic: string, chainId: string, signer: string, data: string): Promise<SignedArbitraryData> {
  const wallet = await Wallet.fromMnemonic(mnemonic);
  const walletSigner = wallet.getSigner();
  const signed = makeArbitrarySignDoc(chainId, signer, data);
  const signature = await walletSigner.signData(getArbitrarySignBytes(signed));

  return {
    signed,
    signature: {
      pubKey: { typeUrl: Secp256k1PubKeyType, value: toBase64(await walletSigner.getPublicKey()) },
      signature: toBase64(signature),
    },
  };
}

function toHighS(signature: string): string {
  const bytes = fromBase64(signature);
  const s = BigInt('0x' + Buffer.from(bytes.slice(32)).toString('hex'));
  const highS = Buffer.from((SECP256K1_ORDER - s).toString(16).padStart(64, '0'), 'hex');
  return toBase64(new Uint8Array([...bytes.slice(0, 32), ...highS]));
}

describe('makeArbitrarySignDoc', () => {
  it('builds a single zero-fee sign/MsgSignData document bound to the chain id', () => {
    const doc = makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'hello');

    expect(doc).toEqual({
      chain_id: CHAIN_ID,
      account_number: '0',
      sequence: '0',
      fee: { amount: [], gas: '0' },
      msgs: [{ type: ARBITRARY_MSG_TYPE, value: { signer: SIGNER, data: 'aGVsbG8=' } }],
      memo: '',
    });
  });

  it('base64-encodes the message as UTF-8, including non-ASCII', () => {
    const message = 'Sign in to Gnoland · 서명 · 🔑';
    const doc = makeArbitrarySignDoc(CHAIN_ID, SIGNER, message);

    expect(fromUtf8(fromBase64(doc.msgs[0].value.data))).toBe(message);
  });
});

describe('getArbitrarySignBytes', () => {
  // The payload pinned by adena-module; the extension signs exactly these bytes.
  it('matches the payload signed by the Adena extension', () => {
    const doc = makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'hello');

    expect(fromUtf8(getArbitrarySignBytes(doc))).toBe(
      '{"account_number":"0","chain_id":"gnoland-1","fee":{"amount":[],"gas":"0"},"memo":"",' +
        '"msgs":[{"type":"sign/MsgSignData","value":{"data":"aGVsbG8=",' +
        '"signer":"g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5"}}],"sequence":"0"}'
    );
  });

  it('agrees byte for byte with the Cosmos amino serializer', () => {
    for (const message of ['hello', 'Sign in to Gnoland · 서명 · 🔑', 'a<b>c&d', ''.padEnd(512, 'x')]) {
      const doc = makeArbitrarySignDoc(CHAIN_ID, SIGNER, message);
      expect(getArbitrarySignBytes(doc)).toEqual(serializeSignDoc(doc as unknown as StdSignDoc));
    }
  });
});

describe('parseArbitrarySignDoc', () => {
  it('returns the chain id, signer and decoded message', () => {
    const doc = makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'nonce: 1234');

    expect(parseArbitrarySignDoc(doc)).toEqual({ chainId: CHAIN_ID, signer: SIGNER, data: 'nonce: 1234' });
  });

  it('keeps a leading byte order mark', () => {
    const doc = makeArbitrarySignDoc(CHAIN_ID, SIGNER, '\uFEFFnonce: 1234');

    expect(parseArbitrarySignDoc(doc)?.data).toBe('\uFEFFnonce: 1234');
  });

  it.each([
    ['null', null],
    ['a non-object', 'doc'],
    ['no messages', { ...makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'a'), msgs: [] }],
    [
      'two messages',
      {
        ...makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'a'),
        msgs: [
          ...makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'a').msgs,
          ...makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'b').msgs,
        ],
      },
    ],
    [
      'another message type',
      {
        ...makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'a'),
        msgs: [{ type: '/bank.MsgSend', value: { signer: SIGNER, data: 'YQ==' } }],
      },
    ],
    [
      'data that is not UTF-8',
      {
        ...makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'a'),
        msgs: [{ type: ARBITRARY_MSG_TYPE, value: { signer: SIGNER, data: toBase64(new Uint8Array([0xff, 0xfe])) } }],
      },
    ],
  ])('returns null for %s', (_, doc) => {
    expect(parseArbitrarySignDoc(doc)).toBeNull();
  });
});

describe('verifyArbitrarySignature', () => {
  it('accepts a proof signed by the signer', async () => {
    const proof = await sign(MNEMONIC, CHAIN_ID, SIGNER, 'hello');

    await expect(verifyArbitrarySignature(proof)).resolves.toBe(true);
    await expect(verifyArbitrarySignature(proof, { signer: SIGNER, chainId: CHAIN_ID, data: 'hello' })).resolves.toBe(
      true
    );
  });

  it('accepts the Cosmos ADR-036 form with an empty chain id', async () => {
    const proof = await sign(MNEMONIC, '', SIGNER, 'hello');

    await expect(verifyArbitrarySignature(proof, { chainId: '' })).resolves.toBe(true);
  });

  it('accepts a message that starts with a byte order mark', async () => {
    const data = '\uFEFFLogin nonce 123';
    const proof = await sign(MNEMONIC, CHAIN_ID, SIGNER, data);

    await expect(verifyArbitrarySignature(proof)).resolves.toBe(true);
    await expect(verifyArbitrarySignature(proof, { signer: SIGNER, chainId: CHAIN_ID, data })).resolves.toBe(true);
  });

  it.each([
    ['signer', { signer: 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf6' }],
    ['chain id', { chainId: 'test13' }],
    ['message', { data: 'hello!' }],
  ])('rejects a proof whose %s does not match the expectation', async (_, expected) => {
    const proof = await sign(MNEMONIC, CHAIN_ID, SIGNER, 'hello');

    await expect(verifyArbitrarySignature(proof, expected)).resolves.toBe(false);
  });

  it('rejects a document altered after signing', async () => {
    const proof = await sign(MNEMONIC, CHAIN_ID, SIGNER, 'hello');
    const tampered = makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'hellp');

    await expect(verifyArbitrarySignature({ ...proof, signed: tampered })).resolves.toBe(false);
  });

  it('rejects a signature over a non-canonical document', async () => {
    const wallet = await Wallet.fromMnemonic(MNEMONIC);
    const signed = { ...makeArbitrarySignDoc(CHAIN_ID, SIGNER, 'hello'), sequence: '7' };
    const signature = await wallet.getSigner().signData(getArbitrarySignBytes(signed));
    const proof: SignedArbitraryData = {
      signed,
      signature: {
        pubKey: { typeUrl: Secp256k1PubKeyType, value: toBase64(await wallet.getSigner().getPublicKey()) },
        signature: toBase64(signature),
      },
    };

    await expect(verifyArbitrarySignature(proof)).resolves.toBe(false);
  });

  it('rejects a key that does not derive the signer address', async () => {
    const proof = await sign(OTHER_MNEMONIC, CHAIN_ID, SIGNER, 'hello');

    await expect(verifyArbitrarySignature(proof)).resolves.toBe(false);
  });

  it('rejects the malleated high-S form of a valid signature', async () => {
    const proof = await sign(MNEMONIC, CHAIN_ID, SIGNER, 'hello');
    const malleated = { ...proof, signature: { ...proof.signature, signature: toHighS(proof.signature.signature) } };

    await expect(verifyArbitrarySignature(malleated)).resolves.toBe(false);
  });

  it('rejects a public key of another type', async () => {
    const proof = await sign(MNEMONIC, CHAIN_ID, SIGNER, 'hello');
    const ed25519 = {
      ...proof,
      signature: { ...proof.signature, pubKey: { ...proof.signature.pubKey, typeUrl: '/tm.PubKeyEd25519' } },
    };

    await expect(verifyArbitrarySignature(ed25519)).resolves.toBe(false);
  });

  it('resolves false instead of throwing on malformed input', async () => {
    const proof = await sign(MNEMONIC, CHAIN_ID, SIGNER, 'hello');

    await expect(verifyArbitrarySignature({} as SignedArbitraryData)).resolves.toBe(false);
    await expect(
      verifyArbitrarySignature({ ...proof, signature: { ...proof.signature, signature: 'not base64!' } })
    ).resolves.toBe(false);
    await expect(
      verifyArbitrarySignature({
        ...proof,
        signature: { ...proof.signature, pubKey: { ...proof.signature.pubKey, value: toBase64(new Uint8Array(3)) } },
      })
    ).resolves.toBe(false);
  });
});
