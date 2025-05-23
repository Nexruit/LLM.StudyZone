import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { changePassword } from '../../api/IdentityAPI';
import LoadingActions from '../../store/actions/LoadingActions';
import { connectToRedux } from '../../utils/ReduxConnect';
import ChangePasswordForm from './ChangePasswordForm';

function ChangePasswordScreen({ navigation, startLoading, clearLoading }) {
  const theme = useTheme();

  const submit = data => {
    startLoading({ key: 'changePassword' });

    changePassword(data)
      .then(() => navigation.goBack())
      .finally(() => clearLoading());
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ChangePasswordForm submit={submit} cancel={() => navigation.goBack()} />
    </View>
  );
}

ChangePasswordScreen.propTypes = {
  startLoading: PropTypes.func.isRequired,
  clearLoading: PropTypes.func.isRequired,
};

export default connectToRedux({
  component: ChangePasswordScreen,
  dispatchProps: {
    startLoading: LoadingActions.start,
    clearLoading: LoadingActions.stop,
  },
});
