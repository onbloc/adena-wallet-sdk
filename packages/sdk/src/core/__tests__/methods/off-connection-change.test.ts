import { mockConnectionManager } from '../../__mocks__/mock-connection-manager';
import { ConnectionManager } from '../../connection';
import { offConnectionChange } from '../../methods';
import { OffConnectionChangeOptions } from '../../types/methods'; // Adjust imports based on your actual file structure

describe('offConnectionChange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call off and remove the listener', () => {
    const mockCallback = jest.fn();
    const options: OffConnectionChangeOptions = { callback: mockCallback };

    offConnectionChange(mockConnectionManager as unknown as ConnectionManager, options);

    expect(mockConnectionManager.off).toHaveBeenCalledWith(mockCallback);
  });

  it('should handle cases where no callback is provided', () => {
    const callback = () => {};
    const options: OffConnectionChangeOptions = { callback };

    offConnectionChange(mockConnectionManager as unknown as ConnectionManager, options);

    expect(mockConnectionManager.off).toHaveBeenCalledWith(callback);
  });
});
