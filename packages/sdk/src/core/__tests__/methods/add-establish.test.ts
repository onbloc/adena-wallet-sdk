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

  it('should forward chainIds array when provided for multi-chain establish', async () => {
    const mockResponse: AddEstablishResponse = addEstablishSuccessMock;
    mockWalletProvider.addEstablish.mockResolvedValue(mockResponse);

    const multiOptions: AddEstablishOptions = {
      siteName: 'Test Site',
      chainIds: ['atomone-1', 'portal-loop'],
    };

    const response = await addEstablish(mockWalletProvider, multiOptions);

    expect(mockWalletProvider.addEstablish).toHaveBeenCalledWith(multiOptions);
    expect(response).toEqual(mockResponse);
  });

  it('should forward a single string chainId for single-chain establish', async () => {
    const mockResponse: AddEstablishResponse = addEstablishSuccessMock;
    mockWalletProvider.addEstablish.mockResolvedValue(mockResponse);

    const singleOptions: AddEstablishOptions = {
      siteName: 'Test Site',
      chainIds: 'atomone-1',
    };

    const response = await addEstablish(mockWalletProvider, singleOptions);

    expect(mockWalletProvider.addEstablish).toHaveBeenCalledWith(singleOptions);
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
