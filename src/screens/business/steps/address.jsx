import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback
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
  
  // Add loading states for better UX
  const countriesLoading = useSelector(state => state?.countries?.loading);
  const statesLoading = useSelector(state => state?.states?.loading);

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

  // Add a stable flag to prevent unnecessary resets
  const [isInitialized, setIsInitialized] = useState(false);
  const [countriesLoaded, setCountriesLoaded] = useState(false);

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

  // Track when countries are loaded
  useEffect(() => {
    if (countries && Array.isArray(countries) && countries.length > 0) {
      setCountriesLoaded(true);
    }
  }, [countries]);

  // Debug logging
  useEffect(() => {
    console.log('Countries data:', countries);
    console.log('States data:', states);
    console.log('Current country value:', country);
    console.log('Current state value:', state);
    console.log('States loading:', statesLoading);
  }, [countries, states, country, state, statesLoading]);

  // Memoize the transformed country data to prevent unnecessary re-renders
  const transformedCountryData = useMemo(() => {
    if (!countries || !Array.isArray(countries)) {
      console.log('Countries not available or not array:', countries);
      return [];
    }
    const transformed = countries.map(c => ({
      label: c.name,
      value: String(c.id), // Ensure value is always a string
    }));
    console.log('Transformed country data:', transformed.slice(0, 5)); // Log first 5 items
    return transformed;
  }, [countries]);

  // Memoize the transformed state data to prevent unnecessary re-renders
  const transformedStateData = useMemo(() => {
    if (!states || !Array.isArray(states)) {
      console.log('States not available or not array:', states);
      return [];
    }
    const transformed = states.map(s => ({
      label: s.name,
      value: String(s.id), // Ensure value is always a string
    }));
    console.log('Transformed state data:', transformed.slice(0, 5)); // Log first 5 items
    return transformed;
  }, [states]);

  // Memoize the selected country object - Fixed logic with stability
  const memoizedSelectedCountry = useMemo(() => {
    // Don't try to find selected country until countries are loaded
    if (!countriesLoaded || !countries || !Array.isArray(countries) || countries.length === 0) {
      console.log('Countries not loaded yet or not available');
      return null;
    }
    
    if (!country) {
      console.log('No country value set');
      return null;
    }
    
    // Convert country to string for comparison
    const countryStr = String(country);
    const selected = countries.find(item => String(item.id) === countryStr);
    
    if (selected) {
      const result = { label: selected.name, value: String(selected.id) };
      console.log('Selected country object:', result);
      return result;
    }
    
    console.log('Country not found in list:', countryStr);
    // Don't return null immediately, keep the current country value for now
    return country ? { label: `ID: ${country}`, value: String(country) } : null;
  }, [country, countries, countriesLoaded]);

  // Memoize the selected state object - Fixed logic with stability
  const memoizedSelectedState = useMemo(() => {
    if (!state || !states || !Array.isArray(states) || states.length === 0) {
      console.log('No state selected or states not available');
      return null;
    }
    
    // Convert state to string for comparison
    const stateStr = String(state);
    const selected = states.find(item => String(item.id) === stateStr);
    
    if (selected) {
      const result = { label: selected.name, value: String(selected.id) };
      console.log('Selected state object:', result);
      return result;
    }
    
    console.log('State not found in list:', stateStr);
    // Keep the state value even if not found in list yet
    return state ? { label: `ID: ${state}`, value: String(state) } : null;
  }, [state, states]);

  // Update state when initialData changes (when user navigates back) - IMPROVED
  useEffect(() => {
    if (initialData && !isInitialized) {
      console.log('Updating Address form with initialData:', initialData);

      setStreet(initialData.street || '');
      setStreet2(initialData.street2 || '');
      setArea(initialData.area || '');
      setCity(initialData.city || '');
      setPinCode(initialData.zip || initialData.pinCode || '');

      // Ensure the values are properly converted to match dropdown data
      const countryValue = initialData.country_id || initialData.country;
      const stateValue = initialData.state_id || initialData.state;

      // Convert to string to match dropdown data format
      if (countryValue) {
        setCountry(String(countryValue));
        console.log('Setting country value:', countryValue);
      }
      
      if (stateValue) {
        setState(String(stateValue));
        console.log('Setting state value:', stateValue);
      }

      setIsInitialized(true);
    }
  }, [initialData, isInitialized]);

  // Separate effect to handle country/state preservation after countries load
  useEffect(() => {
    if (countriesLoaded && country && !isInitialized) {
      // This ensures the country value is preserved even after countries load
      console.log('Countries loaded, ensuring country value is preserved:', country);
      setIsInitialized(true);
    }
  }, [countriesLoaded, country, isInitialized]);

  // FIXED: Load states when country changes - with better error handling
  useEffect(() => {
    // Add more comprehensive checks
    if (country && countries && Array.isArray(countries) && countries.length > 0) {
      console.log('Loading states for country:', country);
      
      // Find the selected country object
      const selectedCountryObj = countries.find(c => String(c.id) === String(country));
      
      if (selectedCountryObj) {
        console.log('Found country object:', selectedCountryObj.id);
        
        // Clear existing state selection when country changes
        // setState('');
        // setStateError(''); // Also clear any state errors
        
        // Dispatch the getState action
        console.log('Dispatching getState with country_id:', country, );
        dispatch(getState({ country_code: selectedCountryObj.id }))
      } else {
        console.warn('Country object not found for ID:', country);
        // Clear states if country not found
        setState('');
      }
    } else {
      // Log why the effect didn't run
      console.log('Effect not running because:', {
        country: !!country,
        countries: !!countries,
        isArray: Array.isArray(countries),
        length: countries?.length || 0
      });
    }
  }, [country, dispatch, countries]); // Added 'countries' to dependency array

  // Debugging effect to track state changes
  useEffect(() => {
    console.log('Debug - Current state:', {
      country,
      countriesLoaded,
      countriesLength: countries?.length || 0,
      statesLength: states?.length || 0,
      statesLoading
    });
  }, [country, countriesLoaded, countries, states, statesLoading]);

  // Memoize the handleSelectCountry callback - Fixed with stability
  const handleSelectCountry = useCallback((item) => {
    console.log('Country dropdown selected:', item);
    if (item && item.value) {
      const countryValue = item.value;
      console.log('Setting country to:', countryValue);
      setCountry(countryValue);
      setCountryError('');
      // Don't reset state here, let the useEffect handle it
      
      // Force re-render to ensure dropdown shows selection
      setTimeout(() => {
        console.log('Country set to:', countryValue);
      }, 0);
    }
  }, []);

  // Memoize the handleSelectState callback - Fixed with stability
  const handleSelectState = useCallback((item) => {
    if (!country) {
      setCountryError('Please select a country first');
      return;
    }
    
    if (item && item.value) {
      setCountryError('');
      const stateValue = item.value;
      console.log('Setting state to:', stateValue);
      setState(stateValue);
      setStateError('');
      
      // Force re-render to ensure dropdown shows selection
      setTimeout(() => {
        console.log('State set to:', stateValue);
      }, 0);
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
            state_id: state ? parseInt(state) : null,
            country_id: country ? parseInt(country) : null,
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
              data={transformedCountryData}
              onSelect={handleSelectCountry}
              required={true}
              requiredText="Please select a country"
              selectedValue={memoizedSelectedCountry}
              placeholder="Select a country"
              error={countryError}
              key={`country-${countriesLoaded}-${country}`}
              searchPlaceholder="Search countries..."
              noDataText="No countries found"
              loading={countriesLoading} // Add loading prop if supported
            />

            <DropdownWSearch
              label="State"
              data={transformedStateData}
              onSelect={handleSelectState}
              required={true}
              requiredText="Please select a state"
              selectedValue={memoizedSelectedState}
              placeholder={statesLoading ? "Loading states..." : "Select a state"}
              error={stateError}
              disabled={!country || statesLoading} // Disable if no country selected or loading
              key={`state-${country}-${state}-${states?.length || 0}`} // Better key
              searchPlaceholder="Search states..."
              noDataText={statesLoading ? "Loading states..." : "No states found"}
              loading={statesLoading} // Add loading prop if supported
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
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingTop: height * 0.025,
    paddingBottom: height * 0.1,
    paddingHorizontal: 16,
  },
});

export default Address;