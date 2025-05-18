import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';
import {isOTPVerified} from './sendOTPSlices';
import Toast from 'react-native-toast-message';

// Async thunk for registering a user (POST request)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({email, otp, token}, thunkAPI) => {
    try {
      console.log(email);

      const response = await apiClient.post('api/login', {
        params: {
          email: email,
          otp: otp,
          token: token,
        },
      });
      console.log('Response Data:', response);
      const message = 'Login successful.';
      if (message === response?.result?.message) {
        Toast.show({
          type: 'success',
          text1: response?.result?.message,
        });
        thunkAPI.dispatch(isOTPVerified());
      } else {
        Toast.show({
          type: 'error',
          text1: response?.result?.message,
        });
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;
