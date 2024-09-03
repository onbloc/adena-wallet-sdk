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
      if (connected) {
        this.stateManager.setState(ConnectionState.CONNECTED);
        return;
      }

      const addEstablishResponse = await this.provider.addEstablish({});
      if (!isSuccessType(addEstablishResponse.status)) {
        this.stateManager.setState(ConnectionState.ERROR);
        throw new Error(addEstablishResponse.message);
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

  getWalletProvider(): WalletProvider {
    if (this.stateManager.getState() !== ConnectionState.CONNECTED) {
      throw new Error('not connect wallet');
    }
    return this.provider;
  }
}
