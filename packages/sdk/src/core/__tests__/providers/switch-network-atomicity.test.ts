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

  describe('overlapping switches', () => {
    /** Hands back a resolver per endpoint so the factory can be settled out of order. */
    const deferProviders = (): Record<string, (value: unknown) => void> => {
      const resolvers: Record<string, (value: unknown) => void> = {};
      createMock.mockImplementation(
        (rpcUrl: string) =>
          new Promise((resolve) => {
            resolvers[rpcUrl] = resolve;
          })
      );
      return resolvers;
    };

    it('keeps reported and active in sync when the superseded switch resolves last', async () => {
      const resolvers = deferProviders();

      const slow = provider.switchNetwork({ chainId: networkB.chainId });
      const fast = provider.switchNetwork({ chainId: networkC.chainId });

      // C started second but settles first, then the stale B connection lands.
      resolvers[networkC.rpcUrl](providerFor(networkC.rpcUrl));
      await fast;
      resolvers[networkB.rpcUrl](providerFor(networkB.rpcUrl));
      await slow;

      expect(await reportedChainId()).toBe(networkC.chainId);
      // B must never become the active provider after C has committed.
      expect(connected).toEqual({ rpcUrl: networkC.rpcUrl });
    });

    it('keeps reported and active in sync when the superseded switch resolves first', async () => {
      const resolvers = deferProviders();

      const slow = provider.switchNetwork({ chainId: networkB.chainId });
      const fast = provider.switchNetwork({ chainId: networkC.chainId });

      resolvers[networkB.rpcUrl](providerFor(networkB.rpcUrl));
      await slow;
      // B lost ownership before it resolved, so the wallet is still on A.
      expect(await reportedChainId()).toBe(networkA.chainId);
      expect(connected).toEqual({ rpcUrl: networkA.rpcUrl });

      resolvers[networkC.rpcUrl](providerFor(networkC.rpcUrl));
      await fast;

      expect(await reportedChainId()).toBe(networkC.chainId);
      expect(connected).toEqual({ rpcUrl: networkC.rpcUrl });
    });

    it('does not let an in-flight connect() overwrite a newer switch', async () => {
      const resolvers = deferProviders();

      // `connect()` targets the current network (A) and is still in flight.
      const connecting = provider.connect();
      const switching = provider.switchNetwork({ chainId: networkB.chainId });

      // The switch lands first, then the older connect factory resolves.
      resolvers[networkB.rpcUrl](providerFor(networkB.rpcUrl));
      await switching;
      resolvers[networkA.rpcUrl](providerFor(networkA.rpcUrl));
      await connecting;

      expect(await reportedChainId()).toBe(networkB.chainId);
      expect(connected).toEqual({ rpcUrl: networkB.rpcUrl });
    });

    it('does not let an in-flight connect() install ahead of a pending switch', async () => {
      const resolvers = deferProviders();

      const connecting = provider.connect();
      const switching = provider.switchNetwork({ chainId: networkB.chainId });

      // The older connect resolves first; it has already lost ownership.
      resolvers[networkA.rpcUrl](providerFor(networkA.rpcUrl));
      await connecting;
      resolvers[networkB.rpcUrl](providerFor(networkB.rpcUrl));
      await switching;

      expect(await reportedChainId()).toBe(networkB.chainId);
      expect(connected).toEqual({ rpcUrl: networkB.rpcUrl });
    });

    it('never installs a provider for a switch that lost ownership', async () => {
      const resolvers = deferProviders();

      const slow = provider.switchNetwork({ chainId: networkB.chainId });
      const fast = provider.switchNetwork({ chainId: networkC.chainId });

      resolvers[networkC.rpcUrl](providerFor(networkC.rpcUrl));
      await fast;
      resolvers[networkB.rpcUrl](providerFor(networkB.rpcUrl));
      await slow;

      const installed = (wallet.connect as unknown as jest.Mock).mock.calls.map(
        ([p]: [{ rpcUrl: string }]) => p.rpcUrl
      );
      expect(installed).not.toContain(networkB.rpcUrl);
    });
  });
});
