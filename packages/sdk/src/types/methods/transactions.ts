import { MsgAddPackage, MsgCall, MsgSend } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";
import { BroadcastTxCommitResult } from "@gnolang/tm2-js-client";

import { IAdenaResponse } from "../common";
import { EMessageType } from "../index";

type TMessage = MsgAddPackage | MsgCall | MsgSend | MsgRun;

export type ContractMessage = {
	type: EMessageType;
	value: TMessage;
};

type TransactionParams = {
	messages: ContractMessage[];
	gasFee: number;
	gasWanted: number;
	memo?: string;
};

enum DoContractResponseType {
	TRANSACTION_SENT = "TRANSACTION_SENT",
}

// TODO: BroadcastTxCommitResult isn't correct in case of a VM call
type DoContractResponse = IAdenaResponse<DoContractResponseType, BroadcastTxCommitResult>;

export type AdenaDoContract = (params: TransactionParams) => Promise<DoContractResponse>;

enum SignTxResponseType {
	SIGN_TX = "SIGN_TX",
}

type SignTxResponseData = {
	encodedTransaction: string;
};

type SignTxResponse = IAdenaResponse<SignTxResponseType, SignTxResponseData>;

export type AdenaSignTx = (params: TransactionParams) => Promise<SignTxResponse>;
