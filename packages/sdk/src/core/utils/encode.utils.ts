import { Tx, uint8ArrayToBase64 } from '@gnolang/tm2-js-client';

export const hexToUint8Array = (hexString: string) => {
  const adjustString = hexString.replace('0x', '');
  return Uint8Array.from(Buffer.from(adjustString, 'hex'));
};

/**
 * encode a transaction to base64
 *
 * @param transaction
 * @returns
 */
export const encodeTransaction = (transaction: Tx): string => {
  return uint8ArrayToBase64(Tx.encode(transaction).finish());
};
