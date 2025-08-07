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
  ActivityIndicator,
} from 'react-native';
import {typography} from '../../theme/typography';
import SmallButton from '../../components/buttons/smallButton';
import {useOTPVerification} from '../../hooks/auth/useOTPVerification';
import logo from '../../../assets/logo.png';

const {width, height} = Dimensions.get('window');

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
  const glowAnimation = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={styles.loadingText}>
              {isVerifying
                ? 'Verifying...'
                : isResending
                ? 'Resending OTP...'
                : 'Please wait...'}
            </Text>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <View style={[styles.container, isLoading && styles.containerBlurred]}>
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

              <Text style={styles.cardTitle}>Check Your Email ✨</Text>
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
                  {transform: [{translateX: shakeAnimation}]},
                ]}>
                {otp.map((digit, index) => (
                  <View key={index} style={styles.otpBoxContainer}>
                    <Animated.View
                      style={[
                        styles.otpBoxWrapper,
                        {
                          shadowOpacity: glowAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.2, 0.6],
                          }),
                        },
                      ]}>
                      <TextInput
                        ref={ref => (inputRefs.current[index] = ref)}
                        style={[
                          styles.otpBox,
                          digit ? styles.filledOtpBox : {},
                          isLoading && styles.disabledInput,
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={text =>
                          !isLoading && handleChange(text, index)
                        }
                        onKeyPress={event =>
                          !isLoading && handleKeyPress(event, index)
                        }
                        textContentType="oneTimeCode"
                        editable={!isLoading}
                        placeholderTextColor={colors.textSecondary}
                      />
                    </Animated.View>
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
                  Code expires in:{' '}
                  <Text style={styles.timerValue}>{`00:${
                    timer < 10 ? '0' : ''
                  }${timer}`}</Text>
                </Text>
              </View>
            </View>

            {/* Verify Button */}
            <View style={styles.buttonSection}>
              <SmallButton
                title={isVerifying ? 'Verifying...' : 'Verify Code'}
                onPress={handleVerifyOTP}
                style={[
                  styles.verifyButton,
                  isLoading && styles.disabledButton,
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
                  isLoading && styles.disabledButton,
                ]}>
                <View style={styles.resendButtonContent}>
                  {isResending && (
                    <ActivityIndicator
                      size="small"
                      color={colors.gold}
                      style={styles.resendLoader}
                    />
                  )}
                  <Text
                    style={[
                      styles.resendText,
                      timer === 0 && !isLoading && styles.resendTextActive,
                      isLoading && styles.disabledText,
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
                isLoading && styles.disabledButton,
              ]}
              disabled={isLoading}>
              <Text
                style={[
                  styles.wrongEmailText,
                  isLoading && styles.disabledText,
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
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: width < 350 ? 12 : 20,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: colors.secondary,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text_color_1,
  },
  disabledInput: {
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    borderColor: colors.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textSecondary,
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
    backgroundColor: colors.shimmer,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 10,
    left: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.accent}40`,
    shadowColor: colors.accent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: `${colors.gold}25`,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 4},
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
        tintColor: colors.gold, // Apply white tint for dark mode
    
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
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  completedStep: {
    backgroundColor: colors.status_green,
  },
  activeStep: {
    backgroundColor: colors.gold,
  },
  checkmark: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepNumber: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 40,
    height: 3,
    backgroundColor: colors.gold,
    marginHorizontal: 12,
    borderRadius: 1.5,
  },

  // Verification Card
  verificationCard: {
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: width < 350 ? 16 : 24,
    marginHorizontal: 4,
    marginVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 8,
    maxHeight: height * 0.55,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    alignSelf: 'center',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text_color_1,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: colors.shadow,
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  cardSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  // OTP Section
 otpSection: {
  marginBottom: 24,
  alignItems: 'center',
  paddingHorizontal: width * 0.02, // Responsive horizontal padding
},
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
    textAlign: 'center',
    marginBottom: 20,
  },
otpContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: width * 0.85, // 85% of screen width
  alignSelf: 'center',
  paddingHorizontal: width * 0.02, // 2% padding
},
otpBoxContainer: {
  position: 'relative',
  alignItems: 'center',
  width: (width * 0.85 - width * 0.04 - (5 * width * 0.015)) / 6, // Calculate exact width for 6 boxes
  height: (width * 0.85 - width * 0.04 - (5 * width * 0.015)) / 6, // Square boxes
  minWidth: width * 0.1, // Minimum 10% of screen width
  maxWidth: width * 0.15, // Maximum 15% of screen width
  minHeight: 45,
  maxHeight: 60,
},
otpBoxWrapper: {
  shadowColor: colors.gold,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  elevation: 4,
  width: '100%',
  height: '100%',
},
otpBox: {
  width: '100%',
  height: '100%',
  backgroundColor: colors.surface,
  borderRadius: width * 0.025, // Responsive border radius
  textAlign: 'center',
  fontSize: width < 350 ? width * 0.045 : width * 0.05, // Responsive font size
  fontWeight: 'bold',
  color: colors.text_color_1,
  borderWidth: 2,
  borderColor: colors.border,
  paddingVertical: 0,
  includeFontPadding: false,
  textAlignVertical: 'center',
},
otpDot: {
  position: 'absolute',
  bottom: width * 0.015, // Responsive positioning
  left: '50%',
  marginLeft: -3,
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: colors.gold,
},
  filledOtpBox: {
    borderColor: colors.gold,
    backgroundColor: `${colors.gold}10`,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  otpDot: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },

  // Timer Section
  timerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.gold}15`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    borderWidth: 1,
    borderColor: `${colors.gold}30`,
  },
  timerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  timerText: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: '500',
  },
  timerValue: {
    fontWeight: 'bold',
    color: colors.goldDark,
  },

  // Button Section
  buttonSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  verifyButton: {
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  // Help Section
  helpSection: {
    alignItems: 'center',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helpIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Bottom Section
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 12,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  resendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resendButtonActive: {
    backgroundColor: `${colors.gold}15`,
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  resendText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resendTextActive: {
    color: colors.gold,
    fontWeight: '600',
  },
  wrongEmailButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  wrongEmailText: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default OTPVerificationScreen;
