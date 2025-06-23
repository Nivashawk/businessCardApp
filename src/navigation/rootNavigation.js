import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
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
import logo from '../../assets/logo.png';

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeepLink, setPendingDeepLink] = useState(null);
  const navigationRef = useRef();

  const VerifyState = useSelector(state => state.OTPData);
  const {otpVerified} = VerifyState;

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

  // Debug function
  // const debugAlert = (title, message) => {
  //   Alert.alert(`🐛 DEBUG: ${title}`, message);
  // };

  useEffect(() => {
    checkLoginStatus();
    handleInitialURL();
  }, []);

  // Handle deep links when app is already running
  useEffect(() => {
    const handleDeepLink = event => {
      const {url} = event;
      console.log('Deep link received:', url);
      // debugAlert(
      //   'Deep Link Received',
      //   `URL: ${url}\nLoggedIn: ${isLoggedIn}\nOTP Verified: ${otpVerified}`,
      // );

      if (!isLoggedIn && !otpVerified) {
        console.log('User not authenticated, storing pending deep link:', url);
        setPendingDeepLink(url);
        // debugAlert('Storing Pending Link', `URL stored: ${url}`);
      } else {
        // debugAlert(
        //   'User Already Authenticated',
        //   'Processing deep link immediately',
        // );
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
  }, [isLoggedIn, otpVerified]);

  // Simple handling of pending deep link after authentication
  useEffect(() => {
    if (
      pendingDeepLink &&
      (isLoggedIn || otpVerified) &&
      navigationRef.current
    ) {
      console.log(
        'User authenticated, processing pending deep link:',
        pendingDeepLink,
      );
      // debugAlert(
      //   'Processing Pending Link',
      //   `About to process: ${pendingDeepLink}`,
      // );

      handlePendingDeepLink(pendingDeepLink);
      setPendingDeepLink(null); // Clear immediately after processing
    }
  }, [isLoggedIn, otpVerified, pendingDeepLink]);

  // Simplified deep link handler
  const handlePendingDeepLink = url => {
    try {
      console.log('Processing pending deep link:', url);
      // debugAlert('Processing Deep Link', `URL: ${url}`);

      const {path, params} = parseUrl(url);

      // debugAlert(
      //   'URL Parsed',
      //   `Path: ${path}\nParams: ${JSON.stringify(params)}`,
      // );

      if (path.includes('business/view')) {
        const business_id = params.business_id;
        const shared_by = params.shared_by;
        const event_id = params.event_id;
        const type = params.type;

        // debugAlert(
        //   'Business View Detected',
        //   `business_id: ${business_id}\nshared_by: ${shared_by}\nevent_id: ${event_id}\ntype: ${type}`,
        // );

        if (business_id && navigationRef.current) {
          console.log('Navigating to BusinessDetails2 with params:', {
            business_id,
            shared_by,
            event_id,
            type,
          });

          // debugAlert(
          //   'About to Navigate',
          //   `Target: BusinessDetails2\nParams: ${JSON.stringify({
          //     business_id,
          //     shared_by,
          //     event_id,
          //     type,
          //   })}`,
          // );

          setTimeout(() => {
            navigationRef.current.navigate('BusinessDetails2', {
              business_id,
              shared_by,
              event_id,
              type,
            });
            // debugAlert('Navigation Called', 'Successfully called navigate()');
          }, 100);
        } else if (!business_id) {
          console.log('Missing Business ID', 'No business_id found in URL');
        } else if (!navigationRef.current) {
          console.log('Navigation Ref Missing', 'navigationRef.current is null');
        }
      } else {
        console.log(
          'Path Not Matched',
          `Path "${path}" does not contain "business/view"`,
        );
      }
    } catch (error) {
      console.error('Error processing pending deep link:', error);
      // debugAlert(
      //   'Deep Link Error',
      //   `Error: ${error.message}\nStack: ${error.stack}`,
      // );
    }
  };

  const checkLoginStatus = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
      // debugAlert('Login Status Checked', `Status: ${loginStatus === 'true'}`);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      // debugAlert('Login Check Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialURL = async () => {
    try {
      const initialUrl = await Linking.getInitialURL();
      console.log('Initial URL:', initialUrl);
      // debugAlert('Initial URL', `URL: ${initialUrl || 'None'}`);

      if (initialUrl) {
        // Store the deep link if user is not authenticated
        if (!isLoggedIn && !otpVerified) {
          console.log('Storing initial deep link for later:', initialUrl);
          setPendingDeepLink(initialUrl);
          // debugAlert('Initial URL Stored', `URL: ${initialUrl}`);
        } else {
          // debugAlert('User Already Auth', 'Processing initial URL immediately');
          handlePendingDeepLink(initialUrl);
        }
      }
    } catch (error) {
      console.error('Error getting initial URL:', error);
      // debugAlert('Initial URL Error', error.message);
    }
  };

  // Handle navigation ready and process any pending deep links
  const onNavigationReady = () => {
    // debugAlert('Navigation Ready', 'Navigation container is ready');

    // Process any pending deep link when navigation is ready
    if (pendingDeepLink && (isLoggedIn || otpVerified)) {
      handlePendingDeepLink(pendingDeepLink);
      setPendingDeepLink(null);
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
            Register: 'register',
            OTPVerification: 'verify-otp',
          },
        },
      },
    },
    // Custom state handling
    getStateFromPath: (path, options) => {
      console.log('Getting state from path:', path);
      // debugAlert('Getting State From Path', `Path: ${path}`);

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

            // debugAlert('Custom State Generated', `business_id: ${business_id}`);

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
          // debugAlert('URL Parse Error', error.message);
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

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={onNavigationReady}>
      {otpVerified || isLoggedIn ? <DrawerNavigation /> : <AuthNavigator />}
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
