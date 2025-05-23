export interface OAuthConfig {
  issuer: string;
  clientId: string;
  scope: string;
  clientSecret?: string;
}

export interface Environment {
  apiUrl: string;
  appUrl: string;
  oAuthConfig: OAuthConfig;
  localization: {
    defaultResourceName: string;
  };
}
