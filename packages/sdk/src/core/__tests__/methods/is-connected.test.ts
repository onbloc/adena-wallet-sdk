import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { isConnected } from '../../methods';
import { WalletResponseSuccessType } from '../../types';
import { IsConnectedResponse } from '../../types/methods';
import { makeResponseMessage } from '../../utils';

describe('isConnected', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call isConnected and return the response', async () => {
    const mockResponse: IsConnectedResponse = makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS);

    mockWalletProvider.isConnected.mockResolvedValue(mockResponse);

    const response = await isConnected(mockWalletProvider);

    expect(mockWalletProvider.isConnected).toHaveBeenCalled();
    expect(response).toEqual(mockResponse);
  });

  it('should handle errors when isConnected fails', async () => {
    const mockError = new Error('Failed to check connection');
    mockWalletProvider.isConnected.mockRejectedValue(mockError);

    await expect(isConnected(mockWalletProvider)).rejects.toThrow('Failed to check connection');
  });
});
