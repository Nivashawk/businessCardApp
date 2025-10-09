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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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

// Enhanced animated tab icon with dark theme
const AnimatedTabIcon = ({focused, children, dimensions}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const iconScale = dimensions.isTablet ? 1.15 : 1.12;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? iconScale : 1,
        useNativeDriver: true,
        tension: 120,
        friction: 6,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -2 : 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, iconScale]);

  return (
    <View
      style={[
        styles.tabIconContainer,
        {
          padding: dimensions.isTablet ? 8 : 6,
        },
      ]}>
      {/* Animated background glow for focused state */}
      <Animated.View
        style={[
          styles.tabIconGlow,
          {
            opacity: opacityAnim,
            width: dimensions.isTablet ? 40 : 36,
            height: dimensions.isTablet ? 40 : 36,
            borderRadius: dimensions.isTablet ? 20 : 18,
          },
        ]}
      />
      <Animated.View
        style={{
          transform: [{scale: scaleAnim}, {translateY}],
          zIndex: 2,
        }}>
        {children}
      </Animated.View>
    </View>
  );
};

// Premium floating scan button with gold accents
const FloatingScanButton = ({focused, onPress, dimensions, tabBarHeight}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const buttonSize = dimensions.isTablet
    ? 56
    : dimensions.isLandscape
    ? 48
    : 52;
  const iconSize = dimensions.isTablet ? 28 : dimensions.isLandscape ? 24 : 26;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }),
    );

    if (focused) {
      shimmerAnimation.start();
      rotateAnimation.start();
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      shimmerAnimation.stop();
      rotateAnimation.stop();
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }).start();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      shimmerAnimation.stop();
      rotateAnimation.stop();
    };
  }, [focused]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-buttonSize, buttonSize],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.floatingButtonWrapper}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.floatingButtonTouchable}
        activeOpacity={0.85}>
        
        {/* Outer glow ring */}
        <Animated.View
          style={[
            styles.floatingButtonGlow,
            {
              width: buttonSize + 8,
              height: buttonSize + 8,
              borderRadius: (buttonSize + 8) / 2,
              transform: [{scale: pulseAnim}],
              opacity: focused ? 0.3 : 0.15,
            },
          ]}
        />

        {/* Rotating border gradient effect */}
        <Animated.View
          style={[
            styles.floatingButtonBorder,
            {
              width: buttonSize + 3,
              height: buttonSize + 3,
              borderRadius: (buttonSize + 3) / 2,
              transform: [{rotate: rotateInterpolate}, {scale: scaleAnim}],
            },
          ]}>
          
          {/* Main button */}
          <View
            style={[
              styles.floatingButton,
              {
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2,
              },
            ]}>
            
            {/* Shimmer effect overlay */}
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  width: buttonSize * 0.3,
                  height: buttonSize,
                  transform: [{translateX: shimmerTranslateX}],
                  borderRadius: buttonSize / 2,
                },
              ]}
            />
            
            {/* Inner icon container */}
            <View
              style={[
                styles.scanButtonInner,
                {
                  width: buttonSize * 0.65,
                  height: buttonSize * 0.65,
                  borderRadius: (buttonSize * 0.65) / 2,
                },
              ]}>
              <ScanIcon width={iconSize} height={iconSize} fill={colors.text_color_1} />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

