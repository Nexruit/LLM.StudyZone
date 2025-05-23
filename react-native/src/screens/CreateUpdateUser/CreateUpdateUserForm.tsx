import React, { useEffect, useRef, useState } from 'react';
import { Platform, KeyboardAvoidingView, StyleSheet, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import { useFormik } from 'formik';
import i18n from 'i18n-js';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useTheme, Button, TextInput, Checkbox } from 'react-native-paper';

import { FormButtons } from '../../components/FormButtons';
import ValidationMessage from '../../components/ValidationMessage/ValidationMessage';
import UserRoles from './UserRoles';
import { createAppConfigSelector } from '../../store/selectors/AppSelectors';

const MIN_PASSWORD_LENGTH = 6;

const validations = {
  userName: Yup.string()
    .required('AbpAccount::ThisFieldIsRequired.')
    .test('no-trim', 'AbpValidation::ThisFieldIsNotValid.', value => value === value?.trim()),
  email: Yup.string()
    .email('AbpAccount::ThisFieldIsNotAValidEmailAddress.')
    .required('AbpAccount::ThisFieldIsRequired.'),
};

const props = {
  underlineStyle: { backgroundColor: 'transparent' },
  underlineColor: '#333333bf',
};

let roleNames = [];

function onChangeRoles(roles) {
  roleNames = roles;
}

type EditingUser = {
  id: string;
  isActive: boolean;
  lockoutEnabled: boolean;
};

