import { WalletMessageInfo, WalletResponseExecuteType, WalletResponseStatus } from '../../types';

describe('WalletResponseExecuteType — Cosmos entries', () => {
  const cosmosTypes = [
    WalletResponseExecuteType.ENABLE_COSMOS,
    WalletResponseExecuteType.GET_COSMOS_KEY,
    WalletResponseExecuteType.SIGN_COSMOS_AMINO,
    WalletResponseExecuteType.SIGN_COSMOS_DIRECT,
    WalletResponseExecuteType.SEND_COSMOS_TX,
  ];

  it('exposes string-equal enum values for each cosmos execute type', () => {
    expect(WalletResponseExecuteType.ENABLE_COSMOS).toBe('ENABLE_COSMOS');
    expect(WalletResponseExecuteType.GET_COSMOS_KEY).toBe('GET_COSMOS_KEY');
    expect(WalletResponseExecuteType.SIGN_COSMOS_AMINO).toBe('SIGN_COSMOS_AMINO');
    expect(WalletResponseExecuteType.SIGN_COSMOS_DIRECT).toBe('SIGN_COSMOS_DIRECT');
    expect(WalletResponseExecuteType.SEND_COSMOS_TX).toBe('SEND_COSMOS_TX');
  });

  it('registers each cosmos type in WalletMessageInfo with SUCCESS status and code 0', () => {
    for (const type of cosmosTypes) {
      const entry = WalletMessageInfo[type];
      expect(entry).toBeDefined();
      expect(entry.code).toBe(0);
      expect(entry.status).toBe(WalletResponseStatus.SUCCESS);
      expect(entry.type).toBe(type);
      expect(entry.message).toEqual(expect.any(String));
      expect(entry.message.length).toBeGreaterThan(0);
    }
  });
});
