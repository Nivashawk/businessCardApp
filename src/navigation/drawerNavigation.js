import React, {useEffect, useState} from 'react';
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
  Image,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector, useDispatch} from 'react-redux';
import logo from '../../assets/logo.png';
import BottomTabNavigator from './bottomTabNavigation';
import {colors} from '../theme/colors';
import {sentOTP} from '../redux/slices/auth/sendOTPSlices';
import {Deactivate} from '../redux/slices/auth/accountDeactivateSlices';
import {Delete} from '../redux/slices/auth/accountDeleteSlices';
import {isOTPVerified} from '../redux/slices/auth/sendOTPSlices';
import { resetOTPData } from '../redux/slices/auth/sendOTPSlices';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
const Drawer = createDrawerNavigator();

// Enhanced Profile Screen with Edit Functionality
const ProfileScreen = ({navigation}) => {
  const homeData =
    useSelector(state => state?.homeData?.data?.result?.data) ?? {};
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
    if (
      !editedData.name.trim() ||
      !editedData.email.trim() ||
      !editedData.mobile.trim()
    ) {
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

  const getInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
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
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}>
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

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.inputSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={editedData.name}
                    onChangeText={text =>
                      setEditedData({...editedData, name: text})
                    }
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
                    onChangeText={text =>
                      setEditedData({...editedData, email: text})
                    }
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
                    onChangeText={text =>
                      setEditedData({...editedData, mobile: text})
                    }
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
const SettingsScreen = ({navigation}) => {
  const homeData =
    useSelector(state => state?.homeData?.data?.result?.data) ?? {};
  const dispatch = useDispatch();
  const otpData = useSelector(state => state.OTPData);
  const {data: otpResponse, loading: otpLoading, error: otpError} = otpData;
  const deactivateData = useSelector(state => state.accountDeactivate);
  const {
    data: deactivateResponse,
    loading: deactivateLoading,
    error: deactivateError,
  } = deactivateData;
  const deleteData = useSelector(state => state.accountDelete);
  const {
    data: deleteResponse,
    loading: deleteLoading,
    error: deleteError,
  } = deleteData;

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [deleteEnteredOTP, setDeleteEnteredOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [deleteOtpSent, setDeleteOtpSent] = useState(false);

  // Deactivate Account Handler
  const handleDeactivateAccount = () => {
    if (!homeData?.partner?.email) {
      Alert.alert('Error', 'User email not found. Cannot send OTP.');
      return;
    }
    dispatch(sentOTP({email: homeData?.partner?.email}));
    setShowDeactivateModal(true);
  };

  // Delete Account Handler
  const handleDeleteAccount = () => {
    if (!homeData?.partner?.email) {
      Alert.alert('Error', 'User email not found. Cannot send OTP.');
      return;
    }
    dispatch(sentOTP({email: homeData?.partner?.email}));
    setShowDeleteModal(true);
  };

  // OTP Response Effect
  useEffect(() => {
    dispatch(resetOTPData());
    if (otpResponse?.result?.status === 'success') {
      setOtpSent(true);
      setDeleteOtpSent(true);
      Alert.alert(
        'OTP Sent',
        'An OTP has been sent to your registered email address.',
      );
    } else if (otpError) {
      Alert.alert('Error', otpError.message || 'Failed to send OTP.');
    }
  }, [otpResponse, otpError]);

  // Deactivate Response Effect
  useEffect(() => {
    if (deactivateResponse?.result?.status === 'success') {
      Alert.alert(
        'Account Deactivated',
        'Your account has been successfully deactivated.',
      );
      setShowDeactivateModal(false);
      // Navigate to login or a success screen
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Login' }],
      // });
    } else if (deactivateError) {
      Alert.alert(
        'Error',
        deactivateError.message || 'Failed to deactivate account.',
      );
    }
  }, [deactivateResponse, deactivateError, navigation]);

  // Delete Response Effect
  useEffect(() => {
    if (deleteResponse?.result?.status === 'success') {
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted.',
      );
      setShowDeleteModal(false);
      // Navigate to login or a success screen
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Login' }],
      // });
    } else if (deleteError) {
      Alert.alert('Error', deleteError.message || 'Failed to delete account.');
    }
  }, [deleteResponse, deleteError, navigation]);

  const confirmDeactivation = async() => {
    if (!enteredOTP.trim()) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    if (!otpResponse?.result?.token) {
      Alert.alert(
        'Error',
        'OTP token not found. Please try sending OTP again.',
      );
      return;
    }
    dispatch(
      Deactivate({
        email: homeData?.partner?.email,
        otp: enteredOTP,
        token: otpResponse?.result?.token,
      }),
    );
    dispatch(isOTPVerified(false));
    await AsyncStorage.setItem('isLoggedIn', 'false');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  const confirmDeletion = async () => {
    if (!deleteEnteredOTP.trim()) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    if (!otpResponse?.result?.token) {
      Alert.alert(
        'Error',
        'OTP token not found. Please try sending OTP again.',
      );
      return;
    }
    dispatch(
      Delete({
        email: homeData?.partner?.email,
        otp: deleteEnteredOTP,
        token: otpResponse?.result?.token,
      }),
    );
    dispatch(isOTPVerified(false));
    await AsyncStorage.setItem('isLoggedIn', 'false');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.editButton} /> {/* Placeholder for alignment */}
      </View>
      <ScrollView
        style={styles.screenContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() =>
              Alert.alert(
                'Under Construction',
                'Notification Settings are coming soon!',
              )
            }>
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionText}>Notification Settings</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() =>
              Alert.alert('Under Construction', 'Dark Mode is coming soon!')
            }>
            <Text style={styles.actionIcon}>🌙</Text>
            <Text style={styles.actionText}>Dark Mode</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeactivateAccount}>
            <Text style={[styles.actionIcon, {color: '#FF9500'}]}>⚠️</Text>
            <Text
              style={[
                styles.actionText,
                {color: '#FF9500', fontWeight: '700'},
              ]}>
              Deactivate Account
            </Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeleteAccount}>
            <Text style={[styles.actionIcon, {color: '#FF3B30'}]}>🗑️</Text>
            <Text
              style={[
                styles.actionText,
                {color: '#FF3B30', fontWeight: '700'},
              ]}>
              Delete Account
            </Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Deactivate Account Modal */}
      <Modal
        visible={showDeactivateModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeactivateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header with Icon */}
            <View style={styles.modalHeader}>
              <View style={styles.warningIconContainer}>
                <Text style={styles.warningIcon}>⚠️</Text>
              </View>
              <Text style={styles.modalTitle}>Deactivate Account</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDeactivateModal(false)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>
                Are you sure you want to deactivate your account? This action is{' '}
                <Text style={styles.emphasizedText}>irreversible</Text>.
              </Text>

              <Text style={styles.otpInfoText}>
                An OTP has been sent to your registered email for verification.
              </Text>

              {/* OTP Input Section */}
              <View style={styles.otpSection}>
                <Text style={styles.otpLabel}>Enter OTP</Text>
                <View style={styles.otpInputContainer}>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="000000"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    value={enteredOTP}
                    onChangeText={setEnteredOTP}
                    maxLength={6}
                    textAlign="center"
                    editable={!otpLoading && !deactivateLoading}
                  />
                </View>
              </View>

              {/* Loading States */}
              {otpLoading && (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingDot} />
                  <Text style={styles.loadingText}>Sending OTP...</Text>
                </View>
              )}

              {deactivateLoading && (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingDot} />
                  <Text style={styles.loadingText}>
                    Deactivating account...
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setShowDeactivateModal(false)}
                disabled={otpLoading || deactivateLoading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.deactivateConfirmButton,
                  (otpLoading || deactivateLoading || !enteredOTP.trim()) &&
                    styles.disabledButton,
                ]}
                onPress={confirmDeactivation}
                disabled={
                  otpLoading || deactivateLoading || !enteredOTP.trim()
                }>
                <Text
                  style={[
                    styles.deactivateConfirmButtonText,
                    (otpLoading || deactivateLoading || !enteredOTP.trim()) &&
                      styles.disabledButtonText,
                  ]}>
                  {deactivateLoading
                    ? 'Deactivating...'
                    : 'Confirm Deactivation'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header with Icon */}
            <View style={styles.deleteModalHeader}>
              <View style={styles.deleteIconContainer}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </View>
              <Text style={styles.deleteModalTitle}>Delete Account</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>
                Are you sure you want to permanently delete your account? This
                action is{' '}
                <Text style={styles.emphasizedText}>irreversible</Text> and all
                your data will be lost forever.
              </Text>

              <Text style={styles.otpInfoText}>
                An OTP has been sent to your registered email for verification.
              </Text>

              {/* OTP Input Section */}
              <View style={styles.otpSection}>
                <Text style={styles.otpLabel}>Enter OTP</Text>
                <View style={styles.otpInputContainer}>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="000000"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    value={deleteEnteredOTP}
                    onChangeText={setDeleteEnteredOTP}
                    maxLength={6}
                    textAlign="center"
                    editable={!otpLoading && !deleteLoading}
                  />
                </View>
              </View>

              {/* Loading States */}
              {otpLoading && (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingDot} />
                  <Text style={styles.loadingText}>Sending OTP...</Text>
                </View>
              )}

              {deleteLoading && (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingDot} />
                  <Text style={styles.loadingText}>Deleting account...</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
                disabled={otpLoading || deleteLoading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.deleteConfirmButton,
                  (otpLoading || deleteLoading || !deleteEnteredOTP.trim()) &&
                    styles.disabledButton,
                ]}
                onPress={confirmDeletion}
                disabled={
                  otpLoading || deleteLoading || !deleteEnteredOTP.trim()
                }>
                <Text
                  style={[
                    styles.deleteConfirmButtonText,
                    (otpLoading || deleteLoading || !deleteEnteredOTP.trim()) &&
                      styles.disabledButtonText,
                  ]}>
                  {deleteLoading ? 'Deleting...' : 'Confirm Deletion'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Help Screen
const HelpScreen = ({navigation}) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
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
  const dispatch = useDispatch();
  const {navigation, state} = props;
  const homeData =
    useSelector(state => state?.homeData?.data?.result?.data) ?? {};

  const getInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const handleNavigation = routeName => {
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
            onError={error => console.log('Logo load error:', error)}
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
          {/* <DrawerItem
            label="Help & Support"
            onPress={() => handleNavigation('Help')}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
          /> */}

          {/* <View style={styles.divider} /> */}

          <DrawerItem
            label="Logout"
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: async () => {
                    // Handle logout logic here
                    console.log('User logged out');
                    dispatch(isOTPVerified(false));
                    await AsyncStorage.setItem('isLoggedIn', 'false');
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Login'}],
                      }),
                    );
                    // You might want to navigate to login screen or reset navigation stack
                    // navigation.reset({
                    //   index: 0,
                    //   routes: [{ name: 'Login' }],
                    // });
                  },
                },
              ]);
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
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          drawerItemStyle: {height: 0, overflow: 'hidden'},
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerItemStyle: {height: 0, overflow: 'hidden'},
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerItemStyle: {height: 0, overflow: 'hidden'},
        }}
      />

      {/* <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          drawerItemStyle: {height: 0, overflow: 'hidden'},
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
    shadowOffset: {width: 2, height: 0},
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
    color: '#000',
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
    marginRight: '5%',
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
    marginRight: '5%',
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
    // Adjusted for settings screen to prevent centering all content
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 20, // Added padding for better layout
    paddingVertical: 20,
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 4},
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
    shadowOffset: {width: 0, height: 2},
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
    color: '#000',
    fontWeight: '600',
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    width: 24, // Fixed width for consistent alignment
    textAlign: 'center',
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
    shadowOffset: {width: 0, height: 1},
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
  // Deactivate Account Modal Specific Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  modalDeactivateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FF3B30',
  },
  modalDeactivateMessage: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 15,
    lineHeight: 22,
  },
  otpInput: {
    height: 50,
    width: '100%',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#212529',
  },
  modalDeactivateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deactivateButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deactivateCancelButton: {
    backgroundColor: '#e9ecef',
  },
  deactivateCancelButtonText: {
    color: '#495057',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deactivateConfirmButton: {
    backgroundColor: '#FF3B30',
  },
  deactivateConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    color: '#007bff',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },

  // Modal Header
  modalHeader: {
    backgroundColor: '#FFF5F5',
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#FED7D7',
  },
  warningIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#DC2626',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },

  // Modal Content
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  modalMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emphasizedText: {
    fontWeight: '700',
    color: '#DC2626',
  },
  otpInfoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  // OTP Section
  otpSection: {
    marginBottom: 20,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  otpInputContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 4,
  },
  otpInput: {
    height: 56,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 4,
    backgroundColor: 'transparent',
  },

  // Loading States
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    marginTop: 16,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 8,
    // Add animation if you want
  },
  loadingText: {
    fontSize: 14,
    color: '#1D4ED8',
    fontWeight: '500',
  },

  // Action Buttons
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },

  // Add these styles to your existing StyleSheet.create()

  // Delete Modal Specific Styles
  deleteModalHeader: {
    backgroundColor: '#FFF1F1',
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#FFCDD2',
  },
  deleteIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteIcon: {
    fontSize: 28,
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#D32F2F',
    textAlign: 'center',
  },
  deleteConfirmButton: {
    backgroundColor: '#D32F2F',
    shadowColor: '#D32F2F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteConfirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deactivateConfirmButton: {
    backgroundColor: '#FF9500',
    shadowColor: '#FF9500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deactivateConfirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Merge these with your existing styles object
});
