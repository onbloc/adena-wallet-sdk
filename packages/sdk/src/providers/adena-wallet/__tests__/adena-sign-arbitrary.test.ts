import {
  WalletResponseFailureType,
  WalletResponseStatus,
  WalletResponseSuccessType,
  makeArbitrarySignDoc,
  makeResponseMessage,
} from '../../../core';
import { AdenaWalletProvider } from '../adena-wallet';
import { AdenaWallet, SignArbitraryResponse } from '../types';

const SIGNER = 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5';

function installAdena(adena: Partial<AdenaWallet>): void {
  Object.defineProperty(global, 'window', { value: { adena }, configurable: true, writable: true });
}

describe('AdenaWalletProvider.signArbitrary', () => {
  afterEach(() => {
    delete (global as { window?: unknown }).window;
  });

  it('forwards signer and data and maps the extension response', async () => {
    // Shape the extension answers with on approval
    const extensionResponse = {
      code: 0,
      status: 'success',
      type: 'SIGN_ARBITRARY',
      message: '',
      data: {
        signed: makeArbitrarySignDoc('gnoland-1', SIGNER, 'hello'),
        signature: { pubKey: { typeUrl: '/tm.PubKeySecp256k1', value: 'AQ==' }, signature: 'AQ==' },
      },
    } as unknown as SignArbitraryResponse;
    const SignArbitrary = jest.fn().mockResolvedValue(extensionResponse);
    installAdena({ SignArbitrary });

    const response = await new AdenaWalletProvider().signArbitrary({ signer: SIGNER, data: 'hello' });

    expect(SignArbitrary).toHaveBeenCalledWith({ signer: SIGNER, data: 'hello' });
    expect(response).toEqual({
      code: 0,
      status: WalletResponseStatus.SUCCESS,
      type: WalletResponseSuccessType.SIGN_ARBITRARY_SUCCESS,
      message: '',
      data: extensionResponse.data,
    });
  });

  it('passes a failure from the extension through', async () => {
    const failure = makeResponseMessage(WalletResponseFailureType.ACCOUNT_MISMATCH, {});
    installAdena({ SignArbitrary: jest.fn().mockResolvedValue(failure) });

    const response = await new AdenaWalletProvider().signArbitrary({ signer: SIGNER, data: 'hello' });

    expect(response.type).toBe(WalletResponseFailureType.ACCOUNT_MISMATCH);
    expect(response.status).toBe(WalletResponseStatus.FAILURE);
  });

  it('answers UNSUPPORTED_TYPE when the extension predates SignArbitrary', async () => {
    installAdena({});

    const response = await new AdenaWalletProvider().signArbitrary({ signer: SIGNER, data: 'hello' });

    expect(response.type).toBe(WalletResponseFailureType.UNSUPPORTED_TYPE);
  });
});
