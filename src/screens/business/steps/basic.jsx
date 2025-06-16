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
import InputBox from '../../../components/inputs/textInput';
import TextAreaBox from '../../../components/inputs/textArea';
import PhoneNumberInput from '../../../components/inputs/phoneNumberInput';
import DatePickerBox from '../../../components/inputs/datePicker';
import YearPickerBox from '../../../components/inputs/yearPickerBox'; // New component for year selection
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
  const [DOJ, setDOJ] = useState(initialData?.DOJ || '');

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

  // Helper function to find and match industry
  const findAndSetIndustry = (industryValue, availableIndustries) => {
    if (!industryValue || !availableIndustries || availableIndustries.length === 0) {
      setIndustry('');
      return;
    }

    // Convert industryValue to string for consistent comparison
    const industryId = String(industryValue);
    
    // Find the matching industry object
    const matchedIndustry = availableIndustries.find(
      item => String(item.id) === industryId
    );

    if (matchedIndustry) {
      console.log('Found matching industry:', matchedIndustry);
      // Set the industry value that matches the dropdown's expected format
      setIndustry(matchedIndustry?.name);
    } else {
      console.log('No matching industry found for ID:', industryId);
      setIndustry('');
    }
  };

  // Update state when initialData changes (when user navigates back)
  useEffect(() => {
    if (initialData) {
      console.log('Updating Basic form with initialData:', initialData);
      console.log('Available industry data:', industryData);

      setCompanyName(initialData.companyName || '');
      setYourDesignation(initialData.yourDesignation || '');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setDescription(initialData.description || '');
      setServices(initialData.services || '');
      setDOJ(initialData.DOJ || '');
      setFoundedYear(initialData.foundedYear || '');
      setGstNumber(initialData.gstNumber || '');

      // Handle industry matching
      findAndSetIndustry(initialData.industry, industryData);
    }
  }, [initialData, industryData]);

  // Separate useEffect to handle industry matching when industryData loads
  useEffect(() => {
    if (initialData?.industry && industryData && industryData.length > 0) {
      console.log('Industry data loaded, re-matching industry...');
      findAndSetIndustry(initialData.industry, industryData);
    }
  }, [industryData, initialData?.industry]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      // Uncomment these validations as needed
      // if (companyName.trim() === '') {
      //   setCompanyError('Company Name is required');
      //   isValid = false;
      // } else {
      //   setCompanyError('');
      // }

      // if (yourDesignation.trim() === '') {
      //   setYourDesignationError('Designation is required');
      //   isValid = false;
      // } else {
      //   setYourDesignationError('');
      // }

      // if (!/^\d{10}$/.test(phone)) {
      //   setPhoneError('Phone must be a 10-digit number');
      //   isValid = false;
      // } else {
      //   setPhoneError('');
      // }

      // if (!/\S+@\S+\.\S+/.test(email)) {
      //   setemailError('Enter a valid email');
      //   isValid = false;
      // } else {
      //   setemailError('');
      // }

      // if (description.trim() === '') {
      //   setDescriptionError('Description is required');
      //   isValid = false;
      // } else {
      //   setDescriptionError('');
      // }

      // if (!industry || industry.length === 0) {
      //   setIndustryError('Select at least one industry');
      //   isValid = false;
      // } else {
      //   setIndustryError('');
      // }

      // if (!services || services.length === 0) {
      //   setServicesError('Select at least one service');
      //   isValid = false;
      // } else {
      //   setServicesError('');
      // }

      // if (!DOJ) {
      //   setDOJError('Date of Joining is required');
      //   isValid = false;
      // } else {
      //   setDOJError('');
      // }

      // New validations for founded year and GST
      // if (!foundedYear) {
      //   setFoundedYearError('Founded year is required');
      //   isValid = false;
      // } else {
      //   setFoundedYearError('');
      // }

      // GST validation (15 characters alphanumeric)
      // if (gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
      //   setGstNumberError('Enter a valid GST number');
      //   isValid = false;
      // } else {
      //   setGstNumberError('');
      // }

      if (isValid) {
        console.log('Basic form validation passed');
      }

      return isValid;
    },

    getData: () => {
      const data = {
        companyName,
        yourDesignation,
        phone,
        email,
        description,
        industry: industry,
        services,
        DOJ,
        foundedYear,
        gstNumber,
      };
      console.log('Getting Basic form data:', data);
      return data;
    },
  }));

  const handleSelectIndustry = item => {
    console.log('industry dropdown selected:', item);
    const industryValue = String(item.value);
    setIndustry(industryValue);
    setIndustryError('');
  };

  // Get the selected industry name for display purposes
  const getSelectedIndustryName = () => {
    if (!industry || !industryData || industryData.length === 0) {
      return '';
    }
    
    const selectedIndustry = industryData.find(
      item => String(item.id) === String(industry)
    );
    
    return selectedIndustry ? selectedIndustry.name : '';
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
              startYear={1800} // Optional: custom start year
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
              data={
                industryData?.map(c => ({
                  label: c.name,
                  value: String(c.id), // Ensure consistent string type
                })) ?? []
              }
              onSelect={handleSelectIndustry}
              required={true}
              requiredText="Please select a industry"
              value={industry}
              selectedValue={industry} // Add this if your dropdown component supports it
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
              value={DOJ}
              onChange={setDOJ}
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

export default Basic;