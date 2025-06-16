import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const getReferrals = createAsyncThunk(
  'referrals/getReferrals',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const partner_id = state.homeData?.data?.result?.data?.partner?.id
      const response = await apiClient.post(`api/my-referrals`, {
        params: {
          partner_id: partner_id,
        },
      });
      console.log('Response Data:', response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const getReferralsSlice = createSlice({
  name: 'getReferrals',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(getReferrals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getReferralsSlice.reducer;
