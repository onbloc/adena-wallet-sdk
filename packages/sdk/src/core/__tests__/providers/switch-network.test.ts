import { GnoWalletProvider } from '../../../providers';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';
import { NetworkInfo, WalletResponseFailureType, WalletResponseSuccessType } from '../../types';
import { SwitchNetworkOptions } from '../../types/methods';
import { makeResponseMessage } from '../../utils';

describe('GnoWalletProvider.switchNetwork', () => {
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
    jest.spyOn(provider as unknown as { connectProvider(): boolean }, 'connectProvider').mockReturnValue(true);
    jest.spyOn(provider as unknown as { setNetwork(network: NetworkInfo): void }, 'setNetwork');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Validate if chainId is empty
  it('should return INVALID_FORMAT when chainId is empty', async () => {
    const options: SwitchNetworkOptions = {
      chainId: '',
    };

    const response = await provider.switchNetwork(options);

    expect(response).toEqual(makeResponseMessage(WalletResponseFailureType.INVALID_FORMAT));
    expect(provider['setNetwork']).not.toHaveBeenCalled();
  });

  // Validate when attempting to switch to a non-existent network
  it('should return UNADDED_NETWORK when network is not found', async () => {
    const options: SwitchNetworkOptions = {
      chainId: 'non-existent-chain',
    };

    const response = await provider.switchNetwork(options);

    expect(response).toEqual(makeResponseMessage(WalletResponseFailureType.UNADDED_NETWORK));
    expect(provider['setNetwork']).not.toHaveBeenCalled();
  });

  // Validate a normal network transition
  it('should successfully switch network', async () => {
    const options: SwitchNetworkOptions = {
      chainId: 'test-chain-1',
    };

    const response = await provider.switchNetwork(options);

    expect(response).toEqual(makeResponseMessage(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS));
    expect(provider['setNetwork']).toHaveBeenCalledWith(mockNetworks[0]);
  });

  // Validate network change callback calls
  it('should call network change callback when switching networks', async () => {
    const mockCallback = jest.fn();
    provider.onChangeNetwork({ callback: mockCallback });

    const options: SwitchNetworkOptions = {
      chainId: 'test-chain-1',
    };

    await provider.switchNetwork(options);

    expect(mockCallback).toHaveBeenCalledWith('test-chain-1');
  });

  // Validate the ability to switch between different networks
  it('should be able to switch between different networks', async () => {
    // First switch to network 1
    await provider.switchNetwork({ chainId: 'test-chain-1' });
    expect(provider['setNetwork']).toHaveBeenCalledWith(mockNetworks[0]);

    // Then switch to network 2
    await provider.switchNetwork({ chainId: 'test-chain-2' });
    expect(provider['setNetwork']).toHaveBeenCalledWith(mockNetworks[1]);
  });
});
