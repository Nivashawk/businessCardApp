import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  View,
  Image,
  Text,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';

import AuthNavigator from './authNavigation';
import DrawerNavigation from './drawerNavigation';
import { setLoginStatus } from '../redux/slices/auth/loginSlices';
import { isOTPVerified } from '../redux/slices/auth/sendOTPSlices';
import logo from '../../assets/logo.png';

export default function RootNavigator() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeepLink, setPendingDeepLink] = useState(null);
  const navigationRef = useRef();

  // Get authentication state from Redux
  const VerifyState = useSelector(state => state.OTPData);
  const loginState = useSelector(state => state.login);
  const { otpVerified } = VerifyState;
  const { isLoggedIn } = loginState;

  // Determine if user is authenticated
  const isAuthenticated = otpVerified || isLoggedIn;

  const parseUrl = url => {
    try {
      // Extract path and query string manually
      const urlParts = url.split('?');
      const path = urlParts[0];
      const queryString = urlParts[1] || '';

      // Parse query parameters
      const params = {};
      if (queryString) {
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }

      return {path, params};
    } catch (error) {
      console.error('Error parsing URL:', error);
      return {path: '', params: {}};
    }
  };

  useEffect(() => {
    checkAuthenticationStatus();
    handleInitialURL();
  }, []);

  // Handle deep links when app is already running
  useEffect(() => {
    const handleDeepLink = event => {
      const {url} = event;
      console.log('Deep link received:', url);

      if (!isAuthenticated) {
        console.log('User not authenticated, storing pending deep link:', url);
        setPendingDeepLink(url);
      } else {
        handlePendingDeepLink(url);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else {
        // For older React Native versions
        Linking.removeEventListener('url', handleDeepLink);
      }
    };
  }, [isAuthenticated]);

  // Process pending deep link after authentication
  useEffect(() => {
    if (pendingDeepLink && isAuthenticated && navigationRef.current) {
      console.log('User authenticated, processing pending deep link:', pendingDeepLink);
      
      // Add small delay to ensure navigation is ready
      setTimeout(() => {
        handlePendingDeepLink(pendingDeepLink);
        setPendingDeepLink(null);
      }, 500);
    }
  }, [isAuthenticated, pendingDeepLink]);

  // Check authentication status from AsyncStorage
  const checkAuthenticationStatus = async () => {
    try {
      console.log('Checking authentication status...');
      
      const [loginStatus, partnerId] = await AsyncStorage.multiGet([
        'isLoggedIn',
        'partner_id'
      ]);

      const isStoredAsLoggedIn = loginStatus[1] === 'true';
      const hasPartnerId = partnerId[1] !== null;

      console.log('AsyncStorage check:', {
        isLoggedIn: isStoredAsLoggedIn,
        hasPartnerId: hasPartnerId,
        partnerId: partnerId[1]
      });

      if (isStoredAsLoggedIn && hasPartnerId) {
        // Update Redux state to reflect logged in status
        dispatch(setLoginStatus(true));
        dispatch(isOTPVerified(true));
        console.log('✅ User is authenticated from AsyncStorage');
      } else {
        console.log('❌ User is not authenticated');
        // Clear any inconsistent state
        if (isStoredAsLoggedIn && !hasPartnerId) {
          await AsyncStorage.removeItem('isLoggedIn');
        }
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      // On error, assume not authenticated
      dispatch(setLoginStatus(false));
      dispatch(isOTPVerified(false));
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified deep link handler
  const handlePendingDeepLink = url => {
    try {
      console.log('Processing deep link:', url);

      const {path, params} = parseUrl(url);

      if (path.includes('business/view')) {
        const business_id = params.business_id;
        const shared_by = params.shared_by;
        const event_id = params.event_id;
        const type = params.type;

        if (business_id && navigationRef.current) {
          console.log('Navigating to BusinessDetails2 with params:', {
            business_id,
            shared_by,
            event_id,
            type,
          });

          navigationRef.current.navigate('BusinessDetails2', {
            business_id,
            shared_by,
            event_id,
            type,
          });
        } else {
          console.log('Missing business_id or navigation ref not ready');
        }
      } else {
        console.log(`Path "${path}" does not match business/view pattern`);
      }
    } catch (error) {
      console.error('Error processing deep link:', error);
    }
  };

  const handleInitialURL = async () => {
    try {
      const initialUrl = await Linking.getInitialURL();
      console.log('Initial URL:', initialUrl);

      if (initialUrl) {
        // Store the deep link if user is not authenticated
        if (!isAuthenticated) {
          console.log('Storing initial deep link for later:', initialUrl);
          setPendingDeepLink(initialUrl);
        } else {
          handlePendingDeepLink(initialUrl);
        }
      }
    } catch (error) {
      console.error('Error getting initial URL:', error);
    }
  };

  // Handle navigation ready and process any pending deep links
  const onNavigationReady = () => {
    console.log('Navigation container is ready');

    // Process any pending deep link when navigation is ready
    if (pendingDeepLink && isAuthenticated) {
      setTimeout(() => {
        handlePendingDeepLink(pendingDeepLink);
        setPendingDeepLink(null);
      }, 100);
    }
  };

  const linking = {
    prefixes: ['https://thumps.app', 'thumps://'],
    config: {
      screens: {
        MainTabs: {
          screens: {
            Home: {
              screens: {
                mainPage: 'home',
                BusinessDetails: 'business/:businessId',
                BusinessDetails2: {
                  path: 'business/view',
                  parse: {
                    business_id: business_id => business_id,
                    shared_by: shared_by => shared_by,
                    event_id: event_id => event_id,
                    type: type => type,
                  },
                },
                CreateBusiness: 'create-business',
                ListBusiness: 'list-business',
                CreateEvent: 'create-event',
                UpdateEvents: 'update-event/:eventId',
                EventList: 'event-list',
                GenerateQR: 'generate-qr',
                Referral: 'referral',
                CustomCamera: 'camera',
              },
            },
            Business: {
              // Add business tab screens if needed
            },
            ScanQR: {
              // Add scan screens if needed
            },
            Events: {
              // Add event screens if needed
            },
            Contacts: {
              // Add contact screens if needed
            },
          },
        },
        Profile: 'profile',
        Settings: 'settings',
        // Auth screens for when user is not logged in
        Auth: {
          screens: {
            Login: 'login',
            Signup: 'register',
            Verify: 'verify-otp',
          },
        },
      },
    },
    // Custom state handling
    getStateFromPath: (path, options) => {
      console.log('Getting state from path:', path);

      // Parse business view URLs with query parameters
      if (path.includes('business/view')) {
        try {
          const {path: urlPath, params} = parseUrl(`https://dummy.com${path}`);
          const business_id = params.business_id;
          const shared_by = params.shared_by;
          const event_id = params.event_id;
          const type = params.type;

          if (business_id) {
            console.log('Parsed business view params:', {
              business_id,
              shared_by,
              event_id,
              type,
            });

            return {
              index: 0,
              routes: [
                {
                  name: 'MainTabs',
                  state: {
                    index: 0,
                    routes: [
                      {
                        name: 'Home',
                        state: {
                          index: 1,
                          routes: [
                            {name: 'mainPage'},
                            {
                              name: 'BusinessDetails2',
                              params: {
                                business_id,
                                shared_by,
                                event_id,
                                type,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            };
          }
        } catch (error) {
          console.error('Error parsing business view URL:', error);
        }
      }

      // Fall back to default parsing
      return require('@react-navigation/native').getStateFromPath(
        path,
        options,
      );
    },
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.loadingText}>Loading your experience...</Text>
        {pendingDeepLink && (
          <Text style={styles.pendingLinkText}>
            Preparing your shared content...
          </Text>
        )}
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={{marginTop: 20}}
        />
      </View>
    );
  }

  console.log('Rendering navigator. IsAuthenticated:', isAuthenticated);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={onNavigationReady}>
      {isAuthenticated ? <DrawerNavigation /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
  pendingLinkText: {
    fontSize: 14,
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});