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
  StatusBar
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
    setEmail,
    handleSignIn,
    navigateToSignup,
  } = useLogin();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.secondary} />
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
                  Welcome Back! 👋
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Enter your email to receive a secure login code
                </Text>
              </View>
            </View>

            {/* Login Card */}
            <View style={styles.loginCard}>
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
                />
                
                {/* Help Text */}
                <Text style={styles.helpText}>
                  We'll send a 6-digit verification code to this email
                </Text>
              </View>

              {/* Button Section */}
              <View style={styles.buttonSection}>
                <LargeButton 
                  title="Send Verification Code"
                  onPress={handleSignIn}
                  style={styles.primaryButton}
                />
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
                  // You can either navigate to FAQ page or show an alert
                  // For now, showing inline explanation
                  alert('We use email + OTP for enhanced security. No passwords to remember or forget! 🔐');
                }}
              >
                <Text style={styles.faqText}>Why email verification instead of password? 💡</Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <TouchableOpacity onPress={navigateToSignup} style={styles.signupSection}>
                <Text style={styles.signupText}>
                  New here?{' '}
                  <Text style={styles.signupLink}>Create your account</Text>
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
    backgroundColor: colors.secondary,
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
    backgroundColor: colors.primary ? `${colors.primary}15` : '#007AFF15',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 20,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent ? `${colors.accent}20` : '#FF6B3520',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
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
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text || '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  // Login Card
  loginCard: {
    flex: 0.4,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
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
    backgroundColor: colors.primary || '#007AFF',
    marginRight: 8,
  },
  stepText: {
    fontSize: 12,
    color: colors.primary || '#007AFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text || '#1a1a1a',
    letterSpacing: -0.3,
  },
  inputSection: {
    marginBottom: 24,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary || '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  buttonSection: {
    marginBottom: 20,
  },
  primaryButton: {
    shadowColor: colors.primary || '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.success || '#28a745',
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
    color: colors.textSecondary || '#666',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  faqText: {
    fontSize: 14,
    color: colors.textSecondary || '#666',
    fontStyle: 'italic',
  },
  signupSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  signupText: {
    fontSize: 16,
    color: colors.textSecondary || '#666',
    textAlign: 'center',
  },
  signupLink: {
    color: colors.primary || '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default Login;