import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../redux/slices/auth/loginSlices';

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
    console.log('Signing in with:', email);
    dispatch(loginUser({ email }));
    navigation.navigate('Verify', { purpose: "Login", email: email });
  };

  /**
   * Navigate to signup screen
   */
  const navigateToSignup = () => {
    navigation.navigate("Signup");
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