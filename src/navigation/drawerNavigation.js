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
  StatusBar,
  Platform,
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
import {resetOTPData} from '../redux/slices/auth/sendOTPSlices';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
import {CommonActions} from '@react-navigation/native';

// Get status bar height for proper positioning
const getStatusBarHeight = () => {
  return Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
};

const Drawer = createDrawerNavigator();

// Enhanced Profile Screen with proper status bar handling
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
    if (
      !editedData.name.trim() ||
      !editedData.email.trim() ||
      !editedData.mobile.trim()
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (editedData.mobile.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

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
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
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
        </ScrollView>

        <Modal
          visible={showEditModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCancel}>
          <View style={styles.container}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.background}
              translucent={false}
            />
            <SafeAreaView style={styles.safeArea}>
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
                        placeholderTextColor={colors.text_color_2}
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
                        placeholderTextColor={colors.text_color_2}
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
                        placeholderTextColor={colors.text_color_2}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

// Settings Screen with proper status bar handling
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

  const handleDeactivateAccount = () => {
    if (!homeData?.partner?.email) {
      Alert.alert('Error', 'User email not found. Cannot send OTP.');
      return;
    }
    dispatch(sentOTP({email: homeData?.partner?.email}));
    setShowDeactivateModal(true);
  };

  const handleDeleteAccount = () => {
    if (!homeData?.partner?.email) {
      Alert.alert('Error', 'User email not found. Cannot send OTP.');
      return;
    }
    dispatch(sentOTP({email: homeData?.partner?.email}));
    setShowDeleteModal(true);
  };

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

  useEffect(() => {
    if (deactivateResponse?.result?.status === 'success') {
      Alert.alert(
        'Account Deactivated',
        'Your account has been successfully deactivated.',
      );
      setShowDeactivateModal(false);
    } else if (deactivateError) {
      Alert.alert(
        'Error',
        deactivateError.message || 'Failed to deactivate account.',
      );
    }
  }, [deactivateResponse, deactivateError, navigation]);

  useEffect(() => {
    if (deleteResponse?.result?.status === 'success') {
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted.',
      );
      setShowDeleteModal(false);
    } else if (deleteError) {
      Alert.alert('Error', deleteError.message || 'Failed to delete account.');
    }
  }, [deleteResponse, deleteError, navigation]);

  const confirmDeactivation = async () => {
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
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.editButton} />
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
              <Text style={[styles.actionIcon, {color: colors.status_red}]}>⚠️</Text>
              <Text
                style={[
                  styles.actionText,
                  {color: colors.status_red, fontWeight: '700'},
                ]}>
                Deactivate Account
              </Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleDeleteAccount}>
              <Text style={[styles.actionIcon, {color: colors.status_red}]}>🗑️</Text>
              <Text
                style={[
                  styles.actionText,
                  {color: colors.status_red, fontWeight: '700'},
                ]}>
                Delete Account
              </Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Deactivate Modal */}
        <Modal
          visible={showDeactivateModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowDeactivateModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
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

              <View style={styles.modalContent}>
                <Text style={styles.modalMessage}>
                  Are you sure you want to deactivate your account? This action is{' '}
                  <Text style={styles.emphasizedText}>irreversible</Text>.
                </Text>

                <Text style={styles.otpInfoText}>
                  An OTP has been sent to your registered email for verification.
                </Text>

                <View style={styles.otpSection}>
                  <Text style={styles.otpLabel}>Enter OTP</Text>
                  <View style={styles.otpInputContainer}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="000000"
                      placeholderTextColor={colors.text_color_2}
                      keyboardType="number-pad"
                      value={enteredOTP}
                      onChangeText={setEnteredOTP}
                      maxLength={6}
                      textAlign="center"
                      editable={!otpLoading && !deactivateLoading}
                    />
                  </View>
                </View>

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

        {/* Delete Modal */}
        <Modal
          visible={showDeleteModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
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

                <View style={styles.otpSection}>
                  <Text style={styles.otpLabel}>Enter OTP</Text>
                  <View style={styles.otpInputContainer}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="000000"
                      placeholderTextColor={colors.text_color_2}
                      keyboardType="number-pad"
                      value={deleteEnteredOTP}
                      onChangeText={setDeleteEnteredOTP}
                      maxLength={6}
                      textAlign="center"
                      editable={!otpLoading && !deleteLoading}
                    />
                  </View>
                </View>

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
    </View>
  );
};

