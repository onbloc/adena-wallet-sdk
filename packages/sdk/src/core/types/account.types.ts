export type AccountStatusType = 'ACTIVE' | 'IN_ACTIVE';

export type AccountInfo = {
  accountNumber: string;
  address: string;
  coins: string;
  chainId: string;
  sequence: string;
  status: AccountStatusType;
  public_key: {
    '@type': string;
    value: string;
  };
};
