import { GnoWallet } from '@gnolang/gno-js-client';
import { CustomChainConfig, WALLET_ADAPTERS } from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';

import {
  ExtraLoginOptions,
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
  private extraLoginOptions?: ExtraLoginOptions;

  constructor(
    web3auth: Web3AuthNoModal,
    socialType: SocialType,
    networks?: NetworkInfo[],
    extraLoginOptions?: Record<string, unknown>
  ) {
    super(undefined, networks);
    this.web3auth = web3auth;
    this.socialType = socialType;
    this.extraLoginOptions = extraLoginOptions;
  }

  public async connect(): Promise<boolean> {
    if (!this.currentNetwork) {
      return false;
    }

    try {
      const connectOptions = {
        loginProvider: this.socialType,
        ...(this.extraLoginOptions && { extraLoginOptions: this.extraLoginOptions }),
      };

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

  private async requestPrivateKey() {
    if (!this.web3auth.provider) {
      throw new Error('Not initialized web3 provider.');
    }

    const privateKey = await this.web3auth.provider.request({
      method: 'private_key',
    });
    return `${privateKey}`;
  }

  private static async initializeWeb3Auth(
    clientId: string,
    chainConfig: CustomChainConfig,
    loginConfig?: LoginConfig,
    network: 'mainnet' | 'testnet' = 'testnet'
  ) {
    const privateKeyProvider = new CommonPrivateKeyProvider({
      config: { chainConfig },
    });

    const web3auth = new Web3AuthNoModal({
      clientId,
      web3AuthNetwork: network,
      privateKeyProvider,
    });

    const authAdapter = new AuthAdapter({
      adapterSettings: {
        uxMode: 'popup',
        loginConfig,
      },
    });

    web3auth.configureAdapter(authAdapter);
    await web3auth.init();
    return web3auth;
  }

  public static async createGoogle(config: SocialGoogleConfigure) {
    const socialType = SocialType.GOOGLE;
    const chainConfig: CustomChainConfig = {
      displayName: 'Gno.land',
      tickerName: 'Gno.land',
      ticker: 'ugnot',
      chainNamespace: 'other',
      chainId: config.chainId,
      rpcTarget: config.rpcTarget,
    };

    const loginConfig: LoginConfig = {
      [socialType]: {
        typeOfLogin: 'google',
        name: config.name,
        clientId: config.googleClientId,
        verifier: config.verifier,
      },
    };

    const web3auth = await this.initializeWeb3Auth(config.clientId, chainConfig, loginConfig, config.network);

    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    return new GnoSocialWalletProvider(web3auth, socialType, [networkConfig]);
  }

  public static async createTwitter(config: SocialTwitterConfigure) {
    const socialType = SocialType.TWITTER;
    const chainConfig: CustomChainConfig = {
      displayName: 'Gno.land',
      tickerName: 'Gno.land',
      ticker: 'ugnot',
      chainNamespace: 'other',
      chainId: config.chainId,
      rpcTarget: config.rpcTarget,
    };

    const loginConfig: LoginConfig = {
      [socialType]: {
        typeOfLogin: 'twitter',
        name: config.name,
        verifier: config.verifier,
        clientId: config.authClientId,
        jwtParameters: {
          connection: 'twitter',
          verifyerIdField: 'sub',
          domain: config.domain,
        },
      },
    };

    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    const web3auth = await this.initializeWeb3Auth(config.clientId, chainConfig, loginConfig, config.network);
    return new GnoSocialWalletProvider(web3auth, socialType, [networkConfig]);
  }

  public static async createEmailPasswordless(config: SocialEmailPasswordlessConfigure) {
    const socialType = SocialType.EMAIL;
    const chainConfig: CustomChainConfig = {
      displayName: 'Gno.land',
      tickerName: 'Gno.land',
      ticker: 'ugnot',
      chainNamespace: 'other',
      chainId: config.chainId,
      rpcTarget: config.rpcTarget,
    };

    const loginConfig: LoginConfig = {
      [socialType]: {
        typeOfLogin: 'email_passwordless',
        name: config.name,
        verifier: config.verifier,
        clientId: config.clientId,
      },
    };

    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    const web3auth = await this.initializeWeb3Auth(config.clientId, chainConfig, loginConfig, config.network);

    const extraLoginOptions: ExtraLoginOptions = {
      login_hint: config.email,
    };

    return new GnoSocialWalletProvider(web3auth, socialType, [networkConfig], extraLoginOptions);
  }

  public async getSocialUserProfile(): Promise<GetSocialUserProfileResponse> {
    if (!this.web3auth) {
      throw new Error('Not initialized web3 provider.');
    }

    return await this.web3auth.getUserInfo();
  }
}
