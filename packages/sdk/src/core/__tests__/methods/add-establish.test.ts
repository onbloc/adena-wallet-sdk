import {
  addEstablishFailureMock,
  addEstablishRejectMock,
  addEstablishSuccessMock,
  mockWalletProvider,
} from '../../__mocks__/mock-wallet-provider';
import { addEstablish } from '../../methods';
import { AddEstablishOptions, AddEstablishResponse } from '../../types/methods';

describe('addEstablish', () => {
  const options: AddEstablishOptions = {
    siteName: 'Test Site',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call addEstablish with correct options and return the response', async () => {
    const mockResponse: AddEstablishResponse = addEstablishSuccessMock;
    mockWalletProvider.addEstablish.mockResolvedValue(mockResponse);

    const response = await addEstablish(mockWalletProvider, options);

    expect(mockWalletProvider.addEstablish).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });

  it('should handle failure response', async () => {
    const mockResponse: AddEstablishResponse = addEstablishFailureMock;
    mockWalletProvider.addEstablish.mockResolvedValue(mockResponse);

    const response = await addEstablish(mockWalletProvider, options);

    expect(response).toEqual(mockResponse);
  });

  it('should handle reject response', async () => {
    const mockResponse: AddEstablishResponse = addEstablishRejectMock;
    mockWalletProvider.addEstablish.mockResolvedValue(mockResponse);

    const response = await addEstablish(mockWalletProvider, options);

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if addEstablish fails', async () => {
    const mockError = new Error('Failed to establish connection');

    mockWalletProvider.addEstablish.mockRejectedValue(mockError);

    await expect(addEstablish(mockWalletProvider, options)).rejects.toThrow('Failed to establish connection');
  });
});
