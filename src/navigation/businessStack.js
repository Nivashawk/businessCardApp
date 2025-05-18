import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getHeaderOptions } from '../theme/headerOptions';

import BusinessDetails from '../screens/business/businessDetails';
import CreateBusiness from '../screens/business/createBusiness';
import ListBusiness from '../screens/business/listBusiness';


import CustomHeader from '../components/customHeader';

const Stack = createNativeStackNavigator();

export default function BusinessStack() {
  return (
    <Stack.Navigator initialRouteName="ListBusiness">
    <Stack.Screen
        name="ListBusiness"
        component={ListBusiness}
        options={{ header: () => <CustomHeader title="My Business" /> }}
      />
        <Stack.Screen
          name="CreateBusiness"
          component={CreateBusiness}
          options={{ header: () => <CustomHeader title="Create Business" /> }}
        />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetails}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
    </Stack.Navigator>
  );
}
