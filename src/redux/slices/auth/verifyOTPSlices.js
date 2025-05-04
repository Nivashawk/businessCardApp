import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async ({ email, otp, partner_id,name, purpose }, thunkAPI) => {
    try {
      console.log('Purpose:', purpose);
      console.log('Email:', email);
      console.log('OTP:', otp);
      console.log('partner_id:', partner_id);
      console.log('partner_id:', name);

      let url = '';
      let payload = {};

      if (purpose === 'Login') {
        url = 'api/verify_otp';
        payload = {
          "params": {
            "email": email,
            "otp": otp
        }
        };
      } else if (purpose === 'Register') {
        url = 'api/verify_otp_register';
        payload = {
          "params": {
            "partner_id": partner_id,
            "otp": otp,
            "name": name
        }
        };
      } else {
        throw new Error('Invalid OTP verification purpose');
      }

      console.log("payload", payload);
      const response = await apiClient.post(url, payload);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const verifySlice = createSlice({
  name: 'verify',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default verifySlice.reducer;
