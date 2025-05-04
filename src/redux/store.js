import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';




import userReducer from './slices/user/userSlices';
import authReducer from './slices/auth/authSlices';
import registerReducer from './slices/auth/registerSlices';
import verifyReducer  from './slices/auth/verifyOTPSlices';
import loginReducer from './slices/auth/loginSlices';

const rootReducer = {
  user: userReducer,
  auth: authReducer,
  register: registerReducer,
  verify : verifyReducer,
  login: loginReducer
}

export const store = configureStore({
  reducer: rootReducer,
},
);