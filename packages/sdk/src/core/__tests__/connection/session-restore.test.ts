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

const network: NetworkInfo = {
  chainId: 'chain-a',
  networkName: 'Chain A',
  rpcUrl: 'https://a.example',
  addressPrefix: GNO_ADDRESS_PREFIX,
  indexerUrl: null,
};

const flush = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

/**
 * `ConnectionManager` restores a session from its constructor without awaiting.
 * Since tm2-js-client 3.x the provider factory rejects for an unreachable node,
 * where the previous synchronous constructor could not, so that rejection has
 * to be caught at the call site or it escapes unhandled.
 */
describe('session restore with an unreachable node', () => {
  let walletProvider: GnoWalletProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    defineGlobalMock();

    const wallet = { connect: jest.fn() } as unknown as TM2Wallet;
    walletProvider = new GnoWalletProvider(wallet, [network]);
    createMock.mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:26657'));
  });

  it('does not leak an unhandled rejection when the session cannot be restored', async () => {
    const sdk = new AdenaSDK(walletProvider, { isSession: true });

    // An escaping rejection fails this suite before the assertion runs.
    await flush();

    expect(sdk.getConnectionState()).toBe(ConnectionState.ERROR);
  });

  it('leaves the session disconnected rather than throwing from the constructor', () => {
    expect(() => new AdenaSDK(walletProvider, { isSession: true })).not.toThrow();
  });
});
