import { isSuccessType } from '../../providers/adena-wallet/mapper.utils';
import { WalletProvider } from '../providers';
import { ConnectionStateManager, ConnectionState } from './connection-state';

export class ConnectionManager {
  private stateManager: ConnectionStateManager;

  constructor(private provider: WalletProvider) {
    this.stateManager = new ConnectionStateManager();
  }

  async connect(): Promise<void> {
    this.stateManager.setState(ConnectionState.CONNECTING);
    try {
      const connected = await this.provider.isConnected();
      if (!connected) {
        const response = await this.provider.addEstablish({});
        if (!isSuccessType(response.status)) {
          throw new Error(response.message);
        }
      }

      this.stateManager.setState(ConnectionState.CONNECTED);
    } catch (error) {
      this.stateManager.setState(ConnectionState.ERROR);
      throw error;
    }
  }

  disconnect(): void {
    this.stateManager.setState(ConnectionState.DISCONNECTED);
  }

  getConnectionState(): ConnectionState {
    return this.stateManager.getState();
  }
}
