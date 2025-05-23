import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useFocusEffect } from '@react-navigation/native';
import {
  createTenant,
  getTenantById,
  removeTenant,
  updateTenant,
  getEditions,
} from '../../api/SaasAPI';
import LoadingActions from '../../store/actions/LoadingActions';
import { createLoadingSelector } from '../../store/selectors/LoadingSelectors';
import { connectToRedux } from '../../utils/ReduxConnect';
import CreateUpdateTenantForm from './CreateUpdateTenantForm';

function CreateUpdateTenantScreen({ navigation, route, startLoading, clearLoading }) {
  const [tenant, setTenant] = useState();
  const [editions, setEditions] = useState();
  const tenantId = route.params?.tenantId;

  const remove = () => {
    startLoading({ key: 'removeTenant' });
    removeTenant(tenantId)
      .then(() => navigation.goBack())
      .finally(() => clearLoading());
  };

  useFocusEffect(
    useCallback(() => {
      if (tenantId) {
        getTenantById(tenantId).then((data = {}) => setTenant(data));
      }
      getEditions().then(data => setEditions(data));
    }, []),
  );

  const submit = data => {
    startLoading({ key: 'saveTenant' });
    (data.id ? updateTenant(data, tenantId) : createTenant(data))
      .then(() => navigation.goBack())
      .finally(() => clearLoading());
  };

  const renderForm = () => (
    <CreateUpdateTenantForm
      editingTenant={tenant}
      editions={editions && editions.totalCount > 0 ? editions.items : []}
      submit={submit}
      remove={remove}
    />
  );

  if (tenantId && tenant) {
    return renderForm();
  }

  if (!tenantId) {
    return renderForm();
  }

  return null;
}

CreateUpdateTenantScreen.propTypes = {
  startLoading: PropTypes.func.isRequired,
  clearLoading: PropTypes.func.isRequired,
};

export default connectToRedux({
  component: CreateUpdateTenantScreen,
  stateProps: state => ({ loading: createLoadingSelector()(state) }),
  dispatchProps: {
    startLoading: LoadingActions.start,
    clearLoading: LoadingActions.stop,
  },
});