function CreateUpdateUserForm({ editingUser = {} as EditingUser, ownedRoles = [], submit }) {
  const theme = useTheme();
  const currentUser = useSelector(createAppConfigSelector())?.currentUser;

  const [selectedTab, setSelectedTab] = useState(0);
  const [hidePassword, setHidePassword] = useState(true);

  const usernameRef = useRef();
  const nameRef = useRef();
  const surnameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const passwordRef = useRef();

  const onSubmit = values => {
    if (!formik.isValid) {
      return;
    }

    submit({
      ...editingUser,
      ...values,
      roleNames: roleNames?.map(role => role.name),
    });
  };

  const passwordValidation = Yup.lazy(() => {
    if (editingUser.id) {
      return Yup.string();
    }

    const nonAlphanumericRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;

    return Yup.string()
      .required('AbpAccount::ThisFieldIsRequired.')
      .min(MIN_PASSWORD_LENGTH, 'AbpIdentity::Volo.Abp.Identity:PasswordTooShort')
      .matches(
        nonAlphanumericRegex,
        'AbpIdentity::Volo.Abp.Identity:PasswordRequiresNonAlphanumeric',
      )
      .matches(uppercaseRegex, 'AbpIdentity::Volo.Abp.Identity:PasswordRequiresUpper')
      .matches(lowercaseRegex, 'AbpIdentity::Volo.Abp.Identity:PasswordRequiresLower')
      .matches(digitRegex, 'AbpIdentity::Volo.Abp.Identity:PasswordRequiresDigit');
  });

  const formik = useFormik({
    enableReinitialize: true,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      ...validations,
      password: passwordValidation,
    }),
    initialValues: {
      ...editingUser,
      isActive: editingUser?.isActive ?? true,
      lockoutEnabled: editingUser?.lockoutEnabled ?? false,
    },
    onSubmit,
  });

  const passwordValidationTranslationParam = { 0: MIN_PASSWORD_LENGTH };

  const isInvalidControl = (controlName = null) => {
    if (!controlName) {
      return;
    }

    return (
      ((!!formik.touched[controlName] && formik.submitCount > 0) || formik.submitCount > 0) &&
      !!formik.errors[controlName]
    );
  };

  const inputStyle = { ...styles.input, backgroundColor: theme.colors.primaryContainer };

  useEffect(() => {
    roleNames = ownedRoles || [];
  }, [ownedRoles]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'margin'}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.tab}>
            <Button
              mode="text"
              onPress={() => setSelectedTab(0)}
              textColor={selectedTab === 0 ? '#B84297' : '#e1e1e1'}>
              {i18n.t('AbpIdentity::UserInformations')}
            </Button>

            <Button
              mode="text"
              onPress={() => setSelectedTab(1)}
              textColor={selectedTab === 1 ? '#B84297' : '#e1e1e1'}>
              {i18n.t('AbpIdentity::Roles')}
            </Button>
          </View>

          {selectedTab === 0 ? (
            <>
              <View style={styles.input.container}>
                <TextInput
                  mode="flat"
                  ref={usernameRef}
                  error={isInvalidControl('userName')}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  returnKeyType="next"
                  onChangeText={formik.handleChange('userName')}
                  onBlur={formik.handleBlur('userName')}
                  value={formik.values.userName}
                  autoCapitalize="none"
                  label={i18n.t('AbpIdentity::UserName')}
                  style={inputStyle}
                  {...props}
                />
                {isInvalidControl('userName') && (
                  <ValidationMessage>{formik.errors.userName}</ValidationMessage>
                )}
              </View>

              {!editingUser.id && (
                <View style={styles.input.container}>
                  <TextInput
                    mode="flat"
                    returnKeyType="next"
                    returnKeyLabel="next"
                    autoCapitalize="none"
                    ref={passwordRef}
                    error={isInvalidControl('password')}
                    onSubmitEditing={() => nameRef.current.focus()}
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                    value={formik.values.password}
                    secureTextEntry={hidePassword}
                    label={i18n.t('AbpIdentity::Password')}
                    style={inputStyle}
                    {...props}
                    right={
                      <TextInput.Icon
                        icon={hidePassword ? 'eye-off' : 'eye'}
                        onPress={() => setHidePassword(!hidePassword)}
                      />
                    }
                  />
                  {isInvalidControl('password') && (
                    <ValidationMessage translationParams={passwordValidationTranslationParam}>
                      {formik.errors.password}
                    </ValidationMessage>
                  )}
                </View>
              )}

              <View style={styles.input.container}>
                <TextInput
                  mode="flat"
                  ref={nameRef}
                  onSubmitEditing={() => surnameRef.current.focus()}
                  returnKeyType="next"
                  onChangeText={formik.handleChange('name')}
                  onBlur={formik.handleBlur('name')}
                  value={formik.values.name}
                  label={i18n.t('AbpIdentity::DisplayName:Name')}
                  style={inputStyle}
                  {...props}
                />
              </View>

              <View style={styles.input.container}>
                <TextInput
                  mode="flat"
                  ref={surnameRef}
                  onSubmitEditing={() => emailRef.current.focus()}
                  returnKeyType="next"
                  onChangeText={formik.handleChange('surname')}
                  onBlur={formik.handleBlur('surname')}
                  value={formik.values.surname}
                  label={i18n.t('AbpIdentity::DisplayName:Surname')}
                  style={inputStyle}
                  {...props}
                />
              </View>

              <View style={styles.input.container}>
                <TextInput
                  mode="flat"
                  ref={emailRef}
                  error={isInvalidControl('email')}
                  onSubmitEditing={() => phoneNumberRef.current.focus()}
                  returnKeyType="next"
                  onChangeText={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  value={formik.values.email}
                  autoCapitalize="none"
                  label={i18n.t('AbpIdentity::EmailAddress')}
                  style={inputStyle}
                  {...props}
                />
                {isInvalidControl('email') && (
                  <ValidationMessage>{formik.errors.email}</ValidationMessage>
                )}
              </View>

              <View style={styles.input.container}>
                <TextInput
                  mode="flat"
                  ref={phoneNumberRef}
                  returnKeyType={!editingUser.id ? 'next' : 'default'}
                  onChangeText={formik.handleChange('phoneNumber')}
                  onBlur={formik.handleBlur('phoneNumber')}
                  value={formik.values.phoneNumber}
                  label={i18n.t('AbpIdentity::PhoneNumber')}
                  style={inputStyle}
                  {...props}
                />
              </View>

              {currentUser.id !== editingUser.id && (
                <View style={styles.checkbox}>
                  <Checkbox.Item
                    position="leading"
                    label={i18n.t('AbpIdentity::DisplayName:IsActive')}
                    labelVariant="bodyLarge"
                    mode="android"
                    status={formik.values.isActive ? 'checked' : 'unchecked'}
                    onPress={() =>
                      formik.setFieldValue('isActive', !formik.values.isActive)
                    }></Checkbox.Item>
                </View>
              )}

              <View style={styles.checkbox}>
                <Checkbox.Item
                  label={i18n.t('AbpIdentity::DisplayName:LockoutEnabled')}
                  labelVariant="bodyLarge"
                  mode="android"
                  status={formik.values.lockoutEnabled ? 'checked' : 'unchecked'}
                  position="leading"
                  onPress={() =>
                    formik.setFieldValue('lockoutEnabled', !formik.values.lockoutEnabled)
                  }></Checkbox.Item>
              </View>
            </>
          ) : (
            <UserRoles
              {...{
                editingUser,
                ownedRoles: roleNames,
                onChangeRoles,
              }}
            />
          )}

          <FormButtons style={styles.button} submit={formik.handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333bf',
  },
  input: {
    container: {
      margin: 8,
      marginLeft: 16,
      marginRight: 16,
    },
    borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    marginLeft: 16,
    marginRight: 16,
  },
});

CreateUpdateUserForm.propTypes = {
  editingUser: PropTypes.object,
  ownedRoles: PropTypes.array,
  submit: PropTypes.func.isRequired,
};

export default CreateUpdateUserForm;