// Help Screen
const HelpScreen = ({navigation}) => (
  <View style={styles.container}>
    <StatusBar
      barStyle="light-content"
      backgroundColor={colors.background}
      translucent={false}
    />
    <SafeAreaView style={styles.safeArea}>
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
  </View>
);

// Enhanced Custom Drawer Content Component with Gold Logo
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

  const handleLogout = async () => {
    try {
      console.log('User logout initiated');

      dispatch(isOTPVerified(false));
      dispatch(resetOTPData());

      await AsyncStorage.setItem('isLoggedIn', 'false');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      console.log('Logout data cleared, navigating to login');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );

      console.log('Navigation dispatch completed');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout properly. Please try again.');
    }
  };

  return (
    <View style={styles.drawerContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      <SafeAreaView style={styles.drawerSafeArea}>
        <View style={styles.drawerHeader}>
          <View style={styles.profileSection}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logoImage}
                resizeMode="contain"
                source={logo}
                onError={error => console.log('Logo load error:', error)}
              />
            </View>
          </View>
        </View>

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.drawerContent}
          showsVerticalScrollIndicator={false}>
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

          <View style={styles.divider} />

          <View style={styles.bottomSection}>
            <DrawerItem
              label="Logout"
              onPress={() => {
                handleLogout();
              }}
              labelStyle={[styles.drawerLabel, styles.logoutLabel]}
              style={styles.drawerItem}
            />
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
    </View>
  );
}

// Main Drawer Navigator
export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawer,
        drawerActiveTintColor: colors?.primary || '#007AFF',
        drawerInactiveTintColor: colors?.textSecondary,
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
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  // Container and SafeArea fixes
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Drawer styles with proper status bar handling
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  drawerSafeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  drawer: {
    backgroundColor: colors.background,
    width: 280,
    shadowColor: colors.shadow,
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  drawerHeader: {
    backgroundColor: colors.secondary,
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
  logoContainer: {
    height: height * 0.15,
    width: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 10,
  },
  logoImage: {
    height: '100%',
    width: '100%',
    tintColor: colors.gold, // Gold color for the logo
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
    color: colors.text_color_1,
  },
  userName: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  userId: {
    fontSize: 11,
    color: colors.textSecondary,
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
    color: colors.text_color_2,
  },
  logoutLabel: {
    color: colors.status_red,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
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

  // Screen content styles
  screenContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  screenText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text_color_1,
  },

  // Header styles with proper positioning
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    minWidth: 40,
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text_color_1,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text_color_1,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    minWidth: 40,
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 18,
    color: colors.gold,
  },

  // Profile screen content
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  userStatus: {
    fontSize: 16,
    color: colors.status_green,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text_color_1,
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
    backgroundColor: colors.surface,
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
    color: colors.text_color_2,
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text_color_1,
    fontWeight: '600',
  },

  // Settings screen styles
  actionsCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    elevation: 2,
    shadowColor: colors.shadow,
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
    width: 24,
    textAlign: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
  },
  actionArrow: {
    fontSize: 18,
    color: colors.text_color_2,
    fontWeight: '600',
  },

  // Modal styles
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.status_red,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text_color_1,
  },
  modalSaveText: {
    fontSize: 16,
    color: colors.gold,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text_color_1,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 12,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text_color_1,
    backgroundColor: 'transparent',
  },

  // OTP Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  warningIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 28,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.text_color_2,
    fontWeight: '600',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.text_color_1,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emphasizedText: {
    fontWeight: '700',
    color: colors.status_red,
  },
  otpInfoText: {
    fontSize: 14,
    color: colors.text_color_2,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  otpSection: {
    marginBottom: 20,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 8,
    textAlign: 'center',
  },
  otpInputContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 4,
  },
  otpInput: {
    height: 56,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text_color_1,
    letterSpacing: 4,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginTop: 16,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginRight: 8,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: '500',
  },
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
  },
  disabledButton: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: colors.text_color_2,
  },

  // Delete modal specific styles
  deleteModalHeader: {
    backgroundColor: colors.surface,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  deleteIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
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
    color: colors.status_red,
    textAlign: 'center',
  },
  deleteConfirmButton: {
    backgroundColor: colors.status_red,
    shadowColor: colors.status_red,
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
    color: colors.text_color_1,
  },

  // Deactivate modal specific styles
  deactivateConfirmButton: {
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
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
    color: colors.primary,
  },
});