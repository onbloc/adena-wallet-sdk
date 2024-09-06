import { ConnectionManager, ConnectionState } from '../connection';
import {
  addEstablish,
  addNetwork,
  broadcastTransaction,
  getAccount,
  isConnected,
  onChangeAccount,
  onChangeNetwork,
  signTransaction,
  switchNetwork,
} from '../methods';
import { WalletProvider } from '../providers';
import { SDKConfigure } from '../types/config.types';
import {
  AddEstablishOptions,
  AddEstablishResponse,
  AddNetworkOptions,
  AddNetworkResponse,
  BroadcastTransactionOptions,
  BroadcastTransactionResponse,
  GetAccountResponse,
  IsConnectedResponse,
  OnChangeAccountOptions,
  OnChangeAccountResponse,
  OnChangeNetworkOptions,
  OnChangeNetworkResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  SwitchNetworkOptions,
  SwitchNetworkResponse,
} from '../types/methods';
import { OffConnectionChangeOptions, OffConnectionChangeResponse } from '../types/methods/off-connection-change';
import { OnConnectionChangeOptions, OnConnectionChangeResponse } from '../types/methods/on-connection-change';

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

  async connectWallet(): Promise<void> {
    return this.connectionManager.connectWallet().catch(() => {
      if (this.config.walletDownloadUrl) {
        this.openLink(this.config.walletDownloadUrl);
      }
    });
  }

  disconnectWallet(): void {
    this.connectionManager.disconnectWallet();
  }

  getConnectionState(): ConnectionState {
    return this.connectionManager.getConnectionState();
  }

  onConnectionChange(options: OnConnectionChangeOptions): OnConnectionChangeResponse {
    return this.connectionManager.on(options.callback);
  }

  offConnectionChange(options: OffConnectionChangeOptions): OffConnectionChangeResponse {
    return this.connectionManager.off(options.callback);
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

  private openLink(url: string): void {
    window?.open(url, '_blank');
  }
}
