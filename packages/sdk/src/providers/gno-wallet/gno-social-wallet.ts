import { GnoWallet } from '@gnolang/gno-js-client';
import {
  AUTH_CONNECTION,
  AUTH_CONNECTION_TYPE,
  AuthLoginParams,
  CHAIN_NAMESPACES,
  CONNECTOR_EVENTS,
  CONNECTOR_STATUS,
  CustomChainConfig,
  IWeb3AuthCoreOptions,
  ProjectConfig,
  WALLET_CONNECTORS,
  Web3AuthNoModal,
} from '@web3auth/no-modal';

import {
  SocialExtraLoginOptions,
  NetworkInfo,
  SocialEmailPasswordlessConfigure,
  SocialGoogleConfigure,
  SocialTwitterConfigure,
  SocialType,
} from '../../core';
import { GNO_ADDRESS_PREFIX } from '../../core/constants/chains.constant';
import { hexToUint8Array } from '../../core/utils/encode.utils';
import { GnoWalletProvider } from './gno-wallet';
import { GetSocialUserProfileResponse } from '../../core/types/methods/get-social-user-profile.types';

// Login parameters for the AUTH connector. Auth connections (formerly "verifiers")
// are resolved from the Embedded Wallets dashboard in v11, so only the connection
// type and its dashboard ID are passed from code.
type SocialLoginParams = Pick<AuthLoginParams, 'authConnection' | 'authConnectionId' | 'extraLoginOptions'>;

// Upper bound for the AUTH connector to become usable after `init()` resolves
// (auth iframe load plus, for a cached session, its rehydration).
const AUTH_CONNECTOR_READY_TIMEOUT_MS = 30_000;

type EventSource = {
  on(event: string, listener: (...args: unknown[]) => void): unknown;
  removeListener(event: string, listener: (...args: unknown[]) => void): unknown;
};

type EventTrigger = { source: EventSource; event: string };

/**
 * Settles on the first matching event: resolves on any `resolveOn` event, rejects with the
 * event payload on any `rejectOn` event, and rejects with `timeoutMessage` after `timeoutMs`.
 * Every listener and the timer are removed whichever way it settles.
 */
function waitForEvent({
  resolveOn,
  rejectOn = [],
  timeoutMs,
  timeoutMessage,
}: {
  resolveOn: EventTrigger[];
  rejectOn?: EventTrigger[];
  timeoutMs: number;
  timeoutMessage: string;
}): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const subscriptions: { source: EventSource; event: string; listener: (...args: unknown[]) => void }[] = [];

    const cleanup = () => {
      clearTimeout(timer);
      subscriptions.forEach(({ source, event, listener }) => source.removeListener(event, listener));
    };

    const subscribe = ({ source, event }: EventTrigger, settle: (payload: unknown) => void) => {
      const listener = (payload?: unknown) => {
        cleanup();
        settle(payload);
      };
      subscriptions.push({ source, event, listener });
      source.on(event, listener);
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    resolveOn.forEach((trigger) => subscribe(trigger, () => resolve()));
    rejectOn.forEach((trigger) =>
      subscribe(trigger, (error) => reject(error instanceof Error ? error : new Error(String(error))))
    );
  });
}

/**
 * Web3AuthNoModal pinned to a single Gno chain.
 *
 * v11 merges chains configured on the dashboard in front of the ones passed in
 * code, and the initial chain decides which provider the AUTH connector sets up
 * (EVM/Solana chains get the wallet-services embed, `other` gets a private key
 * provider). `defaultChainId` cannot be used to pin the Gno chain because v11
 * requires it to be a hex string. Restricting the merged list to the Gno chain
 * keeps the initial chain, the AUTH connector provider and `private_key` export
 * on the `other` namespace regardless of the dashboard chain settings.
 */
class GnoWeb3AuthNoModal extends Web3AuthNoModal {
  private readonly gnoChainId: string;

  constructor(options: IWeb3AuthCoreOptions, gnoChainId: string) {
    super(options);
    this.gnoChainId = gnoChainId;
  }

  protected initChainsConfig(projectConfig: ProjectConfig): void {
    super.initChainsConfig(projectConfig);
    this.coreOptions.chains = (this.coreOptions.chains || []).filter((chain) => chain.chainId === this.gnoChainId);
  }
}

export class GnoSocialWalletProvider extends GnoWalletProvider {
  private web3auth: Web3AuthNoModal;
  private socialType: SocialType;
  private config: SocialGoogleConfigure | SocialTwitterConfigure | SocialEmailPasswordlessConfigure;
  private chainConfig: CustomChainConfig;
  private extraLoginOptions: SocialExtraLoginOptions;

  constructor(
    socialType: SocialType,
    config: SocialGoogleConfigure | SocialTwitterConfigure | SocialEmailPasswordlessConfigure,
    networks?: NetworkInfo[]
  ) {
    super(undefined, networks);
    this.socialType = socialType;
    this.config = config;
    this.chainConfig = {
      displayName: 'Gno.land',
      tickerName: 'Gno.land',
      ticker: 'ugnot',
      chainNamespace: CHAIN_NAMESPACES.OTHER,
      chainId: this.config.chainId,
      rpcTarget: this.config.rpcTarget,
      blockExplorerUrl: '',
      logo: '',
    };
    this.extraLoginOptions = {};

    // Validate the configuration for the selected social type eagerly.
    this.getAuthConnection();

    if (isSocialEmailPasswordlessConfigure(config)) {
      this.extraLoginOptions = { login_hint: config.email };
    }
  }

