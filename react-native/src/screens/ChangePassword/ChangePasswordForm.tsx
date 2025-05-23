import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFormik } from 'formik';
import i18n from 'i18n-js';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useTheme, TextInput } from 'react-native-paper';
import { FormButtons } from '../../components/FormButtons';
import ValidationMessage from '../../components/ValidationMessage/ValidationMessage';

const ValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('AbpAccount::ThisFieldIsRequired.'),
  newPassword: Yup.string()
    .required('AbpAccount::ThisFieldIsRequired.')
    .oneOf(
      [Yup.ref('repeatPassword'), null],
      'AbpIdentity::Volo.Abp.Identity:PasswordConfirmationFailed',
    ),
  repeatPassword: Yup.string()
    .required('AbpAccount::ThisFieldIsRequired.')
    .oneOf(
      [Yup.ref('newPassword'), null],
      'AbpIdentity::Volo.Abp.Identity:PasswordConfirmationFailed',
    ),
});

function ChangePasswordForm({ submit, cancel }) {
  const theme = useTheme();
  styles = {
    ...styles,
    input: {
      ...styles.input,
      backgroundColor: theme.colors.primaryContainer,
    },
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const repeatPasswordRef = useRef();

  const onSubmit = values => {
    submit({
      ...values,
      newPasswordConfirm: values.newPassword,
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnBlur: true,
    validationSchema: ValidationSchema,
    initialValues: {
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
    onSubmit,
  });

  const isInvalidControl = (controlName = null) => {
    if (!controlName) {
      return;
    }

    return (
      ((!!formik.touched[controlName] && formik.submitCount > 0) || formik.submitCount > 0) &&
      !!formik.errors[controlName]
    );
  };

  return (
    <>
      <View style={{ ...styles.container }}>
        <View style={styles.formGroup}>
          <TextInput
            mode="flat"
            returnKeyType="next"
            returnKeyLabel="next"
            autoCapitalize="none"
            ref={currentPasswordRef}
            error={isInvalidControl('currentPassword')}
            onSubmitEditing={() => newPasswordRef?.current?.focus()}
            onChangeText={formik.handleChange('currentPassword')}
            onBlur={formik.handleBlur('currentPassword')}
            value={formik.values.currentPassword}
            secureTextEntry={!showCurrentPassword}
            label={i18n.t('AbpIdentity::DisplayName:CurrentPassword')}
            style={styles.input}
            underlineStyle={styles.input.underlineStyle}
            underlineColor={styles.input.underlineColor}
            right={
              <TextInput.Icon
                icon={!showCurrentPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            }
          />
          {isInvalidControl('currentPassword') && (
            <ValidationMessage>{formik.errors.currentPassword}</ValidationMessage>
          )}
        </View>

        <View style={styles.formGroup}>
          <TextInput
            mode="flat"
            returnKeyType="next"
            ref={newPasswordRef}
            error={isInvalidControl('newPassword')}
            onSubmitEditing={() => repeatPasswordRef?.current?.focus()}
            onChangeText={formik.handleChange('newPassword')}
            onBlur={formik.handleBlur('newPassword')}
            value={formik.values.newPassword}
            secureTextEntry={!showNewPassword}
            autoCapitalize="none"
            label={i18n.t('AbpIdentity::DisplayName:NewPassword')}
            style={styles.input}
            underlineStyle={styles.input.underlineStyle}
            underlineColor={styles.input.underlineColor}
            right={
              <TextInput.Icon
                icon={!showNewPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            }
          />
          {isInvalidControl('newPassword') && (
            <ValidationMessage>{formik.errors.newPassword}</ValidationMessage>
          )}
        </View>

        <View style={styles.formGroup}>
          <TextInput
            mode="flat"
            returnKeyType="done"
            ref={repeatPasswordRef}
            error={isInvalidControl('repeatPassword')}
            onSubmitEditing={formik.handleSubmit}
            onChangeText={formik.handleChange('repeatPassword')}
            onBlur={formik.handleBlur('repeatPassword')}
            value={formik.values.repeatPassword}
            secureTextEntry={hidePassword}
            autoCapitalize="none"
            label={i18n.t('AbpIdentity::DisplayName:NewPasswordConfirm')}
            style={styles.input}
            underlineStyle={styles.input.underlineStyle}
            underlineColor={styles.input.underlineColor}
            right={
              <TextInput.Icon
                icon={hidePassword ? 'eye-off' : 'eye'}
                onPress={() => setHidePassword(!hidePassword)}
              />
            }
          />
          {isInvalidControl('repeatPassword') && (
            <ValidationMessage>{formik.errors.repeatPassword}</ValidationMessage>
          )}
        </View>

        <FormButtons submit={formik.handleSubmit} cancel={cancel} />
      </View>
    </>
  );
}

ChangePasswordForm.propTypes = {
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    container: {
      margin: 8,
      marginLeft: 16,
      marginRight: 16,
    },
    underlineStyle: {
      backgroundColor: 'transparent',
    },
    underlineColor: '#333333bf',
    borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default ChangePasswordForm;
