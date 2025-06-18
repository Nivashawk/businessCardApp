import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Image, Text, StyleSheet } from 'react-native';

import AuthNavigator from './authNavigation';
import DrawerNavigation from './drawerNavigation';
import logo from '../../assets/logo.png';

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const VerifyState = useSelector(state => state.OTPData);
  const { otpVerified } = VerifyState;

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={logo} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={styles.loadingText}>Loading your experience...</Text>
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {otpVerified || isLoggedIn ? (
        <DrawerNavigation />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500'
  }
});
