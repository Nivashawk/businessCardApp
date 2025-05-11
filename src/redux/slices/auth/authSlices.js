import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../api/apiClient';


export const authUser = createAsyncThunk(
  'auth/authUser', 
  async (_, thunkAPI) => {  
    try {
      console.log("Attempting authentication with fetch-based API client");
      
      // Use the getFullResponse method to get access to headers
      const response = await apiClient.getFullResponse('web/session/authenticate', {
        method: 'POST',
        body: JSON.stringify({
          // params:{
          //   db: "thumps18",
          //   login: "thumpsbot@yopmail.com",
          //   password: "Welcome@123"
          // }
          params:{
            db: "thumpsapp_dev",
            login: "thumpsbot@yopmail.com",
            password: "Welcome@123"
          }
        }),
        excludeSessionID: true
      });
      
      // Log response status
      console.log("Response Status:", response.status);
      
      // Access and log headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
        console.log(`${key}: ${value}`);
      });
      
      // Get session cookie
      const setCookieHeader = response.headers.get('set-cookie');
      console.log("Set-Cookie Header:", setCookieHeader);
      
      // Parse the response body
      const data = await response.json();
      console.log("Response Data:", data);
      
      // Store session ID if present
      if (setCookieHeader) {
        const match = setCookieHeader.match(/(session_id=[^;]+)/);
        const sessionId = match ? match[1] : null;
        await AsyncStorage.setItem('sessionID', sessionId);
      }
      
      return {
        data,
        headers
      };
    } catch (error) {
      console.error("Authentication Error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: null,
    headers: null,
    sessionID: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(authUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.headers = action.payload.headers;
        state.sessionID = action.payload.sessionID;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;