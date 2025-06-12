import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../theme/colors';

import HomeStack from './homeStack';
import ContactStack from './contactStack';
import ScanQR from '../screens/scan/scanQR';
import BusinessStack from './businessStack';
import EventStack from './eventsStacks';

import HomeIcon from '../../assets/bottomTab/home.svg';
import BusinessIcon from '../../assets/bottomTab/business.svg';
import ScanIcon from '../../assets/bottomTab/qscan.svg';
import EventIcon from '../../assets/bottomTab/event.svg';
import ContactsIcon from '../../assets/bottomTab/contact.svg';
import ScanStack from './scanStack';

const {width: initialWidth, height: initialHeight} = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// Hook for responsive dimensions
const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState(() => {
    const {width, height} = Dimensions.get('window');
    return {
      width,
      height,
      isTablet: width > 768,
      isLandscape: width > height,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions({
        width: window.width,
        height: window.height,
        isTablet: window.width > 768,
        isLandscape: window.width > window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// Fixed animated tab icon with better visibility
const AnimatedTabIcon = ({focused, children, dimensions}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const iconScale = dimensions.isTablet ? 1.12 : 1.08;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? iconScale : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [focused, iconScale]);

  return (
    <View
      style={[
        styles.tabIconContainer,
        {
          padding: dimensions.isTablet ? 6 : 4,
        },
      ]}>
      <Animated.View
        style={{
          transform: [{scale: scaleAnim}, {translateY}],
          zIndex: 1,
        }}>
        {children}
      </Animated.View>
    </View>
  );
};

// Enhanced floating scan button - properly centered
const FloatingScanButton = ({focused, onPress, dimensions, tabBarHeight}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const buttonSize = dimensions.isTablet
    ? 56
    : dimensions.isLandscape
    ? 48
    : 52;
  const iconSize = dimensions.isTablet ? 26 : dimensions.isLandscape ? 20 : 22;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    if (focused) {
      pulseAnimation.start();
      Animated.spring(scaleAnim, {
        toValue: 1.08,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }).start();
    } else {
      pulseAnimation.stop();
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }).start();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      pulseAnimation.stop();
    };
  }, [focused]);

  return (
    <View style={styles.floatingButtonWrapper}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.floatingButtonTouchable}
        activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.floatingButton,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <Animated.View
            style={[
              styles.floatingButtonPulse,
              {
                width: buttonSize + 6,
                height: buttonSize + 6,
                borderRadius: (buttonSize + 6) / 2,
                transform: [{scale: pulseAnim}],
                opacity: focused ? 0.25 : 0,
              },
            ]}
          />
          <View
            style={[
              styles.scanButtonInner,
              {
                width: buttonSize * 0.7,
                height: buttonSize * 0.7,
                borderRadius: (buttonSize * 0.7) / 2,
              },
            ]}>
            <ScanIcon width={iconSize} height={iconSize} fill="#FFFFFF" />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

// Fixed custom tab bar component
const CustomTabBar = ({state, descriptors, navigation}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const dimensions = useResponsiveDimensions();

  const containerPadding = dimensions.isTablet ? 20 : 12;
  const tabBarHeight = dimensions.isTablet
    ? 70
    : dimensions.isLandscape
    ? 52
    : 62;
  const tabBarRadius = dimensions.isTablet ? 22 : 18;

  // Fixed bottom margin to prevent scroll interference
  const bottomMargin = Platform.OS === 'ios' 
    ? (dimensions.isLandscape ? 8 : 20)
    : (dimensions.isLandscape ? 12 : 8);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [state.index]);

  const focusedRoute = state.routes[state.index];
  const routeName = getFocusedRouteNameFromRoute(focusedRoute);

  if (routeName === 'CreateBusiness' || routeName === 'GenerateQR' || routeName === 'CreateEvent' || routeName === 'CustomCamera') {
    return null;
  }

  const availableWidth = dimensions.width - (containerPadding * 2);
  const tabWidth = availableWidth / state.routes.length;

  const indicatorTranslateX = slideAnim.interpolate({
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map((_, i) => i * tabWidth + (tabWidth - (tabWidth - 32)) / 2), // Properly center the indicator
  });

  return (
    <>
      {/* Spacer to prevent scroll content from going under tab bar */}
      <View style={{height: tabBarHeight + bottomMargin + 10}} />
      
      <View
        style={[
          styles.tabBarContainer,
          {
            bottom: bottomMargin,
            left: containerPadding,
            right: containerPadding,
            height: tabBarHeight,
            borderRadius: tabBarRadius,
          },
        ]}>
        <View
          style={[
            styles.tabBarBackground,
            {
              borderRadius: tabBarRadius,
            },
          ]}
        />

        {/* Fixed animated indicator - properly centered */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              transform: [{translateX: indicatorTranslateX}],
              width: 40, // Fixed width for consistent appearance
              height: 40,
              top: (tabBarHeight - 40) / 2, // Center vertically
              borderRadius: 20,
            },
          ]}
        />

        <View
          style={[
            styles.tabBarContent,
            {
              height: tabBarHeight,
            },
          ]}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                if (route.name === 'Home') {
                  navigation.navigate('Home', {screen: 'mainPage'});
                } else if (route.name === 'Business') {
                  navigation.navigate('Business', {screen: 'ListBusiness'});
                } else if (route.name === 'Events') {
                  navigation.navigate('Events', {screen: 'ListEvents'});
                } else if (route.name === 'Contacts') {
                  navigation.navigate('Contacts', {screen: 'contactPage'});
                } else {
                  navigation.navigate(route.name);
                }
              }
            };

            // Special handling for ScanQR
            if (route.name === 'ScanQR') {
              return (
                <FloatingScanButton
                  key={route.key}
                  focused={isFocused}
                  onPress={onPress}
                  dimensions={dimensions}
                  tabBarHeight={tabBarHeight}
                />
              );
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[
                  styles.tabItem,
                  {
                    height: tabBarHeight,
                    paddingVertical: dimensions.isTablet ? 6 : 4,
                  },
                ]}
                activeOpacity={0.7}>
                <AnimatedTabIcon focused={isFocused} dimensions={dimensions}>
                  {getTabIcon(route.name, isFocused, dimensions)}
                </AnimatedTabIcon>
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? colors.primary : '#888888', // Better contrast for inactive
                      fontWeight: isFocused ? '600' : '500',
                      fontSize: dimensions.isTablet
                        ? 11
                        : dimensions.isLandscape
                        ? 8
                        : 9,
                      marginTop: dimensions.isTablet ? 3 : 2,
                    },
                  ]}>
                  {getTabLabel(route.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
};

// Helper functions with better color contrast
const getTabIcon = (routeName, focused, dimensions) => {
  const iconSize = dimensions.isTablet ? 22 : dimensions.isLandscape ? 16 : 25;
  const color = focused ? colors.primary : '#666666'; // Strong contrast for inactive icons

  switch (routeName) {
    case 'Home':
      return <HomeIcon width={iconSize} height={iconSize} fill={color} />;
    case 'Business':
      return <BusinessIcon width={iconSize} height={iconSize} fill={color} />; // Replace with BusinessIcon
    case 'Events':
      return <EventIcon width={iconSize} height={iconSize} fill={color} />; // Replace with EventsIcon
    case 'Contacts':
      return <ContactsIcon width={iconSize} height={iconSize} fill={color} />;
    default:
      return null;
  }
};

const getTabLabel = routeName => {
  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Business':
      return 'Business';
    case 'ScanQR':
      return '';
    case 'Events':
      return 'Events';
    case 'Contacts':
      return 'Contacts';
    default:
      return routeName;
  }
};

export default function ModernBottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Business" component={BusinessStack} />
      <Tab.Screen name="ScanQR" component={ScanStack} />
      <Tab.Screen name="Events" component={EventStack} />
      <Tab.Screen name="Contacts" component={ContactStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 1000, // Ensure it stays on top
    // backgroundColor: colors.background
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  activeIndicator: {
    position: 'absolute',
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30, // Ensure consistent height
    minWidth: 30, // Ensure consistent width
  },
  tabIconBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary + '25',
  },
  tabLabel: {
    textAlign: 'center',
    includeFontPadding: false, // Better text alignment on Android
  },
  floatingButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingButtonTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButton: {
    backgroundColor: colors.primary,
    elevation: 12,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'relative',
  },
  floatingButtonPulse: {
    position: 'absolute',
    backgroundColor: colors.primary,
    zIndex: 0,
  },
  scanButtonInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});