import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
import InputBox from '../../../components/inputs/textInput';
import DropdownWSearch from '../../../components/inputs/dropdownWSearch';
import {useSelector, useDispatch} from 'react-redux';
import {updateBusinessAddressData} from '../../../redux/slices/business/businessBasic';
import {getCountry} from '../../../redux/slices/business/getCountrySlices';
import {getState} from '../../../redux/slices/business/getStateSlices';

const {width, height} = Dimensions.get('window');

const UpdateAddress = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessBasic);
  const countries = useSelector(state => state?.countries?.data?.result?.data);
  const states = useSelector(state => state?.states?.data?.result?.data);

  // input values
  const [street, setStreet] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  // input errors
  const [streetError, setStreetError] = useState('');
  const [street2Error, setStreet2Error] = useState('');
  const [cityError, setCityError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');
  const [stateError, setStateError] = useState('');
  const [countryError, setCountryError] = useState('');

  // Initialize form with existing data
  useEffect(() => {
    if (businessData) {
      setStreet(businessData.street || '');
      setStreet2(businessData.street2 || '');
      setCity(businessData.city || '');
      setPinCode(businessData.zip || '');
      setState(businessData.state_id || '');
      setCountry(businessData.country_id || '');
    }
  }, [businessData]);

  useEffect(() => {
    dispatch(getCountry());
  }, [dispatch]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      // Clear previous errors
      setStreetError('');
      setStreet2Error('');
      setCityError('');
      setPinCodeError('');
      setStateError('');
      setCountryError('');

      // Validation logic (uncomment as needed)
      if (street.trim() === '') {
        setStreetError('Street is required');
        isValid = false;
      }

      if (city.trim() === '') {
        setCityError('City is required');
        isValid = false;
      }

      if (pinCode.trim() === '') {
        setPinCodeError('Pin Code is required');
        isValid = false;
      }

      if (!state) {
        setStateError('State is required');
        isValid = false;
      }

      if (!country) {
        setCountryError('Country is required');
        isValid = false;
      }

      // Update Redux store with current form data
      if (isValid) {
        const formData = {
          street,
          street2,
          city,
          zip: pinCode,
          state_id: state,
          country_id: country,
        };
        
        dispatch(updateBusinessAddressData(formData));
      }

      return isValid;
    },
  }));

  const handleSelectCountry = item => {
    setCountry(item.value);
    setCountryError('');
    dispatch(getState({country_code: item.value}));
  };

  const handleSelectState = item => {
    if (!country) {
      setCountryError('Please select a country first');
    } else {
      setCountryError('');
      setState(item.value);
      setStateError('');
    }
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
              error={countryError}
            />
            <DropdownWSearch
              label="State"
              data={states?.map(c => ({label: c.name, value: c.id})) ?? []}
              onSelect={handleSelectState}
              required={true}
              requiredText="Please select a state"
              disabled={!country}
              error={stateError}
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
              label="Street 2"
              value={street2}
              onChangeText={setStreet2}
              placeholder="Street 2 (Optional)"
              keyboardType="default"
              error={street2Error}
            />
            <InputBox
              label="Pin Code"
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="Pin Code"
              keyboardType="numeric"
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
    flexGrow: 1,
    paddingTop: height * 0.025,
    paddingBottom: height * 0.1,
  },
});

export default UpdateAddress;