import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import PropTypes from 'prop-types';
import { List, useTheme } from 'react-native-paper';

import { store } from '../../store';
import AppActions from '../../store/actions/AppActions';
import {
  createLanguageSelector,
  createLanguagesSelector,
  createAppConfigSelector,
} from '../../store/selectors/AppSelectors';
import { connectToRedux } from '../../utils/ReduxConnect';
import { fetchAndRevokeTokens } from '../../hooks/UseLogout';
import PersistentStorageActions from '../../store/actions/PersistentStorageActions';

import ThemeModal from './ThemeModal';
import LanguageModal from './LanguageModal';

type TokenSelector = Partial<{ persistentStorage: { token: string } }>;

function SettingsScreen({ navigation, language, languages, setLanguageAsync }) {
  const sysTheme = useTheme();
  const theme = useSelector<Partial<{ app: { theme: string } }>>(state => state.app.theme);
  const currentUser = useSelector(createAppConfigSelector())?.currentUser;
  const { token } = useSelector<TokenSelector>(state => state.persistentStorage) as {
    token: string;
  };

  const [themeVisible, setThemeVisible] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);

  const showModal = () => setThemeVisible(true);
  const hideModal = () => setThemeVisible(false);

  const toggleLangModal = () => setLanguageVisible(!languageVisible);

  const setCurrTheme = value => {
    store.dispatch(AppActions.setThemeAsync(value));
    hideModal();
  };

  const setLang = selectedLang => {
    setLanguageAsync(selectedLang);
    toggleLangModal();
  };

  const logout = async () => {
    try {
      const { isSuccess, isSuccessRefresh } = await fetchAndRevokeTokens(token);
      if (isSuccess && isSuccessRefresh) {
        store.dispatch(PersistentStorageActions.setToken({}));
        store.dispatch(AppActions.fetchAppConfigAsync());
        navigation.navigate('Home');
      }
    } catch (error) {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: sysTheme.colors.background }}>
      <ThemeModal
        visible={themeVisible}
        hideModal={hideModal}
        outSetTheme={setCurrTheme}
        inputTheme={theme}
      />

      <LanguageModal
        visible={languageVisible}
        hideModal={toggleLangModal}
        languages={languages}
        inputLang={language.cultureName}
        setLanguage={selected => setLang(selected)}
      />

      <View>
        <List.Item
          key="language"
          onPress={() => toggleLangModal()}
          title={i18n.t('AbpUi::Language')}
          description={language.displayName}
          left={props => (
            <List.Icon
              {...props}
              icon="earth"
              style={{
                ...props.style,
                ...styles.icon,
              }}
              color={styles.icon.color}
            />
          )}
        />

        <List.Item
          key="theme"
          onPress={showModal}
          title={i18n.t('AbpUi::Theme')}
          description={theme}
          left={props => (
            <List.Icon
              {...props}
              icon="brightness-6"
              style={{
                ...props.style,
                ...styles.icon,
              }}
              color={styles.icon.color}
            />
          )}
        />
        {currentUser?.isAuthenticated ? (
          <List.Item
            key="profilePicture"
            title={i18n.t('AbpUi::ProfilePicture')}
            onPress={() => navigation.navigate('ProfilePicture')}
            left={props => (
              <List.Icon
                {...props}
                icon="camera-account"
                style={{
                  ...props.style,
                  ...styles.icon,
                }}
                color={styles.icon.color}
              />
            )}
            right={props => (
              <List.Icon
                {...props}
                icon="chevron-right"
                style={{
                  ...props.style,
                }}
              />
            )}
          />
        ) : null}

        {currentUser?.isAuthenticated ? (
          <List.Item
            key="changePassword"
            title={i18n.t('AbpUi::ChangePassword')}
            onPress={() => navigation.navigate('ChangePassword')}
            left={props => (
              <List.Icon
                {...props}
                icon="lock"
                style={{
                  ...props.style,
                  ...styles.icon,
                }}
                color={styles.icon.color}
              />
            )}
            right={props => (
              <List.Icon
                {...props}
                icon="chevron-right"
                style={{
                  ...props.style,
                }}
              />
            )}
          />
        ) : null}

        {currentUser?.isAuthenticated ? (
          <List.Item
            key="logout"
            title={i18n.t('AbpUi::Logout')}
            onPress={logout}
            left={props => (
              <List.Icon
                {...props}
                icon="logout"
                style={{
                  ...props.style,
                  ...styles.icon,
                }}
                color={styles.icon.color}
              />
            )}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: '#B84297',
    padding: 5.5,
    borderRadius: 20,
    color: '#fff',
  },
});

SettingsScreen.propTypes = {
  setLanguageAsync: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  languages: PropTypes.array.isRequired,
};

export default connectToRedux({
  component: SettingsScreen,
  stateProps: state => ({
    languages: createLanguagesSelector()(state),
    language: createLanguageSelector()(state),
  }),
  dispatchProps: {
    setLanguageAsync: AppActions.setLanguageAsync,
  },
});
