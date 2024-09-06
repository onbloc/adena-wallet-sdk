import {
  WalletResponse,
  WalletResponseFailureType,
  WalletResponseRejectType,
  WalletResponseStatus,
  WalletResponseSuccessType,
  WalletResponseType,
} from '../../core/types';
import { AdenaResponse, AdenaResponseStatus } from './types';

export function isSuccessType(type: WalletResponseType | string): type is WalletResponseSuccessType {
  const typeValue = type.toString();
  return !!Object.values(WalletResponseSuccessType).find((value) => value === typeValue);
}

export function isFailedType(type: WalletResponseType | string): type is WalletResponseFailureType {
  const typeValue = type.toString();
  return !!Object.values(WalletResponseFailureType).find((value) => value === typeValue);
}

export function isRejectType(type: WalletResponseType | string): type is WalletResponseRejectType {
  const typeValue = type.toString();
  return !!Object.values(WalletResponseRejectType).find((value) => value === typeValue);
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
