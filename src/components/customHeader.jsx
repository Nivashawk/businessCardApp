// components/CustomHeader.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../assets/logo.png';

const {width, height} = Dimensions.get('window');

// Updated dark theme colors
export const colors = {
  surface: '#2a2a2a',
  border: '#404040',
  textSecondary: '#C4C4C4',
  background: '#1a1a1a',
  primary: '#1f1c2c',
  secondary: '#2d2d2d',
  text_color_1: '#FFFFFF',
  text_color_2: '#C4C4C4',
  status_green: '#80D97E',
  status_red: '#DA4035',
  accent: '#928dab',
  gold: '#FFD700',
  goldDark: '#B8860B',
  goldLight: '#FFFF99',
  shadow: 'rgba(0, 0, 0, 0.3)',
  cardGradient: ['#2d2d2d', '#2a2a2a'],
  shimmer: 'rgba(255, 215, 0, 0.3)',
  text: '#FFFFFF', // Added for compatibility
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  headerGradient: ['#2d2d2d', '#1f1c2c', '#1a1a1a'],
};

// Get status bar height
const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return 0; // SafeAreaView will handle this
  } else {
    return StatusBar.currentHeight || 0;
  }
};

// Calculate dynamic dimensions based on screen size
const getHeaderDimensions = () => {
  const isTablet = width >= 768;
  const isSmallDevice = height < 600;
  
  return {
    headerHeight: isTablet ? height * 0.08 : isSmallDevice ? height * 0.08 : height * 0.08,
    logoHeight: isTablet ? 35 : isSmallDevice ? 80 : 100,
    logoWidth: isTablet ? 80 : isSmallDevice ? 65 : 85,
    iconSize: isTablet ? 24 : isSmallDevice ? 20 : 22,
    fontSize: {
      title: isTablet ? 20 : isSmallDevice ? 14 : 16,
      icon: isTablet ? 20 : isSmallDevice ? 16 : 18,
    },
    padding: isTablet ? 16 : isSmallDevice ? 10 : 12,
    statusBarHeight: getStatusBarHeight(),
  };
};

// Premium Icon Components
const BackIcon = ({ size, color }) => (
  <View style={[styles.iconContainer, { width: size + 8, height: size + 8 }]}>
    <Text style={[styles.iconText, { fontSize: size, color }]}>←</Text>
  </View>
);

const MenuIcon = ({ size, color }) => (
  <View style={[styles.iconContainer, { width: size + 8, height: size + 8 }]}>
    <View style={styles.menuIconContainer}>
      <View style={[styles.menuLine, { backgroundColor: color }]} />
      <View style={[styles.menuLine, { backgroundColor: color }]} />
      <View style={[styles.menuLine, { backgroundColor: color }]} />
    </View>
  </View>
);

export default function CustomHeader() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const dimensions = getHeaderDimensions();
  const isHome = route.name === 'mainPage';
  const headerTitle = route.params?.title || (isHome ? '' : route.name);

  return (
    <>
      {/* Configure StatusBar for dark theme */}
      <StatusBar 
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      
      {/* SafeAreaView to handle notch and status bar */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header with premium gradient background */}
        <LinearGradient
          colors={colors.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.headerGradient,
            { 
              minHeight: dimensions.headerHeight,
              // Add extra padding for Android status bar if needed
              paddingTop: Platform.OS === 'android' ? 8 : 8,
            }
          ]}
        >
          {/* Glass effect overlay */}
          <View style={styles.glassOverlay} />
          
          {/* Header Content */}
          <View style={[styles.headerContent, { paddingHorizontal: dimensions.padding }]}>
            {/* Left Section - Back button or Logo */}
            <View style={styles.leftSection}>
              {!isHome && navigation.canGoBack() ? (
                <TouchableOpacity 
                  onPress={() => navigation.goBack()} 
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                    style={styles.buttonGradient}
                  >
                    <BackIcon size={dimensions.fontSize.icon} color={colors.text_color_1} />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.logoSection}>
                  <View style={styles.logoContainer}>
                    {/* <LinearGradient
                      colors={[colors.gold, colors.goldDark]}
                      style={styles.logoGradientBorder}
                    > */}
                      {/* <View style={styles.logoInnerContainer}> */}
                        <Image 
                          style={[
                            styles.logo, 
                            { 
                              height: dimensions.logoHeight, 
                              width: dimensions.logoWidth 
                            }
                          ]} 
                          resizeMode="contain" 
                          source={logo} 
                        />
                      {/* </View> */}
                    {/* </LinearGradient> */}
                  </View>
                </View>
              )}
            </View>

            {/* Center Section - Dynamic Title */}
            {!isHome && (
              <View style={styles.titleContainer}>
                <Text 
                  style={[styles.headerTitle, { fontSize: dimensions.fontSize.title }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {headerTitle}
                </Text>
                <View style={styles.titleUnderline} />
              </View>
            )}

            {/* Right Section - Menu Button */}
            <View style={styles.rightSection}>
              <TouchableOpacity 
                onPress={() => navigation.openDrawer()} 
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.05)']}
                  style={styles.buttonGradient}
                >
                  <MenuIcon size={dimensions.fontSize.icon} color={colors.gold} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom border with gradient */}
          <LinearGradient
            colors={['transparent', colors.gold, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bottomBorder}
          />
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  headerGradient: {
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    zIndex: 2,
    flex: 1,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    padding: 2,
  },
  logoGradientBorder: {
    borderRadius: 8,
    padding: 1,
  },
  logoInnerContainer: {
    backgroundColor: colors.background,
    borderRadius: 7,
    padding: 4,
  },
  logo: {
    // tintColor: colors.gold, // Apply gold tint to logo
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.text_color_1,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleUnderline: {
    width: 30,
    height: 2,
    backgroundColor: colors.gold,
    marginTop: 4,
    borderRadius: 1,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionButton: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonGradient: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
    marginVertical: 1.5,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});