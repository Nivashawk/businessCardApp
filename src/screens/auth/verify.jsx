import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator
} from 'react-native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import SmallButton from '../../components/buttons/smallButton';
import { useOTPVerification } from '../../hooks/auth/useOTPVerification';
import logo from '../../../assets/logo.png';

const {width, height} = Dimensions.get('window');

const OTPVerificationScreen = () => {
  const {
    otp,
    inputRefs,
    timer,
    resendText,
    isLoading,
    isVerifying,
    isResending,
    handleChange,
    handleKeyPress,
    handleResendOTP,
    handleWrongePhoneNumber,
    handleVerifyOTP,
  } = useOTPVerification();

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.secondary} />
      
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary || '#007AFF'} />
            <Text style={styles.loadingText}>
              {isVerifying ? 'Verifying...' : isResending ? 'Resending OTP...' : 'Please wait...'}
            </Text>
          </View>
        </View>
      )}
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={[styles.container, isLoading && styles.containerBlurred]}>
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
          </View>

          {/* Verification Card */}
          <View style={styles.verificationCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.progressSection}>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepDot, styles.completedStep]}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                  <View style={styles.stepLine} />
                  <View style={[styles.stepDot, styles.activeStep]}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.cardTitle}>Check Your Email</Text>
              <Text style={styles.cardSubtitle}>
                We've sent a 6-digit verification code to your email address
              </Text>
            </View>

            {/* OTP Input Section */}
            <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>Enter Verification Code</Text>
              <Animated.View 
                style={[
                  styles.otpContainer,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
              >
                {otp.map((digit, index) => (
                  <View key={index} style={styles.otpBoxContainer}>
                    <TextInput
                      ref={ref => (inputRefs.current[index] = ref)}
                      style={[
                        styles.otpBox,
                        digit ? styles.filledOtpBox : {},
                        isLoading && styles.disabledInput
                      ]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={text => !isLoading && handleChange(text, index)}
                      onKeyPress={event => !isLoading && handleKeyPress(event, index)}
                      textContentType="oneTimeCode"
                      editable={!isLoading}
                    />
                    {digit && <View style={styles.otpDot} />}
                  </View>
                ))}
              </Animated.View>
            </View>

            {/* Timer Section */}
            <View style={styles.timerSection}>
              <View style={styles.timerContainer}>
                <Text style={styles.timerIcon}>⏱️</Text>
                <Text style={styles.timerText}>
                  Code expires in: <Text style={styles.timerValue}>{`00:${timer < 10 ? '0' : ''}${timer}`}</Text>
                </Text>
              </View>
            </View>

            {/* Verify Button */}
            <View style={styles.buttonSection}>
              <SmallButton 
                title={isVerifying ? "Verifying..." : "Verify"}
                onPress={handleVerifyOTP}
                style={[
                  styles.verifyButton,
                  isLoading && styles.disabledButton
                ]}
                disabled={isLoading}
                showLoader={isVerifying}
              />
            </View>

            {/* Help Section */}
            <View style={styles.helpSection}>
              <View style={styles.helpItem}>
                <Text style={styles.helpIcon}>💡</Text>
                <Text style={styles.helpText}>Check your spam folder too</Text>
              </View>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomSection}>
            {/* Resend Section */}
            <View style={styles.resendSection}>
              <Text style={styles.resendLabel}>Didn't receive the code?</Text>
              <TouchableOpacity 
                onPress={handleResendOTP} 
                disabled={timer > 0 || isLoading}
                style={[
                  styles.resendButton,
                  timer === 0 && !isLoading && styles.resendButtonActive,
                  isLoading && styles.disabledButton
                ]}
              >
                <View style={styles.resendButtonContent}>
                  {isResending && (
                    <ActivityIndicator 
                      size="small" 
                      color={colors.primary || '#007AFF'} 
                      style={styles.resendLoader}
                    />
                  )}
                  <Text style={[
                    styles.resendText,
                    timer === 0 && !isLoading && styles.resendTextActive,
                    isLoading && styles.disabledText
                  ]}>
                    {isResending ? 'Resending...' : resendText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Wrong Email */}
            <TouchableOpacity 
              onPress={handleWrongePhoneNumber}
              style={[
                styles.wrongEmailButton,
                isLoading && styles.disabledButton
              ]}
              disabled={isLoading}
            >
              <Text style={[
                styles.wrongEmailText,
                isLoading && styles.disabledText
              ]}>
                📝 Entered wrong email address?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  containerBlurred: {
    opacity: 0.7,
  },

  // Loading Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text || '#1a1a1a',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#999',
  },
  resendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendLoader: {
    marginRight: 8,
  },

  // Header Section
  headerSection: {
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
    position: 'relative',
    minHeight: height * 0.25,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 20,
    right: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary ? `${colors.primary}15` : '#007AFF15',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 10,
    left: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
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
  progressSection: {
    alignItems: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: colors.success || '#28a745',
  },
  activeStep: {
    backgroundColor: colors.primary || '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: colors.primary || '#007AFF',
    marginHorizontal: 8,
  },

  // Verification Card
  verificationCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 4,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    maxHeight: height * 0.55,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text || '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary || '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  // OTP Section
  otpSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  otpLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text || '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  otpBoxContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  otpBox: {
    width: 42,
    height: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text || '#1a1a1a',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  filledOtpBox: {
    borderColor: colors.primary || '#007AFF',
    backgroundColor: colors.primary ? `${colors.primary}08` : '#007AFF08',
  },
  otpDot: {
    position: 'absolute',
    bottom: 6,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary || '#007AFF',
  },

  // Timer Section
  timerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  timerIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  timerText: {
    fontSize: 13,
    color: '#856404',
  },
  timerValue: {
    fontWeight: 'bold',
    color: '#d39e00',
  },

  // Button Section
  buttonSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  verifyButton: {
    shadowColor: colors.primary || '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Help Section
  helpSection: {
    alignItems: 'center',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  helpIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  helpText: {
    fontSize: 11,
    color: colors.textSecondary || '#666',
  },

  // Bottom Section
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  resendLabel: {
    fontSize: 13,
    color: colors.textSecondary || '#666',
    marginBottom: 6,
    textAlign: 'center',
  },
  resendButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
  },
  resendButtonActive: {
    backgroundColor: colors.primary ? `${colors.primary}15` : '#007AFF15',
  },
  resendText: {
    fontSize: 13,
    color: colors.textSecondary || '#666',
    textAlign: 'center',
  },
  resendTextActive: {
    color: colors.primary || '#007AFF',
    fontWeight: '600',
  },
  wrongEmailButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  wrongEmailText: {
    fontSize: 13,
    color: colors.primary || '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default OTPVerificationScreen;