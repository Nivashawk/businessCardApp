import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import BottomTabNavigator from './bottomTabNavigation';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator screenOptions={{headerShown: false}} drawerPosition="right">
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
