import { GnoWalletProvider } from '../../../providers';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';
import { NetworkInfo } from '../../types';

describe('GnoWalletProvider.setNetwork', () => {
  let provider: GnoWalletProvider;
  const mockNetwork: NetworkInfo = {
    chainId: 'test-chain-1',
    networkName: 'Test Network 1',
    rpcUrl: 'http://test1.com',
    addressPrefix: GNO_ADDRESS_PREFIX,
    indexerUrl: null,
  };

  beforeEach(() => {
    provider = new GnoWalletProvider(undefined, [mockNetwork]);
    provider['triggerNetworkCallback'] = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Validate the currentNetwork setting
  it('should set currentNetwork', () => {
    provider['setNetwork'](mockNetwork);
    expect(provider['currentNetwork']).toBe(mockNetwork);
  });

  // Validate network callback calls
  it('should trigger network callback with chainId', () => {
    provider['setNetwork'](mockNetwork);
    expect(provider['triggerNetworkCallback']).toHaveBeenCalledWith(mockNetwork.chainId);
  });
});
