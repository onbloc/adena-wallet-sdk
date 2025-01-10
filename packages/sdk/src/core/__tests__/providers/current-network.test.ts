import { GnoWalletProvider } from "../../../providers";
import { GNO_ADDRESS_PREFIX } from "../../constants/chains.constant";
import { NetworkInfo } from "../../types";

describe('GnoWalletProvider.currentNetwork', () => {
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
    provider = new GnoWalletProvider(undefined, []);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when networks array is empty', () => {
    const currentNetwork = (provider as unknown as { currentNetwork: NetworkInfo | null }).currentNetwork;
    expect(currentNetwork).toBeNull();
  });

  it('should return first network when currentChainId is null', () => {
    (provider as unknown as { networks: NetworkInfo[] }).networks = mockNetworks;
    (provider as unknown as { currentChainId: string | null }).currentChainId = null;

    const currentNetwork = (provider as unknown as { currentNetwork: NetworkInfo | null }).currentNetwork;
    expect(currentNetwork).toEqual(mockNetworks[0]);
  });

  it('should return matching network when currentChainId is set', () => {
    (provider as unknown as { networks: NetworkInfo[] }).networks = mockNetworks;
    (provider as unknown as { currentChainId: string | null }).currentChainId = 'test-chain-2';

    const currentNetwork = (provider as unknown as { currentNetwork: NetworkInfo | null }).currentNetwork;
    expect(currentNetwork).toEqual(mockNetworks[1]);
  });

  it('should return null when currentChainId does not match any network', () => {
    (provider as unknown as { networks: NetworkInfo[] }).networks = mockNetworks;
    (provider as unknown as { currentChainId: string | null }).currentChainId = 'non-existent-chain';

    const currentNetwork = (provider as unknown as { currentNetwork: NetworkInfo | null }).currentNetwork;
    expect(currentNetwork).toBeNull();
  });
})