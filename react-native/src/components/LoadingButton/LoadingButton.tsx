import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';

export default function LoadingButton({ loading = false, style = {}, children = null, ...props }) {
  return (
    <Button mode="text" style={styles.button} {...props}>
      {children}
      {loading ? <ActivityIndicator /> : null}
    </Button>
  );
}

LoadingButton.propTypes = {
  ...Button.propTypes,
  loading: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    marginBottom: 16,
  },
});