  public setExtraLoginOptions(extraLoginOptions: SocialExtraLoginOptions): void {
    this.extraLoginOptions = extraLoginOptions;
  }

  private getAuthConnection(): AUTH_CONNECTION_TYPE {
    switch (this.socialType) {
      case SocialType.GOOGLE:
        if (!isSocialGoogleConfigure(this.config)) {
          throw new Error('Invalid Google configuration');
        }
        return AUTH_CONNECTION.GOOGLE;

      case SocialType.TWITTER:
        if (!isSocialTwitterConfigure(this.config)) {
          throw new Error('Invalid Twitter configuration');
        }
        return AUTH_CONNECTION.TWITTER;

      case SocialType.EMAIL:
        if (!isSocialEmailPasswordlessConfigure(this.config)) {
          throw new Error('Invalid Email configuration');
        }
        return AUTH_CONNECTION.EMAIL_PASSWORDLESS;

      default:
        throw new Error('Unsupported social type');
    }
  }

  private createLoginParams(): SocialLoginParams {
    const extraLoginOptions: SocialExtraLoginOptions & { connection?: string } = { ...this.extraLoginOptions };

    // Twitter login goes through Auth0. Keep sending the same Auth0 parameters the v9
    // loginConfig sent (`jwtParameters.connection` and `domain`), so the same identity
    // provider is used and existing users derive the same key.
    if (this.socialType === SocialType.TWITTER && isSocialTwitterConfigure(this.config)) {
      extraLoginOptions.connection = extraLoginOptions.connection || 'twitter';
      extraLoginOptions.domain = extraLoginOptions.domain || this.config.domain;
    }

    return {
      authConnection: this.getAuthConnection(),
      authConnectionId: this.config.verifier,
      ...(Object.keys(extraLoginOptions).length > 0 && { extraLoginOptions: { ...extraLoginOptions } }),
    };
  }

