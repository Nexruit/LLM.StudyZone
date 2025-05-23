import React from 'react';
import { TextInput } from 'react-native-paper';
import i18n from 'i18n-js';
import { FormikValues } from 'formik';

type Props = {
  mode: 'flat' | 'outlined' | undefined;
  formik: FormikValues;
  control: any;
  returnKeyType: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing: () => void;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  value: string;
  autoCapitalize;
  label: string;
  styles: any;
};

const AbpTextInput = React.forwardRef<any, Props>((props, ref) => {
  const {
    mode,
    formik,
    control,
    returnKeyType,
    value,
    onSubmitEditing,
    onChangeText,
    onBlur,
    autoCapitalize,
    label,
    styles,
  } = props;

  return (
    <TextInput
      mode={mode || 'flat'}
      ref={ref}
      error={!!formik.errors[control] && !!formik.touched[control]}
      returnKeyType={returnKeyType || 'next'}
      onSubmitEditing={onSubmitEditing}
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value || formik.values[control]}
      autoCapitalize={autoCapitalize || 'none'}
      label={i18n.t(label)}
      style={styles}
      {...props}
    />
  );
});

export default AbpTextInput;
