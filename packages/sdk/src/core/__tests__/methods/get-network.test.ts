import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { getNetwork } from '../../methods';
import { WalletResponseSuccessType } from '../../types';
import { GetNetworkResponse } from '../../types/methods';
import { makeResponseMessage } from '../../utils';

describe('getNetwork', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getNetwork and return the response', async () => {
    const mockResponse: GetNetworkResponse = makeResponseMessage(WalletResponseSuccessType.GET_NETWORK_SUCCESS, {
      chainId: 'chainId',
      networkName: 'networkName',
      addressPrefix: 'g',
      rpcUrl: 'rpcUrl',
      indexerUrl: null,
    });

    mockWalletProvider.getNetwork.mockResolvedValue(mockResponse);

    const response = await getNetwork(mockWalletProvider);

    expect(mockWalletProvider.getNetwork).toHaveBeenCalled();
    expect(response).toEqual(mockResponse);
  });

  it('should handle errors when getNetwork fails', async () => {
    const mockError = new Error('Failed to get network');
    mockWalletProvider.getNetwork.mockRejectedValue(mockError);

    await expect(getNetwork(mockWalletProvider)).rejects.toThrow('Failed to get network');
  });
});
