import { mockConnectionManager } from '../../__mocks__/mock-connection-manager';
import { defineGlobalMock } from '../../__mocks__/mock-global';
import { ConnectionManager } from '../../connection';
import { disconnect } from '../../methods';

describe('disconnect', () => {
  afterEach(() => {
    defineGlobalMock();
    jest.clearAllMocks();
  });

  it('should call disconnectWallet on ConnectionManager', () => {
    disconnect(mockConnectionManager as unknown as ConnectionManager);

    expect(mockConnectionManager.disconnectWallet).toHaveBeenCalled();
  });
});
