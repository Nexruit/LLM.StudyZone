import React, { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { RootSiblingParent } from 'react-native-root-siblings';

import i18n from 'i18n-js';

import { getEnvVars } from './Environment';
import Loading from './src/components/Loading/Loading';
import { LocalizationContext } from './src/contexts/LocalizationContext';
import { initAPIInterceptor } from './src/interceptors/APIInterceptor';
import DrawerNavigator from './src/navigators/DrawerNavigator';

import { persistor, store } from './src/store';
import AppActions from './src/store/actions/AppActions';
import PersistentStorageActions from './src/store/actions/PersistentStorageActions';
import { createLanguageSelector, createThemeSelector } from './src/store/selectors/AppSelectors';
import { createTokenSelector } from './src/store/selectors/PersistentStorageSelectors';

import { connectToRedux } from './src/utils/ReduxConnect';
import { isTokenValid } from './src/utils/TokenUtils';

import * as WebBrowser from 'expo-web-browser';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { PaperProvider } from 'react-native-paper';
import styles from './src/styles/system-styles';
import { LogBox } from 'react-native';
//Ignore warnings
LogBox.ignoreAllLogs();

WebBrowser.maybeCompleteAuthSession();
const { localization } = getEnvVars();

i18n.defaultSeparator = '::';
const cloneT = i18n.t;
i18n.t = (key, ...args) => {
    if (key.slice(0, 2) === '::') {
        key = localization.defaultResourceName + key;
    }
    return cloneT(key, ...args);
};

enableScreens();
initAPIInterceptor(store);

export default function App() {
    const language = createLanguageSelector()(store.getState());
    const [isReady, setIsReady] = useState(false);

    const localizationContextValue = useMemo(
        () => ({
            t: i18n.t,
            locale: (language || {}).cultureName,
        }),
        [language],
    );

    useEffect(() => {
        store.dispatch(
            AppActions.fetchAppConfigAsync({
                callback: () => setIsReady(true),
            }),
        );
    });

    return (
        <NavigationContainer>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {isReady ? (
                        <LocalizationContext.Provider value={localizationContextValue}>
                            <ActionSheetProvider>
                                <RootSiblingParent>
                                    <ConnectedAppContainer />
                                </RootSiblingParent>
                            </ActionSheetProvider>
                        </LocalizationContext.Provider>
                    ) : null}
                    <Loading />
                </PersistGate>
            </Provider>
        </NavigationContainer>
    );
}

function AppContainer({ token, theme, setToken }) {
    const isValid = useMemo(() => isTokenValid(token), [token]);
    const currTheme = useMemo(() => (theme === 'Dark' ? styles.dark : styles.light), [theme]);

    useEffect(() => {
        if (!isValid && token && token.access_token) {
            setToken({});
        }
    }, [isValid]);

    return (
        <PaperProvider theme={currTheme}>
            <DrawerNavigator />
        </PaperProvider>
    );
}

const ConnectedAppContainer = connectToRedux({
    component: AppContainer,
    stateProps: state => ({
        token: createTokenSelector()(state),
        theme: createThemeSelector()(state),
    }),
    dispatchProps: () => ({
        setToken: PersistentStorageActions.setToken,
    }),
});
