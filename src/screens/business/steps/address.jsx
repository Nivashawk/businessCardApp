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

const Address = forwardRef(({initialData}, ref) => {
  const dispatch = useDispatch();
  const countries = useSelector(state => state?.countries?.data?.result?.data);
  const states = useSelector(state => state?.states?.data?.result?.data);

  // Initialize state with initialData (from Redux)
  const [street, setStreet] = useState(initialData?.street || '');
  const [street2, setStreet2] = useState(initialData?.street2 || '');
  const [area, setArea] = useState(initialData?.area || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [pinCode, setPinCode] = useState(
    initialData?.zip || initialData?.pinCode || '',
  );
  const [state, setState] = useState(
    initialData?.state_id || initialData?.state || '',
  );
  const [country, setCountry] = useState(
    initialData?.country_id || initialData?.country || '',
  );

  // input errors
  const [streetError, setStreetError] = useState('');
  const [street2Error, setStreet2Error] = useState('');
  const [areaError, setAreaError] = useState('');
  const [cityError, setCityError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');
  const [stateError, setStateError] = useState('');
  const [countryError, setCountryError] = useState('');

  // Load countries on component mount
  useEffect(() => {
    dispatch(getCountry());
  }, [dispatch]);

  // Update state when initialData changes (when user navigates back)
  useEffect(() => {
    if (initialData) {
      console.log('Updating Address form with initialData:', initialData);

      setStreet(initialData.street || '');
      setStreet2(initialData.street2 || '');
      setArea(initialData.area || '');
      setCity(initialData.city || '');
      setPinCode(initialData.zip || initialData.pinCode || '');

      // Ensure the values are properly converted to match dropdown data
      const countryValue = initialData.country_id || initialData.country;
      const stateValue = initialData.state_id || initialData.state;

      // Convert to string/number as needed to match your dropdown data
      setCountry(countryValue ? String(countryValue) : '');
      setState(stateValue ? String(stateValue) : '');

      console.log('Setting country value:', countryValue);
      console.log('Setting state value:', stateValue);
    }
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (country) {
      dispatch(getState({country_code: country}));
    }
  }, [country]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      // Uncomment these validations as needed
      // if (street.trim() === '') {
      //   setStreetError('Street is required');
      //   isValid = false;
      // } else {
      //   setStreetError('');
      // }

      // if (street2.trim() === '') {
      //   setStreet2Error('Street 2 is required');
      //   isValid = false;
      // } else {
      //   setStreet2Error('');
      // }

      // if (city.trim() === '') {
      //   setCityError('City is required');
      //   isValid = false;
      // } else {
      //   setCityError('');
      // }

      // if (pinCode.trim() === '') {
      //   setPinCodeError('Pin Code is required');
      //   isValid = false;
      // } else {
      //   setPinCodeError('');
      // }

      // if (!state) {
      //   setStateError('State is required');
      //   isValid = false;
      // } else {
      //   setStateError('');
      // }

      // if (!country) {
      //   setCountryError('Country is required');
      //   isValid = false;
      // } else {
      //   setCountryError('');
      // }

      if (isValid) {
        console.log('Address form validation passed');
        // Dispatch the data to Redux when validation passes
        console.log('parseInt(state)', parseInt(state));
         console.log('parseInt(country)', parseInt(country));
        
        dispatch(
          updateBusinessAddressData({
            street,
            street2,
            city,
            zip: pinCode,
            state_id: parseInt(state),
            country_id: parseInt(country),
          }),
        );
      }

      return isValid;
    },

    getData: () => {
      const data = {
        street,
        street2,
        area,
        city,
        pinCode,
        zip: pinCode, // Include both for compatibility
        state,
        state_id: state, // Include both for compatibility
        country,
        country_id: country, // Include both for compatibility
      };
      console.log('Getting Address form data:', data);
      return data;
    },
  }));

  const handleSelectCountry = item => {
    console.log('country dropdown selected:', item);
    const countryValue = item.value;
    console.log('countryValue',countryValue);
    setCountry(countryValue);
    setCountryError('');
    setState(''); // Reset state when country changes
  };

  const handleSelectState = item => {
    if (!country) {
      setCountryError('Please select a country first');
    } else {
      setCountryError('');
      const stateValue = item.value;
      setState(stateValue);
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
              data={
                countries?.map(c => ({
                  label: c.name,
                  value: String(c.id), // Ensure consistent string type
                })) ?? []
              }
              onSelect={handleSelectCountry}
              required={true}
              requiredText="Please select a country"
              value={country}
              error={countryError}
            />

            <DropdownWSearch
              label="State"
              data={
                states?.map(s => ({
                  label: s.name,
                  value: String(s.id), // Ensure consistent string type
                })) ?? []
              }
              onSelect={handleSelectState}
              required={true}
              requiredText="Please select a state"
              value={state}
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
    // backgroundColor:colors.secondary,
    // padding: 16,
    flexGrow: 1,
    paddingTop: height * 0.025,
    paddingBottom: height * 0.1,
  },
});

export default Address;
