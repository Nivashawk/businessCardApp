import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const Delete = createAsyncThunk(
  'auth/Delete',
  async ({email, otp, token}, thunkAPI) => {
    // const navigation = useNavigation();
    try {
      console.log('Email:', email);

      const url = 'api/account/delete';
      const payload = {
         params: {
          email: email,
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

const DeleteSlice = createSlice({
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
      .addCase(Delete.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Delete.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(Delete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOTPData, isOTPVerified, purpose} = DeleteSlice.actions;


export default DeleteSlice.reducer;
