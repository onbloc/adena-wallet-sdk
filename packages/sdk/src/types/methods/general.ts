import { IAdenaResponse } from "../common";

export enum AddEstablishResponseType {
	CONNECTION_SUCCESS = "CONNECTION_SUCCESS",
	ALREADY_CONNECTED = "ALREADY_CONNECTED",
}

export type AddEstablishResponse = IAdenaResponse<AddEstablishResponseType, {}>;

export type AdenaAddEstablish = (name: string) => Promise<AddEstablishResponse>;

enum GetAccountResponseType {
	GET_ACCOUNT = "GET_ACCOUNT",
	NO_ACCOUNT = "NO_ACCOUNT",
	WALLET_LOCKED = "WALLET_LOCKED",
}

enum EAccountStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "IN_ACTIVE",
}

export type GetAccountResponseData = {
	accountNumber: string;
	address: string;
	coins: string;
	chainId: string;
	sequence: string;
	status: EAccountStatus;
	public_key: {
		"@type": string;
		value: string;
	};
};

type GetAccountResponse = IAdenaResponse<GetAccountResponseType, GetAccountResponseData>;

export type AdenaGetAccount = () => Promise<GetAccountResponse>;
