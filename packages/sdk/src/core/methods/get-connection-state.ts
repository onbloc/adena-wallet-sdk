import { ConnectionManager } from '../connection';
import { GetConnectionState } from '../types/methods/get-connection-state.types';

export const getConnectionState = (connectionManager: ConnectionManager): GetConnectionState => {
  return connectionManager.getConnectionState();
};
