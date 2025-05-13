import {useState, useRef, useCallback, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../redux/slices/auth/registerSlices';
import {resetOTPData} from '../../redux/slices/auth/sendOTPSlices';
import {isOTPVerified} from '../../redux/slices/auth/sendOTPSlices';
import { loginUser } from '../../redux/slices/auth/loginSlices';

export const useOTPVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {purpose, name, email, phone} = route.params;
  const otpState = useSelector(state => state.OTPData);
  const {data} = otpState;

  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [resendText, setResendText] = useState(`OTP sent to `);
  const intervalRef = useRef(null);

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
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [startTimer]);

  const handleResendOTP = useCallback(() => {
    startTimer();
    // Implement your actual resend OTP API call here
    console.log('Resend OTP triggered');
  }, [startTimer]);

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
    dispatch(resetOTPData());
    navigation.navigate('Login');
  }, [navigation]);

  const handleVerifyOTP = useCallback(async () => {
    if (otp.every(value => value !== '')) {
      const enteredOTP = otp.join('');
      console.log('inside handleVerifyOTP from hook');
      if (purpose === 'Register') {
        dispatch(
          registerUser({
            name,
            phone,
            email,
            country_code: 'IN',
            otp: enteredOTP,
            token: data?.result?.token,
          }),
        );
      } else if (purpose === 'Login') {
        console.log("inside login condition");
        console.log(email, enteredOTP, data?.result?.token);
        
        
        dispatch(
          loginUser({email, otp: enteredOTP, token: data?.result?.token}),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: "It is not your fault, please reopen the app",
        });
      }
    } else {
      console.log('Please enter all OTP digits.');
    }
  }, [dispatch, navigation, otp, data, name, purpose]);

  return {
    otp,
    inputRefs,
    timer,
    resendText,
    handleChange,
    handleKeyPress,
    handleResendOTP,
    handleWrongePhoneNumber,
    handleVerifyOTP,
  };
};
