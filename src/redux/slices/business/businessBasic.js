import {createSlice} from '@reduxjs/toolkit';

const BusinessDataSlice = createSlice({
  name: 'getBusinessData',
  initialState: {
    companyName: '',
    yourDesignation: '',
    phone: '',
    email: '',
    description: '',
    industry: '',
    services: '',

    street: '',
    street2: '',
    city: '',
    zip: '',
    state_id: '',
    country_id: '',

    website: '',
    promo_video: '',
    business_card_front: '',
    business_card_back: '',
    logo: '',

    social_insta: '',
    social_linkedin: '',
    social_twitter: '',
    social_fb: '',
    social_youtube: '',
    social_google_business: '',

    active: true,
    is_primary: true,
    is_public: true,
  },
  reducers: {
    updateBusinessBasicData: (state, action) => {
      const {
        companyName,
        yourDesignation,
        phone,
        email,
        description,
        industry,
        services,
      } = action.payload;

      state.companyName = companyName;
      state.yourDesignation = yourDesignation;
      state.phone = phone;
      state.email = email;
      state.description = description;
      state.industry = industry;
      state.services = services;
    },
    updateBusinessAddressData: (state, action) => {
      const {street, street2, city, zip, state_id, country_id} = action.payload;
      console.log('from redux');

      state.street = street;
      state.street2 = street2;
      state.city = city;
      state.zip = zip;
      state.state_id = state_id;
      state.country_id = country_id;
    },
    updateBusinessUploadData: (state, action) => {
      const {
        website,
        promo_video,
        business_card_front,
        business_card_back,
        logo,
      } = action.payload;

      state.website = website;
      state.promo_video = promo_video;
      state.business_card_front = business_card_front;
      state.business_card_back = business_card_back;
      state.logo = logo;
    },
    updateBusinessSocialData: (state, action) => {
      const {
        social_insta,
        social_linkedin,
        social_twitter,
        social_fb,
        social_youtube,
        social_google_business,
      } = action.payload;

      state.social_insta = social_insta;
      state.social_linkedin = social_linkedin;
      state.social_twitter = social_twitter;
      state.social_fb = social_fb;
      state.social_youtube = social_youtube;
      state.social_google_business = social_google_business;
    },
  },
});

export const {
  updateBusinessBasicData,
  updateBusinessAddressData,
  updateBusinessUploadData,
  updateBusinessSocialData,
} = BusinessDataSlice.actions;

export default BusinessDataSlice.reducer;
