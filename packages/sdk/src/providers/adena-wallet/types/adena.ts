import {
  AdenaAddEstablish,
  AdenaAddNetwork,
  AdenaDoContract,
  AdenaGetAccount,
  AdenaGetNetwork,
  AdenaOnEvent,
  AdenaSignTx,
  AdenaSignDocument,
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

  SignDocument: AdenaSignDocument;

  DoContract: AdenaDoContract;

  // Events
  On: AdenaOnEvent;
};
