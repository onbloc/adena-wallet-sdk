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
import { SDKConfigure } from '../types';
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

  private get walletProvider() {
    return this.connectionManager.getWalletProvider();
  }

  connectWallet(): Promise<void> {
    return connect(this.connectionManager, this.config);
  }

  disconnectWallet(): void {
    return disconnect(this.connectionManager);
  }

  getConnectionState(): ConnectionState {
    return getConnectionState(this.connectionManager);
  }

  onConnectionChange(options: OnConnectionChangeOptions): OnConnectionChangeResponse {
    return onConnectionChange(this.connectionManager, options);
  }

  offConnectionChange(options: OffConnectionChangeOptions): OffConnectionChangeResponse {
    return offConnectionChange(this.connectionManager, options);
  }

  isConnected(): Promise<IsConnectedResponse> {
    return isConnected(this.walletProvider);
  }

  addEstablish(options: AddEstablishOptions): Promise<AddEstablishResponse> {
    return addEstablish(this.walletProvider, options);
  }

  getAccount(): Promise<GetAccountResponse> {
    return getAccount(this.walletProvider);
  }

  switchNetwork(options: SwitchNetworkOptions): Promise<SwitchNetworkResponse> {
    return switchNetwork(this.walletProvider, options);
  }

  addNetwork(options: AddNetworkOptions): Promise<AddNetworkResponse> {
    return addNetwork(this.walletProvider, options);
  }

  signTransaction(options: SignTransactionOptions): Promise<SignTransactionResponse> {
    return signTransaction(this.walletProvider, options);
  }

  broadcastTransaction(options: BroadcastTransactionOptions): Promise<BroadcastTransactionResponse> {
    return broadcastTransaction(this.walletProvider, options);
  }

  onChangeAccount(options: OnChangeAccountOptions): OnChangeAccountResponse {
    return onChangeAccount(this.walletProvider, options);
  }

  onChangeNetwork(options: OnChangeNetworkOptions): OnChangeNetworkResponse {
    return onChangeNetwork(this.walletProvider, options);
  }
}
