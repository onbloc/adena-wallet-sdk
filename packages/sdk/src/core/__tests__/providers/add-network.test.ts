import { GnoWalletProvider } from '../../../providers';
import { WalletResponseFailureType, WalletResponseSuccessType } from '../../types';
import { AddNetworkOptions } from '../../types/methods';
import { makeResponseMessage } from '../../utils';

describe('GnoWalletProvider.addNetwork', () => {
  let provider: GnoWalletProvider;

  beforeEach(() => {
    provider = new GnoWalletProvider();
  });

  // Normal network addition case
  it('should return ADD_NETWORK_SUCCESS response when adding network', async () => {
    const options: AddNetworkOptions = {
      chainId: 'test-chain',
      chainName: 'Test Chain',
      rpcUrl: 'https://test.network.com',
    };

    const addResponse = await provider.addNetwork(options);
    expect(addResponse).toEqual(makeResponseMessage(WalletResponseSuccessType.ADD_NETWORK_SUCCESS));
  });

  // Validate if a required field is missing
  it('should return INVALID_FORMAT when required fields are missing', async () => {
    const testCases = [
      { chainName: 'Test Chain', rpcUrl: 'https://test.com' },
      { chainId: 'test-chain', rpcUrl: 'https://test.com' },
      { chainId: 'test-chain', chainName: 'Test Chain' },
    ];

    for (const testCase of testCases) {
      const response = await provider.addNetwork(testCase as unknown as AddNetworkOptions);
      expect(response).toEqual(makeResponseMessage(WalletResponseFailureType.INVALID_FORMAT));
    }
  });

  // Validating whitespace characters in RPC URL
  it('should return INVALID_FORMAT when rpcUrl contains whitespace', async () => {
    const options = {
      chainId: 'test-chain',
      chainName: 'Test Chain',
      rpcUrl: 'https://test network.com', // Blank space in the rpcUrl
    };
    const response = await provider.addNetwork(options);

    expect(response).toEqual(makeResponseMessage(WalletResponseFailureType.INVALID_FORMAT));
  });

  // Attempting to add a duplicate network case
  it('should return duplicate error when adding network with same network', async () => {
    const testNetworkOptions: AddNetworkOptions[] = [
      {
        chainId: 'test-chain',
        chainName: 'Test Chain',
        rpcUrl: 'https://test.network.com/', // With trailing slash
      },
      {
        chainId: 'test-chain2',
        chainName: 'Test Chain 2',
        rpcUrl: 'https://test.network.com', // Without trailing slash
      },
    ];

    const response = await provider.addNetwork(testNetworkOptions[0]);
    expect(response).toEqual(makeResponseMessage(WalletResponseSuccessType.ADD_NETWORK_SUCCESS));

    const duplicateResponse = await provider.addNetwork(testNetworkOptions[1]);
    expect(duplicateResponse).toEqual(makeResponseMessage(WalletResponseFailureType.NETWORK_ALREADY_EXISTS));
  });
});
