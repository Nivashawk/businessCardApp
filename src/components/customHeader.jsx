import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {typography} from '../theme/typography';
import { CommonActions } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CustomHeader() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const openMenu = () => {
    setMenuVisible(true);
    slideAnim.setValue(SCREEN_WIDTH);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={typography.heading}>LOGO</Text>
        <TouchableOpacity onPress={openMenu}>
          <Text style={styles.menu}>≡</Text>
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <Animated.View
          style={[styles.drawer, {transform: [{translateX: slideAnim}]}]}>
          <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('HomeStack', {
                screen: 'ListBusiness',
              });
              closeMenu();
            }}>
            <Text style={styles.drawerItem}>Business Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EventList');
              closeMenu();
            }}>
            <Text style={styles.drawerItem}>Manage Events</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#f6f6f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00332e',
  },
  menu: {
    fontSize: 24,
    color: '#00332e',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0, // anchor it to the right
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#fff',
    elevation: 8,
    padding: 20,
    zIndex: 10000000,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeText: {
    fontSize: 20,
    color: '#00332e',
  },
  drawerItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#00332e',
  },
});
