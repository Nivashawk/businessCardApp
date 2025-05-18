import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';




import userReducer from './slices/user/userSlices';
import authReducer from './slices/auth/authSlices';
import registerReducer from './slices/auth/registerSlices';
import sentOTPReducer from './slices/auth/sendOTPSlices';
import loginReducer from './slices/auth/loginSlices';
import odooConnectReducer  from './slices/auth/odooConnectSlices';

import createBusinessReducer  from './slices/business/createBusinessSlices';
import BusinessDataSliceReducer  from './slices/business/businessBasic';
import listBusinessSliceReducer  from './slices/business/listBusinessSlices';

import createEventReducer from './slices/events/createEvents';

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

  eventData : createEventReducer
}

export const store = configureStore({
  reducer: rootReducer,
},
);