export interface WalletState {
  address: string | null;
  connected: boolean;
}

export type WalletConnectionEvent = 'connect' | 'disconnect';

export type WalletListener = (state: WalletState) => void;

export interface WalletResponse<D> {
  code: number;
  status: WalletResponseStatus;
  type: WalletResponseType;
  message: string;
  data: D | null;
}

export enum WalletResponseStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export type WalletResponseType =
  | WalletResponseSuccessType
  | WalletResponseFailureType
  | WalletResponseRejectType
  | WalletResponseExecuteType;

export enum WalletResponseSuccessType {
  CONNECTION_SUCCESS = 'CONNECTION_SUCCESS',
  GET_ACCOUNT_SUCCESS = 'GET_ACCOUNT',
  SIGN_SUCCESS = 'SIGN_TX',
  ADD_NETWORK_SUCCESS = 'ADD_NETWORK_SUCCESS',
  SWITCH_NETWORK_SUCCESS = 'SWITCH_NETWORK_SUCCESS',
  TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS',
}

export enum WalletResponseFailureType {
  NOT_CONNECTED = 'NOT_CONNECTED',
  UNRESOLVED_TRANSACTION_EXISTS = 'UNRESOLVED_TRANSACTION_EXISTS',
  INVALID_FORMAT = 'INVALID_FORMAT',
  WALLET_LOCKED = 'WALLET_LOCKED',
  ACCOUNT_MISMATCH = 'ACCOUNT_MISMATCH',
  NO_ACCOUNT = 'NO_ACCOUNT',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  SIGN_FAILED = 'SIGN_FAILED',
  ALREADY_CONNECTED = 'ALREADY_CONNECTED',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  REDUNDANT_CHANGE_REQUEST = 'REDUNDANT_CHANGE_REQUEST',
  NETWORK_ALREADY_EXISTS = 'NETWORK_ALREADY_EXISTS',
  UNADDED_NETWORK = 'UNADDED_NETWORK',
  UNSUPPORTED_TYPE = 'UNSUPPORTED_TYPE',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

export enum WalletResponseRejectType {
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  SIGN_REJECTED = 'SIGN_REJECTED',
  CONNECTION_REJECTED = 'CONNECTION_REJECTED',
  SWITCH_NETWORK_REJECTED = 'SWITCH_NETWORK_REJECTED',
  ADD_NETWORK_REJECTED = 'ADD_NETWORK_REJECTED',
}

export enum WalletResponseExecuteType {
  ADD_ESTABLISH = 'ADD_ESTABLISH',
  DO_CONTRACT = 'DO_CONTRACT',
  GET_ACCOUNT = 'GET_ACCOUNT',
  SIGN_AMINO = 'SIGN_AMINO',
  SIGN_TX = 'SIGN_TX',
  ADD_NETWORK = 'ADD_NETWORK',
  SWITCH_NETWORK = 'SWITCH_NETWORK',
}

const WalletSuccessMessageInfo: Record<
  WalletResponseSuccessType,
  { code: number; status: WalletResponseStatus; type: WalletResponseType; message: string }
> = {
  CONNECTION_SUCCESS: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.CONNECTION_SUCCESS,
    message: 'The connection has been successfully established.',
  },
  GET_ACCOUNT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.GET_ACCOUNT_SUCCESS,
    message: 'Account information has been successfully returned.',
  },
  SIGN_TX: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.SIGN_SUCCESS,
    message: 'Signature hash has been successfully generated.',
  },
  ADD_NETWORK_SUCCESS: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.ADD_NETWORK_SUCCESS,
    message: 'The network has been successfully added.',
  },
  SWITCH_NETWORK_SUCCESS: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS,
    message: 'The network has been successfully changed.',
  },
  TRANSACTION_SUCCESS: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.TRANSACTION_SUCCESS,
    message: 'Transaction has been successfully executed.',
  },
} as const;

const WalletFailureMessageInfo: Record<
  WalletResponseFailureType,
  { code: number; status: WalletResponseStatus; type: WalletResponseType; message: string }
