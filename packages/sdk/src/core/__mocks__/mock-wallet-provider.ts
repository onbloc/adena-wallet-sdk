import { WalletProvider } from '../providers';
import {
  TransactionResultSync,
  WalletResponseFailureType,
  WalletResponseRejectType,
  WalletResponseSuccessType,
} from '../types';
import { makeResponseMessage } from '../utils';

export const defineMockWalletProvider = () => {
  jest.mock('../providers', () => ({
    WalletProvider: jest.fn(() => mockWalletProvider),
  }));
};

export const mockWalletProvider: jest.Mocked<WalletProvider> = {
  isConnected: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS)),
  addEstablish: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS)),
  getAccount: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.GET_ACCOUNT_SUCCESS)),
  getNetwork: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.GET_NETWORK_SUCCESS)),
  switchNetwork: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS)),
  addNetwork: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.ADD_NETWORK_SUCCESS)),
  signTransaction: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.SIGN_SUCCESS)),
  broadcastTransaction: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.TRANSACTION_SUCCESS)),
  onChangeAccount: jest.fn().mockImplementation(() => {
    return;
  }),
  onChangeNetwork: jest.fn().mockImplementation(() => {
    return;
  }),
};

export const isConnectedSuccessMock = makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS, true);

export const isConnectedFailureMock = makeResponseMessage(WalletResponseFailureType.ALREADY_CONNECTED, false);

export const addEstablishSuccessMock = makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS, true);

export const addEstablishFailureMock = makeResponseMessage(WalletResponseFailureType.ALREADY_CONNECTED, false);

export const addEstablishRejectMock = makeResponseMessage(WalletResponseRejectType.CONNECTION_REJECTED, false);

export const getAccountSuccessMock = makeResponseMessage(WalletResponseSuccessType.GET_ACCOUNT_SUCCESS);

export const getNetworkSuccessMock = makeResponseMessage(WalletResponseSuccessType.GET_NETWORK_SUCCESS);

export const switchNetworkSuccessMock = makeResponseMessage(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS);

export const addNetworkSuccessMock = makeResponseMessage<void>(WalletResponseSuccessType.ADD_NETWORK_SUCCESS);

export const addNetworkFailureMock = makeResponseMessage<void>(WalletResponseFailureType.UNADDED_NETWORK);

export const addNetworkRejectMock = makeResponseMessage<void>(WalletResponseRejectType.SWITCH_NETWORK_REJECTED);

export const signTransactionSuccessMock = makeResponseMessage(WalletResponseSuccessType.SIGN_SUCCESS);

export const broadcastTransactionSuccessMock = makeResponseMessage<TransactionResultSync>(
  WalletResponseSuccessType.TRANSACTION_SUCCESS
);

export const broadcastTransactionFailureMock = makeResponseMessage<TransactionResultSync>(
  WalletResponseFailureType.TRANSACTION_FAILED
);

export const onChangeAccountSuccessMock = makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS);

export const onChangeNetworkSuccessMock = makeResponseMessage(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS);
