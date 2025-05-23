import { useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';

import { store } from '../store';
import AppActions from '../store/actions/AppActions';
import PersistentStorageActions from '../store/actions/PersistentStorageActions';
import { getEnvVars } from '../../Environment';

const {
  apiUrl,
  oAuthConfig: { issuer, clientId, scope },
} = getEnvVars();

const { exchangeCodeAsync, useAutoDiscovery, makeRedirectUri, useAuthRequest, ResponseType } =
  AuthSession;

const useAuthAndTokenExchange = navigation => {
  const tokenEndpoint = `${apiUrl}/connect/token`;

  const discovery = useAutoDiscovery(issuer);
  const redirectUri = makeRedirectUri();
  const [request, result, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      responseType: ResponseType.Code,
      scopes: scope.split(' '),
      usePKCE: true,
    },
    discovery,
  );

  useEffect(() => {
    if (!result) {
      return;
    }

    const { type } = result;
    if (type === 'dismiss') {
      return;
    }

    if (type === 'success') {
      const { code } = result.params;
      const { codeVerifier } = request;

      const exchangeCodeConfig = {
        clientId,
        redirectUri,
        code: code,
        extraParams: { code_verifier: codeVerifier },
      };

      const exchangeRequest = exchangeCodeAsync(exchangeCodeConfig, { tokenEndpoint });
      exchangeRequest
        .then(data => {
          if (!data) {
            return null;
          }

          const { accessToken, refreshToken, expiresIn, scope, tokenType } = data;
          store.dispatch(
            PersistentStorageActions.setToken({
              token_type: tokenType,
              access_token: accessToken,
              refresh_token: refreshToken,
              expire_time: new Date().valueOf() + expiresIn || 0,
              scope,
            }),
          );
        })
        .then(() => store.dispatch(AppActions.fetchAppConfigAsync({ showLoading: false })))
        .then(() => navigation.navigate('Home'));
    }
  }, [result]);

  const handleAuthentication = () => {
    promptAsync();
  };

  return { handleAuthentication };
};

export default useAuthAndTokenExchange;
