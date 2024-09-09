import { mockConnectionManager } from '../../__mocks__/mock-connection-manager';
import { ConnectionManager } from '../../connection';
import { onConnectionChange } from '../../methods';
import { OnConnectionChangeOptions } from '../../types/methods'; // Adjust imports based on your actual file structure

describe('onConnectionChange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on with the correct options', () => {
    const mockCallback = jest.fn();
    const options: OnConnectionChangeOptions = { callback: mockCallback };

    mockConnectionManager.on.mockImplementation(() => {});

    onConnectionChange(mockConnectionManager as unknown as ConnectionManager, options);

    expect(mockConnectionManager.on).toHaveBeenCalledWith(mockCallback);
  });
});
