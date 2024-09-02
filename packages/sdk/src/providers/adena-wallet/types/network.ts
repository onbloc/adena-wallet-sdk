import { AdenaResponse } from '.';

type AddNetworkParams = {
  chainId: string;
  chainName: string;
  rpcUrl: string;
};

enum AddNetworkResponseType {
  ADD_NETWORK_SUCCESS = 'ADD_NETWORK_SUCCESS',
}

type AddNetworkResponse = AdenaResponse<AddNetworkResponseType, AddNetworkParams>;

export type AdenaAddNetwork = (network: AddNetworkParams) => Promise<AddNetworkResponse>;

export enum SwitchNetworkResponseType {
  SWITCH_NETWORK_SUCCESS = 'SWITCH_NETWORK_SUCCESS',
  REDUNDANT_CHANGE_REQUEST = 'REDUNDANT_CHANGE_REQUEST',
  UNADDED_NETWORK = 'UNADDED_NETWORK',
}

type SwitchNetworkResponseData = {
  chainId: string;
};

type SwitchNetworkResponse = AdenaResponse<SwitchNetworkResponseType, SwitchNetworkResponseData>;

export type AdenaSwitchNetwork = (chainId: string) => Promise<SwitchNetworkResponse>;
