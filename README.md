# Adena Wallet SDK

The Adena Wallet SDK is a TypeScript-based library designed to interact with the Adena Wallet and TM2 Wallet.

This SDK provides various functionalities, including transaction signing, wallet connection, network switching, etc.

(NPM Published at https://www.npmjs.com/package/@adena-wallet/sdk)

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
import { AdenaSDK, WalletProvider } from '@adena-wallet/sdk';

const walletProvider = new WalletProvider();
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

Connects to a wallet via the SDK.

**Example:**

```
adenaSDK.connectWallet().then(() => {
  console.log('Wallet connected');
});
```

### `disconnectWallet`

Disconnects from a wallet via the SDK.

**Example:**

```
adenaSDK.disconnectWallet();
```

### `getConnectionState`

Retrieves the current connection state of a wallet.

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

Checks if a wallet is currently connected.

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

### `getNetwork`

Retrieves network information from the connected wallet.

**Example:**

```
adenaSDK.getNetwork().then((network) => {
  console.log('Network:', network);
});
```

### `switchNetwork`

Switches the wallet to a different network.

**Example:**

```
adenaSDK.switchNetwork({ chainId: 'new-chain-id' }).then(() => {
  console.log('Network switched');
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

## Multisig Functions

### `createMultisigAccount`

Creates a new multisig account with specified signers and threshold.

**Parameters:**

- signers: Array of signer addresses
- threshold: Minimum number of signatures required
- noSort (Optional): Whether to skip sorting signers

**Example:**

```typescript
const multisigAccountParams = {
  signers: [
    "g1signer1address...",
    "g1signer2address...",
    "g1signer3address...",
  ],
  threshold: 2,
  noSort: true,
};

await adenaSDK.createMultisigAccount(multisigAccountParams);
```

### `createMultisigTransaction`

Creates a multisig transaction that can be signed by multiple signers. Returns the unsigned
amino transaction that should be shared with all signers.

> Note: This transaction must be created from a multisig account. Make sure you have switched to the multisig account in Adena wallet before calling this method.

**Parameters:**

- messages: Array of transaction messages
- fee: `{ gasFee, gasWanted }`, both as strings (`gasFee` is a `<amount><denom>` coin)
- memo (Optional): Transaction memo
- networkInfo (Optional): `{ chainId, rpcUrl }` to pin the transaction to a specific network

**Example:**

```typescript
const multisigTxParams = {
  messages: [
    {
      type: "/vm.m_call",
      value: {
        caller: "g1multisigaddress...",
        send: "",
        max_deposit: "",
        pkg_path: "gno.land/r/gnoland/wugnot",
        func: "Approve",
        args: ["g1recipient...", "1000"],
      },
    },
  ],
  fee: {
    gasFee: "6113ugnot",
    gasWanted: "6112955",
  },
  memo: "",
};

const response = await adenaSDK.createMultisigTransaction(multisigTxParams);

// response.data structure:
// {
//   tx: {
//     msg: [...],
//     fee: { gas_wanted: "6112955", gas_fee: "6113ugnot" },
//     signatures: null,
//     memo: ""
//   }
// }
```

The signing methods take a multisig document — the transaction plus the account context it
is signed against. Adena no longer returns that context from `createMultisigTransaction`, so
assemble it from `getAccount` and `getNetwork`:

```typescript
const account = await adenaSDK.getAccount();
const network = await adenaSDK.getNetwork();

const multisigDocument = {
  tx: response.data.tx,
  chainId: network.data.chainId,
  accountNumber: account.data.accountNumber,
  sequence: account.data.sequence,
};
```

### `signMultisigTransaction`

Signs a multisig transaction with the current account. This method adds your signature to an existing multisig transaction document.

**Parameters:**

- multisigDocument: `{ tx, chainId, accountNumber, sequence }`
- multisigSignatures (Optional): only for 2nd signer onwards, from previous signer's result

**Example:**

```typescript
// Signer 1: Received multisigDocument from createMultisigTransaction
const signer1Response = await adenaSDK.signMultisigTransaction({ multisigDocument });

// Signer 2: Received result from Signer 1
const { multisigDocument: doc2, multisigSignatures: sigs2 } = signer1Response.data.result;

const signer2Response = await adenaSDK.signMultisigTransaction({
  multisigDocument: doc2,
  multisigSignatures: sigs2,
});

// Signer 3: Received result from Signer 2
const { multisigDocument: doc3, multisigSignatures: sigs3 } = signer2Response.data.result;

const signer3Response = await adenaSDK.signMultisigTransaction({
  multisigDocument: doc3,
  multisigSignatures: sigs3,
});
```

Each collected signature is an amino secp256k1 signature:

```typescript
// {
//   pub_key: { "@type": "/tm.PubKeySecp256k1", value: "A1b2..." },
//   signature: "c3D4..."
// }
```

### `broadcastMultisigTransaction`

Broadcasts a multisig transaction once enough signatures have been collected to meet the threshold requirement.

> Important: This method must be called from the same multisig account that created the transaction. Switch to the multisig account in Adena wallet before broadcasting.

**Parameters:**

- multisigDocument: from the final signer's result
- multisigSignatures: from the final signer's result

**Example:**

```typescript
// Received result from the final signer (when threshold is met)
const { multisigDocument, multisigSignatures } = finalSignerResponse.data.result;

await adenaSDK.broadcastMultisigTransaction({ multisigDocument, multisigSignatures });
```

## Utility Functions

### `TransactionBuilder`

Generate transaction data.

- `makeMsgSendMessage`: Generates a `MsgSend` of bank transaction message.
- `makeAddPackageMessage`: Generate a `AddPackage` of vm transaction message.
- `makeMsgCallMessage`: Generate a `MsgCall` of vm transaction message.
- `makeMsgRunMessage`: Generates a `MsgRun` of vm transaction message.
- `makeMsgEnablePackageMessage`: Generates a `MsgEnablePackage` of vm transaction message.
- `makeMsgRejectPackageMessage`: Generates a `MsgRejectPackage` of vm transaction message.
- `makeMsgCreateSessionMessage`: Generates a `MsgCreateSession` of auth transaction message.
- `makeMsgRevokeSessionMessage`: Generates a `MsgRevokeSession` of auth transaction message.
- `makeMsgRevokeAllSessionsMessage`: Generates a `MsgRevokeAllSessions` of auth transaction message.

**Example:**

```
const tx = TransactionBuilder.create()
  .messages(
    makeMsgSendMessage({
      from_address: account.data?.address || '',
      to_address: account.data?.address || '',
      amount: '1ugnot',
    }),
    // You can add multiple messages
  )
  .memo('memo')
  .build();
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
