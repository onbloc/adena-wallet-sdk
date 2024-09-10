import { Wallet } from '@gnolang/tm2-js-client';
import { AdenaWalletProvider, GnoSocialWalletProvider, GnoWalletProvider } from '../../providers';
import { ConnectionManager, ConnectionState } from '../connection';
import {
  addEstablish,
  addNetwork,
  broadcastTransaction,
  connect,
  disconnect,
  getAccount,
  getConnectionState,
  isConnected,
  offConnectionChange,
  onChangeAccount,
  onChangeNetwork,
  onConnectionChange,
  signTransaction,
  switchNetwork,
} from '../methods';
import { WalletProvider } from '../providers';
import { SDKConfigure, SocialConfigure } from '../types';
import {
  AddEstablishOptions,
  AddEstablishResponse,
  AddNetworkOptions,
  AddNetworkResponse,
  BroadcastTransactionOptions,
  BroadcastTransactionResponse,
  GetAccountResponse,
  IsConnectedResponse,
  OffConnectionChangeOptions,
  OffConnectionChangeResponse,
  OnChangeAccountOptions,
  OnChangeAccountResponse,
  OnChangeNetworkOptions,
  OnChangeNetworkResponse,
  OnConnectionChangeOptions,
  OnConnectionChangeResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  SwitchNetworkOptions,
  SwitchNetworkResponse,
} from '../types/methods';

const DEFAULT_ADENA_URL = 'https://www.adena.app';

function createSDKConfigure({
  isSession = false,
  walletDownloadUrl = DEFAULT_ADENA_URL,
  ...rest
}: SDKConfigure = {}): SDKConfigure {
  return {
    ...rest,
    isSession,
    walletDownloadUrl,
  };
}

export class AdenaSDK {
  private connectionManager: ConnectionManager;
  private config: SDKConfigure;

  constructor(provider: WalletProvider, config?: SDKConfigure) {
    this.config = createSDKConfigure(config);
    this.connectionManager = new ConnectionManager(provider, this.config);
  }

  /**
   * Retrieves the current wallet provider from the connection manager.
   * @returns The current wallet provider.
   */
  private get walletProvider() {
    return this.connectionManager.getWalletProvider();
  }

  /**
   * Connects to the wallet using the connection manager and configuration.
   * @returns A promise that resolves when the connection is successful.
   */
  connectWallet(): Promise<void> {
    return connect(this.connectionManager, this.config);
  }

  /**
   * Disconnects from the wallet using the connection manager.
   */
  disconnectWallet(): void {
    return disconnect(this.connectionManager);
  }

  /**
   * Retrieves the current connection state from the connection manager.
   * @returns The current connection state.
   */
  getConnectionState(): ConnectionState {
    return getConnectionState(this.connectionManager);
  }

  /**
   * Registers a callback to be invoked when the connection state changes.
   * @param options - Configuration options including the callback function.
   * @returns The response from the `onConnectionChange` method of the connection manager.
   */
  onConnectionChange(options: OnConnectionChangeOptions): OnConnectionChangeResponse {
    return onConnectionChange(this.connectionManager, options);
  }

  /**
   * Unregisters a callback previously registered for connection state changes.
   * @param options - Configuration options including the callback function.
   * @returns The response from the `offConnectionChange` method of the connection manager.
   */
  offConnectionChange(options: OffConnectionChangeOptions): OffConnectionChangeResponse {
    return offConnectionChange(this.connectionManager, options);
  }

  /**
   * Checks if the wallet provider is currently connected.
   * @returns A promise that resolves to the response from the wallet provider's `isConnected` method.
   */
  isConnected(): Promise<IsConnectedResponse> {
    return isConnected(this.walletProvider);
  }

  /**
   * Adds an establishment request to the wallet provider.
   * @param options - Options for the establishment request.
   * @returns A promise that resolves to the response from the wallet provider's `addEstablish` method.
   */
  addEstablish(options: AddEstablishOptions): Promise<AddEstablishResponse> {
    return addEstablish(this.walletProvider, options);
  }

  /**
   * Retrieves account information from the wallet provider.
   * @returns A promise that resolves to the account information from the wallet provider.
   */
  getAccount(): Promise<GetAccountResponse> {
    return getAccount(this.walletProvider);
  }

  /**
   * Switches the network in the wallet provider.
   * @param options - Options for switching the network.
   * @returns A promise that resolves to the response from the wallet provider's `switchNetwork` method.
   */
  switchNetwork(options: SwitchNetworkOptions): Promise<SwitchNetworkResponse> {
    return switchNetwork(this.walletProvider, options);
  }

  /**
   * Adds a network to the wallet provider.
   * @param options - Options for adding the network.
   * @returns A promise that resolves to the response from the wallet provider's `addNetwork` method.
   */
  addNetwork(options: AddNetworkOptions): Promise<AddNetworkResponse> {
    return addNetwork(this.walletProvider, options);
  }

  /**
   * Signs a transaction using the wallet provider.
   * @param options - Options for signing the transaction, including the transaction details.
   * @returns A promise that resolves to the response from the wallet provider's `signTransaction` method.
   */
  signTransaction(options: SignTransactionOptions): Promise<SignTransactionResponse> {
    return signTransaction(this.walletProvider, options);
  }

  /**
   * Broadcasts a transaction using the wallet provider.
   * @param options - Options for broadcasting the transaction.
   * @returns A promise that resolves to the response from the wallet provider's `broadcastTransaction` method.
   */
  broadcastTransaction(options: BroadcastTransactionOptions): Promise<BroadcastTransactionResponse> {
    return broadcastTransaction(this.walletProvider, options);
  }

  /**
   * Registers a callback to be invoked when the account changes.
   * @param options - Configuration options including the callback function.
   * @returns The response from the wallet provider's `onChangeAccount` method.
   */
  onChangeAccount(options: OnChangeAccountOptions): OnChangeAccountResponse {
    return onChangeAccount(this.walletProvider, options);
  }

  /**
   * Registers a callback to be invoked when the network changes.
   * @param options - Configuration options including the callback function.
   * @returns The response from the wallet provider's `onChangeNetwork` method.
   */
  onChangeNetwork(options: OnChangeNetworkOptions): OnChangeNetworkResponse {
    return onChangeNetwork(this.walletProvider, options);
  }

  public static createAdenaWallet(config?: SDKConfigure): AdenaSDK {
    return new AdenaSDK(new AdenaWalletProvider(), config);
  }

  public static createGnoWallet(wallet: Wallet, config?: SDKConfigure): AdenaSDK {
    return new AdenaSDK(new GnoWalletProvider(wallet), config);
  }

  public static createGnoSocialWallet(config: SocialConfigure & SDKConfigure): AdenaSDK {
    return new AdenaSDK(GnoSocialWalletProvider.create(config), config);
  }
}
