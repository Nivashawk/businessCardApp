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
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import logo from '../../assets/logo.png';

const {width, height} = Dimensions.get('window');

// Calculate dynamic dimensions based on screen size
const getHeaderDimensions = () => {
  const isTablet = width >= 768; // Tablet threshold
  const isSmallDevice = height < 600; // Small device threshold
  
  return {
    // Reduced header heights to compensate for status bar
    headerHeight: isTablet ? height * 0.06 : isSmallDevice ? height * 0.055 : height * 0.058,
    logoHeight: isTablet ? 40 : isSmallDevice ? 25 : 70,
    logoWidth: isTablet ? 90 : isSmallDevice ? 60 : 80,
    fontSize: {
      title: isTablet ? 20 : isSmallDevice ? 15 : 17,
      arrow: isTablet ? 28 : isSmallDevice ? 22 : 25,
      menu: isTablet ? 32 : isSmallDevice ? 26 : 29,
    },
    padding: isTablet ? 18 : isSmallDevice ? 10 : 12,
  };
};

export default function CustomHeader() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const dimensions = getHeaderDimensions();

  const isHome = route.name === 'mainPage';
  const headerTitle = route.params?.title || (isHome ? '' : route.name);

  return (
    <>
      {/* Configure StatusBar */}
      <StatusBar 
        barStyle="dark-content"
        backgroundColor={colors.background}
        translucent={false} // Changed to false to reduce space
      />
      
      {/* Use regular View instead of SafeAreaView to reduce height */}
      <View style={[
        styles.container, 
        { 
          paddingTop: Platform.OS === 'ios' ? insets.top + 5 : 8, // Minimal padding
          minHeight: dimensions.headerHeight,
          paddingHorizontal: dimensions.padding,
        }
      ]}>
          {/* Left Section - Back button or Logo/App Name */}
          <View style={styles.leftSection}>
            {!isHome && navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Text style={[styles.arrowIcon, { fontSize: dimensions.fontSize.arrow }]}>&#x2190;</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.logoContainer}>
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
              </View>
            )}
          </View>

          {/* Center Section - Dynamic Title */}
          {!isHome && (
            <Text style={[styles.headerTitle, { fontSize: dimensions.fontSize.title }]}>
              {headerTitle}
            </Text>
          )}

          {/* Right Section - Hamburger Menu */}
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
              <Text style={[styles.menuIcon, { fontSize: dimensions.fontSize.menu }]}>&#x2261;</Text>
            </TouchableOpacity>
          </View>
        </View>
      {/* Removed SafeAreaView closing tag */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4, // Reduced padding
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border || '#ccc',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 5,
  },
  appName: {
    ...typography.heading,
    fontWeight: 'bold',
    color: colors.primary,
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: Platform.OS === 'ios' ? 30 : 35,
  },
  menuIcon: {
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: Platform.OS === 'ios' ? 34 : 38,
  },
  headerTitle: {
    ...typography.heading,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'flex-end',
  },
});