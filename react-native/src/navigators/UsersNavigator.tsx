import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import i18n from 'i18n-js';

import { LocalizationContext } from '../contexts/LocalizationContext';

import AddIcon from '../components/AddIcon/AddIcon';
import HamburgerIcon from '../components/HamburgerIcon/HamburgerIcon';

import UsersScreen from '../screens/Users/UsersScreen';
import CreateUpdateUserScreen from '../screens/CreateUpdateUser/CreateUpdateUserScreen';

const Stack = createNativeStackNavigator();

export default function UsersStackNavigator() {
  const { t } = React.useContext(LocalizationContext);
  const policies = useSelector((state: any) => state.app.appConfig.auth.grantedPolicies);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Users">
        <Stack.Screen
          name="Users"
          component={UsersScreen}
          options={({ navigation }) => ({
            title: i18n.t('AbpIdentity::Users'),
            headerLeft: () => <HamburgerIcon navigation={navigation} />,
            headerRight: () =>
              policies['AbpIdentity.Users.Create'] ? (
                <AddIcon onPress={() => navigation.navigate('CreateUpdateUser')} />
              ) : null,
          })}
        />
        <Stack.Screen
          name="CreateUpdateUser"
          component={CreateUpdateUserScreen}
          options={({ route, navigation }) => {
            const { userId } = (route.params as { userId: string }) || {};

            return {
              title: i18n.t(userId ? 'AbpIdentity::Edit' : 'AbpIdentity::NewUser'),
              headerRight: () => (
                <Button mode="text" onPress={() => navigation.navigate('Users')}>
                  {t('AbpUi::Cancel')}
                </Button>
              ),
            };
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
