import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for sending OTP (POST request)
export const sentOTP = createAsyncThunk(
  'auth/sentOTP',
  async ({email}, thunkAPI) => {
    try {
      console.log('Sending OTP to email:', email);

      const url = 'api/send_otp';
      const payload = {
        params: {
          email: email.toLowerCase(),
        },
      };

      console.log('OTP payload:', payload);
      const response = await apiClient.post(url, payload);
      
      console.log('OTP API Response:', response);
      return response;
    } catch (error) {
      console.error('OTP API Error:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send OTP',
      );
    }
  },
);

// Async thunk for resending OTP
export const sendOTP = createAsyncThunk(
  'auth/sendOTP', 
  async ({email, purpose}, thunkAPI) => {
    try {
      console.log('Resending OTP to email:', email, 'for purpose:', purpose);

      const url = 'api/send_otp';
      const payload = {
        params: {
          email: email.toLowerCase(),
        },
      };

      console.log('Resend OTP payload:', payload);
      const response = await apiClient.post(url, payload);
      
      console.log('Resend OTP API Response:', response);
      return response.result || response; // Return the result or full response
    } catch (error) {
      console.error('Resend OTP API Error:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to resend OTP',
      );
    }
  },
);

const sendOTPSlice = createSlice({
  name: 'sendOTP',
  initialState: {
    data: null,
    loading: false,
    error: null,
    otpVerified: false,
    purpose: "",
    resendLoading: false,
    resendError: null,
  },
  reducers: {
    // Reset OTP data
    resetOTPData: (state) => {
      state.data = null;
      state.error = null;
      state.resendError = null;
    },
    // Set OTP verification status
    isOTPVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    // Set purpose (Login/Register)
    purpose: (state, action) => {
      state.purpose = action.payload;
    },
    // Clear OTP verification status
    clearOTPVerified: (state) => {
      state.otpVerified = false;
      state.purpose = "";
    },
    // Reset all OTP state
    resetOTPState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.otpVerified = false;
      state.purpose = "";
      state.resendLoading = false;
      state.resendError = null;
    },
  },
  extraReducers: builder => {
    builder
      // Handle sentOTP (initial OTP sending)
      .addCase(sentOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sentOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(sentOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      })
      
      // Handle sendOTP (resending OTP)
      .addCase(sendOTP.pending, state => {
        state.resendLoading = true;
        state.resendError = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.resendLoading = false;
        state.resendError = null;
        // Update data with new OTP response if needed
        if (action.payload) {
          state.data = {
            ...state.data,
            result: action.payload
          };
        }
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.resendLoading = false;
        state.resendError = action.payload;
      });
  },
});

export const { 
  resetOTPData, 
  isOTPVerified, 
  purpose, 
  clearOTPVerified, 
  resetOTPState 
} = sendOTPSlice.actions;

export default sendOTPSlice.reducer;