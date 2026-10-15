import { Wallet } from '@gnolang/tm2-js-client';

import {
  MAX_ARBITRARY_MESSAGE_BYTES,
  NetworkInfo,
  WalletResponseFailureType,
  WalletResponseStatus,
  WalletResponseSuccessType,
} from '../../../core';
import { verifyArbitrarySignature } from '../../../core/utils';
import { GnoWalletProvider } from '../gno-wallet';

const MNEMONIC =
  'source bonus chronic canvas draft south burst lottery vacant surface solve popular case indicate oppose farm nothing bullet exhibit title speed wink action roast';
const SIGNER = 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5';

const network: NetworkInfo = {
  chainId: 'test-chain',
  networkName: 'Test',
  rpcUrl: 'http://localhost:26657',
  addressPrefix: 'g',
  indexerUrl: null,
};

describe('GnoWalletProvider.signArbitrary', () => {
  let provider: GnoWalletProvider;

  beforeEach(async () => {
    provider = new GnoWalletProvider(await Wallet.fromMnemonic(MNEMONIC), [network]);
  });

  it('signs a proof bound to the current network that verifies', async () => {
    const response = await provider.signArbitrary({ signer: SIGNER, data: 'hello' });

    expect(response.status).toBe(WalletResponseStatus.SUCCESS);
    expect(response.type).toBe(WalletResponseSuccessType.SIGN_ARBITRARY_SUCCESS);
    expect(response.data?.signed.chain_id).toBe(network.chainId);
    await expect(
      verifyArbitrarySignature(response.data!, { signer: SIGNER, chainId: network.chainId, data: 'hello' })
    ).resolves.toBe(true);
  });

  it('refuses a signer other than the wallet address', async () => {
    const response = await provider.signArbitrary({ signer: 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf6', data: 'a' });

    expect(response.type).toBe(WalletResponseFailureType.ACCOUNT_MISMATCH);
  });

  it.each([
    ['an empty message', ''],
    ['a message over the size limit', 'x'.repeat(MAX_ARBITRARY_MESSAGE_BYTES + 1)],
  ])('refuses %s', async (_, data) => {
    const response = await provider.signArbitrary({ signer: SIGNER, data });

    expect(response.type).toBe(WalletResponseFailureType.INVALID_FORMAT);
  });

  it('refuses when no wallet is connected', async () => {
    const response = await new GnoWalletProvider().signArbitrary({ signer: SIGNER, data: 'hello' });

    expect(response.type).toBe(WalletResponseFailureType.NOT_CONNECTED);
  });
});
