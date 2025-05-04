import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';

// Async thunk for registering a user (POST request)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, phone, email }, thunkAPI) => {
    try {
        console.log("inside redux", name, phone, email);
        
      const response = await apiClient.post('api/request_otp', {
       "params":  {
            "name": name,
            "mobile": phone,
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

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registerSlice.reducer;
