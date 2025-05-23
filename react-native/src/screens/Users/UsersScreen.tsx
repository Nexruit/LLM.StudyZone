import React, { useState, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Alert, View } from 'react-native';
import { useTheme, List, IconButton, Avatar } from 'react-native-paper';
import { useActionSheet } from '@expo/react-native-action-sheet';

import { getEnvVars } from '../../../Environment';
import { getUsers, removeUser } from '../../api/IdentityAPI';

import { LocalizationContext } from '../../contexts/LocalizationContext';
import DataList from '../../components/DataList/DataList';
import { createAppConfigSelector } from '../../store/selectors/AppSelectors';

function UsersScreen({ navigation }) {
  const { apiUrl } = getEnvVars();
  const imageUrl = `${apiUrl}/api/account/profile-picture-file/`;
  const theme = useTheme();

  const { t } = useContext(LocalizationContext);
  const [refresh, setRefresh] = useState(null);
  const { showActionSheetWithOptions } = useActionSheet();
  const policies = useSelector(state => state.app.appConfig.auth.grantedPolicies);
  const currentUser = useSelector(createAppConfigSelector())?.currentUser;

  const title = ({ name, surname, userName }) => {
    if (name && surname) {
      return `${name} ${surname}`;
    }
    return userName;
  };

  const hasAnyPermission = () => {
    return policies['AbpIdentity.Users.Delete'] || policies['AbpIdentity.Users.Update'];
  };

  const openContextMenu = item => {
    const options = [];

    if (policies['AbpIdentity.Users.Delete'] && currentUser.id !== item.id) {
      options.push(t('AbpUi::Delete'));
    }

    if (policies['AbpIdentity.Users.Update']) {
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
    navigation.navigate('CreateUpdateUser', { userId: item.id });
  };

  const remove = item => {
    const params = { 0: title(item) };
    const message = t('AbpIdentity::UserDeletionConfirmationMessage', params);

    Alert.alert('Warning', message, [
      {
        text: t('AbpUi::Cancel'),
        style: 'cancel',
      },
      {
        style: 'default',
        text: t('AbpUi::Ok'),
        onPress: () => {
          removeUser(item.id).then(() => {
            setRefresh((refresh ?? 0) + 1);
          });
        },
      },
    ]);
  };

  const UserAvatar = ({ uri }) => {
    const [imageUri, setImageUri] = useState(uri);

    useMemo(() => {
      const fetchImage = async () => {
        try {
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }

          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageUri(reader.result);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error loading image:', error);
        }
      };

      fetchImage();
    }, [new Date()]);

    return <Avatar.Image size={50} source={{ uri: imageUri }} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {currentUser?.isAuthenticated ? (
        <DataList
          navigation={navigation}
          fetchFn={getUsers}
          trigger={refresh}
          render={({ item }) => (
            <List.Item
              key={item.id}
              title={title(item)}
              description={item.email || ''}
              left={() => <UserAvatar uri={`${imageUrl}${item.id}`} />}
              right={props =>
                hasAnyPermission() ? (
                  <IconButton
                    {...props}
                    icon="dots-vertical"
                    rippleColor={'#ccc'}
                    size={20}
                    onPress={() => openContextMenu(item)}
                  />
                ) : null
              }
            />
          )}
        />
      ) : null}
    </View>
  );
}

export default UsersScreen;
