import { GnoWalletProvider } from '../../../providers';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';
import { NetworkInfo, WalletResponseFailureType, WalletResponseSuccessType } from '../../types';
import { makeResponseMessage } from '../../utils';

describe('GnoWalletProvider.getNetwork', () => {
  let provider: GnoWalletProvider;
  const mockNetworks: NetworkInfo[] = [
    {
      chainId: 'test-chain-1',
      networkName: 'Test Network 1',
      rpcUrl: 'http://test1.com',
      addressPrefix: GNO_ADDRESS_PREFIX,
      indexerUrl: null,
    },
    {
      chainId: 'test-chain-2',
      networkName: 'Test Network 2',
      rpcUrl: 'http://test2.com',
      addressPrefix: GNO_ADDRESS_PREFIX,
      indexerUrl: null,
    },
  ];

  beforeEach(() => {
    provider = new GnoWalletProvider(undefined, mockNetworks);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for no wallet connection
  it('should return NOT_CONNECTED when wallet is not connected', async () => {
    const response = await provider.getNetwork();

    expect(response).toEqual(makeResponseMessage(WalletResponseFailureType.NOT_CONNECTED));
  });

  // Test with wallet connected but network not initialized
  it('should return NOT_INITIALIZED_NETWORK when network is not initialized', async () => {
    (provider as unknown as { wallet: object }).wallet = {};
    (provider as unknown as {networks: NetworkInfo[]}).networks = [];

    const response = await provider.getNetwork();

    expect(response).toEqual(makeResponseMessage(WalletResponseFailureType.NOT_INITIALIZED_NETWORK));
  });

  // Steady state test with both wallet connection and network initialization complete
  it('should return current network information when wallet is connected and network is initialized', async () => {
    (provider as unknown as { wallet: object }).wallet = {};
    (provider as unknown as { currentChainId: string | null }).currentChainId = null;

    const response = await provider.getNetwork();

    expect(response).toEqual(makeResponseMessage(WalletResponseSuccessType.GET_NETWORK_SUCCESS, mockNetworks[0]));
  });
});
