import { StorageDepositEvent, StorageUnlockEvent } from '../../types';

describe('storage event protos', () => {
  it('round-trips a positive bytes_delta', () => {
    const event = StorageDepositEvent.create({
      bytes_delta: 1024n,
      fee_delta: '1000ugnot',
      pkg_path: 'gno.land/r/demo/x',
    });

    expect(StorageDepositEvent.decode(StorageDepositEvent.encode(event).finish())).toEqual(event);
  });

  /**
   * `StorageUnlockEvent.BytesDelta` is negative on the chain, and TM2 amino
   * encodes Go `int64` as a zig-zag varint — the proto `sint64` wire type. A
   * plain `int64` varint would round-trip through this library but would not
   * match what a node produces.
   */
  it('zig-zag encodes a negative bytes_delta', () => {
    const event = StorageUnlockEvent.create({
      bytes_delta: -1n,
      fee_refund: '1000ugnot',
      pkg_path: 'gno.land/r/demo/x',
      refund_withheld: false,
    });

    const encoded = StorageUnlockEvent.encode(event).finish();

    // field 1, varint → tag 0x08; zig-zag(-1) === 1
    expect(Array.from(encoded.slice(0, 2))).toEqual([0x08, 0x01]);
    expect(StorageUnlockEvent.decode(encoded)).toEqual(event);
  });

  it('serializes bytes_delta as a decimal string in JSON', () => {
    const event = StorageUnlockEvent.create({ bytes_delta: -2048n, fee_refund: '', pkg_path: '' });

    expect(StorageUnlockEvent.toJSON(event)).toMatchObject({ bytes_delta: '-2048' });
    expect(StorageUnlockEvent.fromJSON({ bytes_delta: '-2048' }).bytes_delta).toBe(-2048n);
  });
});
