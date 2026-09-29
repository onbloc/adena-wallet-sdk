import { decodeTxMessages } from '@gnolang/gno-js-client';
import {
  JSONRPCProvider,
  Secp256k1PubKeyType,
  Wallet as TM2Wallet,
  TransactionEndpoint,
  uint8ArrayToBase64,
} from '@gnolang/tm2-js-client';

import { BroadcastType, NetworkInfo, WalletResponseFailureType, WalletResponseSuccessType } from '../../core';
import { DEFAULT_RPC_URL, GNO_ADDRESS_PREFIX } from '../../core/constants/chains.constant';
import { TM2WalletProvider } from '../../core/providers/tm2-wallet';
import {
  AddEstablishResponse,
  AddNetworkOptions,
  AddNetworkResponse,
  BroadcastMultisigTransactionResponse,
  BroadcastTransactionOptions,
  BroadcastTransactionResponse,
  CreateMultisigAccountResponse,
  CreateMultisigTransactionResponse,
  GetAccountResponse,
  GetNetworkResponse,
  IsConnectedResponse,
  OnChangeAccountResponse,
  OnChangeNetworkOptions,
  OnChangeNetworkResponse,
  SignMultisigTransactionResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  SwitchNetworkOptions,
  SwitchNetworkResponse,
} from '../../core/types/methods';
import { encodeTransaction } from '../../core/utils/encode.utils';
import { makeResponseMessage } from '../../core/utils/message.utils';
import { normalizeRpcUrl, validateNetworkInput } from '../../core/utils/network.utils';
import { GetSocialUserProfileResponse } from '../../core/types/methods/get-social-user-profile.types';

export class GnoWalletProvider implements TM2WalletProvider {
  protected wallet: TM2Wallet | null;
  protected rpcUrl: string | null;
  protected networks: NetworkInfo[];
  protected currentChainId: string | null;
  protected networkCallback: ((chainId: string) => void) | null;
  /** Identifies the connection attempt that currently owns the wallet's provider. */
  private pendingNetworkRequest: symbol | null = null;
  /** Outcome of that attempt, so an attempt it superseded can report it instead of guessing. */
  private pendingConnection: Promise<boolean> | null = null;

  constructor(wallet?: TM2Wallet, networks?: NetworkInfo[]) {
    this.wallet = wallet || null;
    this.networks = networks || [];
    this.currentChainId = null;
  }

  protected get currentNetwork(): NetworkInfo | null {
    if (this.networks.length === 0) {
      return null;
    }

    if (this.currentChainId === null) {
      return this.networks[0];
    }

    return this.networks.find((network) => network.chainId === this.currentChainId) || null;
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

    try {
      await this.setNetwork(network);
    } catch (error) {
      console.error(error);
      // The RPC endpoint could not be reached, so the wallet is still on the
      // network it was on before this call.
      return makeResponseMessage(WalletResponseFailureType.NETWORK_TIMEOUT);
    }

    return makeResponseMessage(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS);
  }

