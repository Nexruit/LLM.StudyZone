import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import i18n from 'i18n-js';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { Avatar, Text, RadioButton, useTheme, Button, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import { profilePictureById, postProfilePicture } from '../../api/AccountAPI';
import AppActions from '../../store/actions/AppActions';
import LoadingActions from '../../store/actions/LoadingActions';
import { connectToRedux } from '../../utils/ReduxConnect';
import { createAppConfigSelector } from '../../store/selectors/AppSelectors';
import FormButtons from '../../components/FormButtons/FormButtons';
import { getEnvVars } from '../../../Environment';
import { store } from '../../store';

const { apiUrl } = getEnvVars();

const imageOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 1,
  base64: true,
};

function ProfilePictureScreen({ startLoading, clearLoading }) {
  const theme = useTheme();

  const { currentUser } = useSelector(createAppConfigSelector()) ?? {};
  const defaultImage = `${apiUrl}/api/account/profile-picture-file/${currentUser.id}`;

  const [profileOption, setProfileOption] = useState(0);
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const [avatar, setAvatar] = useState(null);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(imageOptions);

    if (!result.canceled) {
      setImage(result.assets[0]);
      setAvatar(`data:image/png;base64,${result.assets[0].base64}`);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera permissions to take a photo.');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync(imageOptions);

    if (!result.canceled) {
      setImage(result.assets[0]);
      setAvatar(`data:image/png;base64,${result.assets[0].base64}`);
    }
  };

  const submit = async () => {
    startLoading({ key: 'profilePicture' });

    if (profileOption === 2 && !image) {
      clearLoading();
    }

    const formData = new FormData();
    formData.append('type', +profileOption);

    if (profileOption === 2) {
      const { uri } = image;
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const data = {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      };

      formData.append('imageContent', data);
      store.dispatch(AppActions.setProfilePicture(data.uri));
    }

    postProfilePicture(formData)
      .then(() => {
        if (profileOption === 0 || profileOption === 1) {
          setAvatar(null);
        }

        if (profileOption === 0) {
          setImageUrl(defaultImage);
          store.dispatch(AppActions.setProfilePicture(defaultImage as any));
          return;
        }

        if (profileOption === 1) {
          profilePictureById(currentUser.id)
            .then(({ source }) => {
              setImageUrl(source);
              store.dispatch(AppActions.setProfilePicture(source));
            })
            .finally(() => clearLoading());
          return;
        }
      })
      .finally(() => clearLoading());
  };

  const changeOption = avatarOption => {
    setProfileOption(avatarOption);
    switch (avatarOption) {
      case 3:
        takePhoto();
        break;
    }
  };

  useEffect(() => {
    startLoading({ key: 'profilePicture' });
    profilePictureById(currentUser.id)
      .then((data = {}) => {
        const { type, source } = data || {};
        setProfileOption(type);
        store.dispatch(AppActions.setProfilePicture(data));
        switch (type) {
          case 0:
          case 1:
            setImageUrl(type == 0 ? defaultImage : source);
            break;
          case 2:
            setAvatar(`data:image/png;base64,${data.fileContent}`);
            break;
        }
      })
      .finally(() => {
        clearLoading()
      });
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <View style={styles.avatar}>
        <Avatar.Image size={100} source={{ uri: avatar || imageUrl }} />
      </View>
      <View style={styles.options}>
        <RadioButton.Group onValueChange={newValue => changeOption(newValue)} value={profileOption}>
          <View style={styles.options.option}>
            <RadioButton.Item mode="android" value={0} />
            <Text onPress={() => changeOption(0)} variant="labelLarge">
              {i18n.t('AbpAccount::UseDefault')}
            </Text>
          </View>
          <View style={styles.options.option}>
            <RadioButton.Item mode="android" value={1} />
            <Text onPress={() => changeOption(1)} variant="labelLarge">
              {i18n.t('AbpAccount::DisplayName:UseGravatar')}
            </Text>
          </View>

          <View style={styles.options.option}>
            <RadioButton.Item mode="android" value={2} />
            <Text onPress={() => changeOption(2)} variant="labelLarge">
              {i18n.t('AbpAccount::SelectNewImage')}
            </Text>
          </View>

          {profileOption === 2 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 7,
                marginTop: 10,
                marginBottom: 15,
                alignItems: 'center',
              }}>
              <Button mode="outlined" onPress={() => takePhoto()} style={{ flex: 1 }}>
                {i18n.t('AbpAccount::TakePhoto')}
              </Button>

              <Button
                mode="outlined"
                onPress={() => pickImage()}
                style={{
                  flex: 1,
                  marginHorizontal: 7,
                }}>
                {i18n.t('AbpAccount::ChoosePhoto')}
              </Button>
            </View>
          ) : null}
        </RadioButton.Group>
      </View>

      <FormButtons submit={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  avatar: {
    alignItems: 'center',
    marginTop: 16,
  },
  options: {
    marginTop: 19,
    marginBottom: 16,
    option: { flexDirection: 'row', alignItems: 'center' },
  },
});

ProfilePictureScreen.propTypes = {
  startLoading: PropTypes.func.isRequired,
  clearLoading: PropTypes.func.isRequired,
};

export default connectToRedux({
  component: ProfilePictureScreen,
  dispatchProps: {
    startLoading: LoadingActions.start,
    clearLoading: LoadingActions.stop,
  },
});
