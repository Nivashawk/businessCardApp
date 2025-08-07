import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import LargeButton from '../../components/buttons/largeButton';
import InputBox from '../../components/inputs/textInput';
import useLogin from '../../hooks/auth/useLogin';
import logo from '../../../assets/logo.png';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const {
    email,
    emailError,
    loading,
    error,
    setEmail,
    handleSignIn,
    navigateToSignup,
  } = useLogin();

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
            {/* Hero Section */}
            <View style={styles.heroSection}>
              {/* Decorative Elements with Shimmer Effect */}
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
              <View style={styles.shimmerOverlay} />
              
              {/* Logo */}
              <View style={styles.logoContainer}>
                <View style={styles.logoGlow} />
                <Image 
                  style={styles.logoImage} 
                  resizeMode="contain" 
                  source={logo}
                />
              </View>

              {/* Welcome Text */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>
                  Welcome Back!
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Enter your email to receive a secure login code
                </Text>
              </View>
            </View>

            {/* Login Card */}
            <View style={styles.loginCard}>
              {/* Gradient Overlay */}
              <View style={styles.cardGradient} />
              
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepDot} />
                  <Text style={styles.stepText}>Step 1 of 2</Text>
                </View>
                <Text style={styles.cardTitle}>Enter Email</Text>
              </View>

              {/* Input Section */}
              <View style={styles.inputSection}>
                <InputBox
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  required
                  error={emailError}
                  editable={!loading}
                />
                
                {/* Help Text */}
                <Text style={styles.helpText}>
                  We'll send a 6-digit verification code to this email
                </Text>
              </View>

              {/* Button Section */}
              <View style={styles.buttonSection}>
                <LargeButton 
                  title={loading ? "Sending Code..." : "Send Verification Code"}
                  onPress={handleSignIn}
                  disabled={loading}
                  style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled
                  ]}
                />
                
                {/* Loading Indicator */}
                {loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator 
                      size="small" 
                      color={colors.gold} 
                    />
                    <Text style={styles.loadingText}>
                      Sending verification code...
                    </Text>
                  </View>
                )}
              </View>

              {/* Security Note */}
              <View style={styles.securityNote}>
                <View style={styles.securityIcon}>
                  <Text style={styles.securityIconText}>🔒</Text>
                </View>
                <Text style={styles.securityText}>
                  Your data is protected with bank-level security
                </Text>
              </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              {/* FAQ */}
              <TouchableOpacity 
                style={styles.faqButton}
                onPress={() => {
                  alert('We use email + OTP for enhanced security. No passwords to remember or forget! 🔐');
                }}
                disabled={loading}
              >
                <Text style={[
                  styles.faqText,
                  loading && styles.textDisabled
                ]}>
                  Why email verification instead of password? 💡
                </Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <TouchableOpacity 
                onPress={navigateToSignup} 
                style={styles.signupSection}
                disabled={loading}
              >
                <Text style={[
                  styles.signupText,
                  loading && styles.textDisabled
                ]}>
                  New here?{' '}
                  <Text style={[
                    styles.signupLink,
                    loading && styles.linkDisabled
                  ]}>
                    Create your account
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
  
  // Hero Section
  heroSection: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 20,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 30,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gold + '15',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 20,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent + '25',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  // shimmerOverlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: colors.shimmer,
  //   opacity: 0.1,
  //   borderRadius: 20,
  // },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    position: 'relative',
  },
  // logoGlow: {
  //   position: 'absolute',
  //   width: width * 0.7,
  //   height: height * 0.2,
  //   backgroundColor: colors.gold,
  //   opacity: 0.1,
  //   borderRadius: 100,
  //   blur: 50,
  //   zIndex: 0,
  // },
  logoImage: {
    height: height * 0.18,
    width: width * 0.65,
    maxHeight: 140,
    maxWidth: 280,
    opacity: 0.95,
    zIndex: 1,
    tintColor: colors.gold, // Apply white tint for dark mode
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text_color_1,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  // Login Card
  loginCard: {
    flex: 0.4,
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.gold,
    opacity: 0.8,
  },
  cardHeader: {
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginRight: 8,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  stepText: {
    fontSize: 12,
    color: colors.gold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text_color_1,
    letterSpacing: -0.3,
  },
  inputSection: {
    marginBottom: 24,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  buttonSection: {
    marginBottom: 20,
  },
  primaryButton: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.status_green,
    borderWidth: 1,
    borderColor: colors.border,
  },
  securityIcon: {
    marginRight: 8,
  },
  securityIconText: {
    fontSize: 16,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Bottom Section
  bottomSection: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  faqButton: {
    backgroundColor: colors.surface + '80',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border + '40',
  },
  faqText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  signupSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  signupText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  signupLink: {
    color: colors.gold,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textShadowColor: colors.gold + '40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Loading States
  textDisabled: {
    opacity: 0.4,
  },
  linkDisabled: {
    opacity: 0.4,
    textDecorationLine: 'none',
    textShadowRadius: 0,
  },
});

export default Login;