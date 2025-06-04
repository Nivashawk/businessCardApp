import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
import Dropdown from '../../../components/inputs/dropdown';
import DropdownWSearch from '../../../components/inputs/dropdownWSearch';
import {useSelector, useDispatch} from 'react-redux';
import {updateBusinessAddressData} from '../../../redux/slices/business/businessBasic';
import {getCountry} from '../../../redux/slices/business/getCountrySlices';
import {getState} from '../../../redux/slices/business/getStateSlices';

const {width, height} = Dimensions.get('window');

const UpdateAddress = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessData);
  const countries = useSelector(state => state?.countries?.data?.result?.data);
  const states = useSelector(state => state?.states?.data?.result?.data);

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

  useEffect(() => {
    dispatch(getCountry());
  }, [dispatch]);
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

      // if (street.trim() === '') {
      //   setStreetError('Street is required');
      //   isValid = false;
      // } else {
      //   setStreetError('');
      // }

      // if (street2.trim() === '') {
      //   setStreet2Error('Street is required');
      //   isValid = false;
      // } else {
      //   setStreet2Error('');
      // }

      // // if (area.trim() === '') {
      // //   setAreaError('Area is required');
      // //   isValid = false;
      // // } else {
      // //   setAreaError('');
      // // }

      // if (city.trim() === '') {
      //   setCityError('City is required');
      //   isValid = false;
      // } else {
      //   setCityError('');
      // }

      // if (pinCode.trim() === '') {
      //   setPinCodeError('pinCode is required');
      //   isValid = false;
      // } else {
      //   setPinCodeError('');
      // }

      // if (state.trim() === '') {
      //   setStateError('State is required');
      //   isValid = false;
      // } else {
      //   setStateError('');
      // }

      // if (country.trim() === '') {
      //   setCountryError('Country is required');
      //   isValid = false;
      // } else {
      //   setCountryError('');
      // }

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

  const handleSelectCountry = item => {
    console.log('country dropdown', item);
    setCountry(item);
    setCountryError('');
    dispatch(getState({country_code: item.value}));
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <DropdownWSearch
              label="Country"
              data={countries?.map(c => ({label: c.name, value: c.id})) ?? []}
              onSelect={handleSelectCountry}
              required={true}
              requiredText="Please select a country"

              // placeholder={eventType}
            />
            <DropdownWSearch
              label="State"
              data={states?.map(c => ({label: c.name, value: c.id})) ?? []}
              onSelect={item => {
                if (!country) {
                  setCountryError('Please select a country first');
                } else {
                  setCountryError('');
                  setState(item.value);
                }
              }}
              required={true}
              requiredText="Please select a state"
              disabled={!country}

              // placeholder={eventType}
            />

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
              label="PinCode"
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="PinCode"
              keyboardType="default"
              required
              error={pinCodeError}
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

export default UpdateAddress;
