import { ConnectOptions, ConnectResponse, DisconnectResponse, GetStateResponse } from './methods';

export interface WalletStore {
  connect: (options: ConnectOptions) => Promise<ConnectResponse>;

  disconnect: () => Promise<DisconnectResponse>;

  getState: () => Promise<GetStateResponse>;
}
