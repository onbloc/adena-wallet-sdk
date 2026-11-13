import { GnoWallet } from '@gnolang/gno-js-client';
import {
  AUTH_CONNECTION,
  AUTH_CONNECTION_TYPE,
  AuthLoginParams,
  CHAIN_NAMESPACES,
  CustomChainConfig,
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
    const extraLoginOptions: SocialExtraLoginOptions = { ...this.extraLoginOptions };

    // Twitter login goes through Auth0; keep passing the configured domain.
    if (this.socialType === SocialType.TWITTER && isSocialTwitterConfigure(this.config) && !extraLoginOptions.domain) {
      extraLoginOptions.domain = this.config.domain;
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
        const userInfo = await this.web3auth.getUserInfo();
        const isSameConnection =
          userInfo.authConnection === loginParams.authConnection &&
          userInfo.authConnectionId === loginParams.authConnectionId;

        if (!isSameConnection) {
          const networks = [...this.networks];
          await this.disconnect();

          this.setNetworks(networks);
          this.web3auth = await this.initializeWeb3Auth();
        } else {
          const privateKey = await this.requestPrivateKey();
          const privateKeyBytes = hexToUint8Array(privateKey);
          const wallet = await GnoWallet.fromPrivateKey(privateKeyBytes, {
            addressPrefix: this.currentNetwork.addressPrefix,
          });
          this.wallet = wallet;
          return this.connectProvider();
        }
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
    // v11 removes adapters and code-side login configs. The AUTH connector is
    // registered automatically from the dashboard's auth connections, and the
    // `other` chain namespace makes it use a CommonPrivateKeyProvider internally.
    const web3auth = new Web3AuthNoModal({
      clientId: this.config.clientId,
      web3AuthNetwork: this.config.network,
      chains: [this.chainConfig],
      defaultChainId: this.chainConfig.chainId,
      uiConfig: {
        uxMode: 'popup',
      },
    });

    await web3auth.init();
    return web3auth;
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
