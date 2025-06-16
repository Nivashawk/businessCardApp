import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  Image
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assets/logo.png';
import BottomTabNavigator from './bottomTabNavigation';
import { colors } from '../theme/colors';

const {width, height} = Dimensions.get('window');
const Drawer = createDrawerNavigator();

// Enhanced Profile Screen with Edit Functionality
const ProfileScreen = ({ navigation }) => {
  const homeData = useSelector(state => state?.homeData?.data?.result?.data) ?? {};
  const dispatch = useDispatch();
  
  const [editedData, setEditedData] = useState({
    name: homeData?.partner?.name || '',
    email: homeData?.partner?.email || '',
    mobile: homeData?.partner?.mobile || '',
  });
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = () => {
    setEditedData({
      name: homeData?.partner?.name || '',
      email: homeData?.partner?.email || '',
      mobile: homeData?.partner?.mobile || '',
    });
    setShowEditModal(true);
  };

  const handleSave = () => {
    // Validate required fields
    if (!editedData.name.trim() || !editedData.email.trim() || !editedData.mobile.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Mobile validation (basic)
    if (editedData.mobile.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    // Here you would typically dispatch an action to update the user data
    // dispatch(updateUserProfile(editedData));
    
    Alert.alert('Success', 'Profile updated successfully!');
    setShowEditModal(false);
    console.log('Updated profile data:', editedData);
  };

  const handleCancel = () => {
    setEditedData({
      name: homeData?.partner?.name || '',
      email: homeData?.partner?.email || '',
      mobile: homeData?.partner?.mobile || '',
    });
    setShowEditModal(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
  };

  const handleGoBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(homeData?.partner?.name)}
            </Text>
          </View>
          <Text style={styles.userName}>
            {homeData?.partner?.name || 'User Name'}
          </Text>
          <Text style={styles.userStatus}>Active Member</Text>
        </View>

        {/* Profile Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>👤</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {homeData?.partner?.name || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>📧</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>
                {homeData?.partner?.email || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>📱</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Mobile Number</Text>
              <Text style={styles.infoValue}>
                {homeData?.partner?.mobile || 'Not provided'}
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Actions */}
        <View style={styles.actionsCard}>          
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionText}>Notification Settings</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionIcon}>🌙</Text>
            <Text style={styles.actionText}>Dark Mode</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={editedData.name}
                    onChangeText={(text) => setEditedData({...editedData, name: text})}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={editedData.email}
                    onChangeText={(text) => setEditedData({...editedData, email: text})}
                    placeholder="Enter your email address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={editedData.mobile}
                    onChangeText={(text) => setEditedData({...editedData, mobile: text})}
                    placeholder="Enter your mobile number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Settings Screen
const SettingsScreen = ({ navigation }) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Settings</Text>
      <View style={styles.editButton} />
    </View>
    <View style={styles.screenContent}>
      <Text style={styles.screenText}>Settings Screen</Text>
    </View>
  </SafeAreaView>
);

// Help Screen
const HelpScreen = ({ navigation }) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Help & Support</Text>
      <View style={styles.editButton} />
    </View>
    <View style={styles.screenContent}>
      <Text style={styles.screenText}>Help & Support Screen</Text>
    </View>
  </SafeAreaView>
);

// Enhanced Custom Drawer Content Component with Dynamic Data
function CustomDrawerContent(props) {
  const { navigation, state } = props;
  const homeData = useSelector(state => state?.homeData?.data?.result?.data) ?? {};

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
  };

  const handleNavigation = (routeName) => {
    try {
      navigation.navigate(routeName);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate to the requested screen');
    }
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      {/* Enhanced Header Section with Dynamic Data */}
      <View style={styles.drawerHeader}>
        <View style={styles.profileSection}>
          <Image 
            style={{height: height * 0.2, width: width * 0.7}} 
            resizeMode="contain" 
            source={logo}
            onError={(error) => console.log('Logo load error:', error)}
          />
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Main Navigation Items */}
        <View style={styles.menuSection}>
          <DrawerItem
            label="Home"
            onPress={() => handleNavigation('MainTabs')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />

          <View style={styles.divider} />
          
          <DrawerItem
            label="Profile"
            onPress={() => handleNavigation('Profile')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />

          <View style={styles.divider} />
          
          <DrawerItem
            label="Settings"
            onPress={() => handleNavigation('Settings')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />
        </View>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Additional Options */}
        <View style={styles.bottomSection}>
          <DrawerItem
            label="Help & Support"
            onPress={() => handleNavigation('Help')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          />

          <View style={styles.divider} />
          
          <DrawerItem
            label="Logout"
            onPress={() => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: () => {
                      // Handle logout logic here
                      console.log('User logged out');
                      // You might want to navigate to login screen or reset navigation stack
                      // navigation.reset({
                      //   index: 0,
                      //   routes: [{ name: 'Login' }],
                      // });
                    }
                  }
                ]
              );
            }}
            labelStyle={[styles.drawerLabel, styles.logoutLabel]}
            style={styles.drawerItem}
          />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

// Main Drawer Navigator with error boundaries
export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawer,
        drawerActiveTintColor: colors?.primary || '#007AFF',
        drawerInactiveTintColor: '#424242',
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
      drawerPosition="left"
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      
      <Drawer.Screen 
        name="MainTabs" 
        component={BottomTabNavigator}
        options={{
          drawerItemStyle: { height: 0, overflow: 'hidden' },
        }}
      />
      
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerItemStyle: { height: 0, overflow: 'hidden' },
        }}
      />
      
      {/* <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerItemStyle: { height: 0, overflow: 'hidden' },
        }}
      /> */}
      
      {/* <Drawer.Screen 
        name="Help" 
        component={HelpScreen}
        options={{
          drawerItemStyle: { height: 0, overflow: 'hidden' },
        }}
      /> */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  // Existing drawer styles
  drawerContainer: {
    flex: 1,
    backgroundColor: colors?.background || '#F8F8F8',
  },
  drawer: {
    backgroundColor: '#F8F8F8',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  drawerHeader: {
    backgroundColor: colors?.secondary || '#6200EE',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  userName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 2,
  },
  userId: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  drawerContent: {
    paddingTop: 0,
    paddingHorizontal: 15,
  },
  menuSection: {
    marginBottom: 10,
  },
  drawerItem: {
    marginVertical: 4,
    borderRadius: 10,
    marginRight: '5%'
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
  },
  logoutLabel: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
    marginHorizontal: 0,
    borderRadius: 0.5,
  },
  bottomSection: {
    paddingBottom: 20,
  },
  iconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%'
  },
  iconText: {
    fontSize: 20,
    textAlign: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },

  // New Profile Screen Styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  backIcon: {
    fontSize: 24,
    color: '#343a40',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
  },
  editIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors?.primary || '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  userStatus: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  actionArrow: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalButton: {
    padding: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalAvatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  modalAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6c5ce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
  },
  changePhotoText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  inputSection: {
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#212529',
    backgroundColor: 'transparent',
  },
});