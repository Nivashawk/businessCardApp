
import {View, Text, StyleSheet,ActivityIndicator, TouchableOpacity, Platform, Dimensions, Image} from 'react-native';
import {typography} from '../../theme/typography';
import CustomCheckbox from '../../components/inputs/checkBox';
import InputBox from '../../components/inputs/textInput';
import PhoneNumberInput from '../../components/inputs/phoneNumberInput';
import LargeButton from '../../components/buttons/largeButton';
import { colors } from '../../theme/colors';
import { useSignUp } from '../../hooks/auth/useSignUp';
import { useNavigation } from '@react-navigation/native';
import logo from '../../../assets/logo.png'

const {width, height} = Dimensions.get('window');


const SignUp = () => {
  const navigation = useNavigation()
  const {
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
  } = useSignUp();


  return (
    <View style={styles.container}>
      <Image style={{height:height*0.2, width:width*0.85}} resizeMode="contain" source={logo}/>
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

      <View style={styles.checkboxContainer}>
        <CustomCheckbox value={agree} onValueChange={setAgree} />
        <Text style={styles.checkboxText}>
          I’ve read and agreed to{' '}
          <Text style={styles.link}>User Agreement</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <LargeButton title="Sign up" onPress={handleSignUp} />
      )}

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
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 35,
    justifyContent: 'center',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
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
