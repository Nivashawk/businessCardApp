import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomHeader from '../components/customHeader';

import BottomTabNavigator from './bottomTabNavigation';
import BusinessStack from './businessStack';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator screenOptions={{headerShown: false}} drawerPosition="right">
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
      <Drawer.Screen name="My Businesses" component={BusinessStack} />
    </Drawer.Navigator>
  );
}
