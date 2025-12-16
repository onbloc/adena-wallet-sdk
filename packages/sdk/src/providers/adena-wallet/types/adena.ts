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
  AdenaCreateMultisigAccount,
  AdenaCreateMultisigTransaction,
  AdenaSignMultisigTransaction,
  AdenaBroadcastMultisigTransaction,
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

  // Multisig
  CreateMultisigAccount: AdenaCreateMultisigAccount;

  CreateMultisigTransaction: AdenaCreateMultisigTransaction;

  SignMultisigTransaction: AdenaSignMultisigTransaction;

  BroadcastMultisigTransaction: AdenaBroadcastMultisigTransaction;

  // Events
  On: AdenaOnEvent;
};
