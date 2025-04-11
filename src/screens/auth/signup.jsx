import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {typography} from '../../theme/typography';
import CustomCheckbox from '../../components/inputs/checkBox';
import InputBox from '../../components/inputs/textInput';
import PhoneNumberInput from '../../components/inputs/phoneNumberInput';
import LargeButton from '../../components/buttons/largeButton';
import {useNavigation} from '@react-navigation/native';

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [referral, setReferral] = useState('');
  const [agree, setAgree] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+91');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSignUp = () => {
    if (!agree) {
      alert('Please agree to the terms before signing up');
      return;
    }

    // Validate Indian phone number
    if (name.length == 0) {
      setNameError('Please enter a name');
      return;
    }
    if (selectedCode === '+91') {
      const cleanedPhone = phone.replace(/\D/g, ''); // remove non-digits
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

    // Add more validations if needed

    console.log({name, phone, email, referral});
    navigation.navigate('Verify');
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.logo, styles.logo]}>LOGO</Text>
      <Text style={[typography.heading, styles.subtitle]}>
        Create new account
      </Text>

      <InputBox
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        required
        error={nameError}
      />
      <PhoneNumberInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        required
        selectedCode={selectedCode}
        onSelectCode={setSelectedCode}
        error={phoneError}
      />
      <InputBox
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email address"
        keyboardType="email-address"
        required
        error={emailError}
      />
      <InputBox
        label="Referral Code"
        value={referral}
        onChangeText={setReferral}
        placeholder="Enter Code"
      />

      {/* Checkbox Row */}
      <View style={styles.checkboxContainer}>
        <CustomCheckbox value={agree} onValueChange={setAgree} />
        <Text style={styles.checkboxText}>
          I’ve read and agreed to{' '}
          <Text style={styles.link}>User Agreement</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>

      {/* Sign Up Button */}
      <LargeButton title="Sign up" onPress={handleSignUp} />

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}>
            Back to Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: 'center',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 24,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  link: {
    color: '#00796B',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#444',
  },
});

export default SignUp;
