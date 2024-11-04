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

## Development Setup

The Node.js version is 18.14.2.  
We recommend using [nvm](https://github.com/nvm-sh/nvm).

```bash
# If you don't have that version installed,
# $ nvm install

$ nvm use
```

## License

This project is licensed under the MIT License.
