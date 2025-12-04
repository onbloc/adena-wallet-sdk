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
  GET_NETWORK_SUCCESS = 'GET_NETWORK',
  SIGN_SUCCESS = 'SIGN_TX',
  CREATE_MULTISIG_ACCOUNT_SUCCESS = 'CREATE_MULTISIG_ACCOUNT',
  CREATE_MULTISIG_DOCUMENT_SUCCESS = 'CREATE_MULTISIG_DOCUMENT',
  SIGN_MULTISIG_DOCUMENT_SUCCESS = 'SIGN_MULTISIG_DOCUMENT',
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
  SIGN_MULTISIG_DOCUMENT_FAILED = 'SIGN_MULTISIG_DOCUMENT_FAILED',
  CREATE_MULTISIG_ACCOUNT_FAILED = 'CREATE_MULTISIG_ACCOUNT_FAILED',
  CREATE_MULTISIG_DOCUMENT_FAILED = 'CREATE_MULTISIG_DOCUMENT_FAILED',
  INVALID_MULTISIG_SIGNERS = 'INVALID_MULTISIG_SIGNERS',
  INVALID_MULTISIG_ADDRESS = 'INVALID_MULTISIG_ADDRESS',
  INVALID_MULTISIG_THRESHOLD = 'INVALID_MULTISIG_THRESHOLD',
  ALREADY_CONNECTED = 'ALREADY_CONNECTED',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  REDUNDANT_CHANGE_REQUEST = 'REDUNDANT_CHANGE_REQUEST',
  NETWORK_ALREADY_EXISTS = 'NETWORK_ALREADY_EXISTS',
  UNADDED_NETWORK = 'UNADDED_NETWORK',
  UNSUPPORTED_TYPE = 'UNSUPPORTED_TYPE',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  NOT_INITIALIZED_NETWORK = 'NOT_INITIALIZED_NETWORK',
}

export enum WalletResponseRejectType {
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  SIGN_REJECTED = 'SIGN_REJECTED',
  SIGN_MULTISIG_DOCUMENT_REJECTED = 'SIGN_MULTISIG_DOCUMENT_REJECTED',
  CREATE_MULTISIG_ACCOUNT_REJECTED = 'CREATE_MULTISIG_ACCOUNT_REJECTED',
  CREATE_MULTISIG_DOCUMENT_REJECTED = 'CREATE_MULTISIG_DOCUMENT_REJECTED',
  CONNECTION_REJECTED = 'CONNECTION_REJECTED',
  SWITCH_NETWORK_REJECTED = 'SWITCH_NETWORK_REJECTED',
  ADD_NETWORK_REJECTED = 'ADD_NETWORK_REJECTED',
}

export enum WalletResponseExecuteType {
  ADD_ESTABLISH = 'ADD_ESTABLISH',
  DO_CONTRACT = 'DO_CONTRACT',
  GET_ACCOUNT = 'GET_ACCOUNT',
  GET_NETWORK = 'GET_NETWORK',
  SIGN_AMINO = 'SIGN_AMINO',
  SIGN_TX = 'SIGN_TX',
  SIGN_MULTISIG_DOCUMENT = 'SIGN_MULTISIG_DOCUMENT',
  CREATE_MULTISIG_ACCOUNT = 'CREATE_MULTISIG_ACCOUNT',
  CREATE_MULTISIG_DOCUMENT = 'CREATE_MULTISIG_DOCUMENT',
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
  GET_NETWORK: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.GET_NETWORK_SUCCESS,
    message: 'Network information has been successfully returned.',
  },
  SIGN_TX: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.SIGN_SUCCESS,
    message: 'Signature hash has been successfully generated.',
  },
  SIGN_MULTISIG_DOCUMENT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.SIGN_MULTISIG_DOCUMENT_SUCCESS,
    message: 'Signature hash has been successfully generated.',
  },
  CREATE_MULTISIG_ACCOUNT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.CREATE_MULTISIG_ACCOUNT_SUCCESS,
    message: 'Multisig account has been successfully created.',
  },
  CREATE_MULTISIG_DOCUMENT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.CREATE_MULTISIG_DOCUMENT_SUCCESS,
    message: 'Multisig document has been successfully created.',
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
  INVALID_MULTISIG_SIGNERS: {
    code: 1003,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.INVALID_MULTISIG_SIGNERS,
    message: 'At least 2 signers are required for multisig.',
  },
  INVALID_MULTISIG_ADDRESS: {
    code: 1004,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.INVALID_MULTISIG_ADDRESS,
    message: 'One or more signer addresses are invalid.',
  },
  INVALID_MULTISIG_THRESHOLD: {
    code: 1005,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.INVALID_MULTISIG_THRESHOLD,
    message: 'Threshold must be between 1 and the number of signers.',
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
  SIGN_MULTISIG_DOCUMENT_FAILED: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.SIGN_MULTISIG_DOCUMENT_FAILED,
    message: 'Adena could not generate the signature hash.',
  },
  CREATE_MULTISIG_ACCOUNT_FAILED: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.CREATE_MULTISIG_ACCOUNT_FAILED,
    message: 'Adena could not create the multisig account.',
  },
  CREATE_MULTISIG_DOCUMENT_FAILED: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.CREATE_MULTISIG_DOCUMENT_FAILED,
    message: 'Adena could not create the multisig document.',
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
  NOT_INITIALIZED_NETWORK: {
    code: 4001,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseFailureType.NOT_INITIALIZED_NETWORK,
    message: 'The network has not been initialized on Wallet.',
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
  SIGN_MULTISIG_DOCUMENT_REJECTED: {
    code: 4000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseRejectType.SIGN_REJECTED,
    message: 'The signature has been rejected by the user.',
  },
  CREATE_MULTISIG_ACCOUNT_REJECTED: {
    code: 4000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseRejectType.CREATE_MULTISIG_ACCOUNT_REJECTED,
    message: 'Creating multisig account has been rejected by the user.',
  },
  CREATE_MULTISIG_DOCUMENT_REJECTED: {
    code: 4000,
    status: WalletResponseStatus.FAILURE,
    type: WalletResponseRejectType.CREATE_MULTISIG_DOCUMENT_REJECTED,
    message: 'Creating multisig document has been rejected by the user.',
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
  GET_NETWORK: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.GET_NETWORK,
    message: 'Get Network Information.',
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
  SIGN_MULTISIG_DOCUMENT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.SIGN_MULTISIG_DOCUMENT,
    message: 'Sign Document',
  },
  CREATE_MULTISIG_ACCOUNT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.CREATE_MULTISIG_ACCOUNT,
    message: 'Create Multisig Account',
  },
  CREATE_MULTISIG_DOCUMENT: {
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseExecuteType.CREATE_MULTISIG_DOCUMENT,
    message: 'Create Multisig Document',
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