  public async connect(): Promise<boolean> {
    if (!this.currentNetwork) {
      return false;
    }

    try {
      this.web3auth = await this.initializeWeb3Auth();

      const loginParams = this.createLoginParams();

      if (this.web3auth.connected) {
        if (await this.isRestoredSessionReusable(loginParams)) {
          const privateKey = await this.requestPrivateKey();
          const privateKeyBytes = hexToUint8Array(privateKey);
          const wallet = await GnoWallet.fromPrivateKey(privateKeyBytes, {
            addressPrefix: this.currentNetwork.addressPrefix,
          });
          this.wallet = wallet;
          return this.connectProvider();
        }

        // The restored session belongs to another login or is stale: clear it and log in again.
        const networks = [...this.networks];
        await this.disconnect();

        this.setNetworks(networks);
        this.web3auth = await this.initializeWeb3Auth();
      }

      const connection = await this.web3auth.connectTo(WALLET_CONNECTORS.AUTH, loginParams);

      if (!connection) {
        return false;
      }

      const privateKey = await this.requestPrivateKey();
      const privateKeyBytes = hexToUint8Array(privateKey);

      const wallet = await GnoWallet.fromPrivateKey(privateKeyBytes, {
        addressPrefix: this.currentNetwork.addressPrefix,
      });
      this.wallet = wallet;

      return this.connectProvider();
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  }

  /**
   * Checks whether the session restored by `init()` was created with the same auth connection.
   * In v11 `getUserInfo()` also fetches linked accounts over the network and throws when no access
   * token can be obtained, so any failure is treated as a stale session instead of aborting `connect()`.
   */
  private async isRestoredSessionReusable(loginParams: SocialLoginParams): Promise<boolean> {
    try {
      const userInfo = await this.web3auth.getUserInfo();
      return (
        userInfo.authConnection === loginParams.authConnection &&
        userInfo.authConnectionId === loginParams.authConnectionId
      );
    } catch (error) {
      console.warn('Failed to read the restored Web3Auth session, logging in again:', error);
      return false;
    }
  }

  public disconnect = (): Promise<boolean> => {
    this.disconnectProvider();

    return this.web3auth
      .logout({ cleanup: true })
      .then(() => true)
      .catch(() => false);
  };

  private async requestPrivateKey(): Promise<string> {
    // In v11 `provider` is write-only; the active provider lives on `connection`.
    // For the `other` chain namespace this is a CommonPrivateKeyProvider.
    const provider = this.web3auth.connection?.ethereumProvider;
    if (!provider) {
      throw new Error('Not initialized web3 provider.');
    }

    const privateKey = await provider.request({
      method: 'private_key',
    });
    return `${privateKey}`;
  }

  private async initializeWeb3Auth() {
    const web3auth = this.createWeb3Auth();
    await web3auth.init();
    await this.waitForAuthConnectorReady(web3auth);
    return web3auth;
  }

  /**
   * Waits until the AUTH connector can be used by `connect()`.
   *
   * In v11 `init()` resolves before connectors finish initializing: connectors are set up from an
   * un-awaited `CONNECTORS_UPDATED` listener, and the AUTH connector only becomes `ready` once the
   * auth iframe has loaded. Calling `connectTo()` before that makes `connector.connect()` throw
   * inside `connectTo()`'s promise executor, where nothing catches it, so `connectTo()` never settles.
   *
   * When a cached session exists, the connector starts rehydrating it right after emitting `ready`
   * (status `connecting`). That is waited for too, so `web3auth.connected` reflects the restored
   * session and `connectTo()` is not called while the connector is still connecting.
   *
   * Connector init failures are only logged by Web3Auth, never re-thrown, so the timeout is what
   * surfaces them.
   */
  private async waitForAuthConnectorReady(
    web3auth: Web3AuthNoModal,
    timeoutMs = AUTH_CONNECTOR_READY_TIMEOUT_MS
  ): Promise<void> {
    const connector = web3auth.getConnector(WALLET_CONNECTORS.AUTH);
    if (!connector) {
      // v11 only registers the AUTH connector when the dashboard project config has `embeddedWalletAuth`.
      throw new Error(
        'Web3Auth auth connector is not available. Check the embedded wallet auth connections on the Web3Auth dashboard.'
      );
    }

    if (connector.status === CONNECTOR_STATUS.NOT_READY) {
      await waitForEvent({
        resolveOn: [{ source: connector, event: CONNECTOR_EVENTS.READY }],
        rejectOn: [{ source: connector, event: CONNECTOR_EVENTS.ERRORED }],
        timeoutMs,
        timeoutMessage: 'Web3Auth auth connector was not ready in time',
      });
    }

    if (connector.status === CONNECTOR_STATUS.CONNECTING) {
      // Rehydration either ends with Web3Auth emitting `connected` (after it records the connection)
      // or with the connector emitting `rehydration_error` and going back to `ready`.
      await waitForEvent({
        resolveOn: [
          { source: web3auth, event: CONNECTOR_EVENTS.CONNECTED },
          { source: connector, event: CONNECTOR_EVENTS.REHYDRATION_ERROR },
        ],
        timeoutMs,
        timeoutMessage: 'Web3Auth session was not restored in time',
      });
    }
  }

  private createWeb3Auth(): Web3AuthNoModal {
    // v11 removes adapters and code-side login configs. The AUTH connector is
    // registered automatically from the dashboard's auth connections, and the
    // `other` chain namespace makes it use a CommonPrivateKeyProvider internally.
    // `defaultChainId` is intentionally omitted: v11 rejects non-hex values, and
    // GnoWeb3AuthNoModal already pins the only chain to the Gno chain.
    return new GnoWeb3AuthNoModal(
      {
        clientId: this.config.clientId,
        web3AuthNetwork: this.config.network,
        chains: [this.chainConfig],
        uiConfig: {
          uxMode: 'popup',
        },
      },
      this.chainConfig.chainId
    );
  }

  public static async createGoogle(config: SocialGoogleConfigure): Promise<GnoSocialWalletProvider> {
    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    return new GnoSocialWalletProvider(SocialType.GOOGLE, config, [networkConfig]);
  }

  public static async createTwitter(config: SocialTwitterConfigure): Promise<GnoSocialWalletProvider> {
    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    return new GnoSocialWalletProvider(SocialType.TWITTER, config, [networkConfig]);
  }

  public static async createEmailPasswordless(
    config: SocialEmailPasswordlessConfigure
  ): Promise<GnoSocialWalletProvider> {
    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    return new GnoSocialWalletProvider(SocialType.EMAIL, config, [networkConfig]);
  }

  public async getSocialUserProfile(): Promise<GetSocialUserProfileResponse> {
    if (!this.web3auth) {
      throw new Error('Not initialized web3 provider.');
    }

    return await this.web3auth.getUserInfo();
  }
}

function isSocialGoogleConfigure(
  config: SocialGoogleConfigure | SocialTwitterConfigure | SocialEmailPasswordlessConfigure
): config is SocialGoogleConfigure {
  if (config === null || typeof config !== 'object') {
    return false;
  }
  return 'authClientId' in config && 'googleClientId' in config && 'verifier' in config;
}

function isSocialTwitterConfigure(
  config: SocialGoogleConfigure | SocialTwitterConfigure | SocialEmailPasswordlessConfigure
): config is SocialTwitterConfigure {
  if (config === null || typeof config !== 'object') {
    return false;
  }
  return 'verifier' in config && 'domain' in config;
}

function isSocialEmailPasswordlessConfigure(
  config: SocialGoogleConfigure | SocialTwitterConfigure | SocialEmailPasswordlessConfigure
): config is SocialEmailPasswordlessConfigure {
  if (config === null || typeof config !== 'object') {
    return false;
  }
  return 'email' in config && 'verifier' in config && 'domain' in config;
}
