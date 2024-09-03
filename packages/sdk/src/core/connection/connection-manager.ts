import { isSuccessType } from '../../providers/adena-wallet/mapper.utils';
import { WalletProvider } from '../providers';
import { WalletConnectionEvent } from '../types';
import { ConnectionStateManager, ConnectionState } from './connection-state';

export class ConnectionManager {
  private stateManager: ConnectionStateManager;
  private listeners: ((event: WalletConnectionEvent) => void)[];

  constructor(private provider: WalletProvider) {
    this.stateManager = new ConnectionStateManager();
  }

  async connectWallet(): Promise<void> {
    if (this.getConnectionState() === ConnectionState.CONNECTED) {
      return;
    }

    this.stateManager.setState(ConnectionState.CONNECTING);
    try {
      // If your wallet is already connected, change to connected.
      const connected = await this.provider.isConnected();
      if (connected) {
        this.connect();
        return;
      }

      // If the app is registered in your wallet, change the status to connected.
      const addEstablishResponse = await this.provider.addEstablish({});
      if (isSuccessType(addEstablishResponse.status)) {
        this.connect();
        return;
      }
    } catch (error) {
      this.stateManager.setState(ConnectionState.ERROR);
      throw error;
    }

    this.stateManager.setState(ConnectionState.DISCONNECTED);
  }

  disconnectWallet(): void {
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
