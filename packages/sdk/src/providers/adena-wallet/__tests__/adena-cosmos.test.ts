import { WalletResponseExecuteType, WalletResponseStatus } from '../../../core/types';
import type {
  AdenaCosmos,
  AdenaWallet,
  CosmosKey,
  EnableCosmosResponse,
  GetCosmosKeyResponse,
  SendCosmosTxResponse,
  SignCosmosAminoResponse,
  SignCosmosDirectResponse,
} from '../types';

describe('AdenaWallet.cosmos type surface', () => {
  it('accepts objects without cosmos (backward compat)', () => {
    const wallet = {
      AddEstablish: jest.fn(),
      GetAccount: jest.fn(),
      GetNetwork: jest.fn(),
      SwitchNetwork: jest.fn(),
      AddNetwork: jest.fn(),
      SignTx: jest.fn(),
      SignDocument: jest.fn(),
      DoContract: jest.fn(),
      CreateMultisigAccount: jest.fn(),
      CreateMultisigTransaction: jest.fn(),
      SignMultisigTransaction: jest.fn(),
      BroadcastMultisigTransaction: jest.fn(),
      On: jest.fn(),
    } as unknown as AdenaWallet;

    expect(wallet.cosmos).toBeUndefined();
  });

  it('accepts a cosmos implementation conforming to AdenaCosmos', async () => {
    const cosmosKey: CosmosKey = {
      name: 'acc',
      algo: 'secp256k1',
      pubKey: new Uint8Array([1, 2, 3]),
      address: new Uint8Array([4, 5, 6]),
      bech32Address: 'atone1xxxx',
      isNanoLedger: false,
    };

    const enableResponse: EnableCosmosResponse = {
      code: 0,
      status: WalletResponseStatus.SUCCESS,
      type: WalletResponseExecuteType.ENABLE_COSMOS,
      message: 'Enable Cosmos',
      data: null,
    };

    const getKeyResponse: GetCosmosKeyResponse = {
      code: 0,
      status: WalletResponseStatus.SUCCESS,
      type: WalletResponseExecuteType.GET_COSMOS_KEY,
      message: 'Get Cosmos Key',
      data: cosmosKey,
    };

    const signAminoResponse: SignCosmosAminoResponse = {
      code: 0,
      status: WalletResponseStatus.SUCCESS,
      type: WalletResponseExecuteType.SIGN_COSMOS_AMINO,
      message: 'Sign Cosmos Amino',
      data: {
        signed: {
          chain_id: 'atomone-1',
          account_number: '1',
          sequence: '0',
          fee: { amount: [{ denom: 'uatone', amount: '1' }], gas: '200000' },
          msgs: [],
          memo: '',
        },
        signature: {
          pub_key: { type: 'tendermint/PubKeySecp256k1', value: 'AAAA' },
          signature: 'BBBB',
        },
      },
    };

    const signDirectResponse: SignCosmosDirectResponse = {
      code: 0,
      status: WalletResponseStatus.SUCCESS,
      type: WalletResponseExecuteType.SIGN_COSMOS_DIRECT,
      message: 'Sign Cosmos Direct',
      data: {
        signed: {
          bodyBytes: new Uint8Array([1]),
          authInfoBytes: new Uint8Array([2]),
          chainId: 'atomone-1',
          accountNumber: 1n,
        },
        signature: {
          pub_key: { type: 'tendermint/PubKeySecp256k1', value: 'AAAA' },
          signature: 'BBBB',
        },
      },
    };

    const sendTxResponse: SendCosmosTxResponse = {
      code: 0,
      status: WalletResponseStatus.SUCCESS,
      type: WalletResponseExecuteType.SEND_COSMOS_TX,
      message: 'Send Cosmos Transaction',
      data: { txhash: 'DEAD', code: 0, rawLog: '', height: 1 },
    };

    const cosmos: AdenaCosmos = {
      version: '1.0.0',
      enable: jest.fn().mockResolvedValue(enableResponse),
      getKey: jest.fn().mockResolvedValue(getKeyResponse),
      signAmino: jest.fn().mockResolvedValue(signAminoResponse),
      signDirect: jest.fn().mockResolvedValue(signDirectResponse),
      sendTx: jest.fn().mockResolvedValue(sendTxResponse),
      getOfflineSigner: jest.fn(),
      getOfflineSignerOnlyAmino: jest.fn(),
      getOfflineSignerAuto: jest.fn().mockResolvedValue({
        getAccounts: jest.fn(),
        signAmino: jest.fn(),
      }),
    };

    await cosmos.enable('atomone-1');
    await cosmos.enable(['atomone-1', 'atomone-testnet-1']);
    const key = await cosmos.getKey('atomone-1');
    const auto = await cosmos.getOfflineSignerAuto('atomone-1');

    expect(cosmos.enable).toHaveBeenCalledTimes(2);
    expect(key.status).toBe(WalletResponseStatus.SUCCESS);
    expect(key.data?.bech32Address).toBe('atone1xxxx');
    expect(typeof auto.getAccounts).toBe('function');
  });
});
