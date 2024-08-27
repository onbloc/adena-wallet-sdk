import { Response, ResponseStatus, ResponseType } from '../types';
import { IAdenaResponse, TAdenaResponseStatus } from '../adena-wallet/types';

function mapResponseStatus(status: TAdenaResponseStatus): ResponseStatus {
  if (status === 'success') {
    return ResponseStatus.SUCCESS;
  }

  return ResponseStatus.FAILURE;
}

function isResponseType(type: string): type is ResponseType {
  return type in ResponseType;
}

function mapResponseType(type: string): ResponseType {
  if (!isResponseType(type)) {
    return ResponseType.UNSUPPORTED_TYPE;
  }

  return type;
}

export function mapResponseByAdenaResponse<ProviderResponseData = unknown>(
  response: IAdenaResponse<string, unknown>,
  data?: ProviderResponseData
): Response<ProviderResponseData> {
  return {
    code: response.code,
    status: mapResponseStatus(response.status),
    type: mapResponseType(response.type),
    message: response.message,
    data: data as ProviderResponseData,
  };
}
