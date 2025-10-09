import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Contacts from '../screens/contacts';
import CustomCamera from '../screens/business/steps/customCamera';
import ManualContactDetailScreen from '../screens/ManualContactDetailScreen';

import CustomHeader from '../components/customHeader';

const Stack = createNativeStackNavigator();

export default function ContactStack() {
  return (
    <Stack.Navigator initialRouteName="Contact">
      <Stack.Screen
        name="Contact"
        component={Contacts}
        options={{ header: () => <CustomHeader titles="Contacts"/> }}
      />
      <Stack.Screen
        name="CustomCamera"
        component={CustomCamera}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManualContactDetail"
        component={ManualContactDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
