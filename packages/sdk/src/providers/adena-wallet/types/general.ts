import { AdenaResponse } from '.';

export enum AddEstablishResponseType {
  CONNECTION_SUCCESS = 'CONNECTION_SUCCESS',
  ALREADY_CONNECTED = 'ALREADY_CONNECTED',
}

export type AddEstablishResponse = AdenaResponse<AddEstablishResponseType, Record<string, never>>;

export type AdenaAddEstablish = (name: string) => Promise<AddEstablishResponse>;

enum GetAccountResponseType {
  GET_ACCOUNT = 'GET_ACCOUNT',
  NO_ACCOUNT = 'NO_ACCOUNT',
  WALLET_LOCKED = 'WALLET_LOCKED',
}

enum EAccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'IN_ACTIVE',
}

export type GetAccountResponseData = {
  accountNumber: string;
  address: string;
  coins: string;
  chainId: string;
  sequence: string;
  status: EAccountStatus;
  publicKey: {
    '@type': string;
    value: string;
  } | null;
};

type GetAccountResponse = AdenaResponse<GetAccountResponseType, GetAccountResponseData>;

export type AdenaGetAccount = () => Promise<GetAccountResponse>;

enum GetNetworkResponseType {
  GET_NETWORK_SUCCESS = 'GET_NETWORK_SUCCESS',
  NO_ACCOUNT = 'NO_ACCOUNT',
  WALLET_LOCKED = 'WALLET_LOCKED',
}

export type GetNetworkResponseData = {
  chainId: string;
  networkName: string;
  addressPrefix: string;
  rpcUrl: string;
  indexerUrl: string | null;
};

type GetNetworkResponse = AdenaResponse<GetNetworkResponseType, GetNetworkResponseData>;

export type AdenaGetNetwork = () => Promise<GetNetworkResponse>;
