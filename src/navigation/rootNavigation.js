import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AuthNavigator from './authNavigation';
import DrawerNavigation from './drawerNavigation';
import { useSelector } from 'react-redux';

export default function RootNavigator() {
  const message = "OTP verified successfully"
  // const VerifyState = useSelector(state => state.verify);
  // const {data} = VerifyState;


  return (
    <NavigationContainer>
      {
      // data?.result?.message === message ? 
      // <DrawerNavigation /> : 
      <AuthNavigator />
      }
    </NavigationContainer>
  );
}
