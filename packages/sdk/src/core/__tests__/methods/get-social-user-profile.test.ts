import { getSocialUserProfileSuccessMock, mockSocialWalletProvider } from '../../__mocks__/mock-social-wallet-provider';
import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { getSocialUserProfile } from '../../methods/get-social-user-profile';
import { GetSocialUserProfileResponse } from '../../types/methods/get-social-user-profile.types';

describe('getSocialUserProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wallet provider is not GnoSocialWalletProvider', async () => {
    await expect(getSocialUserProfile(mockWalletProvider)).rejects.toThrow(
      'Wallet provider is not a GnoSocialWalletProvider'
    );
  });

  it('should call getSocialUserProfile and return the response', async () => {
    const mockResponse: GetSocialUserProfileResponse = getSocialUserProfileSuccessMock;

    mockSocialWalletProvider.getSocialUserProfile.mockResolvedValue(mockResponse);

    const response = await getSocialUserProfile(mockSocialWalletProvider);

    expect(mockSocialWalletProvider.getSocialUserProfile).toHaveBeenCalled();
    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if getSocialUserProfile fails', async () => {
    mockSocialWalletProvider.getSocialUserProfile.mockRejectedValue(new Error('Failed to get social user profile'));

    await expect(getSocialUserProfile(mockSocialWalletProvider)).rejects.toThrow('Failed to get social user profile');
  });
});
