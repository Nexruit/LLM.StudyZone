import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from 'i18n-js';
import HamburgerIcon from '../components/HamburgerIcon/HamburgerIcon';
import ChangePasswordScreen from '../screens/ChangePassword/ChangePasswordScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ProfilePictureScreen from '../screens/ProfilePicture/ProfilePictureScreen';
import useLocalizedTitle from '../hooks/UseLocalizedTitle';

const Stack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Settings">
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={({ navigation }) => ({
            headerLeft: () => <HamburgerIcon navigation={navigation} marginLeft={-3} />,
            title: useLocalizedTitle('AbpSettingManagement::Settings'),
          })}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            title: i18n.t('AbpUi::ChangePassword'),
          }}
        />
        <Stack.Screen
          name="ProfilePicture"
          component={ProfilePictureScreen}
          options={{
            title: i18n.t('AbpAccount::ProfilePicture'),
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
