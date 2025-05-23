import { createReducer } from '@reduxjs/toolkit';
import LoadingActions from '../actions/LoadingActions';

const initialState = { activeLoadings: {}, loading: false };

export default createReducer(initialState, builder =>
  builder
    .addCase(LoadingActions.start, (state, action) => {
      const { key, opacity } = (action.payload as { key: string; opacity: number }) || {};

      return {
        ...state,
        actives: { ...state.activeLoadings, [key]: action },
        loading: true,
        opacity,
      };
    })
    .addCase(LoadingActions.stop, (state, action) => {
      const { activeLoadings } = state || {};
      const { key } = (action.payload as { key: string }) || {};

      if (key) {
        delete state.activeLoadings[key];
      }

      if (activeLoadings) {
        state.loading = !!Object.keys(activeLoadings)?.length;
      }
    })
    .addCase(LoadingActions.clear, (state, action) => {}),
);
