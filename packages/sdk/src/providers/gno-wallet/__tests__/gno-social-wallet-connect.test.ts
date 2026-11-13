import { EventEmitter } from 'events';

// Load `core` first, as the app entry does: importing the provider modules first
// would enter the core <-> providers import cycle from the wrong side.
import '../../../core';
import { SocialGoogleConfigure } from '../../../core';
import { GnoWalletProvider } from '../gno-wallet';
import { GnoSocialWalletProvider } from '../gno-social-wallet';

// A valid secp256k1 private key; the derived address is irrelevant here.
const PRIVATE_KEY = '0000000000000000000000000000000000000000000000000000000000000001';

type FakeConnector = EventEmitter & { status: string };
type FakeWeb3AuthInstance = EventEmitter & {
  connected: boolean;
  connector: FakeConnector | null;
  init: jest.Mock<Promise<void>, []>;
  connectTo: jest.Mock;
  getConnector: jest.Mock;
  getUserInfo: jest.Mock;
  logout: jest.Mock;
  connection: unknown;
};

// Configures every Web3AuthNoModal created by the provider under test.
let setupInstance: (instance: FakeWeb3AuthInstance) => void = () => undefined;
const instances: FakeWeb3AuthInstance[] = [];

jest.mock('@web3auth/no-modal', () => {
  // Resolved to the Jest stub through `moduleNameMapper`.
  const actual = jest.requireActual('@web3auth/no-modal');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { EventEmitter: Emitter } = require('events');

  class FakeWeb3AuthNoModal extends Emitter {
    connected = false;
    connector: FakeConnector | null = null;
    coreOptions = { chains: [] };
    connection = {
      ethereumProvider: { request: jest.fn().mockResolvedValue(PRIVATE_KEY) },
    };
    init = jest.fn().mockResolvedValue(undefined);
    connectTo = jest.fn();
    getConnector = jest.fn(() => this.connector);
    getUserInfo = jest.fn();
    logout = jest.fn().mockResolvedValue(undefined);

    constructor() {
      super();
      instances.push(this as unknown as FakeWeb3AuthInstance);
      setupInstance(this as unknown as FakeWeb3AuthInstance);
    }

    protected initChainsConfig(): void {
      // Not reached: `init()` is mocked.
    }
  }

  return { ...actual, Web3AuthNoModal: FakeWeb3AuthNoModal };
});

const config: SocialGoogleConfigure = {
  name: 'test',
  chainId: 'test-chain',
  clientId: 'client-id',
  network: 'testnet',
  rpcTarget: 'http://localhost:26657',
  authClientId: 'auth-client-id',
  googleClientId: 'google-client-id',
  verifier: 'google-connection',
};

function createConnector(status: string): FakeConnector {
  return Object.assign(new EventEmitter(), { status });
}

/** Flushes pending promise callbacks so `connect()` can advance to its next await. */
async function flush(): Promise<void> {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
}

