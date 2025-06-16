import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const receivedBusiness = createAsyncThunk(
  'business/receivedBusiness',
  async (_, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      const state = thunkAPI.getState();
      const partner_id = state.homeData?.data?.result?.data?.partner?.id
      const response = await apiClient.post(`api/share/received`, {
        params: {
          partner_id: partner_id,
        },
      });
      console.log('Response for saved business:', response);
      return response;
    } catch (error) {
      console.error('Authentication Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const receivedBusinessSlice = createSlice({
  name: 'sharedBusireceivedBusinessness',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(receivedBusiness.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(receivedBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(receivedBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default receivedBusinessSlice.reducer;
