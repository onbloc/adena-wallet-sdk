import { getSessionStorageItem, setSessionStorageItem } from '../utils/storage.utils';

export enum ConnectionState {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  ERROR,
}

export class ConnectionStateManager {
  private static readonly STORAGE_KEY = 'adena-sdk-connection-state';

  private state: ConnectionState = ConnectionState.DISCONNECTED;

  getState(): ConnectionState {
    return this.state;
  }

  setState(state: ConnectionState): void {
    this.state = state;
    this.saveState();
  }

  loadState(): void {
    const savedState = getSessionStorageItem(ConnectionStateManager.STORAGE_KEY);
    if (savedState === ConnectionState.CONNECTED.toString()) {
      this.setState(ConnectionState.CONNECTED);
    }
  }

  private saveState(): void {
    setSessionStorageItem(ConnectionStateManager.STORAGE_KEY, this.state.toString());
  }
}
