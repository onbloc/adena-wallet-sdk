import {
  broadcastTransactionFailureMock,
  broadcastTransactionSuccessMock,
  mockWalletProvider,
} from '../../__mocks__/mock-wallet-provider';
import { broadcastTransaction } from '../../methods';
import { BroadcastType } from '../../types';
import { BroadcastTransactionOptions, BroadcastTransactionResponse } from '../../types/methods';

describe('broadcastTransaction', () => {
  const options: BroadcastTransactionOptions = {
    tx: {
      messages: [],
      signatures: [],
      memo: '',
    },
    broadcastType: BroadcastType.SYNC,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call broadcastTransaction with correct options and return the response', async () => {
    const mockResponse: BroadcastTransactionResponse = broadcastTransactionSuccessMock;

    mockWalletProvider.broadcastTransaction.mockResolvedValue(mockResponse);

    const response = await broadcastTransaction(mockWalletProvider, options);

    expect(mockWalletProvider.broadcastTransaction).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });

  it('should handle failure response', async () => {
    const mockResponse: BroadcastTransactionResponse = broadcastTransactionFailureMock;

    mockWalletProvider.broadcastTransaction.mockResolvedValue(mockResponse);

    const response = await broadcastTransaction(mockWalletProvider, options);

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if broadcastTransaction fails', async () => {
    const mockError = new Error('Failed to broadcast transaction');
    mockWalletProvider.broadcastTransaction.mockRejectedValue(mockError);

    await expect(broadcastTransaction(mockWalletProvider, options)).rejects.toThrow('Failed to broadcast transaction');
  });
});
