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

  /**
   * Retrieves the current connection state.
   * @returns The current connection state.
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Sets a new connection state and saves it to storage.
   * @param state - The new connection state to set.
   */
  setState(state: ConnectionState): void {
    this.state = state;
    this.saveState();
  }

  /**
   * Loads the connection state from storage and updates the internal state.
   * If the stored state is 'CONNECTED', it sets the state to CONNECTED.
   */
  loadState(): void {
    const savedState = getSessionStorageItem(ConnectionStateManager.STORAGE_KEY);
    if (savedState === ConnectionState.CONNECTED.toString()) {
      this.setState(ConnectionState.CONNECTED);
    }
  }

  /**
   * Saves the current connection state to storage.
   * The state is saved under the key defined by STORAGE_KEY.
   */
  private saveState(): void {
    setSessionStorageItem(ConnectionStateManager.STORAGE_KEY, this.state.toString());
  }
}
