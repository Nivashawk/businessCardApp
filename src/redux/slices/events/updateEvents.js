import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const updateEvents = createAsyncThunk(
  'event/update',
  async (
    {
      event_id,  
      name,
      description,
      event_type,
      event_date,
      event_address,
      event_organiser,
      state,
    },
    thunkAPI,
  ) => {
    try {
      console.log(
        'params inside api',
        event_id,
        name,
        description,
        event_type,
        event_date,
        event_address,
        event_organiser,
        state,
      );
      const reduxstate = thunkAPI.getState();
      const partner_id = reduxstate.login?.data?.result?.partner_id;
      console.log("partner id from update event", partner_id);
      

      const response = await apiClient.post(`api/events/update/${event_id}`, {
        "params": {
          "partner_id":partner_id,
          "name":name,
          "description":description,
          "event_type":event_type,
          "event_date":event_date,
          "event_address":event_address,
          "event_organiser":event_organiser,
          "state":state,
          "attachment_ids": [],
        },
      });
      console.log('Response Data:', response);
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const updateEventsSlice = createSlice({
  name: 'updateEvents',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(updateEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default updateEventsSlice.reducer;
