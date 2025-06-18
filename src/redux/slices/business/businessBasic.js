import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentTab: 0, // Added missing currentTab property
  companyName: '',
  foundedYear: '',
  gstNumber: '',
  yourDesignation: '',
  phone: '',
  email: '',
  description: '',
  industry: '',
  services: '',
  DOJ:'',
  

  street: '',
  street2: '',
  city: '',
  zip: '',
  state_id: 0,
  country_id: 0,

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
};

const BusinessDataSlice = createSlice({
  name: 'getBusinessData',
  initialState,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    updateBusinessBasicData: (state, action) => {
      const {
        companyName,
        foundedYear,
        gstNumber,
        yourDesignation,
        phone,
        email,
        description,
        industry,
        services,
        DOJ
      } = action.payload;

      state.companyName = companyName;
      state.yourDesignation = yourDesignation;
      state.foundedYear = foundedYear;
      state.gstNumber = gstNumber;
      state.phone = phone;
      state.email = email;
      state.description = description;
      state.industry = industry;
      state.services = services;
      state.DOJ = DOJ;
    },

    updateBusinessAddressData: (state, action) => {
      const {street, street2, city, zip, state_id, country_id} = action.payload;
      // Removed console.log as it's not needed in production

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
    // Reset action to clear all business data except currentTab
    resetBusinessData: state => {
      Object.keys(initialState).forEach(key => {
        if (key !== 'currentTab') {
          state[key] = initialState[key];
        }
      });
    },
    // Reset action to clear all data including currentTab
    resetBusinessDataCompletely: state => {
      Object.keys(initialState).forEach(key => {
        state[key] = initialState[key];
      });
    },
  },
});

export const {
  setCurrentTab,
  updateBusinessBasicData,
  updateBusinessAddressData,
  updateBusinessUploadData,
  updateBusinessSocialData,
  resetBusinessData,
  resetBusinessDataCompletely,
} = BusinessDataSlice.actions;

export default BusinessDataSlice.reducer;
