import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {useDispatch} from 'react-redux';
import SmallButton from '../../components/buttons/smallButton';

const OTPVerificationScreen = ({route}) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [resendText, setResendText] = useState(`OTP sent to `);
  const inputRefs = useRef([]);
  const intervalRef = useRef(null);

  // Function to start the countdown timer
  const startTimer = () => {
    setTimer(60);
    setResendText(`OTP sent to `);
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
  };

  useEffect(() => {
    startTimer(); // Start timer on mount
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  const handleResendOTP = () => {
    startTimer(); // Restart timer when Resend OTP is clicked
  };

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleWrongePhoneNiumber = () => {
    navigation.navigate('Login');
  };

  const handleVerify = async () => {
    // await AsyncStorage.setItem("email", email);
    if (otp.every(value => value !== '')) {
      console.log(`Entered OTP: ${otp.join('')}`);
      const inputOTP = otp.join('');
      if (inputOTP === '123456') {
        navigation.navigate('MainTabs');
      } else {
        console.log('Please enter a valid OTP');
      }
    } else {
      console.log('Please enter all OTP digits.');
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.topSection}>
        <Text style={[typography.logo, styles.logo]}>LOGO</Text>
        <Text style={[typography.heading, styles.subtitle]}>
          Create new account
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={event => handleKeyPress(event, index)}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <SmallButton title="Verify OTP" onPress={handleVerify} />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.timer]}>{`00:${
            timer < 10 ? '0' : ''
          }${timer}`}</Text>
        </View>
      </View>
      <View style={styles.middleSection}></View>
      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={handleResendOTP} disabled={timer > 0}>
          <Text
            style={[
              styles.resendText,
              {color: colors.text_color_1},
              timer === 0 && {color: colors.primary, fontWeight: 'bold'},
            ]}>
            {resendText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleWrongePhoneNiumber}>
          <Text style={[styles.wrongNumberText]}>Entered wrong email ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  topSection: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomSection: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 70,
  },
  label: {
    width: width * 0.8,
    fontSize: 16,
    marginBottom: 10,
    color: colors.text_color_1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 45,
    backgroundColor: colors.background,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  buttonText: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: width * 0.75,
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
  },
  timer: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  wrongNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default OTPVerificationScreen;
