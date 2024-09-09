import { ConnectionManager } from '../connection';
import { DisconnectResponse } from '../types/methods';

export const disconnect = (connectionManager: ConnectionManager): DisconnectResponse => {
  connectionManager.disconnectWallet();
};