// Modern glass-morphism tab bar
const CustomTabBar = ({state, descriptors, navigation}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const dimensions = useResponsiveDimensions();
  const insets = useSafeAreaInsets();

  const containerPadding = dimensions.isTablet ? 24 : 16;
  const tabBarHeight = dimensions.isTablet
    ? 72
    : dimensions.isLandscape
    ? 56
    : 65;
  const tabBarRadius = dimensions.isTablet ? 28 : 24;

  // Use safe area insets for proper spacing above device navigation
  const bottomMargin = Math.max(
    insets.bottom + (dimensions.isTablet ? 8 : 4),
    Platform.OS === 'ios' 
      ? (dimensions.isLandscape ? 16 : 20)
      : (dimensions.isLandscape ? 12 : 16)
  );

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: state.index,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [state.index]);

  const focusedRoute = state.routes[state.index];
  const routeName = getFocusedRouteNameFromRoute(focusedRoute);

  if (routeName === 'CreateBusiness' || routeName === 'GenerateQR' || routeName === 'CreateEvent' || routeName === 'CustomCamera' || routeName === 'UpdateBusiness') {
    return null;
  }

  const availableWidth = dimensions.width - (containerPadding * 2);
  const tabWidth = availableWidth / state.routes.length;

  const indicatorTranslateX = slideAnim.interpolate({
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map((_, i) => i * tabWidth + (tabWidth - 48) / 2),
  });

  return (
    <>
      {/* Enhanced spacer with gradient - accounts for safe area */}
      <View 
        style={{
          height: tabBarHeight + bottomMargin + 8,
          backgroundColor: colors.background,
        }}
      />
      
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
        
        {/* Glass morphism background */}
        <View
          style={[
            styles.tabBarBackground,
            {
              borderRadius: tabBarRadius,
            },
          ]}
        />

        {/* Animated indicator with gradient */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              transform: [{translateX: indicatorTranslateX}],
              width: 48,
              height: 48,
              top: (tabBarHeight - 48) / 2,
              borderRadius: 24,
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
                  navigation.navigate('Contacts', {screen: 'Contact'});
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
                    paddingVertical: dimensions.isTablet ? 8 : 6,
                  },
                ]}
                activeOpacity={0.75}>
                <AnimatedTabIcon focused={isFocused} dimensions={dimensions}>
                  {getTabIcon(route.name, isFocused, dimensions)}
                </AnimatedTabIcon>
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? colors.gold : colors.textSecondary,
                      fontWeight: isFocused ? '700' : '500',
                      fontSize: dimensions.isTablet
                        ? 12
                        : dimensions.isLandscape
                        ? 9
                        : 10,
                      marginTop: dimensions.isTablet ? 4 : 3,
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

// Helper functions with enhanced dark theme colors
const getTabIcon = (routeName, focused, dimensions) => {
  const iconSize = dimensions.isTablet ? 24 : dimensions.isLandscape ? 18 : 22;
  const color = focused ? colors.gold : colors.textSecondary;

  switch (routeName) {
    case 'Home':
      return <HomeIcon width={iconSize} height={iconSize} fill={color} />;
    case 'Business':
      return <BusinessIcon width={iconSize} height={iconSize} fill={color} />;
    case 'Events':
      return <EventIcon width={iconSize} height={iconSize} fill={color} />;
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
    elevation: 20,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    zIndex: 1000,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.secondary + 'F5', // Semi-transparent for glass effect
    borderWidth: 1,
    borderColor: colors.border + '80',
    // Glass morphism blur effect (you might need a library like react-native-blur for full effect)
    backdropFilter: 'blur(20px)',
  },
  activeIndicator: {
    position: 'absolute',
    backgroundColor: colors.gold + '25',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.gold + '40',
    // Inner glow effect
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
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
    minHeight: 36,
    minWidth: 36,
  },
  tabIconGlow: {
    position: 'absolute',
    backgroundColor: colors.gold + '20',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.gold + '30',
  },
  tabLabel: {
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    letterSpacing: 0.3,
  },
  floatingButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -12, // Elevate button above container
    zIndex: 10, // Ensure it's above the container
  },
  floatingButtonTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonGlow: {
    position: 'absolute',
    backgroundColor: colors.gold + '25',
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  floatingButtonBorder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.goldDark,
    backgroundColor: colors.gold + '15',
  },
  floatingButton: {
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    backgroundColor: colors.goldLight + '40',
    opacity: 0.6,
    zIndex: 1,
  },
  scanButtonInner: {
    backgroundColor: colors.goldDark + '30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: colors.goldLight + '50',
  },
});