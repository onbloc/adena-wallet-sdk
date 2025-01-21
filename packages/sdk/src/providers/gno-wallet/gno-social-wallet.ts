import { GnoWallet } from '@gnolang/gno-js-client';
import { CustomChainConfig, WALLET_ADAPTERS } from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

import {
  NetworkInfo,
  SocialCustomConfigure,
  SocialGoogleConfigure,
  SocialTwitterConfigure,
  SocialType,
  SocialUserProfile,
} from '../../core';
import { GNO_ADDRESS_PREFIX } from '../../core/constants/chains.constant';
import { hexToUint8Array } from '../../core/utils/encode.utils';
import { GnoWalletProvider } from './gno-wallet';

export class GnoSocialWalletProvider extends GnoWalletProvider {
  private web3auth: Web3AuthNoModal;
  private socialType: SocialType;

  constructor(web3auth: Web3AuthNoModal, socialType: SocialType, networks?: NetworkInfo[]) {
    super(undefined, networks);
    this.web3auth = web3auth;
    this.socialType = socialType;
  }

  public async connect(): Promise<boolean> {
    if (!this.currentNetwork) {
      return false;
    }

    const initialized = await this.initWeb3Auth();
    if (!initialized) {
      return false;
    }

    const connected = await this.connectWeb3Auth();
    if (!connected) {
      return false;
    }

    const privateKey = await this.requestPrivateKey();
    const privateKeyBytes = hexToUint8Array(privateKey);

    const wallet = await GnoWallet.fromPrivateKey(privateKeyBytes, {
      addressPrefix: this.currentNetwork.addressPrefix,
    });
    this.wallet = wallet;

    return this.connectProvider();
  }

  public disconnect = (): Promise<boolean> => {
    this.disconnectProvider();

    return this.web3auth
      .logout({ cleanup: true })
      .then(() => true)
      .catch(() => false);
  };

  private async initWeb3Auth(): Promise<boolean> {
    return this.web3auth
      .init()
      .then(() => true)
      .catch(() => false);
  }

  private async connectWeb3Auth(): Promise<boolean> {
    return this.web3auth
      .connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: this.socialType,
      })
      .then(() => true)
      .catch((error) => {
        if (error?.name === 'WalletLoginError') {
          return true;
        }
        return false;
      });
  }

  private async requestPrivateKey() {
    if (!this.web3auth.provider) {
      throw new Error('Not initialized web3 provider.');
    }

    const privateKey = await this.web3auth.provider.request({
      method: 'private_key',
    });
    return `${privateKey}`;
  }

  public static createGoogle(config: SocialGoogleConfigure) {
    const socialType = SocialType.GOOGLE;
    const chainConfig: CustomChainConfig = {
      displayName: 'Gno.land',
      tickerName: 'Gno.land',
      ticker: 'ugnot',
      chainNamespace: 'other',
      chainId: config.chainId,
      rpcTarget: config.rpcTarget,
    };

    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    const web3auth = new Web3AuthNoModal({
      clientId: config.clientId,
      web3AuthNetwork: config.network,
      chainConfig,
    });

    const privateKeyProvider = new CommonPrivateKeyProvider({
      config: { chainConfig },
    });

    const openloginAdapter = new OpenloginAdapter({
      privateKeyProvider: privateKeyProvider,
      adapterSettings: {
        clientId: config.clientId,
        uxMode: 'popup',
        loginConfig: {
          [socialType]: {
            typeOfLogin: 'google',
            name: config.name,
            clientId: config.googleClientId,
            verifier: config.verifier,
          },
        },
      },
    });
    web3auth.configureAdapter(openloginAdapter);
    return new GnoSocialWalletProvider(web3auth, socialType, [networkConfig]);
  }

  public static createTwitter(config: SocialTwitterConfigure) {
    const socialType = SocialType.TWITTER;
    const chainConfig: CustomChainConfig = {
      displayName: 'Gno.land',
      tickerName: 'Gno.land',
      ticker: 'ugnot',
      chainNamespace: 'other',
      chainId: config.chainId,
      rpcTarget: config.rpcTarget,
    };

    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    const web3auth = new Web3AuthNoModal({
      clientId: config.clientId,
      web3AuthNetwork: config.network,
      chainConfig,
    });

    const privateKeyProvider = new CommonPrivateKeyProvider({
      config: { chainConfig },
    });

    const openloginAdapter = new OpenloginAdapter({
      privateKeyProvider: privateKeyProvider,
      adapterSettings: {
        uxMode: 'popup',
        loginConfig: {
          [socialType]: {
            typeOfLogin: 'twitter',
            name: config.name,
            verifier: config.verifier,
            clientId: config.authClientId,
            jwtParameters: {
              connection: 'twitter',
              verifierIdField: 'sub',
              domain: config.domain,
            },
          },
        },
      },
    });
    web3auth.configureAdapter(openloginAdapter);
    return new GnoSocialWalletProvider(web3auth, socialType, [networkConfig]);
  }

  public static createEmail(config: SocialCustomConfigure) {
    const socialType = SocialType.EMAIL;
    const chainConfig: CustomChainConfig = {
      displayName: 'Gno.land',
      tickerName: 'Gno.land',
      ticker: 'ugnot',
      chainNamespace: 'other',
      chainId: config.chainId,
      rpcTarget: config.rpcTarget,
    };

    const networkConfig: NetworkInfo = {
      chainId: config.chainId,
      addressPrefix: config.addressPrefix || GNO_ADDRESS_PREFIX,
      indexerUrl: null,
      networkName: config.network,
      rpcUrl: config.rpcTarget,
    };

    const web3auth = new Web3AuthNoModal({
      clientId: config.clientId,
      web3AuthNetwork: config.network,
      chainConfig,
    });

    const privateKeyProvider = new CommonPrivateKeyProvider({
      config: { chainConfig },
    });

    const openloginAdapter = new OpenloginAdapter({
      privateKeyProvider: privateKeyProvider,
      adapterSettings: {
        uxMode: 'popup',
        loginConfig: {
          [socialType]: {
            typeOfLogin: 'jwt',
            name: config.name,
            verifier: config.verifier,
            clientId: config.authClientId,
            jwtParameters: {
              verifierIdField: 'email',
              domain: config.domain,
              login_hint: '',
            },
          },
        },
      },
    });
    web3auth.configureAdapter(openloginAdapter);
    return new GnoSocialWalletProvider(web3auth, socialType, [networkConfig]);
  }

  public async getEmailAddress(): Promise<SocialUserProfile> {
    if (!this.web3auth) {
      throw new Error('Not initialized web3 provider.');
    }

    const userInfo = await this.web3auth.getUserInfo();

    if (!userInfo.email) {
      throw new Error('Email not found');
    }

    return { email: userInfo.email };
  }
}
