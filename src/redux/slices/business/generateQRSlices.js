import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const getBusinessQR = createAsyncThunk(
  'business/getCountry',
  async ({business_id, event_id}, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      const state = thunkAPI.getState();
      const partner_id = state.homeData?.data?.result?.data?.partner?.id
      const response = await apiClient.post(`api/business/share-preview`, {
        params: {
          shared_by_id: partner_id,
          business_id: business_id,
          event_id: event_id,
        },
      });
      console.log('Response Data QR:', response);
      return response;
    } catch (error) {
      console.error('Authentication Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const getBusinessQRSlice = createSlice({
  name: 'getBusinessQR',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
   reducers: {
    resetQRData: (state) => {
      state.data = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getBusinessQR.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBusinessQR.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getBusinessQR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetQRData } = getBusinessQRSlice.actions;
export default getBusinessQRSlice.reducer;
