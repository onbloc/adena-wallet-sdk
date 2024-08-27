export type TAdenaResponseStatus = 'success' | 'failure';

export interface IAdenaResponse<T, D> {
  code: number;
  status: TAdenaResponseStatus;
  type: T;
  message: string;
  data: D;
}

export const ADENA_SUCCESS_CODE = 0;
