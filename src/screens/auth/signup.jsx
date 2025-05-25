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
import { colors } from '../../theme/colors';
import { useSignUp } from '../../hooks/auth/useSignUp';
import { useNavigation } from '@react-navigation/native';
import logo from '../../../assets/logo.png';

const { width, height } = Dimensions.get('window');

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
  } = useSignUp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
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
                  Join Us Today! 🚀
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Create your account and start your journey
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
                />

                <InputBox
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  required
                  error={emailError}
                />

                {/* Optional Section */}
                <View style={styles.optionalSection}>
                  <Text style={styles.optionalHeader}>Optional</Text>
                  <InputBox
                    label="Referral Code"
                    value={referral}
                    onChangeText={setReferral}
                    placeholder="Have a referral code? Enter here"
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
                    <CustomCheckbox value={agree} onValueChange={setAgree} />
                    <View style={styles.termsTextContainer}>
                      <Text style={styles.termsText}>
                        I agree to the{' '}
                        <TouchableOpacity 
                          style={styles.linkButton}
                          onPress={() => {/* Navigate to Terms */}}
                        >
                          <Text style={styles.link}>Terms of Service</Text>
                        </TouchableOpacity>
                        {'      '}and{' '}
                        <TouchableOpacity 
                          style={styles.linkButton}
                          onPress={() => {/* Navigate to Privacy */}}
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
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text style={styles.loadingText}>Creating your account...</Text>
                    </View>
                  ) : (
                    <LargeButton 
                      title="Create Account" 
                      onPress={handleSignUp}
                      style={styles.createButton}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                style={styles.loginSection}
              >
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.loginLink}>Sign In Instead</Text>
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
    backgroundColor: colors.background || '#f8f9fa',
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
    backgroundColor: colors.primary ? `${colors.primary}12` : '#007AFF12',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 10,
    left: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent ? `${colors.accent}15` : '#FF6B3515',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoImage: {
    height: height * 0.12,
    width: width * 0.6,
    maxHeight: 100,
    maxWidth: 240,
    opacity: 0.95,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text || '#1a1a1a',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: colors.textSecondary || '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form Card
  formCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
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
    backgroundColor: colors.primary || '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text || '#1a1a1a',
    marginBottom: 2,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary || '#666',
  },
  nextStepPreview: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary || '#007AFF',
  },
  nextStepText: {
    fontSize: 12,
    color: colors.primary || '#007AFF',
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
    color: colors.text || '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary || '#666',
  },

  // Optional Section
  optionalSection: {
    marginTop: 8,
  },
  optionalHeader: {
    fontSize: 14,
    color: colors.textSecondary || '#666',
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  benefitNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
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
    color: colors.textSecondary || '#666',
    lineHeight: 20,
  },
  linkButton: {
    display: 'inline',
  },
  link: {
    color: colors.primary || '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
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
    color: colors.textSecondary || '#666',
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
    color: colors.textSecondary || '#666',
  },
  createButton: {
    shadowColor: colors.primary || '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    color: colors.textSecondary || '#666',
    textAlign: 'center',
  },
  loginLink: {
    color: colors.primary || '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignUp;