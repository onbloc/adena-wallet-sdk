import { AdenaDoContract, AdenaSignTx } from './methods/transactions';
import { AdenaAddNetwork, AdenaSwitchNetwork } from './methods/network';
import { AdenaAddEstablish, AdenaGetAccount } from './methods/general';
import { AdenaOnEvent } from './methods/events';

export type AdenaWallet = {
  // General
  AddEstablish: AdenaAddEstablish;

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
