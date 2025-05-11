import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';
import { useNavigation } from '@react-navigation/native';

// Async thunk for registering a user (POST request)
export const sentOTP = createAsyncThunk(
  'auth/sentOTP',
  async ({email, purpose}, thunkAPI) => {
    // const navigation = useNavigation();
    try {
      console.log('Purpose:', purpose);
      console.log('Email:', email);

      const url = '/api/send_otp';
      const payload = {
        params: {
          email: email,
        },
      };

      console.log('payload', payload);
      const response = await apiClient.post(url, payload);
      // navigation.navigate('Verify')
      console.log('API Response:', response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
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
  },
  extraReducers: builder => {
    builder
      .addCase(sentOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sentOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(sentOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sendOTPSlice.reducer;