describe('GnoSocialWalletProvider.connect with a Web3Auth v11 AUTH connector', () => {
  let provider: GnoSocialWalletProvider;

  beforeEach(async () => {
    instances.length = 0;
    setupInstance = () => undefined;
    jest
      .spyOn(GnoWalletProvider.prototype as unknown as { connectProvider: () => Promise<boolean> }, 'connectProvider')
      .mockResolvedValue(true);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    provider = await GnoSocialWalletProvider.createGoogle(config);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('waits for the connector to emit ready before calling connectTo', async () => {
    const connector = createConnector('not_ready');
    setupInstance = (instance) => {
      instance.connector = connector;
      instance.connectTo.mockImplementation(async () => {
        // The real connector throws from `checkConnectionRequirements()` when it is not ready.
        expect(connector.status).toBe('ready');
        return {};
      });
    };

    const connecting = provider.connect();
    await flush();

    const [web3auth] = instances;
    expect(web3auth.init).toHaveBeenCalled();
    expect(web3auth.connectTo).not.toHaveBeenCalled();

    connector.status = 'ready';
    connector.emit('ready', 'auth');

    await expect(connecting).resolves.toBe(true);
    expect(web3auth.connectTo).toHaveBeenCalledTimes(1);
    expect(web3auth.connectTo).toHaveBeenCalledWith(
      'auth',
      expect.objectContaining({ authConnection: 'google', authConnectionId: 'google-connection' })
    );
    expect(connector.listenerCount('ready')).toBe(0);
    expect(connector.listenerCount('errored')).toBe(0);
  });

  it('does not wait when the connector is already ready', async () => {
    const connector = createConnector('ready');
    setupInstance = (instance) => {
      instance.connector = connector;
      instance.connectTo.mockResolvedValue({});
    };

    await expect(provider.connect()).resolves.toBe(true);
    expect(instances[0].connectTo).toHaveBeenCalledTimes(1);
    expect(connector.listenerCount('ready')).toBe(0);
  });

  it('fails instead of hanging when the connector emits errored', async () => {
    const connector = createConnector('not_ready');
    setupInstance = (instance) => {
      instance.connector = connector;
    };

    const connecting = provider.connect();
    await flush();
    connector.emit('errored', new Error('auth iframe failed'));

    await expect(connecting).resolves.toBe(false);
    expect(instances[0].connectTo).not.toHaveBeenCalled();
    expect(connector.listenerCount('ready')).toBe(0);
    expect(connector.listenerCount('errored')).toBe(0);
  });

  it('fails instead of hanging when the connector never becomes ready', async () => {
    jest.useFakeTimers();
    const connector = createConnector('not_ready');
    setupInstance = (instance) => {
      instance.connector = connector;
    };

    const connecting = provider.connect();
    await flush();
    jest.advanceTimersByTime(30_000);

    await expect(connecting).resolves.toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Connection failed:',
      expect.objectContaining({ message: 'Web3Auth auth connector was not ready in time' })
    );
    expect(instances[0].connectTo).not.toHaveBeenCalled();
    expect(connector.listenerCount('ready')).toBe(0);
  });

  it('fails with a clear error when the AUTH connector is missing', async () => {
    setupInstance = (instance) => {
      instance.connector = null;
    };

    await expect(provider.connect()).resolves.toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Connection failed:',
      expect.objectContaining({ message: expect.stringContaining('auth connector is not available') })
    );
    expect(instances[0].connectTo).not.toHaveBeenCalled();
  });

  it('waits for a cached session to be restored and reuses it', async () => {
    const connector = createConnector('not_ready');
    setupInstance = (instance) => {
      instance.connector = connector;
      instance.getUserInfo.mockResolvedValue({ authConnection: 'google', authConnectionId: 'google-connection' });
    };

    const connecting = provider.connect();
    await flush();
    const [web3auth] = instances;

    // AuthConnector.init() emits ready and then starts rehydrating the cached session.
    connector.status = 'ready';
    connector.emit('ready', 'auth');
    connector.status = 'connecting';
    await flush();
    expect(web3auth.getUserInfo).not.toHaveBeenCalled();

    connector.status = 'connected';
    web3auth.connected = true;
    web3auth.emit('connected', { connectorName: 'auth' });

    await expect(connecting).resolves.toBe(true);
    expect(web3auth.connectTo).not.toHaveBeenCalled();
    expect(web3auth.listenerCount('connected')).toBe(0);
    expect(connector.listenerCount('rehydration_error')).toBe(0);
  });

  it('logs in again when restoring the cached session fails', async () => {
    const connector = createConnector('connecting');
    setupInstance = (instance) => {
      instance.connector = connector;
      instance.connectTo.mockImplementation(async () => {
        expect(connector.status).toBe('ready');
        return {};
      });
    };

    const connecting = provider.connect();
    await flush();
    const [web3auth] = instances;
    expect(web3auth.connectTo).not.toHaveBeenCalled();

    connector.status = 'ready';
    connector.emit('rehydration_error', new Error('Failed to rehydrate'));

    await expect(connecting).resolves.toBe(true);
    expect(web3auth.connectTo).toHaveBeenCalledTimes(1);
    expect(web3auth.listenerCount('connected')).toBe(0);
  });
});
