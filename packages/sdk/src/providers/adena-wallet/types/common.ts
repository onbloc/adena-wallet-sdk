export type AdenaResponseStatus = 'success' | 'failure';

export interface AdenaResponse<T, D> {
  code: number;
  status: AdenaResponseStatus;
  type: T;
  message: string;
  data: D;
}

export const ADENA_SUCCESS_CODE = 0;
