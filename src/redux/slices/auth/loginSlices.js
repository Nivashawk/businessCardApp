import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email }, thunkAPI) => {
    try {
        console.log(email);
        
      const response = await apiClient.post('api/send_otp', {
       "params":  {
            "email": email,
        }
      });
      console.log(response); // Optional: log only the data
      return response; // assuming API responds with user data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;
