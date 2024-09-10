import { GnoWallet } from '@gnolang/gno-js-client';
import { CustomChainConfig, WALLET_ADAPTERS } from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

import { SocialConfigure } from '../../core';
import { hexToUint8Array } from '../../core/utils/encode.utils';
import { GnoWalletProvider } from './gno-wallet';

export class GnoSocialWalletProvider extends GnoWalletProvider {
  private web3auth: Web3AuthNoModal;

  constructor(web3auth: Web3AuthNoModal) {
    super();
    this.web3auth = web3auth;
  }

  public async connect(): Promise<boolean> {
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

    const wallet = await GnoWallet.fromPrivateKey(privateKeyBytes);
    this.wallet = wallet;

    return this.connectProvider();
  }

  public disconnect = (): Promise<boolean> => {
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
      .connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: 'google' })
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

  public static create(config: SocialConfigure) {
    const chainConfig: CustomChainConfig = {
      chainNamespace: 'other',
      chainId: config.chainId,
      rpcTarget: config.rpcTarget,
      displayName: 'Gno.land',
      ticker: 'ugnot',
      tickerName: 'Gno.land',
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
          google: {
            typeOfLogin: 'google',
            name: config.auth.googleName,
            verifier: config.auth.googleVerifier,
            clientId: config.auth.googleClientId,
          },
        },
      },
    });
    web3auth.configureAdapter(openloginAdapter);
    return new GnoSocialWalletProvider(web3auth);
  }
}
