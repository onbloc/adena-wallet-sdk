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

export class AdenaSDK {
  private connectionManager: ConnectionManager;

  constructor(provider: WalletProvider) {
    this.connectionManager = new ConnectionManager(provider);
  }

  async connectWallet(): Promise<void> {
    return this.connectionManager.connectWallet();
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
