import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { getAccount } from '../../methods';
import { WalletResponseSuccessType } from '../../types';
import { GetAccountResponse } from '../../types/methods';
import { makeResponseMessage } from '../../utils';

describe('getAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getAccount and return the response', async () => {
    const mockResponse: GetAccountResponse = makeResponseMessage(WalletResponseSuccessType.GET_ACCOUNT_SUCCESS, {
      accountNumber: '123456',
      address: 'test-address',
      coins: '1000',
      chainId: 'test-chain-id',
      sequence: '1',
      status: 'ACTIVE' as const,
      publicKey: {
        '@type': 'type',
        value: 'public-key-value',
      },
    });

    mockWalletProvider.getAccount.mockResolvedValue(mockResponse);

    const response = await getAccount(mockWalletProvider);

    expect(mockWalletProvider.getAccount).toHaveBeenCalled();
    expect(response).toEqual(mockResponse);
  });

  it('should handle errors when getAccount fails', async () => {
    const mockError = new Error('Failed to get account');
    mockWalletProvider.getAccount.mockRejectedValue(mockError);

    await expect(getAccount(mockWalletProvider)).rejects.toThrow('Failed to get account');
  });
});
