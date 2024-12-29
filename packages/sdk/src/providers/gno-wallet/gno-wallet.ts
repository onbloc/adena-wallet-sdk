import { decodeTxMessages } from '@gnolang/gno-js-client';
import {
  JSONRPCProvider,
  Secp256k1PubKeyType,
  Wallet as TM2Wallet,
  TransactionEndpoint,
  uint8ArrayToBase64,
} from '@gnolang/tm2-js-client';

import { BroadcastType, WalletResponseFailureType, WalletResponseSuccessType } from '../../core';
import { TM2WalletProvider } from '../../core/providers/tm2-wallet';
import {
  AddEstablishResponse,
  AddNetworkResponse,
  BroadcastTransactionOptions,
  BroadcastTransactionResponse,
  GetAccountResponse,
  GetNetworkResponse,
  IsConnectedResponse,
  OnChangeAccountResponse,
  OnChangeNetworkResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  SwitchNetworkResponse,
} from '../../core/types/methods';
import { encodeTransaction } from '../../core/utils/encode.utils';
import { makeResponseMessage } from '../../core/utils/message.utils';
import { DEFAULT_RPC_URL } from '../../core/constants/chains.constant';

export class GnoWalletProvider implements TM2WalletProvider {
  protected wallet: TM2Wallet | null;
  protected rpcUrl: string | null;

  constructor(wallet?: TM2Wallet) {
    this.wallet = wallet || null;
    this.rpcUrl = null;
  }

  public getWallet(): TM2Wallet | null {
    return this.wallet;
  }

  async connect(rpcUrl?: string): Promise<boolean> {
    return this.connectProvider(rpcUrl);
  }

  async disconnect(): Promise<boolean> {
    return true;
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

  async getNetwork(): Promise<GetNetworkResponse> {
    throw new Error('not supported');
  }

  async switchNetwork(): Promise<SwitchNetworkResponse> {
    throw new Error('not supported');
  }

  async addNetwork(): Promise<AddNetworkResponse> {
    throw new Error('not supported');
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

  onChangeNetwork(): OnChangeNetworkResponse {
    throw new Error('not supported');
  }

  protected connectProvider(rpcUrl?: string): boolean {
    if (!this.wallet) {
      return false;
    }

    const provider = new JSONRPCProvider(rpcUrl || DEFAULT_RPC_URL);
    this.wallet.connect(provider);
    return true;
  }
}
