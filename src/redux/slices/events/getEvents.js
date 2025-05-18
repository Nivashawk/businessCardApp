import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const getEvent = createAsyncThunk(
  'event/get',
  async (
    {
      partner_id
    },
    thunkAPI,
  ) => {
    try {
      const response = await apiClient.get(`api/events/1?partner_id=${partner_id}`);
      console.log('Response Data:', response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const getEventSlice = createSlice({
  name: 'getEvent',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(getEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getEventSlice.reducer;