> = {
  NOT_CONNECTED: {
    code: 1000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.NOT_CONNECTED,
    message: 'A connection has not been established.',
  },
  UNRESOLVED_TRANSACTION_EXISTS: {
    code: 1001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.UNRESOLVED_TRANSACTION_EXISTS,
    message: 'An unresolved transaction pop-up exists.',
  },
  INVALID_FORMAT: {
    code: 1002,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.INVALID_FORMAT,
    message: 'The transaction is in an invalid format.',
  },
  WALLET_LOCKED: {
    code: 2000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.WALLET_LOCKED,
    message: 'Adena is Locked.',
  },
  ACCOUNT_MISMATCH: {
    code: 3001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.ACCOUNT_MISMATCH,
    message: 'The account does not match the caller.',
  },
  NO_ACCOUNT: {
    code: 3002,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.NO_ACCOUNT,
    message: 'No account found on Adena.',
  },
  TRANSACTION_FAILED: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.TRANSACTION_FAILED,
    message: 'Adena could not execute the transaction.',
  },
  SIGN_FAILED: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.SIGN_FAILED,
    message: 'Adena could not generate the signature hash.',
  },
  ALREADY_CONNECTED: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.ALREADY_CONNECTED,
    message: 'The account is already connected to this website.',
  },
  NETWORK_TIMEOUT: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.NETWORK_TIMEOUT,
    message: 'The network response has timed out.',
  },
  REDUNDANT_CHANGE_REQUEST: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.REDUNDANT_CHANGE_REQUEST,
    message: 'Unable to change to the current network.',
  },
  NETWORK_ALREADY_EXISTS: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.NETWORK_ALREADY_EXISTS,
    message: 'The network already exists.',
  },
  UNADDED_NETWORK: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.UNADDED_NETWORK,
    message: 'The network has not been added on Adena.',
  },
  UNSUPPORTED_TYPE: {
    code: 4005,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.UNSUPPORTED_TYPE,
    message: 'Adena does not support the requested transaction type.',
  },
  UNEXPECTED_ERROR: {
    code: 9000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.UNEXPECTED_ERROR,
    message: 'Adena has encountered an unexpected error.',
  },
} as const;

const WalletRejectMessageInfo: Record<
  WalletResponseRejectType,
  { code: number; status: WalletResponseStatus; type: WalletResponseType; message: string }
> = {
  TRANSACTION_REJECTED: {
    code: 4000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseRejectType.TRANSACTION_REJECTED,
    message: 'The transaction has been rejected by the user.',
  },
  SIGN_REJECTED: {
    code: 4000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseRejectType.SIGN_REJECTED,
    message: 'The signature has been rejected by the user.',
  },
  CONNECTION_REJECTED: {
    code: 4000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseRejectType.CONNECTION_REJECTED,
    message: 'The connection request has been rejected by the user.',
  },
  SWITCH_NETWORK_REJECTED: {
    code: 4000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseRejectType.SWITCH_NETWORK_REJECTED,
    message: 'Switching the network has been rejected by the user.',
  },
  ADD_NETWORK_REJECTED: {
    code: 4000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseRejectType.ADD_NETWORK_REJECTED,
    message: 'Adding a network has been rejected by the user.',
  },
} as const;

const WalletExecuteMessageInfo: Record<
  WalletResponseExecuteType,
  { code: number; status: WalletResponseStatus; type: WalletResponseType; message: string }
> = {
  ADD_ESTABLISH: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.ADD_ESTABLISH,
    message: 'Establish Connection.',
  },
  DO_CONTRACT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.DO_CONTRACT,
    message: 'Do Contract.',
  },
  GET_ACCOUNT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.GET_ACCOUNT,
    message: 'Get Account Information.',
  },
  SIGN_AMINO: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.SIGN_AMINO,
    message: 'Sign Amino',
  },
  SIGN_TX: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.SIGN_TX,
    message: 'Sign Transaction',
  },
  ADD_NETWORK: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.ADD_NETWORK,
    message: 'Add Network',
  },
  SWITCH_NETWORK: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.SWITCH_NETWORK,
    message: 'Switch Network',
  },
} as const;

export const WalletMessageInfo: Record<
  WalletResponseType,
  { code: number; status: WalletResponseStatus; type: WalletResponseType; message: string }
> = {
  ...WalletSuccessMessageInfo,
  ...WalletFailureMessageInfo,
  ...WalletRejectMessageInfo,
  ...WalletExecuteMessageInfo,
} as const;
