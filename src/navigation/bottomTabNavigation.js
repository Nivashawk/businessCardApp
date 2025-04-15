import React, {useRef, useEffect} from 'react';
import {View, Animated, TouchableOpacity, Platform, StyleSheet, Dimensions} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../theme/colors';
import CustomHeader from '../components/customHeader';

import HomeStack from './homeStack';
import Contacts from '../screens/contacts';
import ScanQR from '../screens/scan/scanQR';

import HomeIcon from '../../assets/bottomTab/home.svg';
import ScanIcon from '../../assets/bottomTab/qscan.svg';
import ContactsIcon from '../../assets/bottomTab/contact.svg';
const {width, height} = Dimensions.get('window');


const Tab = createBottomTabNavigator();

const AnimatedTabIcon = ({focused, children}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.4 : 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      {children}
    </Animated.View>
  );
};



export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,

        // ✅ Custom tabBarButton to remove default opacity/focus effect
        tabBarButton: props => (
          <TouchableOpacity
            {...props}
            activeOpacity={1} // disables fade on press
            // style={{flex: 1}} // maintain layout
          />
        ),

        tabBarIcon: ({focused, color, size}) => {
          const iconSize = size ?? 24;

          if (route.name === 'Home') {
            return (
              <AnimatedTabIcon focused={focused}>
                <HomeIcon width={iconSize} height={iconSize} fill={color} />
              </AnimatedTabIcon>
            );
          } else if (route.name === 'ScanQR') {
            const scanIconColor = focused ? colors.primary : colors.secondary;
            const scanBgColor = focused ? colors.secondary : colors.primary;

            return (
              <View
                style={{
                  top: -20,
                  backgroundColor: scanBgColor,
                  borderRadius: 35,
                  padding: 12,
                  elevation: 10,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 4},
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                }}>
                <AnimatedTabIcon focused={focused}>
                  <ScanIcon
                    width={iconSize + 10}
                    height={iconSize + 10}
                    fill={scanIconColor}
                  />
                </AnimatedTabIcon>
              </View>
            );
          } else if (route.name === 'Contacts') {
            return (
              <AnimatedTabIcon focused={focused}>
                <ContactsIcon width={iconSize} height={iconSize} fill={color} />
              </AnimatedTabIcon>
            );
          }

          return null;
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.primary,

        tabBarStyle: {
          backgroundColor: colors.secondary,
          height: height * 0.09,
          paddingBottom: 10,
          paddingTop: 10,
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: -2},
          shadowRadius: 4,
        },

        tabBarLabel: ({focused, color}) => {
          return (
            <Animated.Text
              style={{
                fontSize: focused ? 14 : 12,
                fontWeight: focused ? 'bold' : '300',
                color,
                paddingBottom: 5,
              }}>
              {route.name}
            </Animated.Text>
          );
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            // Prevent default behavior
            e.preventDefault();

            // If already on Home tab, reset the stack to Home screen
            navigation.navigate('Home', {
              screen: 'Home', // this is the screen inside your HomeStack
            });
          },
        })}
      />
      <Tab.Screen
        name="ScanQR"
        component={ScanQR}
        options={{
          tabBarStyle: {display: 'none'}, // hides the tab bar only on ScanQR
          headerShown: false, // optional: hide top header if needed
        }}
      />
      <Tab.Screen name="Contacts" component={Contacts} />
    </Tab.Navigator>
  );
}
