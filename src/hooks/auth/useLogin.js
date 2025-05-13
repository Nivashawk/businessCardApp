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
  // Uncomment if you need user state from Redux
  // const { data: user, loading, error } = useSelector(state => state.user);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const otpData = useSelector(state => state.OTPData);
  const {data, loading, error} = otpData;

  useEffect(() => {
    console.log('otp response', data?.result?.status);

    if (data?.result?.status === 'success') {
      navigation.navigate('Verify', {purpose: 'Login', email: email});
    }
    if (error) {
      alert(`Sign up failed: ${error}`);
      // dispatch(clearRegisterError()); // Optional: clear error
    }
  }, [data, error, navigation, dispatch]);

  // Uncomment if you need to fetch user data on mount
  // useEffect(() => {
  //   dispatch(fetchUser());
  // }, [dispatch]);

  /**
   * Validates email and handles login process
   */
  const handleSignIn = () => {
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
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
    // loading,
    // error,

    // Handlers
    setEmail,
    handleSignIn,
    navigateToSignup,
  };
};

export default useLogin;
