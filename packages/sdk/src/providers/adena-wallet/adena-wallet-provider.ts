import {
  WalletProvider,
  Response,
  TransactionData,
  BroadcastType,
  TransactionResult,
  TransactionResultSync,
  TransactionResultCommit,
  AccountInfo,
  SingTransaction,
} from '..';
import { AdenaWallet } from './types';
import { mapResponseByAdenaResponse } from '../utilities';

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

  isConnected(): Promise<Response<void>> {
    throw new Error('not implements');
  }

  async addEstablish(name: string): Promise<Response<void>> {
    const adena = this.getAdena();
    const response = await adena.AddEstablish(name);

    return mapResponseByAdenaResponse(response);
  }

  async getAccount(): Promise<Response<AccountInfo>> {
    const adena = this.getAdena();
    const response = await adena.GetAccount();
    const accountInfo: AccountInfo = response.data;

    return mapResponseByAdenaResponse<AccountInfo>(response, accountInfo);
  }

  async switchNetwork(chainId: string): Promise<Response<void>> {
    const adena = this.getAdena();
    const response = await adena.SwitchNetwork(chainId);

    return mapResponseByAdenaResponse(response);
  }

  async addNetwork(chainId: string, chainName: string, rpcUrl: string): Promise<Response<void>> {
    const adena = this.getAdena();
    const response = await adena.AddNetwork({ chainId, chainName, rpcUrl });

    return mapResponseByAdenaResponse(response);
  }

  async signTransaction(transactionData: TransactionData): Promise<Response<SingTransaction>> {
    const adena = this.getAdena();
    const response = await adena.SignTx(transactionData);

    return mapResponseByAdenaResponse(response, response.data);
  }

  async broadcastTransaction(
    transactionData: TransactionData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    broadcastType: BroadcastType = BroadcastType.SYNC
  ): Promise<Response<TransactionResult | TransactionResultSync | TransactionResultCommit>> {
    const adena = this.getAdena();
    const response = await adena.DoContract(transactionData);
    const transactionResult = response.data;

    return mapResponseByAdenaResponse(response, transactionResult);
  }

  onChangeAccount(callback: (address: string) => void): void {
    const adena = this.getAdena();
    adena.On('changedAccount', callback);
  }

  onChangeNetwork(callback: (chainId: string) => void): void {
    const adena = this.getAdena();
    adena.On('changedNetwork', callback);
  }
}
