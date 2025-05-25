import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ListEvent from '../screens/event/eventList';
import UpdateEvent from '../screens/event/updateEvent';

import CustomHeader from '../components/customHeader';

const Stack = createNativeStackNavigator();

export default function EventStack() {
  return (
    <Stack.Navigator initialRouteName="ListEvents">
      <Stack.Screen
        name="ListEvents"
        component={ListEvent}
        options={{header: () => <CustomHeader title="My Event" />}}
      />
      <Stack.Screen
        name="UpdateEvents"
        component={UpdateEvent}
        options={{header: () => <CustomHeader title="My Event Update" />}}
      />
    </Stack.Navigator>
  );
}
