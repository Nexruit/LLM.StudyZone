import { createSelector } from 'reselect';

const getApp = state => state.app;

export function createAppConfigSelector() {
  return createSelector([getApp], state => state.appConfig);
}

export function createLanguageSelector() {
  return createSelector([getApp], state => state?.appConfig?.localization?.currentCulture);
}

export function createLanguagesSelector() {
  return createSelector([getApp], state => state?.appConfig?.localization?.languages);
}

export function createGrantedPolicySelector(key) {
  return createSelector([getApp], state => state?.appConfig?.auth?.grantedPolicies[key] ?? false);
}

export function createThemeSelector() {
  return createSelector([getApp], state => state?.theme ?? 'System');
}

export function createProfilePictureSelector() {
  return createSelector([getApp], state => state?.profilePicture);
}
