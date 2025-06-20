import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const Deactivate = createAsyncThunk(
  'auth/deactivate',
  async ({email, otp, token}, thunkAPI) => {
    // const navigation = useNavigation();
    try {
      console.log('Email:', email);

      const url = 'api/account/deactivate';
      const payload = {
         params: {
          email: email.toLowerCase(),
          otp: otp,
          token: token,
        },
      };

      console.log('payload', payload);
      const response = await apiClient.post(url, payload);
      // navigation.navigate('Verify')r
      console.log('API Response:', response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const DeactivateSlice = createSlice({
  name: 'sendOTP',
  initialState: {
    data: null,
    loading: false,
    error: null,
    otpVerified: false,
    purpose: ""
  },
  reducers: {
    resetOTPData: (state) => {
      state.data = null;
    },
    isOTPVerified: (state) => {
      state.otpVerified = true
    },
    purpose: (state, action) => {
      state.purpose = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(Deactivate.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Deactivate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(Deactivate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOTPData, isOTPVerified, purpose} = DeactivateSlice.actions;


export default DeactivateSlice.reducer;
