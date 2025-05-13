import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AuthNavigator from './authNavigation';
import DrawerNavigation from './drawerNavigation';
import { useSelector } from 'react-redux';

export default function RootNavigator() {
  // const message = "OTP verified successfully"
  const VerifyState = useSelector(state => state.OTPData);
  const {otpVerified} = VerifyState;


  return (
    <NavigationContainer>
      {
      otpVerified ? 
      <DrawerNavigation /> : 
      <AuthNavigator />
      }
    </NavigationContainer>
  );
}
