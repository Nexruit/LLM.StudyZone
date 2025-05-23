import React, { useRef, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Platform } from 'react-native';
import { useFormik } from 'formik';
import i18n from 'i18n-js';
import { useTheme, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { FormButtons } from '../../components/FormButtons';
import ValidationMessage from '../../components/ValidationMessage/ValidationMessage';
import AbpSelect from '../../components/Select/Select';

const TenantActivationState = {
  Active: 0,
  ActiveWithLimitedTime: 1,
  Passive: 2,
};

const TenantActivationStateArr = Object.entries(TenantActivationState).map(([key, val]) => ({
  id: val,
  displayName: i18n.t('Saas::Enum:TenantActivationState.' + key),
}));

const validations = {
  name: Yup.string().required('AbpAccount::ThisFieldIsRequired.'),
};

const props = {
  underlineStyle: { backgroundColor: 'transparent' },
  underlineColor: '#333333bf',
};

function CreateUpdateTenantForm({ editingTenant = {}, editions = [], submit }) {
  const tenantNameRef = useRef();
  const adminEmailRef = useRef();
  const adminPasswordRef = useRef();
  const editionRef = useRef();

  const [hidePassword, setHidePassword] = useState(true);
  const theme = useTheme();

  const [editionVisible, setEditionVisible] = useState(false);
  const [activationVisible, setActivationVisible] = useState(false);

  const onSubmit = values => {
    if (!formik.isValid) {
      return;
    }

    submit({
      ...editingTenant,
      ...values,
      ...(!values.editionId && { editionId: null }),
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      ...validations,
      ...(!editingTenant.id && {
        adminEmailAddress: Yup.lazy(() =>
          Yup.string()
            .required('AbpAccount::ThisFieldIsRequired.')
            .email('AbpAccount::ThisFieldIsNotAValidEmailAddress.'),
        ),
        adminPassword: Yup.lazy(() => Yup.string().required('AbpAccount::ThisFieldIsRequired.')),
      }),
    }),
    initialValues: {
      lockoutEnabled: false,
      twoFactorEnabled: false,
      editionDisplayName: editingTenant.id ? editingTenant.editionName : '',
      activationState: 0,
      ...editingTenant,
    },
    onSubmit,
    validateOnMount: false,
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

  const inputStyle = { ...styles.input, backgroundColor: theme.colors.primaryContainer };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AbpSelect
        key="editionSelect"
        title={i18n.t('Saas::Editions')}
        visible={editionVisible}
        items={editions}
        hasDefualtItem={true}
        hideModalFn={() => setEditionVisible(false)}
        selectedItem={formik.values.editionId}
        setSelectedItem={id => {
          formik.setFieldValue('editionId', id, false);
          formik.setFieldValue(
            'editionDisplayName',
            editions.find(f => f.id === id)?.displayName || null,
            false,
          );
        }}
      />

      <AbpSelect
        key="activationState"
        title={i18n.t('Saas::ActivationState')}
        visible={activationVisible}
        items={TenantActivationStateArr}
        hideModalFn={() => setActivationVisible(false)}
        selectedItem={formik.values.activationState}
        setSelectedItem={state => {
          formik.setFieldValue('activationState', state, false);
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'margin'}>
        <View style={styles.formGroup}>
          <TextInput
            mode="flat"
            ref={tenantNameRef}
            error={isInvalidControl('name')}
            onChangeText={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
            value={formik.values.name}
            autoCapitalize="none"
            returnKeyType="next"
            label={i18n.t('Saas::TenantName')}
            style={inputStyle}
            {...props}
          />

          {isInvalidControl('name') && <ValidationMessage>{formik.errors.name}</ValidationMessage>}
        </View>

        <View style={styles.formGroup}>
          <TextInput
            ref={editionRef}
            label={i18n.t('Saas::Edition')}
            onPress={() => setEditionVisible(true)}
            right={<TextInput.Icon onPress={() => setEditionVisible(true)} icon="menu-down" />}
            style={inputStyle}
            editable={false}
            value={formik.values.editionDisplayName}
            {...props}
          />
        </View>

        {!editingTenant.id && (
          <>
            <View style={styles.formGroup}>
              <TextInput
                mode="flat"
                ref={adminEmailRef}
                error={isInvalidControl('adminEmailAddress')}
                onChangeText={formik.handleChange('adminEmailAddress')}
                onBlur={formik.handleBlur('adminEmailAddress')}
                value={formik.values.adminEmailAddress}
                autoCapitalize="none"
                onSubmitEditing={() => adminPasswordRef?.current?.focus()}
                returnKeyType="next"
                label={i18n.t('Saas::DisplayName:AdminEmailAddress')}
                style={inputStyle}
                {...props}
              />

              {isInvalidControl('adminEmailAddress') && (
                <ValidationMessage>{formik.errors.adminEmailAddress}</ValidationMessage>
              )}
            </View>
            <View style={styles.formGroup}>
              <TextInput
                mode="flat"
                returnKeyType="done"
                ref={adminPasswordRef}
                error={isInvalidControl('adminPassword')}
                secureTextEntry={hidePassword}
                onChangeText={formik.handleChange('adminPassword')}
                onBlur={formik.handleBlur('adminPassword')}
                value={formik.values.adminPassword}
                autoCapitalize="none"
                label={i18n.t('Saas::DisplayName:AdminPassword')}
                style={inputStyle}
                {...props}
                right={
                  <TextInput.Icon
                    icon={hidePassword ? 'eye-off' : 'eye'}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                }
              />
              {isInvalidControl('adminPassword') && (
                <ValidationMessage>{formik.errors.adminPassword}</ValidationMessage>
              )}
            </View>
          </>
        )}

        <FormButtons submit={formik.handleSubmit} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 0,
  },
});

CreateUpdateTenantForm.propTypes = {
  editingTenant: PropTypes.object,
  editions: PropTypes.array,
  submit: PropTypes.func.isRequired,
};

export default CreateUpdateTenantForm;
