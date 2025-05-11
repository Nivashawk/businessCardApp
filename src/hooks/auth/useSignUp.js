import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/auth/registerSlices';
import { sentOTP } from '../../redux/slices/auth/sendOTPSlices';


export const useSignUp = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const purpose = 'register'
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [referral, setReferral] = useState('');
    const [agree, setAgree] = useState(false);
    const [selectedCode, setSelectedCode] = useState('+91');
    const [phoneError, setPhoneError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    // const registerState = useSelector((state) => state.register);
    const otpData = useSelector((state) => state.OTPData)
    const {data, loading, error} = otpData;
  
    useEffect(() => {
      console.log("otp response",data?.result?.status);
      
      if (data?.result?.status === 'error') {
        navigation.navigate('Verify',{purpose:"Register", name:name});
      }
      if (error) {
        alert(`Sign up failed: ${error}`);
        // dispatch(clearRegisterError()); // Optional: clear error
      }
    }, [data, error, navigation, dispatch]);
  
    const handleSignUp = () => {
      if (!agree) {
        alert('Please agree to the terms before signing up');
        return;
      }
      if (name.length === 0) {
        setNameError('Please enter a name');
        return;
      }
      if (selectedCode === '+91') {
        const cleanedPhone = phone.replace(/\D/g, '');
        if (cleanedPhone.length !== 10) {
          setPhoneError('Please enter a valid 10-digit Indian phone number');
          return;
        }
      }
      if (!email.includes('@')) {
        setEmailError('Please enter a valid email address');
        return;
      }
      setNameError('');
      setPhoneError('');
      setEmailError('');
      dispatch(sentOTP({email, purpose}));
    };
  
    return {
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
      phoneError,
      nameError,
      emailError,
      loading,
      handleSignUp,
    };
  };