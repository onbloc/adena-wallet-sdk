import {
  AdenaAddEstablish,
  AdenaAddNetwork,
  AdenaDoContract,
  AdenaGetAccount,
  AdenaGetNetwork,
  AdenaOnEvent,
  AdenaSignTx,
  AdenaSwitchNetwork,
} from '.';

export type AdenaWallet = {
  // General
  AddEstablish: AdenaAddEstablish;

  GetAccount: AdenaGetAccount;

  GetNetwork: AdenaGetNetwork;

  // Network
  SwitchNetwork: AdenaSwitchNetwork;

  AddNetwork: AdenaAddNetwork;

  // Transactions
  SignTx: AdenaSignTx;

  DoContract: AdenaDoContract;

  // Events
  On: AdenaOnEvent;
};
