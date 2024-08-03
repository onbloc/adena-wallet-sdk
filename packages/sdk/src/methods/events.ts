import { OnAccountChangeFunc, OnEventType, OnNetworkChangeFunc } from "../types/methods/events";
import { getAdena } from "../utils";

/**
 * Add a listener on connected account changes
 * @async
 * @param {OnAccountChangeFunc} func - Function to call on a new event
 * @returns Nothing, throws an error if it fails
 */
export const onAccountChange = async (func: OnAccountChangeFunc): Promise<void> => {
	const adena = getAdena();

	adena.On(OnEventType.CHANGED_ACCOUNT, func);
};

/**
 * Add a listener on network changes
 * @async
 * @param {OnNetworkChangeFunc} func - Function to call on a new event
 * @returns Nothing, throws an error if it fails
 */
export const onNetworkChange = async (func: OnNetworkChangeFunc): Promise<void> => {
	const adena = getAdena();

	adena.On(OnEventType.CHANGED_NETWORK, func);
};
