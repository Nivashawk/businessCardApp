import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';
import { isOTPVerified } from './sendOTPSlices';
import Toast from 'react-native-toast-message';

// import {useSelector} from 'react-redux';

// Async thunk for registering a user (POST request)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({name, phone, email, country_code, otp, token}, thunkAPI) => {
    try {
      
      // const state = thunkAPI.getState();
      // const otpData = state.OTPData;
      // console.log("OTP DATA", otpData);
      
      console.log(name, phone, email, country_code, otp, token);
      
      const response = await apiClient.post('api/register', {
        params:{
          name,
          email,
          mobile: phone,
          country_code,
          otp,
          token,
        }
      });
      // console.log(response);
      console.log("Response Data:", response);
      const message = 'Registration successful.'
      if(message === response?.result?.message){
        Toast.show({
          type: 'success',
          text1: response?.result?.message,
        });
        thunkAPI.dispatch(isOTPVerified());
      }else{
        Toast.show({
          type: 'error',
          text1: response?.result?.message,
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);


const registerSlice = createSlice({
  name: 'register',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },

  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registerSlice.reducer;
