import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';
import {isOTPVerified, purpose} from './sendOTPSlices';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for logging in a user (POST request)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({email, otp, token}, thunkAPI) => {
    try {
      console.log('Login attempt for email:', email);

      const response = await apiClient.post('api/login', {
        params: {
          email: email,
          otp: otp,
          token: token,
        },
      });
      
      console.log('Response login Data:', response);
      
      // Check if login was successful
      if (response?.result?.message === 'Login successful.') {
        console.log('✅ Login successful, processing...');
        
        // Show success toast
        Toast.show({
          type: 'success',
          text1: response.result.message,
        });
        
        // Dispatch Redux actions
        thunkAPI.dispatch(purpose("Login"));
        thunkAPI.dispatch(isOTPVerified(true));
        
        // Store data in AsyncStorage with enhanced logging
        try {
          const partnerId = response?.result?.partner_id;
          
          console.log('📦 Storing to AsyncStorage...');
          console.log('📦 Partner ID to store:', partnerId);
          console.log('📦 Partner ID type:', typeof partnerId);
          
          // Store login status
          await AsyncStorage.setItem('isLoggedIn', 'true');
          console.log('✅ Stored isLoggedIn: true');
          
          // Store partner_id with proper validation
          if (partnerId !== undefined && partnerId !== null) {
            const partnerIdString = partnerId.toString();
            await AsyncStorage.setItem('partner_id', partnerIdString);
            console.log('✅ Stored partner_id:', partnerIdString);
            
            // Verify storage immediately
            const storedPartnerId = await AsyncStorage.getItem('partner_id');
            console.log('🔍 Verification - Stored partner_id:', storedPartnerId);
          } else {
            console.error('❌ Partner ID is undefined or null:', partnerId);
            throw new Error('Partner ID is missing from response');
          }
          
        } catch (storageError) {
          console.error('💥 Error storing to AsyncStorage:', storageError);
          // You might want to show an error toast here
          Toast.show({
            type: 'error',
            text1: 'Failed to save login data',
            text2: 'Please try logging in again',
          });
          // Don't throw here as login was successful, but storage failed
        }
        
        return response; // Return successful response
        
      } else {
        // Login failed - show error toast
        console.log('❌ Login failed:', response?.result?.message);
        Toast.show({
          type: 'error',
          text1: response?.result?.message || 'Login failed',
        });
        
        // Reject with error message
        return thunkAPI.rejectWithValue(
          response?.result?.message || 'Login failed'
        );
      }
      
    } catch (error) {
      console.error('💥 Login error:', error);
      
      // Show error toast
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || error.message || 'Login failed',
      });
      
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
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
    isLoggedIn: false, // Added to track login status
  },
  reducers: {
    // Add a reducer to reset login state if needed
    resetLoginState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.isLoggedIn = false;
    },
    // Add a reducer to handle logout
    logout: (state) => {
      state.data = null;
      state.error = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.isLoggedIn = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.isLoggedIn = true; // Mark as successfully logged in
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
        state.data = null; // Clear any previous data
      });
  },
});

export const { resetLoginState, logout } = loginSlice.actions;
export default loginSlice.reducer;