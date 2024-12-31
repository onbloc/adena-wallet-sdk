import { decodeTxMessages } from '@gnolang/gno-js-client';
import {
  JSONRPCProvider,
  Secp256k1PubKeyType,
  Wallet as TM2Wallet,
  TransactionEndpoint,
  uint8ArrayToBase64,
} from '@gnolang/tm2-js-client';

import { BroadcastType, NetworkInfo, WalletResponseFailureType, WalletResponseSuccessType } from '../../core';
import { TM2WalletProvider } from '../../core/providers/tm2-wallet';
import {
  AddEstablishResponse,
  AddNetworkOptions,
  AddNetworkResponse,
  BroadcastTransactionOptions,
  BroadcastTransactionResponse,
  GetAccountResponse,
  GetNetworkResponse,
  IsConnectedResponse,
  OnChangeAccountResponse,
  OnChangeNetworkOptions,
  OnChangeNetworkResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  SwitchNetworkOptions,
  SwitchNetworkResponse,
} from '../../core/types/methods';
import { encodeTransaction } from '../../core/utils/encode.utils';
import { makeResponseMessage } from '../../core/utils/message.utils';
import { DEFAULT_RPC_URL, GNO_ADDRESS_PREFIX } from '../../core/constants/chains.constant';

export class GnoWalletProvider implements TM2WalletProvider {
  protected wallet: TM2Wallet | null;
  protected rpcUrl: string | null;
  protected networks: NetworkInfo[];
  protected currentNetwork: NetworkInfo | null;
  protected networkCallback: ((chainId: string) => void) | null;

  constructor(wallet?: TM2Wallet, networks?: NetworkInfo[]) {
    this.wallet = wallet || null;
    this.networks = networks || [];
    this.currentNetwork = null;
  }

  public getWallet(): TM2Wallet | null {
    return this.wallet;
  }

  async connect(): Promise<boolean> {
    return this.connectProvider();
  }

  async disconnect(): Promise<boolean> {
    return this.disconnectProvider();
  }

  async isConnected(): Promise<IsConnectedResponse> {
    const connected = this.wallet !== null;
    const responseType = connected
      ? WalletResponseSuccessType.CONNECTION_SUCCESS
      : WalletResponseFailureType.NOT_CONNECTED;
    return makeResponseMessage(responseType);
  }

