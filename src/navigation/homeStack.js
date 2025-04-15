import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/home';
import BusinessDetails from '../screens/business/businessDetails';
import CreateBusiness from '../screens/business/createBusiness';
import ListBusiness from '../screens/business/listBusiness';
import CreateEvent from '../screens/event/createEvent';
import EventList from '../screens/event/eventList';
import GenerateQR from '../screens/scan/generateQR';
import Referral from '../screens/referral';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
      <Stack.Navigator initialRouteName='mainPage' screenOptions={{headerShown: false}}>
        <Stack.Screen name="mainPage" component={Home} />
        <Stack.Screen name="BusinessDetails" component={BusinessDetails} />
        <Stack.Screen name="CreateBusiness" component={CreateBusiness} />
        <Stack.Screen name="ListBusiness" component={ListBusiness} />
        <Stack.Screen name="CreateEvent" component={CreateEvent} />
        <Stack.Screen name="EventList" component={EventList} />
        <Stack.Screen name="GenerateQR" component={GenerateQR} />
        <Stack.Screen name="Referral" component={Referral} />
      </Stack.Navigator>
  );
}
