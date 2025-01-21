export declare const LOGIN_PROVIDER: {
  readonly GOOGLE: 'google';
  readonly FACEBOOK: 'facebook';
  readonly REDDIT: 'reddit';
  readonly DISCORD: 'discord';
  readonly TWITCH: 'twitch';
  readonly APPLE: 'apple';
  readonly LINE: 'line';
  readonly GITHUB: 'github';
  readonly KAKAO: 'kakao';
  readonly LINKEDIN: 'linkedin';
  readonly TWITTER: 'twitter';
  readonly WEIBO: 'weibo';
  readonly WECHAT: 'wechat';
  readonly FARCASTER: 'farcaster';
  readonly EMAIL_PASSWORDLESS: 'email_passwordless';
  readonly SMS_PASSWORDLESS: 'sms_passwordless';
  readonly WEBAUTHN: 'webauthn';
  readonly JWT: 'jwt';
};

export type LOGIN_PROVIDER_TYPE = (typeof LOGIN_PROVIDER)[keyof typeof LOGIN_PROVIDER];

export type CUSTOM_LOGIN_PROVIDER_TYPE = string & {
  toString?: (radix?: number) => string;
};

export interface SocialUserInfo {
  email?: string;
  name?: string;
  profileImage?: string;
  aggregateVerifier?: string;
  verifier?: string;
  verifierId?: string;
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
