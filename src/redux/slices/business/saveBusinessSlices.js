import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const saveBusiness = createAsyncThunk(
  'business/saveBusiness',
  async ({sharedBy, businessId, eventId}, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      const state = thunkAPI.getState();
      const partner_id = state.homeData?.data?.result?.data?.partner?.id
      const response = await apiClient.post(`api/share/log`, {
        params: {
          shared_by_id: sharedBy,
          shared_to_id: partner_id,
          business_id: businessId,
          event_id: eventId,
          scan_type: 'user',
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

const saveBusinessSlice = createSlice({
  name: 'saveBusiness',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(saveBusiness.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default saveBusinessSlice.reducer;
