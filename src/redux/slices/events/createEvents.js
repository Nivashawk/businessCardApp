import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const createEvents = createAsyncThunk(
  'event/create',
  async (
    {
      partner_id,
      name,
      description,
      event_type,
      event_date,
      event_address,
      event_organiser,
      state
    },
    thunkAPI,
  ) => {
    try {
      console.log("params inside api",
        partner_id,
        name,
        description,
        event_type,
        event_date,
        event_address,
        event_organiser,
        state
    );

      const response = await apiClient.post('api/events/create', {
        params: {
            partner_id,
            name,
            description,
            event_type,
            event_date,
            event_address,
            event_organiser,
            state
        },
      });
      console.log('Response Data:', response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const createEventSlice = createSlice({
  name: 'createEvent',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(createEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default createEventSlice.reducer;
