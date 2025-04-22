import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getHeaderOptions } from '../theme/headerOptions';

import Home from '../screens/home';
import BusinessDetails from '../screens/business/businessDetails';
import CreateBusiness from '../screens/business/createBusiness';
import ListBusiness from '../screens/business/listBusiness';
import CreateEvent from '../screens/event/createEvent';
import EventList from '../screens/event/eventList';
import GenerateQR from '../screens/scan/generateQR';
import ReferAndEarn from '../screens/referral';
import CustomCamera from '../screens/business/steps/customCamera';

import CustomHeader from '../components/customHeader';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="mainPage">
      <Stack.Screen
        name="mainPage"
        component={Home}
        options={{ header: () => <CustomHeader /> }}
      />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetails}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
      <Stack.Screen
        name="CreateBusiness"
        component={CreateBusiness}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
      <Stack.Screen
        name="ListBusiness"
        component={ListBusiness}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
      <Stack.Screen
        name="EventList"
        component={EventList}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
      <Stack.Screen
        name="GenerateQR"
        component={GenerateQR}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
      <Stack.Screen
        name="Referral"
        component={ReferAndEarn}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
      <Stack.Screen
        name="CustomCamera"
        component={CustomCamera}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
