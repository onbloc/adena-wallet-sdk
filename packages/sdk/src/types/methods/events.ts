export type OnAccountChangeFunc = (address: string) => void;
export type OnNetworkChangeFunc = (network: string) => void;

export enum OnEventType {
	CHANGED_ACCOUNT = "changedAccount",
	CHANGED_NETWORK = "changedNetwork",
}

type OnEventFunc = OnAccountChangeFunc | OnNetworkChangeFunc;

export type AdenaOnEvent = (event: OnEventType, func: OnEventFunc) => void;
