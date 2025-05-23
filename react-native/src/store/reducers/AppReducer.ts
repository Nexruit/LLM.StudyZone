import { createReducer } from '@reduxjs/toolkit';
import AppActions from '../actions/AppActions';

const initialState = {
  appConfig: {},
  theme: 'Dark',
  profilePicture: '',
};

export default createReducer(initialState, builder =>
  builder
    .addCase(AppActions.setAppConfig, (state, action) => {
      state.appConfig = action.payload;
    })
    .addCase(AppActions.setThemeAsync, (state, action) => {
      state.theme = action.payload;
    })
    .addCase(AppActions.setProfilePicture, (state, action) => {
      state.profilePicture = action.payload;
    }),
);
