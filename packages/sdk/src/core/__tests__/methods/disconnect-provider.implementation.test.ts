import { GnoWalletProvider } from '../../../providers';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';
import { NetworkInfo } from '../../types';
import { GnoWallet } from '@gnolang/gno-js-client';

describe('GnoWalletProvider.disconnectProvider', () => {
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
    provider['networkCallback'] = jest.fn();
    provider['wallet'] = new GnoWallet();
  });

  // Verify that all properties of the provider are initialized correctly
  it('should reset all provider properties', () => {
    provider['disconnectProvider']();

    expect(provider['networkCallback']).toBeNull();
    expect(provider['networks']).toEqual([]);
    expect(provider['currentNetwork']).toBeNull();
    expect(provider['wallet']).toBeNull();
  });

  it('should return true after disconnection', () => {
    const result = provider['disconnectProvider']();
    expect(result).toBe(true);
  });
});
