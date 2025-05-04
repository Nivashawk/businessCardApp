import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cookies} from '@react-native-cookies/cookies';


export const authUser = createAsyncThunk(
  'auth/authUser', 
  async (thunkAPI) => {  
    try {
      console.log("before AUTH");
      const response = await apiClient.get('odoo_connect');
      console.log(response);
      return response.data;  // Add this return statement
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(authUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
