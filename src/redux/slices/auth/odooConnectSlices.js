import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../api/apiClient';

export const odooConnect = createAsyncThunk(
  'auth/odooConnect',
  async (_, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      // Use the getFullResponse method to get access to headers
      const response = await apiClient.getFullResponse('odoo_connect', {
        method: 'GET',
        isOdooConnect: true,
      });

      // Parse the response body
      //  const data = await response.json();
      const text = await response.text();
      console.log('Response Data:', text);

      return {
        response,
      };
    } catch (error) {
      console.error('Authentication Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const odooConnectSlice = createSlice({
  name: 'connect',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(odooConnect.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(odooConnect.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.headers = action.payload.headers;
        state.sessionID = action.payload.sessionID;
      })
      .addCase(odooConnect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default odooConnectSlice.reducer;
