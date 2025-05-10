import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../api/apiClient';


export const odooConnect = createAsyncThunk(
  'auth/odooConnect', 
  async (_, thunkAPI) => {  
    try {
      console.log("Attempting authentication with fetch-based API client");
      // Use the getFullResponse method to get access to headers
      const response = await apiClient.get('odoo_connect', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // "X-Cookie": "session_id=Fj_p3AaN6gcE2ELS_QMYN3NGtQM6hDtfo6Lt2cYcUiwUV0puGW2ie429XszfnX2zwgTER1X6kglXYnJ0MX7H",
            // 'X-DB': 'thumps18',
            // 'X-Login': 'thumpsbot@yopmail.com',
            // 'X-Password': 'Welcome@123'
            'X-DB': 'thumpsapp_dev',
            'X-Login': 'thumpsbot@yopmail.com',
            'X-Password': 'Welcome@123'
          }
      });

     // Parse the response body
    //  const data = await response.json();
     console.log("Response Data:", response);
     
     return {
        response,
     };
    } catch (error) {
      console.error("Authentication Error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const odooConnectSlice = createSlice({
  name: 'connect',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(odooConnect.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(odooConnect.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.headers = action.payload.headers;
        state.sessionID = action.payload.sessionID;
      })
      .addCase(odooConnect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default odooConnectSlice.reducer;