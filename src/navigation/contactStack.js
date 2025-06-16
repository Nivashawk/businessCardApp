import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getHeaderOptions } from '../theme/headerOptions';

import Contacts from '../screens/contacts';

import CustomHeader from '../components/customHeader';

const Stack = createNativeStackNavigator();

export default function ContactStack() {
  return (
    <Stack.Navigator initialRouteName="contactPage">
      <Stack.Screen
        name="contactPage"
        component={Contacts}
        options={{ header: () => <CustomHeader titles="Contacts"/> }}
      />
    </Stack.Navigator>
  );
}
