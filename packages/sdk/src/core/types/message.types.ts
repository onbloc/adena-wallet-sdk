export type WalletMessageStatusType = 'request' | 'response' | 'common' | 'success' | 'failure';

export type WalletMessageType =
  | WalletSuccessMessageType
  | WalletFailureMessageType
  | WalletRejectMessageType
  | WalletExecuteMessageType;

export enum WalletSuccessMessageType {
  CONNECTION_SUCCESS = 'CONNECTION_SUCCESS',
  GET_ACCOUNT_SUCCESS = 'GET_ACCOUNT_SUCCESS',
  SIGN_SUCCESS = 'SIGN_SUCCESS',
  ADD_NETWORK_SUCCESS = 'ADD_NETWORK_SUCCESS',
  SWITCH_NETWORK_SUCCESS = 'SWITCH_NETWORK_SUCCESS',
  TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS',
}

export enum WalletFailureMessageType {
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

export enum WalletRejectMessageType {
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  SIGN_REJECTED = 'SIGN_REJECTED',
  CONNECTION_REJECTED = 'CONNECTION_REJECTED',
  SWITCH_NETWORK_REJECTED = 'SWITCH_NETWORK_REJECTED',
  ADD_NETWORK_REJECTED = 'ADD_NETWORK_REJECTED',
}

export enum WalletExecuteMessageType {
  ADD_ESTABLISH = 'ADD_ESTABLISH',
  DO_CONTRACT = 'DO_CONTRACT',
  GET_ACCOUNT = 'GET_ACCOUNT',
  SIGN_AMINO = 'SIGN_AMINO',
  SIGN_TX = 'SIGN_TX',
  ADD_NETWORK = 'ADD_NETWORK',
  SWITCH_NETWORK = 'SWITCH_NETWORK',
}

const WalletSuccessMessageInfo: Record<WalletSuccessMessageType, { code: number; description: string }> = {
  CONNECTION_SUCCESS: {
    code: 0,
    description: 'The connection has been successfully established.',
  },
  GET_ACCOUNT_SUCCESS: {
    code: 0,
    description: 'Account information has been successfully returned.',
  },
  SIGN_SUCCESS: {
    code: 0,
    description: 'Signature hash has been successfully generated.',
  },
  ADD_NETWORK_SUCCESS: {
    code: 0,
    description: 'The network has been successfully added.',
  },
  SWITCH_NETWORK_SUCCESS: {
    code: 0,
    description: 'The network has been successfully changed.',
  },
  TRANSACTION_SUCCESS: {
    code: 0,
    description: 'Transaction has been successfully executed.',
  },
} as const;

const WalletFailureMessageInfo: Record<WalletFailureMessageType, { code: number; description: string }> = {
  NOT_CONNECTED: {
    code: 1000,
    description: 'A connection has not been established.',
  },
  UNRESOLVED_TRANSACTION_EXISTS: {
    code: 1001,
    description: 'An unresolved transaction pop-up exists.',
  },
  INVALID_FORMAT: {
    code: 1002,
    description: 'The transaction is in an invalid format.',
  },
  WALLET_LOCKED: {
    code: 2000,
    description: 'Adena is Locked.',
  },
  ACCOUNT_MISMATCH: {
    code: 3001,
    description: 'The account does not match the caller.',
  },
  NO_ACCOUNT: {
    code: 3002,
    description: 'No account found on Adena.',
  },
  TRANSACTION_FAILED: {
    code: 4001,
    description: 'Adena could not execute the transaction.',
  },
  SIGN_FAILED: {
    code: 4001,
    description: 'Adena could not generate the signature hash.',
  },
  ALREADY_CONNECTED: {
    code: 4001,
    description: 'The account is already connected to this website.',
  },
  NETWORK_TIMEOUT: {
    code: 4001,
    description: 'The network response has timed out.',
  },
  REDUNDANT_CHANGE_REQUEST: {
    code: 4001,
    description: 'Unable to change to the current network.',
  },
  NETWORK_ALREADY_EXISTS: {
    code: 4001,
    description: 'The network already exists.',
  },
  UNADDED_NETWORK: {
    code: 4001,
    description: 'The network has not been added on Adena.',
  },
  UNSUPPORTED_TYPE: {
    code: 4005,
    description: 'Adena does not support the requested transaction type.',
  },
  UNEXPECTED_ERROR: {
    code: 9000,
    description: 'Adena has encountered an unexpected error.',
  },
} as const;

const WalletRejectMessageInfo: Record<WalletRejectMessageType, { code: number; description: string }> = {
  TRANSACTION_REJECTED: {
    code: 4000,
    description: 'The transaction has been rejected by the user.',
  },
  SIGN_REJECTED: {
    code: 4000,
    description: 'The signature has been rejected by the user.',
  },
  CONNECTION_REJECTED: {
    code: 4000,
    description: 'The connection request has been rejected by the user.',
  },
  SWITCH_NETWORK_REJECTED: {
    code: 4000,
    description: 'Switching the network has been rejected by the user.',
  },
  ADD_NETWORK_REJECTED: {
    code: 4000,
    description: 'Adding a network has been rejected by the user.',
  },
} as const;

const WalletExecuteMessageInfo: Record<WalletExecuteMessageType, { code: number; description: string }> = {
  ADD_ESTABLISH: {
    code: 0,
    description: 'Establish Connection.',
  },
  DO_CONTRACT: {
    code: 0,
    description: 'Do Contract.',
  },
  GET_ACCOUNT: {
    code: 0,
    description: 'Get Account Information.',
  },
  SIGN_AMINO: {
    code: 0,
    description: 'Sign Amino',
  },
  SIGN_TX: {
    code: 0,
    description: 'Sign Transaction',
  },
  ADD_NETWORK: {
    code: 0,
    description: 'Add Network',
  },
  SWITCH_NETWORK: {
    code: 0,
    description: 'Switch Network',
  },
} as const;

export const WalletMessageInfo: Record<WalletMessageType, { code: number; description: string }> = {
  ...WalletSuccessMessageInfo,
  ...WalletFailureMessageInfo,
  ...WalletRejectMessageInfo,
  ...WalletExecuteMessageInfo,
} as const;
