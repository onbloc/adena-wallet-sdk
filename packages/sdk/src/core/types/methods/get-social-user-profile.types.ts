export const LOGIN_PROVIDER = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  REDDIT: 'reddit',
  DISCORD: 'discord',
  TWITCH: 'twitch',
  APPLE: 'apple',
  LINE: 'line',
  GITHUB: 'github',
  KAKAO: 'kakao',
  LINKEDIN: 'linkedin',
  TWITTER: 'twitter',
  WEIBO: 'weibo',
  WECHAT: 'wechat',
  FARCASTER: 'farcaster',
  EMAIL_PASSWORDLESS: 'email_passwordless',
  SMS_PASSWORDLESS: 'sms_passwordless',
  WEBAUTHN: 'webauthn',
  JWT: 'jwt',
} as const;

export type LOGIN_PROVIDER_TYPE = (typeof LOGIN_PROVIDER)[keyof typeof LOGIN_PROVIDER];

export type CUSTOM_LOGIN_PROVIDER_TYPE = string & {
  toString?: (radix?: number) => string;
};

export interface SocialUserInfo {
  email?: string;
  name?: string;
  profileImage?: string;
  /**
   * Auth connection type used to log in (e.g. `google`). Replaces `typeOfLogin` since Web3Auth v11.
   */
  authConnection?: LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE;
  /**
   * Auth Connection ID configured on the dashboard. Replaces `verifier` since Web3Auth v11.
   */
  authConnectionId?: string;
  /**
   * Grouped Auth Connection ID. Replaces `aggregateVerifier` since Web3Auth v11.
   */
  groupedAuthConnectionId?: string;
  /**
   * User identifier for the auth connection. Replaces `verifierId` since Web3Auth v11.
   */
  userId?: string;
  /**
   * @deprecated Not returned since Web3Auth v11. Use `groupedAuthConnectionId`.
   */
  aggregateVerifier?: string;
  /**
   * @deprecated Not returned since Web3Auth v11. Use `authConnectionId`.
   */
  verifier?: string;
  /**
   * @deprecated Not returned since Web3Auth v11. Use `userId`.
   */
  verifierId?: string;
  /**
   * @deprecated Not returned since Web3Auth v11. Use `authConnection`.
   */
  typeOfLogin?: LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE;
  dappShare?: string;
  /**
   * Token issued by Web3Auth.
   */
  idToken?: string;
  /**
   * Token issued by OAuth provider. Will be available only if you are using
   * custom verifiers.
   */
  oAuthIdToken?: string;
  /**
   * Access Token issued by OAuth provider. Will be available only if you are using
   * custom verifiers.
   */
  oAuthAccessToken?: string;
  appState?: string;
  touchIDPreference?: string;
  isMfaEnabled?: boolean;
}

export type GetSocialUserProfileResponse = SocialUserInfo;
