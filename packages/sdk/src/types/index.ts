import { AdenaOnEvent } from './methods/events';
import { AdenaAddEstablish, AdenaCheckConnection, AdenaGetAccount } from './methods/general';
import { AdenaAddNetwork, AdenaSwitchNetwork } from './methods/network';
import { AdenaDoContract, AdenaSignTx } from './methods/transactions';

export type AdenaWallet = {
  // General
  AddEstablish: AdenaAddEstablish;
  CheckConnection: AdenaCheckConnection;
  GetAccount: AdenaGetAccount;

  // Network
  SwitchNetwork: AdenaSwitchNetwork;
  AddNetwork: AdenaAddNetwork;

  // Transactions
  SignTx: AdenaSignTx;
  DoContract: AdenaDoContract;

  // Events
  On: AdenaOnEvent;
};

export enum EMessageType {
  MSG_SEND = '/bank.MsgSend',
  MSG_CALL = '/vm.m_call',
  MSG_ADD_PKG = '/vm.m_addpkg',
  MSG_RUN = '/vm.m_run',
}
