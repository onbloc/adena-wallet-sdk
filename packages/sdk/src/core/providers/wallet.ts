import {
  AddEstablishOptions,
  AddEstablishResponse,
  AddNetworkOptions,
  AddNetworkResponse,
  BroadcastTransactionOptions,
  BroadcastTransactionResponse,
  GetAccountResponse,
  GetNetworkResponse,
  IsConnectedResponse,
  OnChangeAccountOptions,
  OnChangeAccountResponse,
  OnChangeNetworkOptions,
  OnChangeNetworkResponse,
  SwitchNetworkOptions,
  SwitchNetworkResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  SignDocumentOptions,
  SignDocumentResponse,
} from '../types/methods';

export interface WalletProvider {
  isConnected: () => Promise<IsConnectedResponse>;

  /**
   * Establish a connection to your site from Adena
   * @async
   * @param {string} name - The name of the website requesting to connect
   * @returns Original Adena response, useful to check if the site was already connected
   */
  addEstablish: (options: AddEstablishOptions) => Promise<AddEstablishResponse>;

  /**
   * Fetch information about the current connected account
   * @async
   * @returns Original Adena response with the account information
   */
  getAccount: () => Promise<GetAccountResponse>;

  /**
   * Fetch information about the current connected network
   * @async
   * @returns Original Adena response with the network information
   */
  getNetwork: () => Promise<GetNetworkResponse>;

  /**
   * Switches the Adena network to the given chain ID
   * @async
   * @param {string} chainId - Chain ID
   * @returns Nothing, throws an error if it fails
   */
  switchNetwork: (options: SwitchNetworkOptions) => Promise<SwitchNetworkResponse>;

  /**
   * Add a custom network to Adena
   * @async
   * @param {string} chainId - Chain ID
   * @param {string} chainName - Chain name
   * @param {string} rpcUrl - Network RPC URL
   * @returns Nothing, throws an error if it fails
   */
  addNetwork: (options: AddNetworkOptions) => Promise<AddNetworkResponse>;

  /**
   * Sign a transaction crafted by a web-app
   * @async
   * @param {ContractMessage[]} messages - Messages to send in the transaction
   * @param {number} gasFee - Actual network fee to pay (in ugnot)
   * @param {number} gasWanted - Gas limit (in ugnot)
   * @param {string} memo - Transaction memo (tag)
   * @returns {string} Encoded transaction
   */
  signTransaction: (options: SignTransactionOptions) => Promise<SignTransactionResponse>;

  /**
   * @async
   * @param {ContractMessage[]} messages - Messages to send in the transaction
   * @param {number} gasFee - Actual network fee to pay (in ugnot)
   * @param {number} gasWanted - Gas limit (in ugnot)
   * @param {string} memo - Transaction memo (tag)
   * @returns {string} Encoded transaction
   * @returns
   */
  signDocument?: (options: SignDocumentOptions) => Promise<SignDocumentResponse>;

  /**
   * Sign and broadcast a transaction crafted by a web-app
   * @async
   * @param {ContractMessage[]} messages - Messages to send in the transaction
   * @param {number} gasFee - Actual network fee to pay (in ugnot)
   * @param {number} gasWanted - Gas limit (in ugnot)
   * @param {string} memo - Transaction memo (tag)
   * @returns {BroadcastTxCommitResult} Result of the broadcast transaction
   */
  broadcastTransaction: (options: BroadcastTransactionOptions) => Promise<BroadcastTransactionResponse>;

  /**
   * Add a listener on connected account changes
   * @async
   * @param {OnAccountChangeFunc} func - Function to call on a new event
   * @returns Nothing, throws an error if it fails
   */
  onChangeAccount: (options: OnChangeAccountOptions) => OnChangeAccountResponse;

  /**
   * Add a listener on network changes
   * @async
   * @param {OnNetworkChangeFunc} func - Function to call on a new event
   * @returns Nothing, throws an error if it fails
   */
  onChangeNetwork: (options: OnChangeNetworkOptions) => OnChangeNetworkResponse;
}
