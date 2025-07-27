import { configureStore } from '@reduxjs/toolkit';
import flightReducer from './slices/flightSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    flights: flightReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});