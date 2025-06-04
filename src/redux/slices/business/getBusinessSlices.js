import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

export const getBusiness = createAsyncThunk(
  'business/getBusiness',
  async ({id, sharedBy=null}, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const partner_id = state.homeData?.data?.result?.data?.partner?.id
      console.log('Attempting authentication with fetch-based API client');
      // Use the getFullResponse method to get access to headers
      const response = await apiClient.post(`/api/business/${id}`,{
        "params": {
            "partner_id": sharedBy !== null ? sharedBy : partner_id
        }
      });

      // Parse the response body
      //  const data = await response.json();
      // const text = await response.text();
      console.log('Response Data:', response);

      return response;
    } catch (error) {
      console.error('Authentication Error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const getBusinessSlice = createSlice({
  name: 'getBusiness',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(getBusiness.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getBusinessSlice.reducer;
