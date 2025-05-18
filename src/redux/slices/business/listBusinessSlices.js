import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const listBusiness = createAsyncThunk(
  'business/listBusiness',
  async (_, thunkAPI) => {
    try {
      console.log('Attempting authentication with fetch-based API client');
      // Use the getFullResponse method to get access to headers
      const response = await apiClient.post('api/business/list',{
        "params": {
            "partner_id": 18
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

const listBusinessSlice = createSlice({
  name: 'listBusiness',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(listBusiness.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(listBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default listBusinessSlice.reducer;
