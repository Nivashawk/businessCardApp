import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)

export const getHome = createAsyncThunk(
  'user/home',
  async ({partner_id},thunkAPI) => {
    try {
      
      const state = thunkAPI.getState();
      
      const purpose = state?.OTPData?.purpose
      // let partner_id;
      console.log("======>",purpose);
      
      // if (purpose === 'Login') {
      //   console.log("inside login condition");
      //   console.log(state);
      //   partner_id = state.login?.data?.result?.partner_id;
      //   console.log("partner_id in home api 1", partner_id);
      // } else {
      //   partner_id = state.register?.data?.result?.partner_id;
      //   console.log("partner_id in home api 2", partner_id);
      // }

      console.log("partner_id in home api", partner_id);
      
      const response = await apiClient.post('api/home', {
        "params": {
            "partner_id": partner_id
        }
      });

      console.log('Response Data home:', response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const getHomeSlice = createSlice({
  name: 'getHome',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(getHome.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHome.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getHomeSlice.reducer;
