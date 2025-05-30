import { configureStore } from '@reduxjs/toolkit';
import flowReducer from './flowSlice';

export const store = configureStore({
  reducer: {
    flow: flowReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});