import i18n from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Text, Button, useTheme } from 'react-native-paper';
import { createAppConfigSelector } from '../../store/selectors/AppSelectors';
import useAuthAndTokenExchange from '../../hooks/UseAuthAndTokenExchange';
import AnalysisSvg from './AnalysisSvg';

function HomeScreen({ navigation }) {
  const theme = useTheme();
  const currentUser = useSelector(createAppConfigSelector())?.currentUser;
  const hasGranted = useSelector(createAppConfigSelector())?.auth?.grantedPolicies[
    'AbpIdentity.Users'
  ];
  const exchange = useAuthAndTokenExchange(navigation);

  const navigateOrLogin = () => {
    if (currentUser?.isAuthenticated && hasGranted) {
      navigation.navigate('UsersStack');
      return;
    }

    if (!currentUser?.isAuthenticated && !hasGranted) {
      exchange.handleAuthentication();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={homeStyle.container}>
        <Text variant="headlineLarge" style={{ color: theme.colors.text }}>
          {i18n.t('::Welcome')}!
        </Text>
        <Text variant="titleSmall" style={{ color: theme.colors.text }}>
          {i18n.t('::LongWelcomeMessage')}
        </Text>
      </View>

      <AnalysisSvg />

      <View style={homeStyle.button.container}>
        {!currentUser?.isAuthenticated && (
          <Button mode="contained" textColor="#fff" onPress={() => navigateOrLogin()}>
            {i18n.t('AbpUi::Login')}
          </Button>
        )}
        {currentUser?.isAuthenticated && hasGranted && (
          <Button mode="contained" textColor="#fff" onPress={() => navigateOrLogin()}>
            {i18n.t('StudyZone::SeeAllUsers')}
          </Button>
        )}
      </View>
    </View>
  );
}

const homeStyle = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    container: {
      marginTop: 18,
      marginLeft: 18,
      marginRight: 18,
    },
  },
});

export default HomeScreen;
