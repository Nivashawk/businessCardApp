import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';




import userReducer from './slices/user/homeSlices';
import authReducer from './slices/auth/authSlices';
import registerReducer from './slices/auth/registerSlices';
import sentOTPReducer from './slices/auth/sendOTPSlices';
import loginReducer from './slices/auth/loginSlices';
import odooConnectReducer  from './slices/auth/odooConnectSlices';

import createBusinessReducer  from './slices/business/createBusinessSlices';
import BusinessDataSliceReducer  from './slices/business/businessBasic';
import listBusinessSliceReducer  from './slices/business/listBusinessSlices';
import getBusinessReducer from './slices/business/getBusinessSlices';
import getCountryReducer  from './slices/business/getCountrySlices';
import getStateReducer from './slices/business/getStateSlices';

import createEventReducer from './slices/events/createEvents';
import listEventsReducer  from './slices/events/listEvents';
import getEventReducer  from './slices/events/getEvents';
import updateEventsSliceReducer from './slices/events/updateEvents';

import getHomeReducer  from './slices/user/homeSlices';

const rootReducer = {
  // user: userReducer,
  auth: authReducer,
  register: registerReducer,
  OTPData : sentOTPReducer,
  login: loginReducer,
  odooConnect: odooConnectReducer,

  createBusiness: createBusinessReducer,
  businessData: BusinessDataSliceReducer,
  listBusinessData: listBusinessSliceReducer,
  getBusinessData: getBusinessReducer,
  countries: getCountryReducer,
  states: getStateReducer,

  eventData : createEventReducer,
  listEventsData : listEventsReducer,
  getEventData : getEventReducer,
  updateEventData : updateEventsSliceReducer,

  homeData : getHomeReducer
}

export const store = configureStore({
  reducer: rootReducer,
},
);