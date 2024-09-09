import { ConnectionState } from '../connection';
import { WalletProvider } from '../providers';
import { WalletConnectionEvent } from '../types';

export const defineMockConnectionManager = () => {
  jest.mock('../connection', () => ({
    ConnectionManager: jest.fn(() => mockConnectionManager),
  }));
};

export const mockConnectionManager = {
  connectWallet: jest.fn<Promise<void>, []>(),
  disconnectWallet: jest.fn<void, []>(),
  getConnectionState: jest.fn<ConnectionState, []>(),
  getWalletProvider: jest.fn<WalletProvider, []>(),
  on: jest.fn<void, [(event: WalletConnectionEvent) => void]>(),
  off: jest.fn<void, [(event: WalletConnectionEvent) => void]>(),
  connectAdenaWallet: jest.fn<Promise<void>, []>(),
  connectTM2Wallet: jest.fn<Promise<void>, []>(),
  triggerConnectionEvent: jest.fn<void, [WalletConnectionEvent]>(),
};
