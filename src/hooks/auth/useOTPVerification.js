import {useState, useRef, useCallback, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../redux/slices/auth/registerSlices';
import {resetOTPData, sendOTP} from '../../redux/slices/auth/sendOTPSlices';
import {isOTPVerified} from '../../redux/slices/auth/sendOTPSlices';
import {loginUser} from '../../redux/slices/auth/loginSlices';
import Toast from 'react-native-toast-message';

export const useOTPVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {purpose, name, email, phone, referral_code} = route.params;
  
  // Redux state selectors
  const otpState = useSelector(state => state.OTPData);
  const registerState = useSelector(state => state.register);
  const loginState = useSelector(state => state.login);
  
  const {data} = otpState;

  // Local state
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [resendText, setResendText] = useState(`OTP sent to `);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Refs
  const inputRefs = useRef([]);
  const intervalRef = useRef(null);

  // Check if any API call is loading
  const isLoading = registerState?.loading || loginState?.loading || isVerifying || isResending;

  const startTimer = useCallback(() => {
    setTimer(60);
    setResendText(`OTP sent to ${email}`);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(intervalRef.current);
          setResendText('Resend OTP');
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  }, [email]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [startTimer]);

  const handleResendOTP = useCallback(async () => {
    if (isResending || timer > 0) return;
    
    try {
      setIsResending(true);
      
      // Dispatch the resend OTP action
      const result = await dispatch(sendOTP({
        email,
        purpose
      })).unwrap();
      
      if (result.status === "success") {
        startTimer();
        Toast.show({
          type: 'success',
          text1: 'OTP Resent',
          text2: 'A new verification code has been sent to your email',
        });
      } else if(result.status === "error"){
        Toast.show({
          type: 'error',
          text1: 'OTP Resend Failed',
          text2: result.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: error.message || 'Failed to resend OTP. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  }, [dispatch, email, purpose, startTimer, isResending, timer]);

  const handleChange = useCallback(
    (text, index) => {
      if (text.length > 1) return;
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, inputRefs],
  );

  const handleKeyPress = useCallback(
    (event, index) => {
      if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp, inputRefs],
  );

  const handleWrongePhoneNumber = useCallback(() => {
    if (isLoading) return; // Prevent navigation during loading
    
    dispatch(resetOTPData());
    navigation.goBack();
  }, [navigation, isLoading]);

  const handleVerifyOTP = useCallback(async () => {
    if (isLoading) return; // Prevent multiple calls
    
    if (!otp.every(value => value !== '')) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete OTP',
        text2: 'Please enter all 6 digits of the verification code.',
      });
      return;
    }

    const enteredOTP = otp.join('');
    
    try {
      setIsVerifying(true);
      
      if (purpose === 'Register') {
        // For signup flow - directly register user
        const result = await dispatch(
          registerUser({
            name,
            phone,
            email,
            country_code: 'IN',
            otp: enteredOTP,
            token: data?.result?.token,
            referral_code
          }),
        ).unwrap();
        
        console.log("Register result:", result);
        
        if (result?.result?.status === "success") {
          Toast.show({
            type: 'success',
            text1: 'Registration Successful',
            text2: 'Welcome! Your account has been created.',
          });
          
          // Mark as verified and navigate to home
          dispatch(isOTPVerified(true));
          // Navigation will be handled by rootNavigation based on isOTPVerified state
        }
        
      } else if (purpose === 'Login') {
        // For login flow - verify OTP and check user type
        const result = await dispatch(
          loginUser({
            email, 
            otp: enteredOTP, 
            token: data?.result?.token
          }),
        ).unwrap();
        
        console.log("Login result:", result);
        
        if (result?.result?.status === "success") {
          const userType = result?.result?.type;
          
          if (userType === '0') {
            // User exists in DB - proceed to home
            Toast.show({
              type: 'success',
              text1: 'Login Successful',
              text2: 'Welcome back!',
            });
            
            dispatch(isOTPVerified(true));
            // Navigation will be handled by rootNavigation based on isOTPVerified state
            
          } else if (userType === '1') {
            // User doesn't exist - redirect to signup
            Toast.show({
              type: 'info',
              text1: 'Account Not Found',
              text2: 'Please complete your registration.',
            });
            
            // Navigate to signup with email and OTP token (OTP already verified)
            navigation.navigate('Signup', { 
              email: email,
              otpToken: data?.result?.token
            });
          }
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Operation',
          text2: "Something went wrong. Please restart the app.",
        });
      }
      
    } catch (error) {
      console.error('OTP Verification Error:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.message || 'Invalid OTP. Please try again.',
      });
      
      // Clear OTP inputs on error
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
      
    } finally {
      setIsVerifying(false);
    }
  }, [
    dispatch, 
    navigation, 
    otp, 
    data, 
    name, 
    purpose, 
    email, 
    phone, 
    referral_code,
    isLoading
  ]);

  // Handle side effects for registration and login errors
  useEffect(() => {
    if (registerState?.error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: registerState.error,
      });
    }
  }, [registerState?.error]);

  useEffect(() => {
    if (loginState?.error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: loginState.error,
      });
    }
  }, [loginState?.error]);

  return {
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
  };
};