  async addNetwork(options: AddNetworkOptions): Promise<AddNetworkResponse> {
    if (!validateNetworkInput(options)) {
      return makeResponseMessage(WalletResponseFailureType.INVALID_FORMAT);
    }

    const normalizedRpcUrl = normalizeRpcUrl(options.rpcUrl);

    if (this.isExistingNetwork(options.chainId, normalizedRpcUrl)) {
      return makeResponseMessage(WalletResponseFailureType.NETWORK_ALREADY_EXISTS);
    }

    const network: NetworkInfo = {
      chainId: options.chainId,
      networkName: options.chainName,
      rpcUrl: normalizedRpcUrl,
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

    const signedTransaction = await this.wallet!.signTransaction(options.tx, decodeTxMessages);

    const transactionEndpoint =
      options.broadcastType === BroadcastType.COMMIT
        ? TransactionEndpoint.BROADCAST_TX_COMMIT
        : TransactionEndpoint.BROADCAST_TX_SYNC;

    const transactionResult = await this.wallet!.sendTransaction(signedTransaction, transactionEndpoint);
    return makeResponseMessage(WalletResponseSuccessType.TRANSACTION_SUCCESS, transactionResult);
  }

  createMultisigAccount(): Promise<CreateMultisigAccountResponse> {
    throw new Error('not supported');
  }

  createMultisigTransaction(): Promise<CreateMultisigTransactionResponse> {
    throw new Error('not supported');
  }

  signMultisigTransaction(): Promise<SignMultisigTransactionResponse> {
    throw new Error('not supported');
  }

  broadcastMultisigTransaction(): Promise<BroadcastMultisigTransactionResponse> {
    throw new Error('not supported');
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

  protected connectProvider(): Promise<boolean> {
    return this.applyConnection(this.currentNetwork?.rpcUrl || DEFAULT_RPC_URL, null);
  }

  /**
   * Connects the wallet to `rpcUrl`, and when `network` is given makes it the
   * current one once that connection is installed.
   *
   * Every attempt goes through here and takes a ticket, whether it came from
   * `connect()` or from `switchNetwork()`. The ticket is checked after the
   * async factory resolves and before anything is mutated, so a slower attempt
   * can neither install its provider over a newer one nor leave
   * `currentChainId` describing a node the wallet is not talking to.
   *
   * @param rpcUrl
   * @param network - the network to select, or null to keep the current one
   * @returns {Promise<boolean>} whether the wallet is connected to a provider
   */
  private applyConnection(rpcUrl: string, network: NetworkInfo | null): Promise<boolean> {
    if (!this.wallet) {
      // Nothing to connect, but a network selection still applies.
      this.selectNetwork(network);
      return Promise.resolve(false);
    }

    const request = Symbol(network?.chainId ?? rpcUrl);
    this.pendingNetworkRequest = request;

    const settled = this.runConnection(request, rpcUrl, network);
    // Registered synchronously, before any later attempt can take the ticket,
    // so whoever this attempt supersedes can await it.
    this.pendingConnection = settled.then(
      (connected) => connected,
      () => false
    );

    return settled;
  }

  private async runConnection(request: symbol, rpcUrl: string, network: NetworkInfo | null): Promise<boolean> {
    let provider: JSONRPCProvider;

    try {
      // Since tm2-js-client 3.x the provider is built by an async factory that
      // performs a version-detection round trip, so it rejects for an
      // unreachable node.
      provider = await JSONRPCProvider.create(rpcUrl);
    } catch (error) {
      if (this.pendingNetworkRequest === request) {
        this.pendingNetworkRequest = null;
        this.pendingConnection = null;
      }
      throw error;
    }

    if (this.pendingNetworkRequest !== request || !this.wallet) {
      // A newer attempt took over, or `disconnect()` landed while the factory
      // was in flight. Either way this provider is stale: drop it rather than
      // making it the active one, and report what the attempt that took over
      // ends up doing. `pendingConnection` always belongs to a later attempt
      // here, so awaiting it cannot wait on this one.
      return this.pendingConnection ?? false;
    }
    this.pendingNetworkRequest = null;

    // No await between installing the provider and recording the chain id.
    this.wallet.connect(provider);
    this.selectNetwork(network);

    return true;
  }

  private selectNetwork(network: NetworkInfo | null): void {
    if (!network) {
      return;
    }

    this.currentChainId = network.chainId;

    // Trigger network change callback
    this.triggerNetworkCallback(this.currentChainId);
  }

  protected disconnectProvider(): boolean {
    this.networkCallback = null;
    this.networks = [];
    this.currentChainId = null;
    this.wallet = null;
    // Stops an in-flight attempt from committing a chain id after disconnect.
    this.pendingNetworkRequest = null;
    this.pendingConnection = null;

    return true;
  }

  /**
   * Points the wallet at the given network. Rejects if the RPC endpoint cannot
   * be reached, leaving the previous network selected.
   *
   * @param network
   */
  private async setNetwork(network: NetworkInfo): Promise<void> {
    await this.applyConnection(network.rpcUrl, network);
  }

  /**
   * Checks if a network with the given chainId or RPC URL already exists
   *
   * @param chainId
   * @param normalizedRpcUrl
   * @returns {boolean} true if network with same chainId or RPC URL exists, false otherwise
   */
  private isExistingNetwork(chainId: string, normalizedRpcUrl: string): boolean {
    return this.networks.some(
      (network) => network.chainId === chainId || normalizeRpcUrl(network.rpcUrl) === normalizedRpcUrl
    );
  }

  async getSocialUserProfile(): Promise<GetSocialUserProfileResponse> {
    throw new Error('Social user profile is not supported in GnoWalletProvider. Use GnoSocialWalletProvider instead.');
  }
}
