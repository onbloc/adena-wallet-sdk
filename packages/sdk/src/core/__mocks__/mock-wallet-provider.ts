import { WalletProvider } from '../providers';
import { WalletResponseFailureType, WalletResponseStatus, WalletResponseSuccessType } from '../types';

export const mockWalletProvider: jest.Mocked<WalletProvider> = {
  isConnected: jest.fn().mockResolvedValue({
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.CONNECTION_SUCCESS,
    message: 'Wallet is connected',
    data: null,
  }),
  addEstablish: jest.fn().mockResolvedValue({
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.CONNECTION_SUCCESS,
    message: 'Connection established',
    data: null,
  }),
  getAccount: jest.fn().mockResolvedValue({
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.GET_ACCOUNT_SUCCESS,
    message: 'Account retrieved',
    data: { address: 'mock-address', connected: true },
  }),
  switchNetwork: jest.fn().mockResolvedValue({
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS,
    message: 'Network switched',
    data: null,
  }),
  addNetwork: jest.fn().mockResolvedValue({
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.ADD_NETWORK_SUCCESS,
    message: 'Network added',
    data: null,
  }),
  signTransaction: jest.fn().mockResolvedValue({
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.SIGN_SUCCESS,
    message: 'Transaction signed',
    data: 'mock-signed-transaction',
  }),
  broadcastTransaction: jest.fn().mockResolvedValue({
    code: 0,
    status: WalletResponseStatus.SUCCESS,
    type: WalletResponseSuccessType.TRANSACTION_SUCCESS,
    message: 'Transaction broadcasted',
    data: { result: 'mock-result' },
  }),
  onChangeAccount: jest.fn().mockImplementation(() => {
    return {
      code: 0,
      status: WalletResponseStatus.SUCCESS,
      type: WalletResponseSuccessType.CONNECTION_SUCCESS,
      message: 'Account change listener added',
      data: null,
    };
  }),
  onChangeNetwork: jest.fn().mockImplementation(() => {
    return {
      code: 0,
      status: WalletResponseStatus.SUCCESS,
      type: WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS,
      message: 'Network change listener added',
      data: null,
    };
  }),
};

jest.mock('../providers', () => ({
  WalletProvider: jest.fn(() => mockWalletProvider),
}));

export const isConnectedSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.CONNECTION_SUCCESS,
  message: '',
  data: true,
};

export const isConnectedFailureMock = {
  code: 4000,
  status: WalletResponseStatus.FAILURE,
  type: WalletResponseFailureType.ALREADY_CONNECTED,
  message: '',
  data: false,
};

export const addEstablishSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.CONNECTION_SUCCESS,
  message: '',
  data: null,
};

export const addEstablishFailureMock = {
  code: 4000,
  status: WalletResponseStatus.FAILURE,
  type: WalletResponseFailureType.ALREADY_CONNECTED,
  message: '',
  data: null,
};

export const getAccountSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.GET_ACCOUNT_SUCCESS,
  message: '',
  data: { address: '' },
};

export const switchNetworkSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS,
  message: '',
  data: null,
};

export const addNetworkSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.ADD_NETWORK_SUCCESS,
  message: '',
  data: null,
};

export const signTransactionSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.SIGN_SUCCESS,
  message: '',
  data: '',
};

export const broadcastTransactionSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.TRANSACTION_SUCCESS,
  message: '',
  data: { result: '' },
};

export const onChangeAccountSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.CONNECTION_SUCCESS,
  message: '',
  data: null,
};

export const onChangeNetworkSuccessMock = {
  code: 0,
  status: WalletResponseStatus.SUCCESS,
  type: WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS,
  message: '',
  data: null,
};
