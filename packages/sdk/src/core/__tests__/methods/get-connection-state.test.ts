import { mockConnectionManager } from '../../__mocks__/mock-connection-manager';
import { ConnectionManager, ConnectionState } from '../../connection'; // Adjust this import according to your actual file structure
import { getConnectionState } from '../../methods';

describe('getConnectionState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getConnectionState and return the state', () => {
    const mockState: ConnectionState = ConnectionState.CONNECTED; // Replace with actual state values if needed

    mockConnectionManager.getConnectionState.mockReturnValue(mockState);

    const state = getConnectionState(mockConnectionManager as unknown as ConnectionManager);

    expect(mockConnectionManager.getConnectionState).toHaveBeenCalled();
    expect(state).toBe(mockState);
  });
});
