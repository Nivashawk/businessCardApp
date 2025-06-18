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
  SafeAreaView // Use SafeAreaView for better iOS handling
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import logo from '../../assets/logo.png';

const {width, height} = Dimensions.get('window');

export default function CustomHeader() {
  const navigation = useNavigation();
  const route = useRoute();

  const isHome = route.name === 'mainPage';
  // Use route.params.title if available, otherwise fallback to route.name for dynamic title
  const headerTitle = route.params?.title || (isHome ? '' : route.name);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left Section - Back button or Logo/App Name */}
        <View style={styles.leftSection}>
          {!isHome && navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              {/* Unicode for a Left Arrow */}
              <Text style={styles.arrowIcon}>&#x2190;</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.logoContainer}>
              <Image style={styles.logo} resizeMode="contain" source={logo} />
              {/* Uncomment and style if you want an app name next to the logo on home screen */}
              {/* <Text style={styles.appName}>YourApp</Text> */}
            </View>
          )}
        </View>

        {/* Center Section - Dynamic Title (only shown if not home, or if home and you want a title) */}
        {/* {!isHome && <Text style={styles.headerTitle}>{headerTitle}</Text>} */}


        {/* Right Section - Hamburger Menu */}
        <View style={styles.rightSection}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
            {/* Unicode for a Hamburger Menu (Trigram) */}
            <Text style={styles.menuIcon}>&#x2261;</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    // Add additional padding for iPhone X/Xs/Xr/11/12/13/14/15 family devices if needed
    // paddingTop: Platform.OS === 'ios' ? (height > 800 ? 40 : 20) : 0,
  },
  container: {
    height: Platform.OS === 'ios' ? 50 : 60, // Adjusted height for better spacing
    paddingHorizontal: 15,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth, // Subtle line at the bottom
    borderBottomColor: colors.border || '#ccc', // Fallback color
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60, // Ensure enough space for back button or logo
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: height * 0.1, // Adjusted logo size for better fit in header
    width: width * 0.2,
    marginRight: 5,
  },
  appName: {
    ...typography.heading, // Assuming typography.heading has font size and weight
    fontSize: 20,
    fontWeight: 'bold', // Added bold for prominence
    color: colors.primary,
  },
  iconButton: {
    padding: 8, // Make touch target larger and provide visual padding
    justifyContent: 'center', // Center content
    alignItems: 'center', // Center content
  },
  arrowIcon: {
    fontSize: 28, // Large enough for visibility
    fontWeight: 'bold', // Make it stand out
    color: colors.text, // Use theme text color
    lineHeight: Platform.OS === 'ios' ? 30 : 35, // Adjust lineHeight for vertical centering
  },
  menuIcon: {
    fontSize: 32, // Slightly larger for hamburger
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: Platform.OS === 'ios' ? 34 : 38, // Adjust lineHeight for vertical centering
  },
  headerTitle: {
    ...typography.heading, // Assuming typography.heading has font size and weight
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1, // Allows title to take available space
    textAlign: 'center', // Center the title
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60, // Ensure enough space for icons
    justifyContent: 'flex-end',
  },
});