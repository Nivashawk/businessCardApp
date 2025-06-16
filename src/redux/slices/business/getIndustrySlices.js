import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const getIndustry = createAsyncThunk(
  'business/getIndustry',
  async (_, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      const response = await apiClient.post(`api/industries`,{});
      console.log('Response Data:', response);
      return response;
    } catch (error) {
      console.error('Authentication Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const getIndustrySlice = createSlice({
  name: 'getIndustry',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(getIndustry.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIndustry.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getIndustrySlice.reducer;
