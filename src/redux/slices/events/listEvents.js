import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const listEvents = createAsyncThunk(
  'business/listEvents',
  async (_, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      const state = thunkAPI.getState();
      const partner_id = state.login?.data?.result?.partner_id
      // Use the getFullResponse method to get access to headers
      const response = await apiClient.post('api/events/list',{
        "params": {
            "partner_id": partner_id
        }
      });

      // Parse the response body
      //  const data = await response.json();
      // const Jsonresponse = await response.json();
      console.log('Response Data:', response);

      return {
        response,
      };
    } catch (error) {
      console.error('Authentication Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const listEventsSlice = createSlice({
  name: 'listEvents',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(listEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(listEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default listEventsSlice.reducer;
