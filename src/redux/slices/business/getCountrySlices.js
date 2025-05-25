import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const getCountry = createAsyncThunk(
  'business/getCountry',
  async (_, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      const response = await apiClient.post(`api/countries`,{});
      console.log('Response Data:', response);
      return response;
    } catch (error) {
      console.error('Authentication Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const getCountrySlice = createSlice({
  name: 'getCountry',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(getCountry.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getCountrySlice.reducer;
