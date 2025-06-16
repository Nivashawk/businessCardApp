import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const getEvent = createAsyncThunk(
  'event/get',
  async (
    {
      event_id
    },
    thunkAPI,
  ) => {
    try {
      const state = thunkAPI.getState();
      const partner_id = state.homeData?.data?.result?.data?.partner?.id
      const response = await apiClient.post(`api/events/${event_id}`,{
        "params": {
            "partner_id": partner_id
        }
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

const getEventSlice = createSlice({
  name: 'getEvent',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
   reducers: {
    resetGetEvents: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
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
      })
  },
});

export const { resetGetEvents } = getEventSlice.actions;


export default getEventSlice.reducer;
