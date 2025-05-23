import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, View } from 'react-native';
import { useTheme, List, IconButton } from 'react-native-paper';

import { getTenants, removeTenant } from '../../api/SaasAPI';
import DataList from '../../components/DataList/DataList';

import { useActionSheet } from '@expo/react-native-action-sheet';
import { LocalizationContext } from '../../contexts/LocalizationContext';

export default function TenantsScreen({ navigation }) {
  const { t } = React.useContext(LocalizationContext);
  const [refresh, setRefresh] = useState(null);

  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const policies = useSelector(state => state.app.appConfig.auth.grantedPolicies);

  const openContextMenu = item => {
    const options = [];

    if (policies['Saas.Tenants.Delete']) {
      options.push(t('AbpUi::Delete'));
    }

    if (policies['Saas.Tenants.Update']) {
      options.push(t('AbpUi::Edit'));
    }

    options.push(t('AbpUi::Cancel'));

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: options.indexOf(t('AbpUi::Delete')),
      },
      index => {
        switch (options[index]) {
          case t('AbpUi::Edit'):
            edit(item);
            break;
          case t('AbpUi::Delete'):
            remove(item);
            break;
        }
      },
    );
  };

  const edit = item => {
    navigation.navigate('CreateUpdateTenant', { tenantId: item.id });
  };

  const remove = item => {
    const params = { 0: item.name };
    const msg = t('Saas::TenantDeletionConfirmationMessage', params);

    Alert.alert('Warning', msg, [
      {
        text: t('AbpUi::Cancel'),
        style: 'cancel',
      },
      {
        text: t('AbpUi::Ok'),
        onPress: async () => {
          await removeTenant(item.id);
          setRefresh((refresh ?? 0) + 1);
        },
        style: 'default',
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <DataList
        navigation={navigation}
        trigger={refresh}
        fetchFn={getTenants}
        render={({ item }) => (
          <List.Item
            key={item.id}
            title={item.name}
            description={item.email || item.editionName}
            right={props => (
              <IconButton
                {...props}
                icon="dots-vertical"
                size={20}
                rippleColor={'#ccc'}
                onPress={() => openContextMenu(item)}
              />
            )}
          />
        )}
      />
    </View>
  );
}
