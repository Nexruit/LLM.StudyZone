import { createAction } from '@reduxjs/toolkit';

const fetchAppConfigAsync = createAction(
  'app/fetchAppConfigAsync',
  ({ callback = () => {}, showLoading = true } = {}) => ({ payload: { callback, showLoading } }),
);

const setAppConfig = createAction('app/setAppConfig');

const setLanguageAsync = createAction('app/setLanguageAsync', payload => ({ payload }));

const setThemeAsync = createAction('app/setThemeAsync');

const setProfilePicture = createAction('app/setProfilePicture');

const logoutAsync = createAction('app/logoutAsync');

export default {
  fetchAppConfigAsync,
  setAppConfig,
  setLanguageAsync,
  setThemeAsync,
  setProfilePicture,
  logoutAsync,
};
