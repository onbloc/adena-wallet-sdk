import { GnoWalletProvider } from '../../../providers';
import { NetworkInfo } from '../../types';
import { JSONRPCProvider, Wallet as TM2Wallet } from '@gnolang/tm2-js-client';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';

// Mock JSONRPCProvider to test without a real network connection
jest.mock('@gnolang/tm2-js-client', () => ({
  ...jest.requireActual('@gnolang/tm2-js-client'),
  JSONRPCProvider: jest.fn(),
}));

describe('GnoWalletProvider.connectProvider', () => {
  let provider: GnoWalletProvider;
  let mockWallet: TM2Wallet;

  const TEST_RPC_URL = 'https://testnet.gno.land';

  const mockNetwork: NetworkInfo = {
    chainId: 'test-chain-1',
    networkName: 'Test Network 1',
    rpcUrl: TEST_RPC_URL,
    addressPrefix: GNO_ADDRESS_PREFIX,
    indexerUrl: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockWallet = {
      connect: jest.fn(),
    } as unknown as TM2Wallet;

    provider = new GnoWalletProvider(mockWallet, [mockNetwork]);
    provider['currentChainId'] = mockNetwork.chainId;
  });

  // Test the normal Provider connection case
  it('should connect provider with correct rpcUrl', async () => {
    const result = provider['connectProvider']();

    expect(JSONRPCProvider).toHaveBeenCalledWith(TEST_RPC_URL);
    expect(mockWallet.connect).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  // Test the exception case where the wallet is not set up
  it('should return false when wallet is not set', () => {
    provider['wallet'] = null;
    const result = provider['connectProvider']();
    expect(result).toBe(false);
  });
});
