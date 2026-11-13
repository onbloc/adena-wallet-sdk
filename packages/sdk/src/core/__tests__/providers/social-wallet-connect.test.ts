import { GnoSocialWalletProvider } from '../../../providers';
import { SocialGoogleConfigure } from '../../types';

const PRIVATE_KEY = '0x' + '11'.repeat(32);

const config: SocialGoogleConfigure = {
  chainId: 'gnoland-1',
  name: 'Gno.land',
  rpcTarget: 'https://rpc.gno.land',
  network: 'testnet',
  clientId: 'test-client-id',
  authClientId: 'test-auth-client-id',
  googleClientId: 'test-google-client-id',
  verifier: 'gno-google',
};

type FakeWeb3Auth = {
  connected: boolean;
  connection: { ethereumProvider: { request: jest.Mock } } | null;
  getUserInfo: jest.Mock;
  connectTo: jest.Mock;
  logout: jest.Mock;
};

function createFakeWeb3Auth(overrides: Partial<FakeWeb3Auth> = {}): FakeWeb3Auth {
  const connection = { ethereumProvider: { request: jest.fn().mockResolvedValue(PRIVATE_KEY) } };
  return {
    connected: false,
    connection,
    getUserInfo: jest.fn(),
    connectTo: jest.fn().mockResolvedValue(connection),
    logout: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('GnoSocialWalletProvider.connect', () => {
  let provider: GnoSocialWalletProvider;
  let initializeWeb3Auth: jest.Mock;

  beforeEach(async () => {
    provider = await GnoSocialWalletProvider.createGoogle(config);
    provider['currentChainId'] = config.chainId;
    jest.spyOn(provider as never, 'connectProvider').mockResolvedValue(true as never);
    initializeWeb3Auth = jest.fn();
    provider['initializeWeb3Auth'] = initializeWeb3Auth;
  });

  it('logs in again when the restored session cannot be read', async () => {
    const restored = createFakeWeb3Auth({
      connected: true,
      getUserInfo: jest.fn().mockRejectedValue(new Error('Could not obtain an access token')),
    });
    const fresh = createFakeWeb3Auth();
    initializeWeb3Auth.mockResolvedValueOnce(restored).mockResolvedValueOnce(fresh);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    await expect(provider.connect()).resolves.toBe(true);

    expect(restored.logout).toHaveBeenCalledWith({ cleanup: true });
    expect(initializeWeb3Auth).toHaveBeenCalledTimes(2);
    expect(fresh.connectTo).toHaveBeenCalledWith('auth', {
      authConnection: 'google',
      authConnectionId: 'gno-google',
    });
    expect(provider.getWallet()).not.toBeNull();
  });

  it('reuses the restored session when it matches the auth connection', async () => {
    const restored = createFakeWeb3Auth({
      connected: true,
      getUserInfo: jest.fn().mockResolvedValue({ authConnection: 'google', authConnectionId: 'gno-google' }),
    });
    initializeWeb3Auth.mockResolvedValueOnce(restored);

    await expect(provider.connect()).resolves.toBe(true);

    expect(restored.logout).not.toHaveBeenCalled();
    expect(restored.connectTo).not.toHaveBeenCalled();
    expect(initializeWeb3Auth).toHaveBeenCalledTimes(1);
  });

  it('logs in again when the restored session uses another auth connection', async () => {
    const restored = createFakeWeb3Auth({
      connected: true,
      getUserInfo: jest.fn().mockResolvedValue({ authConnection: 'twitter', authConnectionId: 'gno-twitter' }),
    });
    const fresh = createFakeWeb3Auth();
    initializeWeb3Auth.mockResolvedValueOnce(restored).mockResolvedValueOnce(fresh);

    await expect(provider.connect()).resolves.toBe(true);

    expect(restored.logout).toHaveBeenCalledWith({ cleanup: true });
    expect(fresh.connectTo).toHaveBeenCalledTimes(1);
  });
});
