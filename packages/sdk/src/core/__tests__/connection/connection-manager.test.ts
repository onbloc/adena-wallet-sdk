import { clearGlobalMock, defineGlobalMock } from '../../__mocks__/mock-global';
import {
  addEstablishFailureMock,
  addEstablishSuccessMock,
  isConnectedFailureMock,
  isConnectedSuccessMock,
  mockWalletProvider,
} from '../../__mocks__/mock-wallet-provider';
import { ConnectionManager, ConnectionState } from '../../connection';
import { SDKConnectionConfigure } from '../../types/config.types';

describe('ConnectionManager', () => {
  let connectionManager: ConnectionManager;
  let config: SDKConnectionConfigure;

  beforeEach(() => {
    defineGlobalMock();
    config = { isSession: true };

    // Initialize ConnectionManager with a real instance of ConnectionStateManager
    connectionManager = new ConnectionManager(mockWalletProvider, config);
  });

  afterEach(() => {
    jest.clearAllMocks();
    clearGlobalMock();
  });

  test('should initialize and load state if isSession is true', () => {
    // Initially, loadState should set the state to CONNECTED if it was not saved
    connectionManager = new ConnectionManager(mockWalletProvider, config);
    expect(connectionManager.getConnectionState()).toBe(ConnectionState.CONNECTED);
  });

  test('should set state to CONNECTING when connecting wallet', async () => {
    mockWalletProvider.isConnected.mockResolvedValue(isConnectedSuccessMock);
    mockWalletProvider.addEstablish.mockResolvedValue(addEstablishSuccessMock);

    await connectionManager.connectWallet();

    expect(connectionManager.getConnectionState()).toBe(ConnectionState.CONNECTED);
  });

  test('should connect wallet if already connected', async () => {
    mockWalletProvider.isConnected.mockResolvedValue(isConnectedSuccessMock);

    await connectionManager.connectWallet();

    expect(connectionManager.getConnectionState()).toBe(ConnectionState.CONNECTED);
  });

  test('should set state to DISCONNECTED if connection fails', async () => {
    connectionManager = new ConnectionManager(mockWalletProvider, { isSession: false });
    mockWalletProvider.isConnected.mockResolvedValue(isConnectedFailureMock);
    mockWalletProvider.addEstablish.mockResolvedValue(addEstablishFailureMock);

    await connectionManager.connectWallet();

    expect(connectionManager.getConnectionState()).toBe(ConnectionState.DISCONNECTED);
  });

  test('should set state to ERROR if an exception is thrown', async () => {
    mockWalletProvider.isConnected.mockRejectedValueOnce(new Error('connection error'));

    await expect(connectionManager.connectWallet()).rejects.toThrow('connection error');
    expect(connectionManager.getConnectionState()).toBe(ConnectionState.ERROR);
  });

  test('should trigger connection event when connected', () => {
    const listener = jest.fn();
    connectionManager.on(listener);

    connectionManager['connect']();

    expect(connectionManager.getConnectionState()).toBe(ConnectionState.CONNECTED);
    expect(listener).toHaveBeenCalledWith('connect');
  });
});
