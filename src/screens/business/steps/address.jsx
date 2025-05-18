import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {format} from 'date-fns';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {colors} from '../../../theme/colors';
import InputBox from '../../../components/inputs/textInput';
import TextAreaBox from '../../../components/inputs/textArea';
import PhoneNumberInput from '../../../components/inputs/phoneNumberInput';
import DatePickerBox from '../../../components/inputs/datePicker';
import {useSelector, useDispatch} from 'react-redux';
import {updateBusinessAddressData} from '../../../redux/slices/business/businessBasic';

const {width, height} = Dimensions.get('window');

const Address = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessData);

  useEffect(() => {
    console.log('businessData', businessData);
    if (businessData) {
      setStreet(businessData.street || '');
      setStreet2(businessData.street2 || '');
      setCity(businessData.city || '');
      setPinCode(businessData.zip || '');
      setState(businessData.state_id || '');
      setCountry(businessData.country_id || '');
      // If selectedCode is stored, also add:
      // setSelectedCode(businessData.selectedCode || '+91');
    }
  }, [businessData]);
  // input values
  const [street, setStreet] = useState('');
  const [street2, setStreet2] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  // input errors
  const [streetError, setStreetError] = useState('');
  const [street2Error, setStreet2Error] = useState('');
  const [areaError, setAreaError] = useState('');
  const [cityError, setCityError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');
  const [stateError, setStateError] = useState('');
  const [countryError, setCountryError] = useState('');

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      if (street.trim() === '') {
        setStreetError('Street is required');
        isValid = false;
      } else {
        setStreetError('');
      }

      if (street2.trim() === '') {
        setStreet2Error('Street is required');
        isValid = false;
      } else {
        setStreet2Error('');
      }

      // if (area.trim() === '') {
      //   setAreaError('Area is required');
      //   isValid = false;
      // } else {
      //   setAreaError('');
      // }

      if (city.trim() === '') {
        setCityError('City is required');
        isValid = false;
      } else {
        setCityError('');
      }

      if (pinCode.trim() === '') {
        setPinCodeError('pinCode is required');
        isValid = false;
      } else {
        setPinCodeError('');
      }

      if (state.trim() === '') {
        setStateError('State is required');
        isValid = false;
      } else {
        setStateError('');
      }

      if (country.trim() === '') {
        setCountryError('Country is required');
        isValid = false;
      } else {
        setCountryError('');
      }

      if (isValid) {
        const formData = {
          street,
          area,
          city,
          pinCode,
          state,
          country,
        };
        console.log('Form Address:', formData);
        dispatch(
          updateBusinessAddressData({
            street,
            street2,
            city,
            zip: pinCode,
            state_id: state,
            country_id: country,
          }),
        );
      }

      return isValid;
    },

    // getData: () => ({
    //   street,
    //   area,
    //   city,
    //   pinCode,
    //   state,
    //   country,
    // }),
  }));

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <InputBox
              label="Street"
              value={street}
              onChangeText={setStreet}
              placeholder="Street"
              keyboardType="default"
              required
              error={streetError}
            />
            <InputBox
              label="Street2"
              value={street2}
              onChangeText={setStreet2}
              placeholder="Street2"
              keyboardType="default"
              error={street2Error}
            />
            {/* <InputBox
              label="Area"
              value={area}
              onChangeText={setArea}
              placeholder="Area"
              keyboardType="default"
              required
              error={areaError}
            /> */}
            <InputBox
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="City"
              keyboardType="default"
              required
              error={cityError}
            />
            <InputBox
              label="PinCode"
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="PinCode"
              keyboardType="default"
              required
              error={pinCodeError}
            />
            <InputBox
              label="State"
              value={state}
              onChangeText={setState}
              placeholder="State"
              keyboardType="default"
              required
              error={stateError}
            />
            <InputBox
              label="Country"
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
              keyboardType="default"
              required
              error={countryError}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  inner: {
    // backgroundColor:colors.secondary,
    // padding: 16,
    flexGrow: 1,
    paddingTop: height * 0.025,
    paddingBottom: height * 0.1,
  },
});

export default Address;
