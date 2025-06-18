import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';
import { isOTPVerified, purpose } from './sendOTPSlices';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for registering a user (POST request)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({name, phone, email, country_code, otp, token, referral_code}, thunkAPI) => {
    try {
      const response = await apiClient.post('api/register', {
        params: {
          name,
          email,
          mobile: phone,
          country_code,
          otp,
          token,
          referral_code
        }
      });

      console.log("response register", response);
      
      const responseMessage = response?.result?.message;
      const partnerId = response?.result?.partner_id;

      // Check if registration was successful
      if (responseMessage === 'Registered successful.') {
        // Show success toast
        Toast.show({
          type: 'success',
          text1: responseMessage,
        });

        // Dispatch related actions
        thunkAPI.dispatch(purpose("Register"));
        thunkAPI.dispatch(isOTPVerified(true));

        // Store login status and partner_id in AsyncStorage
        try {
          await AsyncStorage.multiSet([
            ['isLoggedIn', 'true'],
            ['partner_id', partnerId.toString()]
          ]);
        } catch (storageError) {
          console.error('Error storing login data:', storageError);
          // Don't reject the thunk as registration was successful
        }
      } else {
        // Show error toast for registration failure
        Toast.show({
          type: 'error',
          text1: responseMessage || 'Registration failed',
        });
      }

      return response;
    } catch (error) {
      // Handle API errors
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      
      Toast.show({
        type: 'error',
        text1: errorMessage,
      });

      return thunkAPI.rejectWithValue(errorMessage);
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
  reducers: {
    // Add a reducer to clear registration state if needed
    clearRegisterState: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
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
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;
export default registerSlice.reducer;