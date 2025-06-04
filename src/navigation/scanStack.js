import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getHeaderOptions } from '../theme/headerOptions';

import ScanQR from '../screens/scan/scanQR';

import CustomHeader from '../components/customHeader';

const Stack = createNativeStackNavigator();

export default function ScanStack() {
  return (
    <Stack.Navigator initialRouteName="scanPage">
      <Stack.Screen
        name="scanPage"
        component={ScanQR}
        options={{ header: () => <CustomHeader titles="Contacts"/> }}
      />
    </Stack.Navigator>
  );
}
