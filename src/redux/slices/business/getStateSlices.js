import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const getState = createAsyncThunk(
  'business/getState',
  async ({country_code}, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      const response = await apiClient.post(`api/states`, {
        params: {
          country_id: country_code,
        },
      });
      console.log('Response Data:', response);
      return response;
    } catch (error) {
      console.error('Authentication Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const getStateSlice = createSlice({
  name: 'getState',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(getState.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getState.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getStateSlice.reducer;
