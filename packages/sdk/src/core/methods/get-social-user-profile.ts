import { WalletProvider } from '../providers';
import { GetSocialUserProfileResponse } from '../types/methods/get-social-user-profile.types';
import { isGnoSocialWalletProvider } from '../utils/provider.utils';

export const getSocialUserProfile = async (walletProvider: WalletProvider): Promise<GetSocialUserProfileResponse> => {
  if (!isGnoSocialWalletProvider(walletProvider)) {
    throw new Error('Wallet provider is not a GnoSocialWalletProvider');
  }

  return await walletProvider.getSocialUserProfile();
};
