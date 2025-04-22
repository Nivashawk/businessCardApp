import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AuthNavigator from './authNavigation';
import DrawerNavigation from './drawerNavigation';

export default function RootNavigator() {
  const [auth] = useState(true);

  return (
    <NavigationContainer>
      {auth ? <DrawerNavigation /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
