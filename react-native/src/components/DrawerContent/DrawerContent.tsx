import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import i18n from 'i18n-js';
import PropTypes from 'prop-types';
import { Drawer, Divider, Avatar, Text, useTheme } from 'react-native-paper';

import { createAppConfigSelector } from '../../store/selectors/AppSelectors';
import { withPermission } from '../../hocs/PermissionHOC';
import { store } from '../../store';
import PersistentStorageActions from '../../store/actions/PersistentStorageActions';
import AppActions from '../../store/actions/AppActions';
import useAuthAndTokenExchange from '../../hooks/UseAuthAndTokenExchange';
import { fetchAndRevokeTokens } from '../../hooks/UseLogout';
import { profilePictureById } from '../../api/AccountAPI';

const screens = {
  HomeStack: { label: '::Menu:Home', iconName: 'home' },
  DashboardStack: {
    label: '::Menu:Dashboard',
    requiredPolicy: 'StudyZone.Dashboard',
    iconName: 'chart-areaspline',
  },
  UsersStack: {
    label: 'AbpIdentity::Users',
    iconName: 'account-supervisor',
    requiredPolicy: 'AbpIdentity.Users',
  },
  TenantsStack: {
    label: 'Saas::Tenants',
    iconName: 'book-outline',
    requiredPolicy: 'Saas.Tenants',
  },
  SettingsStack: { label: 'AbpSettingManagement::Settings', iconName: 'cog', navigation: null },
};

const ListItemWithPermission = withPermission(Drawer.Item, null);

function DrawerContent({ navigation, state: { routeNames } }) {
  const profilePicture = useSelector<Partial<{ app: { profilePicture: string } }>>(
    state => state.app.profilePicture,
  );

  const [image, setImage] = useState(profilePicture || null);

  const theme = useTheme();
  const currentUser = useSelector(createAppConfigSelector())?.currentUser;
  const { token } = useSelector(state => state.persistentStorage);
  const exchnage = useAuthAndTokenExchange(navigation);

  const login = () => {
    if (currentUser?.isAuthenticated) {
      navigation.navigate('UsersStack');
      return;
    }

    exchnage.handleAuthentication();
  };

  const getProfileName = () => {
    if (!currentUser) return '';

    if (currentUser.name && currentUser.surName) {
      return `${currentUser.name} ${currentUser.surName}`;
    }

    return currentUser.userName;
  };

  const navigate = screen => {
    navigation.navigate(screen);
    navigation.closeDrawer();
  };

  const logout = async () => {
    try {
      const { isSuccess, isSuccessRefresh } = await fetchAndRevokeTokens(token);

      if (isSuccess && isSuccessRefresh) {
        store.dispatch(PersistentStorageActions.setToken({}));
        store.dispatch(
          AppActions.fetchAppConfigAsync({
            showLoading: false,
          }),
        );
        navigation.navigate('Home');
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (currentUser.isAuthenticated) {
      profilePictureById(currentUser.id).then((data = {}) => {
        const { type, source } = data || {};
        switch (type) {
          case 0:
          case 2:
            setImage(`data:image/png;base64,${data.fileContent}`);
            break;
          case 1:
            setImage(source);
            break;
        }
      });
    }
  }, [currentUser.id]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.currentUser}>
      {currentUser?.isAuthenticated ? (
          <Avatar.Image size={50} source={{ uri: profilePicture || image }} />
        ) : null}
        <Text variant="titleLarge" style={styles.currentUser.name}>
          {getProfileName()}
        </Text>

        <Text variant="titleSmall" style={styles.currentUser.email}>
          {currentUser?.email ?? ''}
        </Text>
      </View>

      <Divider />

      <Drawer.Section style={styles.routes} showDivider={false}>
        {routeNames.map(name => (
          <ListItemWithPermission
            key={name}
            policyKey={screens[name].requiredPolicy}
            onPress={() => navigate(name)}
            label={i18n.t(screens[name].label)}
            icon={screens[name].iconName}
            navigation={navigation}></ListItemWithPermission>
        ))}
        {currentUser?.isAuthenticated ? (
          <ListItemWithPermission
            key="logout"
            policyKey={''}
            onPress={() => logout()}
            label={i18n.t('AbpUi::Logout')}
            icon="logout"></ListItemWithPermission>
        ) : (
          <ListItemWithPermission
            key="login"
            onPress={() => login()}
            label={i18n.t('AbpUi::Login')}
            icon="login"></ListItemWithPermission>
        )}
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  currentUser: {
    marginTop: 45,
    marginLeft: 16,
    name: {
      marginTop: 9.5,
    },
    email: {
      marginTop: 5,
      marginBottom: 18.5,
    },
  },
  routes: {
    margin: 0,
    marginTop: 13,
  },
});

DrawerContent.propTypes = {
  state: PropTypes.object.isRequired,
};

export default DrawerContent;
