import { JSONRPCProvider, Wallet as TM2Wallet } from '@gnolang/tm2-js-client';

import { GnoWalletProvider } from '../../../providers';
import { defineGlobalMock } from '../../__mocks__/mock-global';
import { ConnectionState } from '../../connection';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';
import { AdenaSDK } from '../../sdk';
import { NetworkInfo, WalletResponseFailureType } from '../../types';

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

const flush = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

/**
 * A superseded `connect()` used to resolve false, which makes
 * `ConnectionManager.connectTM2Wallet` mark the wallet DISCONNECTED and
 * `AdenaSDK` reject every provider method afterwards — even though the switch
 * that superseded it connected successfully.
 */
describe('AdenaSDK connection state under a connect/switch race', () => {
  let sdk: AdenaSDK;
  let connected: { rpcUrl: string } | null;

  beforeEach(async () => {
    jest.clearAllMocks();
    defineGlobalMock();
    connected = null;

    const wallet = {
      connect: jest.fn((provider: { rpcUrl: string }) => {
        connected = provider;
      }),
    } as unknown as TM2Wallet;

    createMock.mockImplementation(async (rpcUrl: string) => ({ rpcUrl }));

    const walletProvider = new GnoWalletProvider(wallet, [networkA, networkB]);
    sdk = new AdenaSDK(walletProvider);

    await sdk.connectWallet();
    await sdk.switchNetwork({ chainId: networkA.chainId });

    expect(sdk.getConnectionState()).toBe(ConnectionState.CONNECTED);
  });

  /** Hands back a resolver and a rejecter per endpoint. */
  const deferProviders = (): {
    resolve: Record<string, (value: unknown) => void>;
    reject: Record<string, (reason: unknown) => void>;
  } => {
    const resolve: Record<string, (value: unknown) => void> = {};
    const reject: Record<string, (reason: unknown) => void> = {};
    createMock.mockImplementation(
      (rpcUrl: string) =>
        new Promise((res, rej) => {
          resolve[rpcUrl] = res;
          reject[rpcUrl] = rej;
        })
    );
    return { resolve, reject };
  };

  it('stays connected when a superseded connect resolves before the switch', async () => {
    const { resolve: resolvers } = deferProviders();

    const reconnecting = sdk.connectWallet();
    const switching = sdk.switchNetwork({ chainId: networkB.chainId });

    // The older connect for A resolves first, then the switch to B lands.
    resolvers[networkA.rpcUrl]({ rpcUrl: networkA.rpcUrl });
    await flush();
    resolvers[networkB.rpcUrl]({ rpcUrl: networkB.rpcUrl });
    await Promise.all([reconnecting, switching]);

    expect(sdk.getConnectionState()).toBe(ConnectionState.CONNECTED);
    expect(connected).toEqual({ rpcUrl: networkB.rpcUrl });

    // Provider methods stay reachable, and report the network B installed.
    const network = await sdk.getNetwork();
    expect(network.data?.chainId).toBe(networkB.chainId);
  });

  it('stays connected when the winning switch fails and the old provider survives', async () => {
    const { resolve: resolvers, reject: rejecters } = deferProviders();

    const reconnecting = sdk.connectWallet();
    const switching = sdk.switchNetwork({ chainId: networkB.chainId });

    // The older connect for A resolves, then the switch to B is refused.
    resolvers[networkA.rpcUrl]({ rpcUrl: networkA.rpcUrl });
    await flush();
    rejecters[networkB.rpcUrl](new Error('connect ECONNREFUSED 127.0.0.1:26657'));

    const response = await switching;
    await reconnecting;

    expect(response.type).toBe(WalletResponseFailureType.NETWORK_TIMEOUT);
    // B never connected, so the wallet is still on the provider it had.
    expect(connected).toEqual({ rpcUrl: networkA.rpcUrl });
    expect(sdk.getConnectionState()).toBe(ConnectionState.CONNECTED);

    const network = await sdk.getNetwork();
    expect(network.data?.chainId).toBe(networkA.chainId);
  });
});
