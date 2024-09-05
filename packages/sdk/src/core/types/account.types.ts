export type AccountStatusType = 'ACTIVE' | 'IN_ACTIVE';

export type AccountInfo = {
  accountNumber: string;
  address: string;
  coins: string;
  chainId: string;
  sequence: string;
  status: AccountStatusType;
  publicKey: {
    '@type': string;
    value: string;
  } | null;
};
