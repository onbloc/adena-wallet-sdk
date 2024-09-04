import {
  AdenaAddEstablish,
  AdenaAddNetwork,
  AdenaDoContract,
  AdenaGetAccount,
  AdenaOnEvent,
  AdenaSignTx,
  AdenaSwitchNetwork,
} from '.';

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
