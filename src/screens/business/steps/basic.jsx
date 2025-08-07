import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback
} from 'react';
import {format, formatISO} from 'date-fns'; // Import formatISO here
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
import YearPickerBox from '../../../components/inputs/yearPickerBox';
import {useDispatch, useSelector} from 'react-redux';
import {getIndustry} from '../../../redux/slices/business/getIndustrySlices';
import DropdownWSearch from '../../../components/inputs/dropdownWSearch';

const {width, height} = Dimensions.get('window');

const Basic = forwardRef(({initialData}, ref) => {
  const dispatch = useDispatch();
  const industryData = useSelector(
    state => state.industries?.data?.result?.data ?? [],
  );

  // Initialize state with initialData (from Redux)
  const [companyName, setCompanyName] = useState(
    initialData?.companyName || '',
  );
  const [yourDesignation, setYourDesignation] = useState(
    initialData?.yourDesignation || '',
  );
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [selectedCode, setSelectedCode] = useState('+91');
  const [email, setEmail] = useState(initialData?.email || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [industry, setIndustry] = useState(initialData?.industry || '');
  const [services, setServices] = useState(initialData?.services || '');
  // Initialize DOJ as a string, as it will be stored as such
  // If initialData.DOJ is a Date object, convert it here, otherwise keep as is
  const [DOJ, setDOJ] = useState(
    initialData?.DOJ
      ? (initialData.DOJ instanceof Date ? formatISO(initialData.DOJ) : initialData.DOJ)
      : ''
  );

  // New state variables
  const [foundedYear, setFoundedYear] = useState(
    initialData?.foundedYear || '',
  );
  const [gstNumber, setGstNumber] = useState(initialData?.gstNumber || '');

  // Input errors
  const [companyError, setCompanyError] = useState('');
  const [yourDesignationError, setYourDesignationError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setemailError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [industryError, setIndustryError] = useState('');
  const [servicesError, setServicesError] = useState('');
  const [DOJError, setDOJError] = useState('');

  // New error states
  const [foundedYearError, setFoundedYearError] = useState('');
  const [gstNumberError, setGstNumberError] = useState('');

  useEffect(() => {
    dispatch(getIndustry());
  }, [dispatch]);

  // Memoize the transformed industry data to prevent unnecessary re-renders
  const transformedIndustryData = useMemo(() => {
    return industryData?.map(c => ({
      label: c.name,
      value: String(c.id),
    })) ?? [];
  }, [industryData]);

  // Memoize the selected industry object
  const memoizedSelectedIndustry = useMemo(() => {
    if (!industry || !industryData || industryData.length === 0) {
      return null;
    }
    const selected = industryData.find(item => String(item.id) === String(industry));
    return selected ? { label: selected.name, value: String(selected.id) } : null;
  }, [industry, industryData]);

  // Update state when initialData changes (when user navigates back)
  useEffect(() => {
    if (initialData) {
      console.log('Updating Basic form with initialData:', initialData);
      
      setCompanyName(initialData.companyName || '');
      setYourDesignation(initialData.yourDesignation || '');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setDescription(initialData.description || '');
      setServices(initialData.services || '');
      // Ensure DOJ is set as a serializable string here too
      setDOJ(initialData.DOJ ? (initialData.DOJ instanceof Date ? formatISO(initialData.DOJ) : initialData.DOJ) : '');
      setFoundedYear(initialData.foundedYear || '');
      setGstNumber(initialData.gstNumber || '');
      setIndustry(String(initialData.industry || ''));
    }
  }, [initialData]);

  // Memoize the handleSelectIndustry callback to prevent unnecessary re-renders
  const handleSelectIndustry = useCallback((item) => {
    console.log('industry dropdown selected:', item);
    const industryValue = String(item.value);
    setIndustry(industryValue);
    setIndustryError('');
  }, []);

  // Handle DatePickerBox change
  const handleDOJChange = useCallback((date) => {
    // date-fns formatISO will convert a Date object to an ISO string
    // If the date is null or undefined (e.g., cleared), set to empty string
    const serializableDOJ = date ? formatISO(date) : '';
    setDOJ(serializableDOJ);
    setDOJError('');
  }, []);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;
      
      // Reset all errors
      setCompanyError('');
      setYourDesignationError('');
      setPhoneError('');
      setemailError('');
      setDescriptionError('');
      setIndustryError('');
      setServicesError('');
      setDOJError('');
      setFoundedYearError('');
      setGstNumberError('');

      // Validate required fields
      if (!companyName.trim()) {
        setCompanyError('Company name is required');
        isValid = false;
      }

      if (!yourDesignation.trim()) {
        setYourDesignationError('Designation is required');
        isValid = false;
      }

      // Basic phone number validation (can be more robust)
      if (!phone.trim()) {
        setPhoneError('Phone number is required');
        isValid = false;
      } else if (phone.trim().length < 7) { // Example: minimum length
        setPhoneError('Phone number is too short');
        isValid = false;
      }

      if (!email.trim()) {
        setemailError('Email is required');
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setemailError('Please enter a valid email');
        isValid = false;
      }

      if (!description.trim()) {
        setDescriptionError('Business description is required');
        isValid = false;
      }

      if (!industry) {
        setIndustryError('Please select an industry');
        isValid = false;
      }

      if (!foundedYear) {
        setFoundedYearError('Founded year is required');
        isValid = false;
      }

      // Validate GST number format if provided (optional, only if you want strict validation)
      if (gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
        setGstNumberError('Please enter a valid GST number');
        isValid = false;
      }

      // DOJ validation if required
      if (!DOJ) { // DOJ is already a string at this point
        setDOJError('Date Associated with the Organization is required');
        isValid = false;
      }

      return isValid;
    },

    getData: () => {
      // DOJ is already a serializable string (ISO 8601) because of handleDOJChange
      const data = {
        companyName,
        yourDesignation,
        phone,
        email,
        description,
        industry: industry, // industry is already a string ID
        services,
        DOJ: DOJ, // Use the already serialized DOJ state
        foundedYear,
        gstNumber,
      };
      console.log('Getting Basic form data:', data);
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
            <InputBox
              label="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter your company name"
              keyboardType="default"
              required
              error={companyError}
            />

            <YearPickerBox
              label="Founded Year"
              value={foundedYear}
              onChange={setFoundedYear}
              placeholder="Select founded year"
              required
              disabled={false}
              error={foundedYearError}
              startYear={1800}
            />

            <InputBox
              label="Your Designation"
              value={yourDesignation}
              onChangeText={setYourDesignation}
              placeholder="Enter your designation"
              keyboardType="default"
              required
              error={yourDesignationError}
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
              label="Business Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
              required
              error={emailError}
            />

            <InputBox
              label="GST Number"
              value={gstNumber}
              onChangeText={setGstNumber}
              placeholder="Enter GST number (optional)"
              keyboardType="default"
              error={gstNumberError}
              autoCapitalize="characters"
              maxLength={15}
            />

            <TextAreaBox
              label="Business Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter Description"
              keyboardType="default"
              required
              error={descriptionError}
            />

            <DropdownWSearch
              label="Industry"
              data={transformedIndustryData}
              onSelect={handleSelectIndustry}
              required={true}
              requiredText="Please select a industry"
              selectedValue={memoizedSelectedIndustry}
              placeholder="Select an industry"
              error={industryError}
            />

            <TextAreaBox
              label="Services"
              value={services}
              onChangeText={setServices}
              placeholder="Enter Services(comma separated)"
              keyboardType="default"
              error={servicesError}
            />

            <DatePickerBox
              label="Date Associated with the Organization"
              // Pass a Date object if DOJ is an ISO string, otherwise null/undefined
              // DatePickerBox will internally handle displaying this date
              value={DOJ ? new Date(DOJ) : null}
              onChange={handleDOJChange} // Use the new handler
              error={DOJError}
              restrictPastDates={false}
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

export default Basic;