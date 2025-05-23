import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import i18n from 'i18n-js';

import DrawerContent from '../components/DrawerContent/DrawerContent';
import HamburgerIcon from '../components/HamburgerIcon/HamburgerIcon';

import DashboardStackNavigator from './DashboardNavigator';
import HomeStackNavigator from './HomeNavigator';
import SettingsStackNavigator from './SettingsNavigator';
import TenantsStackNavigator from './TenantsNavigator';
import UsersStackNavigator from './UsersNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={DrawerContent} defaultStatus="closed">
      <Drawer.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={({ navigation }) => ({
          title: i18n.t('::Menu:Home'),
          headerLeft: () => <HamburgerIcon navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="DashboardStack"
        component={DashboardStackNavigator}
        options={({ navigation }) => ({
          title: i18n.t('::Menu:Dashboard'),
          headerLeft: () => <HamburgerIcon navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="TenantsStack"
        component={TenantsStackNavigator}
        options={{ header: () => null }}
      />
      <Drawer.Screen
        name="UsersStack"
        component={UsersStackNavigator}
        options={{ header: () => null }}
      />
      <Drawer.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{ header: () => null }}
      />
    </Drawer.Navigator>
  );
}