  async addEstablish(): Promise<AddEstablishResponse> {
    return makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS, true);
  }

  async getAccount(): Promise<GetAccountResponse> {
    const connected = this.wallet !== null;
    if (!connected) {
      return makeResponseMessage(WalletResponseFailureType.NOT_CONNECTED);
    }

    try {
      const address = await this.wallet!.getAddress();
      const accountNumber = await this.wallet!.getAccountNumber();
      const accountSequence = await this.wallet!.getAccountSequence();
      const chainId = await this.wallet!.getProvider()
        .getStatus()
        .then((response) => response.node_info.network);
      const publicKey = await this.wallet!.getSigner().getPublicKey();

      return makeResponseMessage(WalletResponseSuccessType.GET_ACCOUNT_SUCCESS, {
        address,
        accountNumber: accountNumber.toString(),
        sequence: accountSequence.toString(),
        chainId,
        coins: '',
        status: 'ACTIVE',
        publicKey: {
          '@type': Secp256k1PubKeyType,
          value: uint8ArrayToBase64(publicKey),
        },
      });
    } catch (e) {
      console.log(e);
      return makeResponseMessage(WalletResponseFailureType.NO_ACCOUNT);
    }
  }

  setNetworks(networks: NetworkInfo[]): void {
    this.networks = networks;
  }

  async getNetwork(): Promise<GetNetworkResponse> {
    const connected = this.wallet !== null;
    if (!connected) {
      return makeResponseMessage(WalletResponseFailureType.NOT_CONNECTED);
    }

    if (!this.currentNetwork) {
      return makeResponseMessage(WalletResponseFailureType.NOT_INITIALIZED_NETWORK);
    }

    return makeResponseMessage(WalletResponseSuccessType.GET_NETWORK_SUCCESS, this.currentNetwork);
  }

  async switchNetwork(options: SwitchNetworkOptions): Promise<SwitchNetworkResponse> {
    const chainId = options.chainId;
    if (!chainId) {
      return makeResponseMessage(WalletResponseFailureType.INVALID_FORMAT);
    }

    const network = this.networks.find((network) => network.chainId === options.chainId);
    if (!network) {
      return makeResponseMessage(WalletResponseFailureType.UNADDED_NETWORK);
    }

    this.setNetwork(network);

    const connected = this.connectProvider();
    if (!connected) {
      return makeResponseMessage(WalletResponseFailureType.NOT_CONNECTED);
    }

    return makeResponseMessage(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS);
  }

  async addNetwork(options: AddNetworkOptions): Promise<AddNetworkResponse> {
    const { chainId, chainName, rpcUrl } = options;

    if (!chainId || !chainName || !rpcUrl) {
      return makeResponseMessage(WalletResponseFailureType.INVALID_FORMAT);
    }

    if (rpcUrl.match(/\s/g)) {
      return makeResponseMessage(WalletResponseFailureType.INVALID_FORMAT);
    }

    const network: NetworkInfo = {
      chainId,
      networkName: chainName,
      rpcUrl: rpcUrl.replace(/\/$/, ''),
      addressPrefix: GNO_ADDRESS_PREFIX,
      indexerUrl: null,
    };

    this.networks = [...this.networks, network];

    return makeResponseMessage(WalletResponseSuccessType.ADD_NETWORK_SUCCESS);
  }

  async signTransaction(options: SignTransactionOptions): Promise<SignTransactionResponse> {
    const connected = this.wallet !== null;
    if (!connected) {
      return makeResponseMessage(WalletResponseFailureType.NOT_CONNECTED);
    }

    const signedTransaction = await this.wallet!.signTransaction(options.tx, decodeTxMessages);
    const encodedTransaction = encodeTransaction(signedTransaction);
    return makeResponseMessage(WalletResponseSuccessType.SIGN_SUCCESS, { encodedTransaction });
  }

  async broadcastTransaction(options: BroadcastTransactionOptions): Promise<BroadcastTransactionResponse> {
    const connected = this.wallet !== null;
    if (!connected) {
      return makeResponseMessage(WalletResponseFailureType.NOT_CONNECTED);
    }

    const transactionEndpoint =
      options.broadcastType === BroadcastType.COMMIT
        ? TransactionEndpoint.BROADCAST_TX_COMMIT
        : TransactionEndpoint.BROADCAST_TX_SYNC;

    const transactionResult = await this.wallet!.sendTransaction(options.tx, transactionEndpoint);
    return makeResponseMessage(WalletResponseSuccessType.TRANSACTION_SUCCESS, transactionResult);
  }

  onChangeAccount(): OnChangeAccountResponse {
    throw new Error('not supported');
  }

  onChangeNetwork(options: OnChangeNetworkOptions): OnChangeNetworkResponse {
    this.networkCallback = options.callback;
  }

  protected triggerNetworkCallback(chainId: string): void {
    if (!this.networkCallback) {
      return;
    }

    this.networkCallback(chainId);
  }

  protected connectProvider(): boolean {
    if (!this.wallet) {
      return false;
    }

    const rpcUrl = this.currentNetwork?.rpcUrl || DEFAULT_RPC_URL;
    const provider = new JSONRPCProvider(rpcUrl);
    this.wallet.connect(provider);
    return true;
  }

  protected disconnectProvider(): boolean {
    this.networkCallback = null;
    this.networks = [];
    this.currentNetwork = null;
    this.wallet = null;

    return true;
  }

  private setNetwork(network: NetworkInfo): void {
    this.currentNetwork = network;

    // Trigger network change callback
    this.triggerNetworkCallback(this.currentNetwork.chainId);
  }
}
