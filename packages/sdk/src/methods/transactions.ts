import { BroadcastTxCommitResult } from "@gnolang/tm2-js-client";

import { getAdena } from "../utils";
import { EAdenaResponseStatus } from "../types/common";
import { ContractMessage } from "../types/methods/transactions";

const DEFAULT_GAS_FEE = 1000000;
const DEFAULT_GAS_LIMIT = 5000000;

/**
 * Sign, then send a transaction crafted by a web-app
 * @async
 * @param {ContractMessage[]} messages - Messages to send in the transaction
 * @param {number} gasFee - Actual network fee to pay (in ugnot)
 * @param {number} gasWanted - Gas limit (in ugnot)
 * @param {string} memo - Transaction memo (tag)
 * @returns {BroadcastTxCommitResult} Result of the broadcast transaction
 */
export const signAndSendTransaction = async (
	messages: ContractMessage[],
	gasFee: number = DEFAULT_GAS_FEE,
	gasWanted: number = DEFAULT_GAS_LIMIT,
	memo?: string,
): Promise<BroadcastTxCommitResult> => {
	const adena = getAdena();

	// Sign and send the transaction
	const response = await adena.DoContract({
		messages,
		gasFee,
		gasWanted,
		memo,
	});

	if (response.status !== EAdenaResponseStatus.SUCCESS) {
		throw new Error(`Unable to send transaction: ${response.message}`);
	}

	return response.data;
};

/**
 * Sign a transaction crafted by a web-app
 * @async
 * @param {ContractMessage[]} messages - Messages to send in the transaction
 * @param {number} gasFee - Actual network fee to pay (in ugnot)
 * @param {number} gasWanted - Gas limit (in ugnot)
 * @param {string} memo - Transaction memo (tag)
 * @returns {string} Encoded transaction
 */
export const signTransaction = async (
	messages: ContractMessage[],
	gasFee: number = DEFAULT_GAS_FEE,
	gasWanted: number = DEFAULT_GAS_LIMIT,
	memo?: string,
): Promise<string> => {
	const adena = getAdena();

	// Sign the transaction
	const response = await adena.SignTx({
		messages,
		gasFee,
		gasWanted,
		memo,
	});

	if (response.status !== EAdenaResponseStatus.SUCCESS) {
		throw new Error(`Unable to sign transaction ${response.message}`);
	}

	return response.data.encodedTransaction;
};
