import * as AuthSession from 'expo-auth-session';
import { getEnvVars } from '../../Environment';

const {
  apiUrl,
  appUrl,
  oAuthConfig: { clientId, scope },
} = getEnvVars();

export const fetchAndRevokeTokens = async token => {
  const config = { scopes: scope.split(' '), clientId };
  const discovery = { revocationEndpoint: `${apiUrl}/connect/revocat` };

  const revokeAccess = AuthSession.revokeAsync(
    {
      ...config,
      token: token.access_token,
      tokenTypeHint: AuthSession.TokenTypeHint.AccessToken,
    },
    discovery,
  );

  const revokeRefresh = AuthSession.revokeAsync(
    {
      ...config,
      token: token.refresh_token,
      tokenTypeHint: AuthSession.TokenTypeHint.RefreshToken,
    },
    discovery,
  );

  const [isSuccess, isSuccessRefresh] = await Promise.all([revokeAccess, revokeRefresh]);
  return { isSuccess, isSuccessRefresh };
};
