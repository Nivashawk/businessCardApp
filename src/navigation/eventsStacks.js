import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ListEvent from '../screens/event/eventList';
import UpdateEvent from '../screens/event/updateEvent';
import CreateEvent from '../screens/event/createEvent';

import CustomHeader from '../components/customHeader';

const Stack = createNativeStackNavigator();

export default function EventStack() {
  return (
    <Stack.Navigator initialRouteName="ListEvents">
       <Stack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
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
