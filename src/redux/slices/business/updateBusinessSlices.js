import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';
import Toast from 'react-native-toast-message';

// Async thunk for updating a business (POST request)
export const updateBusiness = createAsyncThunk(
  'business/update',
  async (updateData, thunkAPI) => {
    try {
      console.log('Inside update business api');

      const state = thunkAPI.getState();
      const partner_id = state.homeData?.data?.result?.data?.partner?.id;
      console.log('partner_id', partner_id);

      // Extract business_id from the businessData
      const { id: business_id, ...updateFields } = updateData;

      if (!business_id) {
        throw new Error('Business ID is required for update');
      }

      console.log('Update data:', {
        business_id,
        partner_id,
        ...updateFields
      });

      const response = await apiClient.post(`api/business/update/${business_id}`, {
        'params':{
            partner_id: partner_id,
            ...updateFields
        }
      });

      console.log('Response update business Data:', response);
      
      // Check for success status
      if (response?.data?.result?.status === 'success' || response?.result?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: response?.data?.result?.message || response?.result?.message || 'Business updated successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: response?.data?.error?.message || response?.error?.message || 'Failed to update business',
        });
      }
      
      return response?.data || response;
    } catch (error) {
      console.error('Update business error:', error);
      
      // Show error toast
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || error.message || 'Failed to update business',
      });
      
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update business'
      );
    }
  },
);

const updateBusinessSlice = createSlice({
  name: 'updateBusiness',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetUpdateBusiness: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateBusiness.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpdateBusiness, clearUpdateError } = updateBusinessSlice.actions;

export default updateBusinessSlice.reducer;