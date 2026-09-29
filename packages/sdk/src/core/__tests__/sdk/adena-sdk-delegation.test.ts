import { defineGlobalMock } from '../../__mocks__/mock-global';
import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { AdenaSDK } from '../../sdk';
import { WalletResponseSuccessType } from '../../types';
import { makeResponseMessage } from '../../utils';

/**
 * `AdenaSDK` is the only entry point most consumers use, so every method on
 * `WalletProvider` has to be reachable through it. `getNetwork` was missing.
 */
describe('AdenaSDK provider delegation', () => {
  let sdk: AdenaSDK;

  beforeEach(async () => {
    // The connection state is persisted to sessionStorage, which the node test
    // environment does not provide.
    defineGlobalMock();
    jest.clearAllMocks();
    sdk = new AdenaSDK(mockWalletProvider);
    // The provider is only reachable once the connection is established.
    await sdk.connectWallet();
  });

  it('exposes every WalletProvider method', () => {
    const providerMethods = Object.keys(mockWalletProvider) as (keyof typeof mockWalletProvider)[];

    for (const method of providerMethods) {
      expect(typeof (sdk as unknown as Record<string, unknown>)[method]).toBe('function');
    }
  });

  it('delegates getNetwork to the wallet provider', async () => {
    const mockResponse = makeResponseMessage(WalletResponseSuccessType.GET_NETWORK_SUCCESS, {
      chainId: 'test-chain-1',
      networkName: 'Test Network 1',
      addressPrefix: 'g',
      rpcUrl: 'http://test1.com',
      indexerUrl: null,
    });
    mockWalletProvider.getNetwork.mockResolvedValue(mockResponse);

    const response = await sdk.getNetwork();

    expect(mockWalletProvider.getNetwork).toHaveBeenCalled();
    expect(response).toEqual(mockResponse);
  });
});
