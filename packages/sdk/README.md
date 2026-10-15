# Adena Wallet SDK

The Adena Wallet SDK is a TypeScript-based library designed to interact with the Adena Wallet and TM2 Wallet.

This SDK provides various functionalities, including wallet connection, network switching, transaction signing, arbitrary message signing (ADR-036), and more.

## Adena Wallet

- [Docs](https://docs.adena.app)
- [Extension](https://www.adena.app/)

## Installation

Install the SDK via npm:

```
npm install @adena-wallet/sdk
```

Or via yarn:

```
yarn add @adena-wallet/sdk
```

## Basic Usage

Here is a basic example of how to use the SDK:

```
import { AdenaSDK, AdenaWalletProvider } from '@adena-wallet/sdk';

// `WalletProvider` is the interface; pass a concrete provider —
// `AdenaWalletProvider` for the extension, `GnoWalletProvider` /
// `GnoSocialWalletProvider` for a locally held key.
const walletProvider = new AdenaWalletProvider();
const adenaSDK = new AdenaSDK(walletProvider);

// Connect to the wallet
adenaSDK.connectWallet().then(() => {
  console.log('Wallet connected');
});

// Retrieves account information
adenaSDK.getAccount().then((account) => {
  console.log('Account:', account);
});
```

## SDK Functions

### `connectWallet`

Connects the SDK to the wallet.

**Example:**

```
adenaSDK.connectWallet().then(() => {
  console.log('Wallet connected');
});
```

### `disconnectWallet`

Disconnects the SDK from the wallet.

**Example:**

```
adenaSDK.disconnectWallet();
```

### `getConnectionState`

Retrieves the current connection state of the wallet.

**Example:**

```
const state = adenaSDK.getConnectionState();
console.log('Connection state:', state);
```

### `onConnectionChange`

Sets up a listener for connection state changes.

**Example:**

```
adenaSDK.onConnectionChange({
  callback: (event) => {
    console.log('Connection event:', event);
  },
});
```

### `offConnectionChange`

Removes a previously set connection state change listener.

**Example:**

```
const listener = (event) => {
  console.log('Connection event:', event);
};

adenaSDK.onConnectionChange({ callback: listener });

// Later, remove the listener
adenaSDK.offConnectionChange({ callback: listener });
```

### `isConnected`

Checks if the wallet is currently connected.

**Example:**

```
adenaSDK.isConnected().then((response) => {
  console.log('Is connected:', response.status);
});
```

### `getAccount`

Retrieves account information from the connected wallet.

**Example:**

```
adenaSDK.getAccount().then((account) => {
  console.log('Account:', account);
});
```

### `switchNetwork`

Switches the wallet to a different network. With `GnoWalletProvider`, an unreachable RPC returns
`NETWORK_TIMEOUT` and leaves the previously connected network active.

**Example:**

```
adenaSDK.switchNetwork({ chainId: 'new-chain-id' }).then((response) => {
  console.log('Network switch:', response.status, response.type);
});
```

### `addNetwork`

Adds a new network to the wallet.

**Example:**

```
adenaSDK.addNetwork({
  chainId: 'new-chain-id',
  chainName: 'New Network',
  rpcUrl: 'New Chain RPC URL',
}).then(() => {
  console.log('Network added');
});
```

### `signTransaction`

Signs a transaction with the connected wallet.

**Example:**

```
const tx = {
    /** specific message types */
    messages: Any[];
    /** transaction costs (fee) */
    fee?: TxFee;
    /** the signatures for the transaction */
    signatures: TxSignature[];
    /** memo attached to the transaction */
    memo: string;
};

adenaSDK.signTransaction({ tx }).then((response) => {
  console.log('Signed transaction:', response.encodedTransaction);
});
```

### `broadcastTransaction`

Broadcasts a signed transaction to the network.

**Example:**

```
const tx = {
    /** specific message types */
    messages: Any[];
    /** transaction costs (fee) */
    fee?: TxFee;
    /** the signatures for the transaction */
    signatures: TxSignature[];
    /** memo attached to the transaction */
    memo: string;
};

adenaSDK.broadcastTransaction({ tx }).then((response) => {
  console.log('Broadcast response:', response);
});
```

### `signArbitrary`

Signs arbitrary off-chain data with the connected account, following [ADR-036](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-036-arbitrary-signature.md). Use it to prove that a user controls an address (e.g. sign-in, ownership checks) — nothing is broadcast and no funds move.

**Parameters:**

- signer: Address expected to sign. The wallet answers `ACCOUNT_MISMATCH` if it is not the current account
- data: UTF-8 text shown to the user and signed as-is (non-empty, at most 4096 bytes)

The signed document is a single `sign/MsgSignData` message with zero account number, sequence and fee. Unlike plain ADR-036, `chain_id` carries the connected network instead of `''`, so a proof issued on one network cannot be replayed on another.

> Note: Requires an Adena extension version that exposes `SignArbitrary`; older versions answer `UNSUPPORTED_TYPE`.

**Example:**

```typescript
const account = await adenaSDK.getAccount();
const nonce = await fetchNonceFromServer();

const response = await adenaSDK.signArbitrary({
  signer: account.data.address,
  data: `Sign in to example.com\nNonce: ${nonce}`,
});

// response.data structure:
// {
//   signed: {
//     chain_id: "gnoland1",
//     account_number: "0",
//     sequence: "0",
//     fee: { amount: [], gas: "0" },
//     msgs: [{ type: "sign/MsgSignData", value: { signer: "g1...", data: "<base64 of data>" } }],
//     memo: ""
//   },
//   signature: {
//     pubKey: { typeUrl: "/tm.PubKeySecp256k1", value: "<base64 compressed key>" },
//     signature: "<base64 r||s>"
//   }
// }
```

### `onChangeAccount`

Sets up a listener for account changes.

**Example:**

```
adenaSDK.onChangeAccount({
  callback: (account) => {
    console.log('Account changed:', account);
  },
});
```

### `onChangeNetwork`

Sets up a listener for network changes.

**Example:**

```
adenaSDK.onChangeNetwork({
  callback: (network) => {
    console.log('Network changed:', network);
  },
});
```

## Utility Functions

### ADR-036 Verification

Verify a `signArbitrary` proof anywhere — in the browser or on a server — without a wallet or network access.

- `verifyArbitrarySignature(proof, expected?)`: Resolves `true` only when the public key derives the signer address, the document is the canonical ADR-036 form, and the signature is a valid low-S Secp256k1 signature over it. Any field in `expected` (`signer`, `chainId`, `data`) must match too. Never throws; malformed input resolves to `false`.
- `parseArbitrarySignDoc(doc)`: Returns `{ chainId, signer, data }` with `data` decoded, or `null` if the document is not a single `sign/MsgSignData` message.
- `makeArbitrarySignDoc(chainId, signer, data)`: Builds the document that is signed.
- `getArbitrarySignBytes(doc)`: Serializes a document into the signed bytes (sorted JSON, byte-identical to `@cosmjs/amino`'s `serializeSignDoc`).

> Always pin `signer`, `chainId` and the exact `data` (including a single-use nonce) when verifying, otherwise a valid proof can be replayed. Passing `chainId: ''` verifies standard Cosmos ADR-036 signatures produced by other wallets.

**Example:**

```typescript
import { verifyArbitrarySignature } from '@adena-wallet/sdk';

const isValid = await verifyArbitrarySignature(response.data, {
  signer: account.data.address,
  chainId: 'gnoland1',
  data: `Sign in to example.com\nNonce: ${nonce}`,
});
```

## Development Setup

The Node.js version is 24.13.0.  
We recommend using [nvm](https://github.com/nvm-sh/nvm).

```bash
# If you don't have that version installed,
# $ nvm install

$ nvm use
```

## License

This project is licensed under the MIT License.
