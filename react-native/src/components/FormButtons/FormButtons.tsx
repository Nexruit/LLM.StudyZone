import i18n from 'i18n-js';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Button } from 'react-native-paper';

function FormButtons({
  submit,
  style = {},
  isSubmitDisabled = false,
  isShowSubmit = true,
  forwardedRef = null,
}) {
  const theme = useTheme();
  return (
    <View style={{ ...styles.container, ...style }}>
      {isShowSubmit ? (
        <Button
          mode="contained"
          onPress={submit}
          disabled={isSubmitDisabled}
          style={styles.button}
          textColor={(theme.colors as any).buttonText}>
          {i18n.t('AbpIdentity::Save')}
        </Button>
      ) : null}
    </View>
  );
}

FormButtons.propTypes = {
  submit: PropTypes.func.isRequired,
  isSubmitDisabled: PropTypes.bool,
  isShowSubmit: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    padding: 4,
  },
});

const Forwarded = forwardRef<any, { submit: any }>((props, ref) => (
  <FormButtons {...props} forwardedRef={ref} />
));

export default Forwarded;
