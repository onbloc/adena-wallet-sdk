import {
  Response,
  AccountInfo,
  BroadcastType,
  TransactionData,
  TransactionResult,
  TransactionResultCommit,
  TransactionResultSync,
  SingTransaction,
} from './types';

export interface WalletProvider {
  isConnected: () => Promise<Response<void>>;

  /**
   * Establish a connection to your site from Adena
   * @async
   * @param {string} name - The name of the website requesting to connect
   * @returns Original Adena response, useful to check if the site was already connected
   */
  addEstablish: (name: string) => Promise<Response<void>>;

  /**
   * Fetch information about the current connected account
   * @async
   * @returns Original Adena response with the account information
   */
  getAccount: () => Promise<Response<AccountInfo>>;

  /**
   * Switches the Adena network to the given chain ID
   * @async
   * @param {string} chainId - Chain ID
   * @returns Nothing, throws an error if it fails
   */
  switchNetwork: (chainId: string) => Promise<Response<void>>;

  /**
   * Add a custom network to Adena
   * @async
   * @param {string} chainId - Chain ID
   * @param {string} chainName - Chain name
   * @param {string} rpcUrl - Network RPC URL
   * @returns Nothing, throws an error if it fails
   */
  addNetwork: (chainId: string, chainName: string, rpcUrl: string) => Promise<Response<void>>;

  /**
   * Sign a transaction crafted by a web-app
   * @async
   * @param {ContractMessage[]} messages - Messages to send in the transaction
   * @param {number} gasFee - Actual network fee to pay (in ugnot)
   * @param {number} gasWanted - Gas limit (in ugnot)
   * @param {string} memo - Transaction memo (tag)
   * @returns {string} Encoded transaction
   */
  signTransaction: (transactionData: TransactionData) => Promise<Response<SingTransaction>>;

  /**
   * Sign and broadcast a transaction crafted by a web-app
   * @async
   * @param {ContractMessage[]} messages - Messages to send in the transaction
   * @param {number} gasFee - Actual network fee to pay (in ugnot)
   * @param {number} gasWanted - Gas limit (in ugnot)
   * @param {string} memo - Transaction memo (tag)
   * @returns {BroadcastTxCommitResult} Result of the broadcast transaction
   */
  broadcastTransaction: (
    transactionData: TransactionData,
    broadcastType?: BroadcastType
  ) => Promise<Response<TransactionResult | TransactionResultSync | TransactionResultCommit>>;

  /**
   * Add a listener on connected account changes
   * @async
   * @param {OnAccountChangeFunc} func - Function to call on a new event
   * @returns Nothing, throws an error if it fails
   */
  onChangeAccount: (callback: (address: string) => void) => void;

  /**
   * Add a listener on network changes
   * @async
   * @param {OnNetworkChangeFunc} func - Function to call on a new event
   * @returns Nothing, throws an error if it fails
   */
  onChangeNetwork: (callback: (chainId: string) => void) => void;
}
