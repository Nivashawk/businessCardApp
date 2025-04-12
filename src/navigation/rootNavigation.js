import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import AuthNavigator from './authNavigation';
import BottomTabNavigator from './bottomTabNavigation'; 


import BusinessDetails from '../screens/business/businessDetails';
import CreateBusiness from '../screens/business/createBusiness';
import ListBusiness from '../screens/business/listBusiness';
import CreateEvent from '../screens/event/createEvent';
import EventList from '../screens/event/eventList';
import GenerateQR from '../screens/scan/generateQR';
import Referral from '../screens/referral';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="BusinessDetails" component={BusinessDetails} />
        <Stack.Screen name="CreateBusiness" component={CreateBusiness} />
        <Stack.Screen name="ListBusiness" component={ListBusiness} />
        <Stack.Screen name="CreateEvent" component={CreateEvent} />
        <Stack.Screen name="EventList" component={EventList} />
        <Stack.Screen name="GenerateQR" component={GenerateQR} />
        <Stack.Screen name="Referral" component={Referral} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
