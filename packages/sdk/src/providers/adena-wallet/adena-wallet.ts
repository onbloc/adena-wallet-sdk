import { makeResponseMessage } from '../../core';
import { WalletProvider } from '../../core/providers';
import { AccountInfo, NetworkInfo, WalletResponseFailureType, WalletResponseSuccessType } from '../../core/types';
import {
  AddEstablishOptions,
  AddEstablishResponse,
  AddNetworkOptions,
  AddNetworkResponse,
  BroadcastTransactionOptions,
  BroadcastTransactionResponse,
  GetAccountResponse,
  GetNetworkResponse,
  IsConnectedResponse,
  OnChangeAccountOptions,
  OnChangeAccountResponse,
  OnChangeNetworkOptions,
  OnChangeNetworkResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  SwitchNetworkOptions,
  SwitchNetworkResponse,
} from '../../core/types/methods';
import { isSuccessType, mapResponseByAdenaResponse, mapTxToTransactionParams } from './mapper.utils';
import { AdenaWallet } from './types';

export class AdenaWalletProvider implements WalletProvider {
  private getAdena(): AdenaWallet {
    if (!window) {
      throw new Error('Window not initialized');
    }

    const adena = window.adena;

    // Check if adena is installed as an extension
    if (!adena) {
      throw new Error('Adena not installed');
    }
    return adena;
  }

  async isConnected(): Promise<IsConnectedResponse> {
    return makeResponseMessage<boolean>(WalletResponseFailureType.UNSUPPORTED_TYPE, false);
  }

  async addEstablish(options: AddEstablishOptions): Promise<AddEstablishResponse> {
    const adena = this.getAdena();
    const name = options.siteName || '';
    const response = await adena.AddEstablish(name);
    const succeed =
      isSuccessType(response.type) || response.type === WalletResponseFailureType.ALREADY_CONNECTED.toString();

    if (succeed) {
      return makeResponseMessage<boolean>(WalletResponseSuccessType.CONNECTION_SUCCESS, succeed);
    }
    return mapResponseByAdenaResponse(response, false);
  }

  async getAccount(): Promise<GetAccountResponse> {
    const adena = this.getAdena();
    const response = await adena.GetAccount();
    const accountInfo: AccountInfo = {
      ...response.data,
    };

    return mapResponseByAdenaResponse<AccountInfo>(response, accountInfo);
  }

  async getNetwork(): Promise<GetNetworkResponse> {
    const adena = this.getAdena();
    const response = await adena.GetNetwork();
    const networkInfo: NetworkInfo = response.data;

    return mapResponseByAdenaResponse<NetworkInfo>(response, networkInfo);
  }

  async switchNetwork(options: SwitchNetworkOptions): Promise<SwitchNetworkResponse> {
    const adena = this.getAdena();
    const response = await adena.SwitchNetwork(options.chainId);

    return mapResponseByAdenaResponse(response);
  }

  async addNetwork(options: AddNetworkOptions): Promise<AddNetworkResponse> {
    const adena = this.getAdena();
    const response = await adena.AddNetwork(options);

    return mapResponseByAdenaResponse(response);
  }

  async signTransaction(options: SignTransactionOptions): Promise<SignTransactionResponse> {
    const adena = this.getAdena();
    const response = await adena.SignTx(mapTxToTransactionParams(options.tx));

    return mapResponseByAdenaResponse(response, response.data);
  }

  async broadcastTransaction(options: BroadcastTransactionOptions): Promise<BroadcastTransactionResponse> {
    const adena = this.getAdena();
    const response = await adena.DoContract(mapTxToTransactionParams(options.tx));
    const transactionResult = response.data;

    return mapResponseByAdenaResponse(response, transactionResult);
  }

  onChangeAccount(options: OnChangeAccountOptions): OnChangeAccountResponse {
    const adena = this.getAdena();
    adena.On('changedAccount', options.callback);
  }

  onChangeNetwork(options: OnChangeNetworkOptions): OnChangeNetworkResponse {
    const adena = this.getAdena();
    adena.On('changedNetwork', options.callback);
  }
}
