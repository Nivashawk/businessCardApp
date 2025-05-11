import {useState,useRef,useCallback, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { verifyUser } from '../../redux/slices/auth/sendOTPSlices';

export const useOTPVerification = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const {purpose, name, email} = route.params;
    const registerState = useSelector(state => state.register);
    const {data} = registerState;
  
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
  
    const handleChange = useCallback((text, index) => {
      if (text.length > 1) return;
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }, [otp, inputRefs]);
  
    const handleKeyPress = useCallback((event, index) => {
      if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }, [otp, inputRefs]);
  
    const handleWrongePhoneNumber = useCallback(() => {
      navigation.navigate('Login');
    }, [navigation]);
  
    const handleVerifyOTP = useCallback(async () => {
      
      if (otp.every(value => value !== '')) {
        const enteredOTP = otp.join('');
        console.log("inside handleVerifyOTP from hook");

        dispatch(
          verifyUser({
            email: email,
            otp: enteredOTP,
            partner_id: purpose === "Login" ? '' : data.result.partner_id,
            name: purpose === "Login" ? '' : name,
            purpose: purpose,
          }),
          navigation.navigate('MainTabs')
        );
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