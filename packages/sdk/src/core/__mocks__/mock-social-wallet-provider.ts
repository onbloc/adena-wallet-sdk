import { GnoSocialWalletProvider } from '../../providers';
import { WalletResponseSuccessType } from '../types';
import { GetSocialUserProfileResponse } from '../types/methods/get-social-user-profile.types';
import { makeResponseMessage } from '../utils';

export const defineMockSocialWalletProvider = () => {
  jest.mock('../../providers', () => ({
    GnoSOcialWalletProvider: jest.fn(() => mockSocialWalletProvider),
  }));
};

// Mock social user profile response
export const getSocialUserProfileSuccessMock: GetSocialUserProfileResponse = {
  email: 'test@example.com',
  name: 'Test User',
  profileImage: 'https://example.com/profile.jpg',
  verifier: 'test-verifier',
  verifierId: 'test-verifier-id',
  typeOfLogin: 'google',
  aggregateVerifier: 'test-aggregate-verifier',
  idToken: 'test-id-token',
  oAuthIdToken: 'test-oauth-id-token',
  oAuthAccessToken: 'test-oauth-access-token',
};

// Create mock instance
const mockSocialWalletProvider = Object.create(GnoSocialWalletProvider.prototype);

// Add mock implementations
Object.assign(mockSocialWalletProvider, {
  isConnected: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS)),
  addEstablish: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.CONNECTION_SUCCESS)),
  getAccount: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.GET_ACCOUNT_SUCCESS)),
  getNetwork: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.GET_NETWORK_SUCCESS)),
  switchNetwork: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.SWITCH_NETWORK_SUCCESS)),
  addNetwork: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.ADD_NETWORK_SUCCESS)),
  signTransaction: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.SIGN_SUCCESS)),
  broadcastTransaction: jest.fn().mockResolvedValue(makeResponseMessage(WalletResponseSuccessType.TRANSACTION_SUCCESS)),
  onChangeAccount: jest.fn().mockImplementation(() => {
    return;
  }),
  onChangeNetwork: jest.fn().mockImplementation(() => {
    return;
  }),
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true),
  getWallet: jest.fn().mockReturnValue(null),
  setNetworks: jest.fn(),
  getSocialUserProfile: jest.fn().mockResolvedValue(getSocialUserProfileSuccessMock),
});

export { mockSocialWalletProvider };

export const getSocialUserProfileFailureMock = new Error('Failed to get social user profile');
export const getSocialUserProfileNotInitializedMock = new Error('Not initialized web3 provider.');
