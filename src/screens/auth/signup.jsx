import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar
} from 'react-native';
import { typography } from '../../theme/typography';
import CustomCheckbox from '../../components/inputs/checkBox';
import InputBox from '../../components/inputs/textInput';
import PhoneNumberInput from '../../components/inputs/phoneNumberInput';
import LargeButton from '../../components/buttons/largeButton';
import { useSignUp } from '../../hooks/auth/useSignUp';
import { useNavigation } from '@react-navigation/native';
import logo from '../../../assets/logo.png';

const { width, height } = Dimensions.get('window');

// Dark color scheme
const colors = {
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
};

const SignUp = () => {
  const navigation = useNavigation();
  const {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    referral,
    setReferral,
    agree,
    setAgree,
    selectedCode,
    setSelectedCode,
    phoneError,
    nameError,
    emailError,
    loading,
    handleSignUp,
    navigateToLogin,
    fromLogin,
  } = useSignUp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              {/* Decorative Elements */}
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
              <View style={styles.decorativeCircle3} />
              
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image 
                  style={styles.logoImage} 
                  resizeMode="contain" 
                  source={logo}
                />
              </View>

              {/* Welcome Text */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>
                  Complete Your Registration ✨
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Please complete your account setup to continue
                </Text>
              </View>

              {/* Coming from login notification */}
              <View style={styles.infoBanner}>
                <Text style={styles.infoBannerIcon}>ℹ️</Text>
                <Text style={styles.infoBannerText}>
                  We found your email but need a few more details to set up your account
                </Text>
              </View>
            </View>

            {/* Registration Form Card */}
            <View style={styles.formCard}>
              {/* Step Indicator */}
              <View style={styles.stepSection}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Personal Details</Text>
                    <Text style={styles.stepSubtitle}>Just a few details to get started</Text>
                  </View>
                </View>
                <View style={styles.nextStepPreview}>
                  <Text style={styles.nextStepText}>Next: Email verification →</Text>
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.formFields}>
                {/* Personal Info Section */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                  <Text style={styles.sectionSubtitle}>Tell us about yourself</Text>
                </View>

                <InputBox
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  required
                  error={nameError}
                  editable={!loading}
                />

                <PhoneNumberInput
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  required
                  selectedCode={selectedCode}
                  onSelectCode={setSelectedCode}
                  error={phoneError}
                  editable={!loading}
                />

                <InputBox
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  required
                  error={emailError}
                  editable={false} // Always disable editing since email comes from login
                />

                {/* Optional Section */}
                <View style={styles.optionalSection}>
                  <Text style={styles.optionalHeader}>Optional</Text>
                  <InputBox
                    label="Referral Code"
                    value={referral}
                    onChangeText={setReferral}
                    placeholder="Have a referral code? Enter here"
                    editable={!loading}
                  />
                  
                  {/* Referral Benefits */}
                  {referral.length === 0 && (
                    <View style={styles.benefitNote}>
                      <Text style={styles.benefitIcon}>🎁</Text>
                      <Text style={styles.benefitText}>
                        Got a referral code? You'll get special bonuses!
                      </Text>
                    </View>
                  )}
                </View>

                {/* Terms & Conditions */}
                <View style={styles.termsSection}>
                  <View style={styles.checkboxContainer}>
                    <CustomCheckbox 
                      value={agree} 
                      onValueChange={setAgree}
                      disabled={loading}
                    />
                    <View style={styles.termsTextContainer}>
                      <Text style={styles.termsText}>
                        I agree to the{' '}
                        <TouchableOpacity 
                          style={styles.linkButton}
                          onPress={() => {/* Navigate to Terms */}}
                          disabled={loading}
                        >
                          <Text style={styles.link}>Terms of Service</Text>
                        </TouchableOpacity>
                        {'      '}and{' '}
                        <TouchableOpacity 
                          style={styles.linkButton}
                          onPress={() => {/* Navigate to Privacy */}}
                          disabled={loading}
                        >
                          <Text style={styles.link}>Privacy Policy</Text>
                        </TouchableOpacity>
                      </Text>
                    </View>
                  </View>

                  {/* Trust Indicators */}
                  <View style={styles.trustIndicators}>
                    <View style={styles.trustItem}>
                      <Text style={styles.trustIcon}>🔒</Text>
                      <Text style={styles.trustText}>Secure & Encrypted</Text>
                    </View>
                    <View style={styles.trustItem}>
                      <Text style={styles.trustIcon}>⚡</Text>
                      <Text style={styles.trustText}>Quick Setup</Text>
                    </View>
                    <View style={styles.trustItem}>
                      <Text style={styles.trustIcon}>🎯</Text>
                      <Text style={styles.trustText}>No Spam</Text>
                    </View>
                  </View>
                </View>

                {/* Submit Button */}
                <View style={styles.buttonSection}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={colors.gold} />
                      <Text style={styles.loadingText}>
                        Setting up your account...
                      </Text>
                    </View>
                  ) : (
                    <LargeButton 
                      title="Complete Registration"
                      onPress={handleSignUp}
                      style={[
                        styles.createButton,
                        loading && styles.buttonDisabled
                      ]}
                      disabled={loading}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <TouchableOpacity 
                onPress={navigateToLogin}
                style={[
                  styles.loginSection,
                  loading && styles.linkDisabled
                ]}
                disabled={loading}
              >
                <Text style={[
                  styles.loginText,
                  loading && styles.textDisabled
                ]}>
                  Already have an account?{' '}
                  <Text style={[
                    styles.loginLink,
                    loading && styles.linkDisabled
                  ]}>
                    Sign In Instead
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Header Section
  headerSection: {
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 20,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.shimmer,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 10,
    left: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.accent}40`,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 60,
    left: -10,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: `${colors.gold}30`,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    height: height * 0.18,
    width: width * 0.65,
    maxHeight: 140,
    maxWidth: 280,
    opacity: 0.95,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text_color_1,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Info Banner (for coming from login)
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.gold}15`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    borderWidth: 1,
    borderColor: `${colors.gold}30`,
  },
  infoBannerIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: colors.gold,
    lineHeight: 20,
    fontWeight: '500',
  },

  // Form Card
  formCard: {
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 4,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Step Indicator
  stepSection: {
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  stepNumberText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text_color_1,
    marginBottom: 2,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  nextStepPreview: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  nextStepText: {
    fontSize: 12,
    color: colors.gold,
    fontWeight: '500',
  },

  // Form Fields
  formFields: {
    gap: 16,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text_color_1,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Optional Section
  optionalSection: {
    marginTop: 8,
  },
  optionalHeader: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  benefitNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.gold}15`,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    borderWidth: 1,
    borderColor: `${colors.gold}30`,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    color: colors.gold,
    lineHeight: 18,
  },

  // Terms Section
  termsSection: {
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  termsText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  linkButton: {
    display: 'inline',
  },
  link: {
    color: colors.gold,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  trustText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Button Section
  buttonSection: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  createButton: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
    elevation: 2,
  },

  // Bottom Section
  bottomSection: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  loginSection: {
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loginLink: {
    color: colors.gold,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  
  // Loading States
  textDisabled: {
    opacity: 0.4,
  },
  linkDisabled: {
    opacity: 0.4,
    textDecorationLine: 'none',
  },
});

export default SignUp;