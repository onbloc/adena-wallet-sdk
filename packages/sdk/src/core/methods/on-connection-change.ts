import { ConnectionManager } from '../connection';
import { OnConnectionChangeOptions, OnConnectionChangeResponse } from '../types/methods/on-connection-change';

export const onConnectionChange = (
  connectionManager: ConnectionManager,
  options: OnConnectionChangeOptions
): OnConnectionChangeResponse => {
  return connectionManager.on(options.callback);
};
