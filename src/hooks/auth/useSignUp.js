import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/auth/registerSlices';
import Toast from 'react-native-toast-message';

export const useSignUp = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Users can ONLY reach signup from login with type:1
  // So these params will ALWAYS be present
  const { email: prefilledEmail, otpToken } = route.params || {};
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(prefilledEmail || '');
  const [referral, setReferral] = useState('');
  const [agree, setAgree] = useState(false);
  const [selectedCode, setSelectedCode] = useState('IN');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const registerState = useSelector((state) => state.register);

  // Handle registration response
  useEffect(() => {
    if (registerState?.data?.result?.status === 'success') {
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Welcome! Your account has been created.',
      });
      // Navigation to home will be handled by rootNavigation based on Redux state
    }
    
    if (registerState?.error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: registerState.error,
      });
    }
  }, [registerState]);

  // Redirect if no OTP token (shouldn't happen in normal flow)
  useEffect(() => {
    if (!otpToken) {
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Please start from login screen.',
      });
      navigation.navigate('Login');
    }
  }, [otpToken, navigation]);

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setPhoneError('');
    setEmailError('');

    // Validate agreement to terms
    if (!agree) {
      Toast.show({
        type: 'error',
        text1: 'Terms Required',
        text2: 'Please agree to the terms and conditions before signing up',
      });
      return false;
    }

    // Validate name
    if (name.trim().length === 0) {
      setNameError('Please enter your full name');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters long');
      isValid = false;
    }

    // Validate phone number
    if (selectedCode === '+91') {
      const cleanedPhone = phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10) {
        setPhoneError('Please enter a valid 10-digit Indian phone number');
        isValid = false;
      }
    } else {
      // Add validation for other country codes if needed
      if (phone.trim().length === 0) {
        setPhoneError('Please enter a valid phone number');
        isValid = false;
      }
    }

    // Validate email (should be pre-filled and verified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    if (!otpToken) {
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Please start from login screen.',
      });
      navigation.navigate('Login');
      return;
    }

    try {
      // Call registration API directly (OTP already verified during login)
      await dispatch(
        registerUser({
          name: name.trim(),
          phone: phone.replace(/\D/g, ''), // Clean phone number
          email: email.trim().toLowerCase(),
          country_code: selectedCode, // Remove + from country code
          otp: '111111', // Hardcoded OTP as per requirement
          token: otpToken,
          referral_code: referral.trim() || null
        })
      ).unwrap();
      
    } catch (error) {
      console.error('Registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message || error,
      });
    }
  };

  // Navigate back to login
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    // Form state
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
    
    // Validation errors
    phoneError,
    nameError,
    emailError,
    
    // Loading state
    loading: registerState?.loading,
    
    // Actions
    handleSignUp,
    navigateToLogin,
    
    // Flags
    fromLogin: true, // Always true since signup is only accessible from login
  };
};