/**
 * Runs the real `@web3auth/no-modal` chain initialization steps against the
 * instance built by `GnoSocialWalletProvider`.
 *
 * The Jest config maps `@web3auth/no-modal` to a stub, because its entry pulls
 * in ESM-only wallet packages. This file maps it back to the upstream CJS
 * `Web3AuthNoModal` class and mocks only the ESM-only connector modules, which
 * chain initialization never calls.
 */
import path from 'path';

import { GnoSocialWalletProvider } from '../../../providers';
import { SocialGoogleConfigure } from '../../types';

const NO_MODAL_CJS_DIR = path.join(
  path.dirname(require.resolve('@web3auth/auth', { paths: [__dirname] })),
  '../../../no-modal/dist/lib.cjs'
);

jest.mock('@web3auth/no-modal', () => {
  const dir = path.join(
    path.dirname(require.resolve('@web3auth/auth', { paths: [__dirname] })),
    '../../../no-modal/dist/lib.cjs'
  );
  return {
    AUTH_CONNECTION: jest.requireActual('@web3auth/auth').AUTH_CONNECTION,
    CHAIN_NAMESPACES: jest.requireActual('@toruslabs/base-controllers').CHAIN_NAMESPACES,
    WALLET_CONNECTORS: jest.requireActual(path.join(dir, 'base/wallet/index.js')).WALLET_CONNECTORS,
    Web3AuthNoModal: jest.requireActual(path.join(dir, 'noModal.js')).Web3AuthNoModal,
  };
});
jest.mock('@metamask/connect-evm', () => ({}));
jest.mock('@metamask/connect-multichain', () => ({}));
jest.mock('@metamask/connect-solana', () => ({}));

const GNO_CHAIN_ID = 'gnoland-1';

const config: SocialGoogleConfigure = {
  chainId: GNO_CHAIN_ID,
  name: 'Gno.land',
  rpcTarget: 'https://rpc.gno.land',
  network: 'sapphire_mainnet' as SocialGoogleConfigure['network'],
  clientId: 'test-client-id',
  authClientId: 'test-auth-client-id',
  googleClientId: 'test-google-client-id',
  verifier: 'gno-google',
};

const EVM_DASHBOARD_CHAIN = {
  chainNamespace: 'eip155',
  chainId: '0x1',
  rpcTarget: 'https://rpc.ankr.com/eth',
  displayName: 'Ethereum',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: '',
  blockExplorerUrl: '',
};

type ChainInitSteps = {
  coreOptions: { chains?: { chainId: string }[]; defaultChainId?: string };
  currentChainId: string | null;
  initChainsConfig(projectConfig: unknown): void;
  initCachedConnectorAndChainId(): Promise<void>;
};

async function runChainInitSteps(projectConfig: unknown): Promise<ChainInitSteps> {
  const provider = await GnoSocialWalletProvider.createGoogle(config);
  const web3auth = provider['createWeb3Auth']() as unknown as ChainInitSteps;

  // Same order as `Web3AuthNoModal.init()`.
  web3auth.initChainsConfig(projectConfig);
  await web3auth.initCachedConnectorAndChainId();
  return web3auth;
}

describe('GnoSocialWalletProvider web3auth chain initialization', () => {
  it('uses the upstream Web3AuthNoModal implementation', () => {
    const { Web3AuthNoModal } = jest.requireActual(path.join(NO_MODAL_CJS_DIR, 'noModal.js'));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    expect(require('@web3auth/no-modal').Web3AuthNoModal).toBe(Web3AuthNoModal);
  });

  it('does not pass a defaultChainId for the non-hex Gno chain ID', async () => {
    const web3auth = await runChainInitSteps({ chains: [] });

    expect(web3auth.coreOptions.defaultChainId).toBeUndefined();
    expect(web3auth.coreOptions.chains?.map((chain) => chain.chainId)).toEqual([GNO_CHAIN_ID]);
    expect(web3auth.currentChainId).toBe(GNO_CHAIN_ID);
  });

  it('keeps the Gno chain as the only chain when the dashboard configures other chains', async () => {
    const web3auth = await runChainInitSteps({ chains: [EVM_DASHBOARD_CHAIN] });

    expect(web3auth.coreOptions.chains?.map((chain) => chain.chainId)).toEqual([GNO_CHAIN_ID]);
    expect(web3auth.currentChainId).toBe(GNO_CHAIN_ID);
  });

  it('rejects a non-hex defaultChainId upstream (regression guard)', async () => {
    const provider = await GnoSocialWalletProvider.createGoogle(config);
    const web3auth = provider['createWeb3Auth']() as unknown as ChainInitSteps;
    web3auth.coreOptions.defaultChainId = GNO_CHAIN_ID;

    web3auth.initChainsConfig({ chains: [] });
    await expect(web3auth.initCachedConnectorAndChainId()).rejects.toThrow(
      'Please provide a valid defaultChainId in constructor'
    );
  });
});
