import { JSONRPCProvider, Wallet as TM2Wallet } from '@gnolang/tm2-js-client';

import { GnoWalletProvider } from '../../../providers';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';
import { NetworkInfo, WalletResponseFailureType, WalletResponseSuccessType } from '../../types';

// `JSONRPCProvider.create` performs a version-detection round trip, so it
// rejects for an unreachable node.
jest.mock('@gnolang/tm2-js-client', () => ({
  ...jest.requireActual('@gnolang/tm2-js-client'),
  JSONRPCProvider: { create: jest.fn() },
}));

const createMock = JSONRPCProvider.create as unknown as jest.Mock;

const networkA: NetworkInfo = {
  chainId: 'chain-a',
  networkName: 'Chain A',
  rpcUrl: 'https://a.example',
  addressPrefix: GNO_ADDRESS_PREFIX,
  indexerUrl: null,
};

const networkB: NetworkInfo = {
  chainId: 'chain-b',
  networkName: 'Chain B',
  rpcUrl: 'https://b.example',
  addressPrefix: GNO_ADDRESS_PREFIX,
  indexerUrl: null,
};

const networkC: NetworkInfo = {
  chainId: 'chain-c',
  networkName: 'Chain C',
  rpcUrl: 'https://c.example',
  addressPrefix: GNO_ADDRESS_PREFIX,
  indexerUrl: null,
};

/** A stand-in provider that remembers which endpoint produced it. */
const providerFor = (rpcUrl: string): unknown => ({ rpcUrl });

describe('GnoWalletProvider.switchNetwork atomicity', () => {
  let provider: GnoWalletProvider;
  let wallet: TM2Wallet;
  let connected: { rpcUrl: string } | null;

  const reportedChainId = async (): Promise<string | undefined> => {
    const response = await provider.getNetwork();
    return response.data?.chainId;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    // `switchNetwork` logs the rejection it swallows.
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    connected = null;

    wallet = {
      connect: jest.fn((p: { rpcUrl: string }) => {
        connected = p;
      }),
    } as unknown as TM2Wallet;

    createMock.mockImplementation(async (rpcUrl: string) => providerFor(rpcUrl));

    provider = new GnoWalletProvider(wallet, [networkA, networkB, networkC]);
    await provider.switchNetwork({ chainId: networkA.chainId });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts on the network it was switched to', async () => {
    expect(await reportedChainId()).toBe(networkA.chainId);
    expect(connected).toEqual({ rpcUrl: networkA.rpcUrl });
  });

  it('keeps the reported chain and the active provider in sync when the RPC connection is refused', async () => {
    createMock.mockRejectedValueOnce(new Error('connect ECONNREFUSED 127.0.0.1:26657'));

    const response = await provider.switchNetwork({ chainId: networkB.chainId });

    expect(response.type).toBe(WalletResponseFailureType.NETWORK_TIMEOUT);
    // Both still describe chain A — the failed switch committed nothing.
    expect(await reportedChainId()).toBe(networkA.chainId);
    expect(connected).toEqual({ rpcUrl: networkA.rpcUrl });
  });

  it('does not notify listeners when the switch fails', async () => {
    const callback = jest.fn();
    provider.onChangeNetwork({ callback });

    createMock.mockRejectedValueOnce(new Error('connect ECONNREFUSED 127.0.0.1:26657'));
    await provider.switchNetwork({ chainId: networkB.chainId });

    expect(callback).not.toHaveBeenCalled();
  });

  it('recovers once the endpoint becomes reachable again', async () => {
    createMock.mockRejectedValueOnce(new Error('connect ECONNREFUSED 127.0.0.1:26657'));
    await provider.switchNetwork({ chainId: networkB.chainId });

    const response = await provider.switchNetwork({ chainId: networkB.chainId });

    expect(response.type).toBe(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS);
    expect(await reportedChainId()).toBe(networkB.chainId);
    expect(connected).toEqual({ rpcUrl: networkB.rpcUrl });
  });

  it('lets the most recent switch win when two overlap', async () => {
    const resolvers: Record<string, (value: unknown) => void> = {};
    createMock.mockImplementation(
      (rpcUrl: string) =>
        new Promise((resolve) => {
          resolvers[rpcUrl] = resolve;
        })
    );

    const slow = provider.switchNetwork({ chainId: networkB.chainId });
    const fast = provider.switchNetwork({ chainId: networkC.chainId });

    // C started second but settles first, then the stale B connection lands.
    resolvers[networkC.rpcUrl](providerFor(networkC.rpcUrl));
    await fast;
    resolvers[networkB.rpcUrl](providerFor(networkB.rpcUrl));
    await slow;

    expect(await reportedChainId()).toBe(networkC.chainId);
  });
});
