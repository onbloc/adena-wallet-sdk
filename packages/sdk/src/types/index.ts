import { AdenaDoContract, AdenaSignTx } from "./methods/transactions";
import { AdenaAddNetwork, AdenaSwitchNetwork } from "./methods/network";
import { AdenaAddEstablish, AdenaGetAccount } from "./methods/general";
import { AdenaOnEvent } from "./methods/events";

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

export enum EMessageType {
	MSG_SEND = "/bank.MsgSend",
	MSG_CALL = "/vm.m_call",
	MSG_ADD_PKG = "/vm.m_addpkg",
	MSG_RUN = "/vm.m_run",
}
