import { addNetworkFailureMock, addNetworkSuccessMock, mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { addNetwork } from '../../methods';
import { AddNetworkOptions, AddNetworkResponse } from '../../types/methods';

describe('addNetwork', () => {
  const options: AddNetworkOptions = {
    chainId: 'test-chain-id',
    chainName: 'Test Chain',
    rpcUrl: 'https://test-rpc-url.com',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call addNetwork with correct options and return the response', async () => {
    const mockResponse: AddNetworkResponse = addNetworkSuccessMock;

    mockWalletProvider.addNetwork.mockResolvedValue(mockResponse);

    const response = await addNetwork(mockWalletProvider, options);

    expect(mockWalletProvider.addNetwork).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });

  it('should handle failure response', async () => {
    const mockResponse: AddNetworkResponse = addNetworkFailureMock;

    mockWalletProvider.addNetwork.mockResolvedValue(mockResponse);

    const response = await addNetwork(mockWalletProvider, options);

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if addNetwork fails', async () => {
    const mockError = new Error('Failed to add network');
    mockWalletProvider.addNetwork.mockRejectedValue(mockError);

    await expect(addNetwork(mockWalletProvider, options)).rejects.toThrow('Failed to add network');
  });
});
