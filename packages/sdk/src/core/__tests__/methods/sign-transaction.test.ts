import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { signTransaction } from '../../methods';
import { WalletResponseFailureType, WalletResponseRejectType, WalletResponseSuccessType } from '../../types';
import { SignTransactionOptions, SignTransactionResponse } from '../../types/methods/sign-transaction.types'; // Adjust imports based on your actual file structure
import { makeResponseMessage } from '../../utils';

describe('signTransaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call signTransaction with the correct options and return the response', async () => {
    const tx = {
      messages: [],
      signatures: [],
      memo: '',
    };

    const options: SignTransactionOptions = {
      tx,
    };

    const mockResponse: SignTransactionResponse = makeResponseMessage(WalletResponseSuccessType.SIGN_SUCCESS, {
      encodedTransaction: '',
    });

    mockWalletProvider.signTransaction.mockResolvedValue(mockResponse);

    const response = await signTransaction(mockWalletProvider, options);

    expect(mockWalletProvider.signTransaction).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });

  it('should handle failure response', async () => {
    const tx = {
      messages: [],
      signatures: [],
      memo: '',
    };

    const options: SignTransactionOptions = {
      tx,
    };

    const mockResponse: SignTransactionResponse = makeResponseMessage(WalletResponseFailureType.SIGN_FAILED, {
      encodedTransaction: '',
    });

    mockWalletProvider.signTransaction.mockResolvedValue(mockResponse);

    const response = await signTransaction(mockWalletProvider, options);

    expect(mockWalletProvider.signTransaction).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });

  it('should handle rejected response', async () => {
    const tx = {
      messages: [],
      signatures: [],
      memo: '',
    };

    const options: SignTransactionOptions = {
      tx,
    };

    const mockResponse: SignTransactionResponse = makeResponseMessage(WalletResponseRejectType.SIGN_REJECTED, {
      encodedTransaction: '',
    });

    mockWalletProvider.signTransaction.mockResolvedValue(mockResponse);

    const response = await signTransaction(mockWalletProvider, options);

    expect(mockWalletProvider.signTransaction).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });

  it('should handle throw errors', async () => {
    const tx = {
      messages: [],
      signatures: [],
      memo: '',
    };

    const options: SignTransactionOptions = {
      tx,
    };

    const mockError = new Error('Failed to sign transaction');
    mockWalletProvider.signTransaction.mockRejectedValue(mockError);

    await expect(signTransaction(mockWalletProvider, options)).rejects.toThrow('Failed to sign transaction');
  });
});
