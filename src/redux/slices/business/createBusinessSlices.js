import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/apiClient';
import { useNavigation } from '@react-navigation/native';

// Async thunk for registering a user (POST request)
export const createBusiness = createAsyncThunk(
  'business/create',
  async (
    {
      name,
      designation,
      business_mobile,
      business_email,
      description,
      industry,
      services_products,
      date_of_joining,
      street,
      street2,
      city,
      zip,
      state_id,
      country_id,
      website,
      promo_video,
      business_card_front,
      business_card_back,
      logo,
      social_insta,
      social_linkedin,
      social_twitter,
      social_fb,
      social_youtube,
      social_google_business,
      active,
      is_primary,
      is_public,
    },
    thunkAPI,
  ) => {
    try {
        const state = thunkAPI.getState();
        const partner_id = state.login?.data?.result?.partner_id
        const navigation = useNavigation();
      console.log(
        "param data",
        partner_id,
        name,
        designation,
        business_mobile,
        business_email,
        description,
        industry,
        services_products,
        date_of_joining,
        street,
        street2,
        city,
        zip,
        state_id,
        country_id,
        website,
        promo_video,
        business_card_front,
        business_card_back,
        logo,
        social_insta,
        social_linkedin,
        social_twitter,
        social_fb,
        social_youtube,
        social_google_business,
        active,
        is_primary,
        is_public,
      );

      const response = await apiClient.post('api/business/create', {
        params: {
          partner_id: partner_id,
          name,
          designation,
          business_mobile,
          business_email,
          description,
          industry,
          services_products,
          date_of_joining,
          street,
          street2,
          city,
          zip,
          state_id,
          country_id,
          website,
          promo_video,
          business_card_front,
          business_card_back,
          logo,
          social_insta,
          social_linkedin,
          social_twitter,
          social_fb,
          social_youtube,
          social_google_business,
          active,
          is_primary,
          is_public,
        },
      });
      console.log('Response Data:', response);
      const status = 'success';
      if (status === response?.result?.status) {
        Toast.show({
          type: 'success',
          text1: response?.result?.message,
        });
        navigation.navigate("Home")
      } else {
        Toast.show({
          type: 'error',
          text1: response?.result?.message,
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const createBusinessSlice = createSlice({
  name: 'createBusiness',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(createBusiness.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default createBusinessSlice.reducer;
