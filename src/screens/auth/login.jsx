import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import LargeButton from '../../components/buttons/largeButton';
import InputBox from '../../components/inputs/textInput';
import useLogin from '../../hooks/auth/useLogin';
/**
 * Login Screen Component
 * Focuses on rendering the UI while logic is handled by useLogin hook
 */

const Login = () => {
  const {
    email,
    emailError,
    // loading,
    // error,
    setEmail,
    handleSignIn,
    navigateToSignup,
  } = useLogin();

  // Uncomment if you need loading state
  // if (loading) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator size="large" color="#007AFF" />
  //       <Text style={styles.loadingText}>Loading user info...</Text>
  //     </View>
  //   );
  // }

  // Uncomment if you need error handling
  // if (error) {
  //   return (
  //     <View style={styles.center}>
  //       <Text style={styles.errorText}>Error: {error}</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.topSection}>
        <Text style={[typography.logo, styles.logo]}>LOGO</Text>
      </View>

      <View style={styles.bottomSection}>
        {/* Title */}
        <Text style={[typography.heading, styles.subtitle]}>
          Sign in to your account
        </Text>

        {/* Input */}
        <InputBox
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          keyboardType="email-address"
          required
          error={emailError}
        />

        {/* Button */}
        <LargeButton title="Sent OTP" onPress={handleSignIn} />

        {/* Bottom text */}
        <TouchableOpacity onPress={navigateToSignup} style={styles.footer}>
          <Text style={typography.footerText}>
            Don't have an account?{' '}
            <Text style={typography.linkText}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  topSection: {
    height: '60%',
    justifyContent: 'center',
  },
  logo: {
    textAlign: 'center',
  },
  bottomSection: {
    height: '40%',
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // loadingText: {
  //   marginTop: 10,
  //   fontSize: 16,
  // },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
});

export default Login;