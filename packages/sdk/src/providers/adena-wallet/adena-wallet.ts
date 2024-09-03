import { WalletProvider } from '../../core/providers';
import { AccountInfo } from '../../core/types';
import {
  AddEstablishOptions,
  AddEstablishResponse,
  AddNetworkOptions,
  AddNetworkResponse,
  BroadcastTransactionOptions,
  BroadcastTransactionResponse,
  GetAccountResponse,
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
import { mapResponseByAdenaResponse } from './mapper.utils';
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

  isConnected(): Promise<IsConnectedResponse> {
    throw new Error('not implements');
  }

  async addEstablish(options: AddEstablishOptions): Promise<AddEstablishResponse> {
    const adena = this.getAdena();
    const name = options.siteName || '';
    const response = await adena.AddEstablish(name);
    const succeed = response.code === 0;

    return mapResponseByAdenaResponse<boolean>(response, succeed);
  }

  async getAccount(): Promise<GetAccountResponse> {
    const adena = this.getAdena();
    const response = await adena.GetAccount();
    const accountInfo: AccountInfo = response.data;

    return mapResponseByAdenaResponse<AccountInfo>(response, accountInfo);
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
    const response = await adena.SignTx(options.transactionData);

    return mapResponseByAdenaResponse(response, response.data);
  }

  async broadcastTransaction(options: BroadcastTransactionOptions): Promise<BroadcastTransactionResponse> {
    const adena = this.getAdena();
    const response = await adena.DoContract(options.transactionData);
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
