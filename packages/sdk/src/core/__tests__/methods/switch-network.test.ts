import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { switchNetwork } from '../../methods';
import { WalletResponseFailureType, WalletResponseSuccessType } from '../../types';
import { SwitchNetworkOptions, SwitchNetworkResponse } from '../../types/methods';
import { makeResponseMessage } from '../../utils';

describe('switchNetwork', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call switchNetwork with the correct options and return the response', async () => {
    const options: SwitchNetworkOptions = {
      chainId: 'test-chain-id',
    };

    const mockResponse: SwitchNetworkResponse = makeResponseMessage(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS);

    mockWalletProvider.switchNetwork.mockResolvedValue(mockResponse);

    const response = await switchNetwork(mockWalletProvider, options);

    expect(mockWalletProvider.switchNetwork).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });

  it('should handle failure response', async () => {
    const options: SwitchNetworkOptions = {
      chainId: 'test-chain-id',
    };

    const mockResponse: SwitchNetworkResponse = makeResponseMessage(WalletResponseFailureType.REDUNDANT_CHANGE_REQUEST);

    mockWalletProvider.switchNetwork.mockResolvedValue(mockResponse);

    const response = await switchNetwork(mockWalletProvider, options);

    expect(mockWalletProvider.switchNetwork).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });
});
