import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';




import userReducer from './slices/user/homeSlices';
import authReducer from './slices/auth/authSlices';
import registerReducer from './slices/auth/registerSlices';
import sentOTPReducer from './slices/auth/sendOTPSlices';
import loginReducer from './slices/auth/loginSlices';
import odooConnectReducer  from './slices/auth/odooConnectSlices';
import DeactivateReducer  from './slices/auth/accountDeactivateSlices';
import DeleteReducer  from './slices/auth/accountDeleteSlices';

import createBusinessReducer  from './slices/business/createBusinessSlices';
import BusinessDataSliceReducer  from './slices/business/businessBasic';
import listBusinessSliceReducer  from './slices/business/listBusinessSlices';
import getBusinessReducer from './slices/business/getBusinessSlices';
import getCountryReducer  from './slices/business/getCountrySlices';
import getStateReducer from './slices/business/getStateSlices';
import getBusinessQRReducer  from './slices/business/generateQRSlices';
import saveBusinessSliceReducer  from './slices/business/saveBusinessSlices';
import sharedBusinessSliceReducer from './slices/business/sharedBusinessSlices';
import receivedBusinessSliceReducer  from './slices/business/receivedBusinessSlices';
import updateBusinessSliceReducer from './slices/business/updateBusinessSlices';
import getIndustryReducer from './slices/business/getIndustrySlices';

import createEventReducer from './slices/events/createEvents';
import listEventsReducer  from './slices/events/listEvents';
import getEventReducer  from './slices/events/getEvents';
import updateEventsSliceReducer from './slices/events/updateEvents';

import getReferralsSlicesReducer  from './slices/referral/getReferralsSlices';
import inviteSlicesReducer from './slices/referral/inviteSlices';

import getHomeReducer  from './slices/user/homeSlices';

const rootReducer = {
  // user: userReducer,
  auth: authReducer,
  register: registerReducer,
  OTPData : sentOTPReducer,
  login: loginReducer,
  odooConnect: odooConnectReducer,
  accountDeactivate: DeactivateReducer,
  accountDelete: DeleteReducer,

  createBusiness: createBusinessReducer,
  businessData: BusinessDataSliceReducer,
  listBusinessData: listBusinessSliceReducer,
  getBusinessData: getBusinessReducer,
  countries: getCountryReducer,
  states: getStateReducer,
  QRData: getBusinessQRReducer,
  saveBusiness: saveBusinessSliceReducer,
  sharedBusiness: sharedBusinessSliceReducer,
  receivedBusiness: receivedBusinessSliceReducer,
  updateBusiness: updateBusinessSliceReducer,
  industries: getIndustryReducer,

  eventData : createEventReducer,
  listEventsData : listEventsReducer,
  getEventData : getEventReducer,
  updateEventData : updateEventsSliceReducer,

  invite : inviteSlicesReducer,
  getMyReferrals : getReferralsSlicesReducer,

  homeData : getHomeReducer
}

export const store = configureStore({
  reducer: rootReducer,
},
);