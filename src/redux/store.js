import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user/userSlices';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});