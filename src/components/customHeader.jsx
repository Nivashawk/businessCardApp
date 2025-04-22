// components/CustomHeader.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../theme/colors';
import { typography } from '../theme/typography';


export default function CustomHeader() {
  const navigation = useNavigation();
  const route = useRoute();

  const isHome = route.name === 'mainPage';

  return (
    <View style={styles.container}>
      {/* Left - Back button (if not home) */}
      <View style={[{flexDirection:'row', alignItems:'center'}, !isHome && {gap:10}]}>
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack() && !isHome && navigation.goBack()
          }
          disabled={isHome}>
          <Text style={[styles.icon, isHome && {display:'none'}]}>←</Text>
        </TouchableOpacity>

        {/* Center - Logo (you can swap this out for an image if needed) */}
        <Text style={typography.heading}>LOGO</Text>
      </View>

      {/* Right - Hamburger menu */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Text style={styles.icon}>≡</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 100 : 70,
    // paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 15,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 22,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
});
