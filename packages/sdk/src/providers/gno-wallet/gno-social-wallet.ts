import { GnoWallet } from '@gnolang/gno-js-client';
import { CustomChainConfig, WALLET_ADAPTERS } from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';

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
import { AuthAdapter, LoginConfig } from '@web3auth/auth-adapter';

export class GnoSocialWalletProvider extends GnoWalletProvider {
  private web3auth: Web3AuthNoModal;
  private socialType: SocialType;
  private config: SocialGoogleConfigure | SocialTwitterConfigure | SocialEmailPasswordlessConfigure;
  private chainConfig: CustomChainConfig;
  private loginConfig: LoginConfig;
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
      chainNamespace: 'other',
      chainId: this.config.chainId,
      rpcTarget: this.config.rpcTarget,
    };
    this.extraLoginOptions = {};

    this.loginConfig = this.createLoginConfig();

    if (isSocialEmailPasswordlessConfigure(config)) {
      this.extraLoginOptions = { login_hint: config.email };
    }
  }

  public setExtraLoginOptions(extraLoginOptions: SocialExtraLoginOptions): void {
    this.extraLoginOptions = extraLoginOptions;
  }

  private createLoginConfig(): LoginConfig {
    switch (this.socialType) {
      case SocialType.GOOGLE:
        if (!isSocialGoogleConfigure(this.config)) {
          throw new Error('Invalid Google configuration');
        }

        return {
          [this.socialType]: {
            typeOfLogin: 'google',
            name: this.config.name,
            clientId: this.config.googleClientId,
            verifier: this.config.verifier,
          },
        };

      case SocialType.TWITTER:
        if (!isSocialTwitterConfigure(this.config)) {
          throw new Error('Invalid Twitter configuration');
        }
        return {
          [this.socialType]: {
            typeOfLogin: 'twitter',
            name: this.config.name,
            verifier: this.config.verifier,
            clientId: this.config.authClientId,
            jwtParameters: {
              connection: 'twitter',
              verifyerIdField: 'sub',
              domain: this.config.domain,
            },
          },
        };

      case SocialType.EMAIL:
        if (!isSocialEmailPasswordlessConfigure(this.config)) {
          throw new Error('Invalid Email configuration');
        }

        return {
          [this.socialType]: {
            typeOfLogin: 'email_passwordless',
            name: this.config.name,
            verifier: this.config.verifier,
            clientId: this.config.clientId,
          },
        };

      default:
        throw new Error('Unsupported social type');
    }
  }

  public async connect(): Promise<boolean> {
    if (!this.currentNetwork) {
      return false;
    }

    try {
      this.web3auth = await this.initializeWeb3Auth();

      const connectOptions = {
        loginProvider: this.socialType,
        ...(this.extraLoginOptions && { extraLoginOptions: this.extraLoginOptions }),
      };

      if (this.web3auth.connected) {
        const userInfo = await this.web3auth.getUserInfo();
        const currentLoginType = userInfo.typeOfLogin;

        if (currentLoginType !== this.socialType) {
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

      const provider = await this.web3auth.connectTo(WALLET_ADAPTERS.AUTH, connectOptions);

      if (!provider) {
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
    if (!this.web3auth.provider) {
      throw new Error('Not initialized web3 provider.');
    }

    const privateKey = await this.web3auth.provider.request({
      method: 'private_key',
    });
    return `${privateKey}`;
  }

  private async initializeWeb3Auth() {
    const privateKeyProvider = new CommonPrivateKeyProvider({
      config: { chainConfig: this.chainConfig },
    });

    const web3auth = new Web3AuthNoModal({
      clientId: this.config.clientId,
      web3AuthNetwork: this.config.network,
      privateKeyProvider,
    });

    const authAdapter = new AuthAdapter({
      adapterSettings: {
        uxMode: 'popup',
        loginConfig: this.loginConfig,
      },
    });

    web3auth.configureAdapter(authAdapter);
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
