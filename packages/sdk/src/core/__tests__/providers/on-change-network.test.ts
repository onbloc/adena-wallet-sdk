import { GnoWalletProvider } from '../../../providers';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';
import { NetworkInfo } from '../../types';
import { OnChangeNetworkOptions } from '../../types/methods';

describe('GnoWalletProvider.onChange', () => {
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

  // Verify that the callbacks registered with onChangeNetwork are stored correctly inside the provider
  it('should register network callback successfully', () => {
    const mockCallback = jest.fn();
    const options: OnChangeNetworkOptions = {
      callback: mockCallback,
    };

    provider.onChangeNetwork(options);

    const providerWithCallback = provider as unknown as { networkCallback: ((chainId: string) => void) | null };
    expect(providerWithCallback.networkCallback).toBe(mockCallback);
  });

  // Ensure that only registered callbacks are executed and no other callbacks are executed
  it('should fail when checking registered callback', () => {
    const mockCallback = jest.fn();
    const differentCallback = jest.fn();

    provider.onChangeNetwork({ callback: mockCallback });

    const providerWithCallback = provider as unknown as { networkCallback: ((chainId: string) => void) | null };
    providerWithCallback.networkCallback?.('test-chain');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(differentCallback).not.toHaveBeenCalled();
  });

  // Ensure callbacks are fired with the correct chainId on network changes
  it('should execute registered callback when network changes', () => {
    const mockCallback = jest.fn();
    const testChainId = 'test-chain-1';

    provider.onChangeNetwork({ callback: mockCallback });

    const providerWithCallback = provider as unknown as { networkCallback: ((chainId: string) => void) | null };
    const registeredCallback = providerWithCallback.networkCallback;

    registeredCallback?.(testChainId);

    expect(mockCallback).toHaveBeenCalledWith(testChainId);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  // To ensure that the callback system works in real-world network change situations.
  it('should notify when network actually changes', () => {
    const mockCallback = jest.fn();
    provider.onChangeNetwork({ callback: mockCallback });

    const newNetwork = mockNetworks[1];
    (provider as unknown as { setNetwork(network: NetworkInfo): void }).setNetwork(newNetwork);

    expect(mockCallback).toHaveBeenCalledWith(newNetwork.chainId);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
