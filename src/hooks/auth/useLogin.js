import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {loginUser} from '../../redux/slices/auth/loginSlices';
import {sentOTP} from '../../redux/slices/auth/sendOTPSlices';

/**
 * Custom hook that handles all login functionality
 * @returns {Object} Login state and handlers
 */

const useLogin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Get OTP data and loading state from Redux
  const otpData = useSelector(state => state.OTPData);
  const {data, loading, error} = otpData;

  useEffect(() => {
    // console.log('otp response', data?.result?.status);

    if (data?.result?.status === 'success') {
      navigation.navigate('Verify', {purpose: 'Login', email: email});
    }
    if (error) {
      alert(`Sign up failed: ${error}`);
      // dispatch(clearRegisterError()); // Optional: clear error
    }
  }, [data, error, email]);

  /**
   * Validates email and handles login process
   */
  const handleSignIn = () => {
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Clear any previous errors
    setEmailError('');
    
    // Dispatch OTP request
    dispatch(sentOTP({email}));
  };

  /**
   * Navigate to signup screen
   */
  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return {
    // State
    email,
    emailError,
    loading, // Expose loading state
    error,   // Expose error state

    // Handlers
    setEmail,
    handleSignIn,
    navigateToSignup,
  };
};

export default useLogin;