import { JSONRPCProvider, Wallet as TM2Wallet } from '@gnolang/tm2-js-client';

import { GnoWalletProvider } from '../../../providers';
import { defineGlobalMock } from '../../__mocks__/mock-global';
import { ConnectionState } from '../../connection';
import { GNO_ADDRESS_PREFIX } from '../../constants/chains.constant';
import { AdenaSDK } from '../../sdk';
import { NetworkInfo } from '../../types';

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

  it('stays connected when a superseded connect resolves before the switch', async () => {
    const resolvers: Record<string, (value: unknown) => void> = {};
    createMock.mockImplementation(
      (rpcUrl: string) =>
        new Promise((resolve) => {
          resolvers[rpcUrl] = resolve;
        })
    );

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
});
