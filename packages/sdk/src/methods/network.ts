import { getAdena } from "../utils";
import { EAdenaResponseStatus } from "../types/common";
import { SwitchNetworkResponseType } from "../types/methods/network";

/**
 * Switches the Adena network to the given chain ID
 * @async
 * @param {string} chainId - Chain ID
 * @returns Nothing, throws an error if it fails
 */
export const switchNetwork = async (chainId: string): Promise<void> => {
	const adena = getAdena();

	const response = await adena.SwitchNetwork(chainId);
	if (
		(response.status === EAdenaResponseStatus.SUCCESS &&
			response.type === SwitchNetworkResponseType.SWITCH_NETWORK_SUCCESS) ||
		(response.status === EAdenaResponseStatus.FAILURE &&
			response.type === SwitchNetworkResponseType.REDUNDANT_CHANGE_REQUEST)
	) {
		return;
	}

	throw new Error(`Unable to switch Adena network: ${response.message}`);
};

/**
 * Add a custom network to Adena
 * @async
 * @param {string} chainId - Chain ID
 * @param {string} chainName - Chain name
 * @param {string} rpcUrl - Network RPC URL
 * @returns Nothing, throws an error if it fails
 */
export const addNetwork = async (chainId: string, chainName: string, rpcUrl: string): Promise<void> => {
	const adena = getAdena();

	const response = await adena.AddNetwork({ chainId, chainName, rpcUrl });

	if (response.status === EAdenaResponseStatus.SUCCESS) {
		return;
	}

	throw new Error(`Unable to add network ${response.message}`);
};
