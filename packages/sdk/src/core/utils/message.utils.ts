import { WalletMessageInfo, WalletResponse, WalletResponseType } from '../types';

export const makeResponseMessage = <D>(messageType: WalletResponseType, data?: D): WalletResponse<D> => {
  const messageInfo = WalletMessageInfo[messageType];
  return {
    ...messageInfo,
    data: data || null,
  };
};
