import { clearGlobalMock, defineGlobalMock } from '../../__mocks__/mock-global';
import { ConnectionState, ConnectionStateManager } from '../../connection';
import { getSessionStorageItem, setSessionStorageItem } from '../../utils/storage.utils';

jest.mock('../../utils/storage.utils', () => ({
  getSessionStorageItem: jest.fn(),
  setSessionStorageItem: jest.fn(),
}));

describe('ConnectionStateManager', () => {
  let manager: ConnectionStateManager;

  beforeEach(() => {
    defineGlobalMock();
    manager = new ConnectionStateManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
    clearGlobalMock();
  });

  it('should initialize with DISCONNECTED state', () => {
    expect(manager.getState()).toBe(ConnectionState.DISCONNECTED);
  });

  it('should save state to session storage when setState is called', () => {
    manager.setState(ConnectionState.CONNECTED);

    expect(setSessionStorageItem).toHaveBeenCalledWith(
      'adena-sdk-connection-state',
      ConnectionState.CONNECTED.toString()
    );
    expect(manager.getState()).toBe(ConnectionState.CONNECTED);
  });

  it('should load state from session storage when loadState is called', () => {
    (getSessionStorageItem as jest.Mock).mockReturnValue(ConnectionState.CONNECTED.toString());

    manager.loadState();

    expect(getSessionStorageItem).toHaveBeenCalledWith('adena-sdk-connection-state');
    expect(manager.getState()).toBe(ConnectionState.CONNECTED);
  });

  it('should not change state if the loaded state is not CONNECTED', () => {
    (getSessionStorageItem as jest.Mock).mockReturnValue(ConnectionState.DISCONNECTED.toString());

    manager.loadState();

    expect(getSessionStorageItem).toHaveBeenCalledWith('adena-sdk-connection-state');
    expect(manager.getState()).toBe(ConnectionState.DISCONNECTED);
  });
});
