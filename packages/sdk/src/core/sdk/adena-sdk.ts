import { ConnectionManager } from '../connection';
import { WalletProvider } from '../providers';

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
}
