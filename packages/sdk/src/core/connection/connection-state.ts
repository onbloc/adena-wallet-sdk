export enum ConnectionState {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  ERROR,
}

export class ConnectionStateManager {
  private state: ConnectionState = ConnectionState.DISCONNECTED;

  getState(): ConnectionState {
    return this.state;
  }

  setState(state: ConnectionState): void {
    this.state = state;
  }
}
