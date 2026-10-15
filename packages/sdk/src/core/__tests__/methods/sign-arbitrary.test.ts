import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { signArbitrary } from '../../methods';
import { WalletResponseFailureType, WalletResponseRejectType, WalletResponseSuccessType } from '../../types';
import { SignArbitraryOptions, SignArbitraryResponse } from '../../types/methods';
import { makeArbitrarySignDoc, makeResponseMessage } from '../../utils';

const options: SignArbitraryOptions = {
  signer: 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5',
  data: 'hello',
};

describe('signArbitrary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call signArbitrary with the correct options and return the response', async () => {
    const mockResponse: SignArbitraryResponse = makeResponseMessage(WalletResponseSuccessType.SIGN_ARBITRARY_SUCCESS, {
      signed: makeArbitrarySignDoc('gnoland-1', options.signer, options.data),
      signature: { pubKey: { typeUrl: '/tm.PubKeySecp256k1', value: '' }, signature: '' },
    });
    mockWalletProvider.signArbitrary.mockResolvedValue(mockResponse);

    const response = await signArbitrary(mockWalletProvider, options);

    expect(mockWalletProvider.signArbitrary).toHaveBeenCalledWith(options);
    expect(response).toEqual(mockResponse);
  });

  it('should handle failure response', async () => {
    const mockResponse: SignArbitraryResponse = makeResponseMessage(WalletResponseFailureType.ACCOUNT_MISMATCH);
    mockWalletProvider.signArbitrary.mockResolvedValue(mockResponse);

    const response = await signArbitrary(mockWalletProvider, options);

    expect(response).toEqual(mockResponse);
  });

  it('should handle rejected response', async () => {
    const mockResponse: SignArbitraryResponse = makeResponseMessage(WalletResponseRejectType.SIGN_REJECTED);
    mockWalletProvider.signArbitrary.mockResolvedValue(mockResponse);

    const response = await signArbitrary(mockWalletProvider, options);

    expect(response).toEqual(mockResponse);
  });

  it('should handle throw errors', async () => {
    mockWalletProvider.signArbitrary.mockRejectedValue(new Error('Failed to sign arbitrary data'));

    await expect(signArbitrary(mockWalletProvider, options)).rejects.toThrow('Failed to sign arbitrary data');
  });
});
