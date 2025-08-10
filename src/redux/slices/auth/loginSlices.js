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

      const response = await apiClient.post('api/user/verify', {
        params: {
          email: email.toLowerCase(),
          otp: otp,
          token: token,
        },
      });
      
      console.log('Response login Data:', response);
      
      // Check if login was successful
      if (response?.result?.status === "success") {
        console.log('✅ Login successful, processing...');
        
        const userType = response?.result?.type;
        
        if (userType === '0') {
          // User exists in DB - handle login success
          console.log('👤 User exists in database, proceeding with login...');
          
          // Dispatch Redux actions for successful login
          thunkAPI.dispatch(isOTPVerified(true));
          thunkAPI.dispatch(purpose("Login"));
          
          try {
            const partnerId = response?.result?.partner_id;
            
            console.log('📦 Storing login data to AsyncStorage...');
            console.log('📦 Partner ID to store:', partnerId);
            
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
            Toast.show({
              type: 'error',
              text1: 'Failed to save login data',
              text2: 'Please try logging in again',
            });
            // Don't throw here as login was successful, but storage failed
          }
          
        } else if (userType === '1') {
          // User doesn't exist in DB - will be handled in the component
          console.log('👤 User not found in database, registration required');
        } else {
          console.log('⚠️ Unknown user type:', userType);
        }
        
        return response; // Return successful response for both cases
        
      } else {
        // Login failed - show error toast
        console.log('❌ Login failed:', response?.result?.message);
        
        // Reject with error message
        return thunkAPI.rejectWithValue(
          response?.result?.message || 'Login failed'
        );
      }
      
    } catch (error) {
      console.error('💥 Login error:', error);
      
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
    isLoggedIn: false,
  },
  reducers: {
    // Reset login state
    resetLoginState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.isLoggedIn = false;
    },
    // Handle logout
    logout: (state) => {
      state.data = null;
      state.error = null;
      state.isLoggedIn = false;
    },
    // Set login status manually (useful for AsyncStorage checks)
    setLoginStatus: (state, action) => {
      state.isLoggedIn = action.payload;
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
        
        // Only mark as logged in if user type is 0 (existing user)
        const userType = action.payload?.result?.type;
        if (userType === 0) {
          state.isLoggedIn = true;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
        state.data = null;
      });
  },
});

export const { resetLoginState, logout, setLoginStatus } = loginSlice.actions;
export default loginSlice.reducer;