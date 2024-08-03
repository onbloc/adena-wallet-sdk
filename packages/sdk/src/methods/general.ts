import { EAdenaResponseStatus } from "../types/common";
import { getAdena } from "../utils";
import { AddEstablishResponse, AddEstablishResponseType, GetAccountResponseData } from "../types/methods/general";

/**
 * Establish a connection to your site from Adena
 * @async
 * @param {string} name - The name of the website requesting to connect
 * @returns Original Adena response, useful to check if the site was already connected
 */
export const establishConnection = async (name: string): Promise<AddEstablishResponse> => {
	const adena = getAdena();

	// Establish a connection to the wallet
	const response = await adena.AddEstablish(name);

	if (
		response.status === EAdenaResponseStatus.SUCCESS &&
		(response.type === AddEstablishResponseType.ALREADY_CONNECTED ||
			response.type === AddEstablishResponseType.CONNECTION_SUCCESS)
	) {
		// Adena establishes a connection if:
		// - the app was not connected before, and the user approves
		// - the app was connected before
		return response;
	}

	throw new Error(`Unable to establish connection: ${response.message}`);
};

/**
 * Fetch information about the current connected account
 * @async
 * @returns Original Adena response with the account information
 */
export const getAccountInfo = async (): Promise<GetAccountResponseData> => {
	const adena = getAdena();

	const response = await adena.GetAccount();
	if (response.status !== EAdenaResponseStatus.SUCCESS) {
		throw new Error(`Unable to fetch account info: ${response.message}`);
	}

	return response.data;
};
