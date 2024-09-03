import { ConnectionManager } from '../connection';
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

export class AdenaSDK {
  private connectionManager: ConnectionManager;

  constructor(provider: WalletProvider) {
    this.connectionManager = new ConnectionManager(provider);
  }

  async connectWallet(): Promise<void> {
    return this.connectionManager.connect();
  }

  disconnectWallet(): void {
    this.connectionManager.disconnect();
  }

  getConnectionState() {
    return this.connectionManager.getConnectionState();
  }

  isConnected(): Promise<IsConnectedResponse> {
    return isConnected(this.connectionManager.getWalletProvider());
  }

  addEstablish(options: AddEstablishOptions): Promise<AddEstablishResponse> {
    return addEstablish(this.connectionManager.getWalletProvider(), options);
  }

  getAccount(): Promise<GetAccountResponse> {
    return getAccount(this.connectionManager.getWalletProvider());
  }

  switchNetwork(options: SwitchNetworkOptions): Promise<SwitchNetworkResponse> {
    return switchNetwork(this.connectionManager.getWalletProvider(), options);
  }

  addNetwork(options: AddNetworkOptions): Promise<AddNetworkResponse> {
    return addNetwork(this.connectionManager.getWalletProvider(), options);
  }

  signTransaction(options: SignTransactionOptions): Promise<SignTransactionResponse> {
    return signTransaction(this.connectionManager.getWalletProvider(), options);
  }

  broadcastTransaction(options: BroadcastTransactionOptions): Promise<BroadcastTransactionResponse> {
    return broadcastTransaction(this.connectionManager.getWalletProvider(), options);
  }

  onChangeAccount(options: OnChangeAccountOptions): OnChangeAccountResponse {
    return onChangeAccount(this.connectionManager.getWalletProvider(), options);
  }

  onChangeNetwork(options: OnChangeNetworkOptions): OnChangeNetworkResponse {
    return onChangeNetwork(this.connectionManager.getWalletProvider(), options);
  }
}
