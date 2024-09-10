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

  /**
   * Initiates the connection process with the wallet provider.
   * Determines if the provider is TM2 or Adena and calls the respective connection method.
   * @returns A promise that resolves when the connection process is complete.
   */
  async connectWallet(): Promise<void> {
    if (isTM2WalletProvider(this.provider)) {
      return this.connectTM2Wallet();
    }
    return this.connectAdenaWallet();
  }

  /**
   * Disconnects from the wallet provider and updates the connection state.
   */
  disconnectWallet(): void {
    if (this.provider instanceof GnoWalletProvider) {
      this.provider.disconnect();
    }
    this.disconnect();
  }

  /**
   * Retrieves the current connection state from the state manager.
   * @returns The current connection state.
   */
  getConnectionState(): ConnectionState {
    return this.stateManager.getState();
  }

  /**
   * Retrieves the wallet provider if the connection state is connected.
   * Throws an error if the wallet is not connected.
   * @returns The current wallet provider.
   * @throws Error if the wallet is not connected.
   */
  getWalletProvider(): WalletProvider {
    if (this.stateManager.getState() !== ConnectionState.CONNECTED) {
      throw new Error('not connect wallet');
    }
    return this.provider;
  }

  /**
   * Registers a callback function to be called when the connection state changes.
   * @param listener - The callback function to be invoked on connection state changes.
   */
  on(listener: (connection: WalletConnectionEvent) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Unregisters a previously registered callback function from being called on connection state changes.
   * @param listener - The callback function to be removed.
   */
  off(listener: (connection: WalletConnectionEvent) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * Handles the connection process for Adena wallet providers.
   * Updates the connection state based on the success or failure of connection attempts.
   * @returns A promise that resolves when the connection process is complete.
   * @throws Error if an error occurs during the connection process.
   */
  private async connectAdenaWallet(): Promise<void> {
    if (this.getConnectionState() !== ConnectionState.CONNECTED) {
      this.stateManager.setState(ConnectionState.CONNECTING);
    }

    try {
      const isConnectedResponse = await this.provider.isConnected();
      if (isConnectedResponse.status === WalletResponseStatus.SUCCESS) {
        this.connect();
        return;
      }

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

  /**
   * Handles the connection process for TM2 wallet providers.
   * Updates the connection state based on the success or failure of the connection attempt.
   * @returns A promise that resolves when the connection process is complete.
   * @throws Error if an error occurs during the connection process.
   */
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

  /**
   * Updates the connection state to connected and triggers the connection event.
   */
  private connect() {
    this.stateManager.setState(ConnectionState.CONNECTED);
    this.triggerConnectionEvent('connect');
  }

  /**
   * Updates the connection state to disconnected and triggers the disconnection event.
   */
  private disconnect() {
    this.stateManager.setState(ConnectionState.DISCONNECTED);
    this.triggerConnectionEvent('disconnect');
  }

  /**
   * Invokes all registered listeners with the specified connection event.
   * @param event - The connection event to trigger.
   */
  private triggerConnectionEvent(event: WalletConnectionEvent): void {
    this.listeners?.forEach((listener) => listener(event));
  }
}
