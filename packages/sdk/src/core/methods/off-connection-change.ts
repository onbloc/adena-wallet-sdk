import { ConnectionManager } from '../connection';
import { OffConnectionChangeOptions, OffConnectionChangeResponse } from '../types/methods/off-connection-change';

export const offConnectionChange = (
  connectionManager: ConnectionManager,
  options: OffConnectionChangeOptions
): OffConnectionChangeResponse => {
  return connectionManager.off(options.callback);
};
