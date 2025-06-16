// components/CustomHeader.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../theme/colors';
import { typography } from '../theme/typography';
import logo from '../../assets/logo.png';

const {width, height} = Dimensions.get('window');



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
        {/* <Text style={typography.heading}>LOGO</Text> */}
                <Image style={{height:height*0.2, width:width*0.25}} resizeMode="contain" source={logo}></Image>

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
    height: Platform.OS === 'ios' ? 50 : 70,
    // paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 15,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 36,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
});
