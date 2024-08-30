import {
  WalletResponse,
  WalletResponseFailedType,
  WalletResponseStatus,
  WalletResponseSuccessType,
  WalletResponseType,
  WalletResponseRejectedType,
} from '../../types';
import { AdenaResponse, AdenaResponseStatus } from '../adena-wallet';

export function isSuccessType(type: WalletResponseType | string): type is WalletResponseSuccessType {
  return Object.values(WalletResponseSuccessType).includes(type as WalletResponseSuccessType);
}

export function isFailedType(type: WalletResponseType | string): type is WalletResponseFailedType {
  return Object.values(WalletResponseFailedType).includes(type as WalletResponseFailedType);
}

export function isRejectType(type: WalletResponseType | string): type is WalletResponseRejectedType {
  return Object.values(WalletResponseRejectedType).includes(type as WalletResponseRejectedType);
}

function mapResponseStatus(status: AdenaResponseStatus): WalletResponseStatus {
  if (status === 'success') {
    return WalletResponseStatus.SUCCESS;
  }

  return WalletResponseStatus.FAILURE;
}

function mapResponseType(type: string): WalletResponseType {
  if (!isSuccessType(type) && !isFailedType(type) && !isRejectType(type)) {
    throw new Error('is not response type');
  }
  return type;
}

export function mapResponseByAdenaResponse<ProviderResponseData = unknown>(
  response: AdenaResponse<string, unknown>,
  data?: ProviderResponseData
): WalletResponse<ProviderResponseData> {
  return {
    code: response.code,
    status: mapResponseStatus(response.status),
    type: mapResponseType(response.type),
    message: response.message,
    data: data as ProviderResponseData,
  };
}
