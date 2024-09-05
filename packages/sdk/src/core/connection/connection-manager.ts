import { GnoWalletProvider } from '../../providers/gno-wallet';
import { TM2WalletProvider, WalletProvider } from '../providers';
import { WalletConnectionEvent, WalletResponseStatus } from '../types';
import { SDKConnectionConfigure } from '../types/config.types';
import { isTM2WalletProvider } from '../utils/provider.utils';
import { ConnectionState, ConnectionStateManager } from './connection-state';

export class ConnectionManager {
  private stateManager: ConnectionStateManager;
  private listeners: ((event: WalletConnectionEvent) => void)[];

  constructor(
    private provider: WalletProvider | TM2WalletProvider,
    private config: SDKConnectionConfigure
  ) {
    this.listeners = [];
    this.stateManager = new ConnectionStateManager();
    if (this.config.isSession) {
      this.stateManager.loadState();
      this.connectWallet();
    }
  }

  async connectWallet(): Promise<void> {
    if (isTM2WalletProvider(this.provider)) {
      return this.connectTM2Wallet();
    }
    return this.connectAdenaWallet();
  }

  disconnectWallet(): void {
    if (this.provider instanceof GnoWalletProvider) {
      this.provider.disconnect();
    }
    this.disconnect();
  }

  getConnectionState(): ConnectionState {
    return this.stateManager.getState();
  }

  getWalletProvider(): WalletProvider {
    if (this.stateManager.getState() !== ConnectionState.CONNECTED) {
      throw new Error('not connect wallet');
    }
    return this.provider;
  }

  on(listener: (connection: WalletConnectionEvent) => void): void {
    this.listeners.push(listener);
  }

  off(listener: (connection: WalletConnectionEvent) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private async connectAdenaWallet(): Promise<void> {
    if (this.getConnectionState() !== ConnectionState.CONNECTED) {
      this.stateManager.setState(ConnectionState.CONNECTING);
    }

    try {
      // If your wallet is already connected, change to connected.
      const isConnectedResponse = await this.provider.isConnected();
      if (isConnectedResponse.status === WalletResponseStatus.SUCCESS) {
        this.connect();
        return;
      }

      // If the app is registered in your wallet, change the status to connected.
      const addEstablishResponse = await this.provider.addEstablish({});
      if (addEstablishResponse.status === WalletResponseStatus.SUCCESS) {
        this.connect();
        return;
      }
    } catch (error) {
      this.stateManager.setState(ConnectionState.ERROR);
      throw error;
    }

    this.stateManager.setState(ConnectionState.DISCONNECTED);
  }

  private async connectTM2Wallet(): Promise<void> {
    if (this.getConnectionState() !== ConnectionState.CONNECTED) {
      this.stateManager.setState(ConnectionState.CONNECTING);
    }

    try {
      const connected = await (this.provider as TM2WalletProvider).connect();
      if (connected) {
        this.connect();
        return;
      }
    } catch (error) {
      this.stateManager.setState(ConnectionState.ERROR);
      throw error;
    }

    this.stateManager.setState(ConnectionState.DISCONNECTED);
  }

  private connect() {
    this.stateManager.setState(ConnectionState.CONNECTED);
    this.triggerConnectionEvent('connect');
  }

  private disconnect() {
    this.stateManager.setState(ConnectionState.DISCONNECTED);
    this.triggerConnectionEvent('disconnect');
  }

  private triggerConnectionEvent(event: WalletConnectionEvent): void {
    this.listeners?.forEach((listener) => listener(event));
  }
}
