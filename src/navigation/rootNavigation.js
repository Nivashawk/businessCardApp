import React from 'react';
import { useNavigationState } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import CustomHeader from '../components/customHeader';

import AuthNavigator from './authNavigation';
import BottomTabNavigator from './bottomTabNavigation'; 

const Stack = createNativeStackNavigator();

function withCustomHeader(Component) {
  return (props) => {
    // Get the currently focused screen inside BottomTabs
    const currentRouteName = useNavigationState(state => {
      const mainTab = state.routes.find(r => r.name === 'MainTabs')?.state;
      return mainTab?.routes[mainTab.index]?.name;
    });

    // Screens that should NOT show the header
    const screensWithoutHeader = ['ScanQR'];

    const showHeader = !screensWithoutHeader.includes(currentRouteName);

    return (
      <View style={styles.container}>
        {showHeader && <CustomHeader />}
        <View style={styles.content}>
          <Component {...props} />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="MainTabs" component={withCustomHeader(BottomTabNavigator)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
