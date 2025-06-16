import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import InputBox from '../../../components/inputs/textInput';
import TextAreaBox from '../../../components/inputs/textArea';
import PhoneNumberInput from '../../../components/inputs/phoneNumberInput';
import DatePickerBox from '../../../components/inputs/datePicker';
import { useSelector, useDispatch } from 'react-redux';
import { updateBusinessBasicData } from '../../../redux/slices/business/businessBasic';

const {width, height} = Dimensions.get('window');

const UpdateBasic = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessBasic);

  // input values
  const [companyName, setCompanyName] = useState('');
  const [yourDesignation, setYourDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCode, setSelectedCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [services, setServices] = useState('');
  const [DOJ, setDOJ] = useState('');

  // input errors
  const [companyError, setCompanyError] = useState('');
  const [yourDesignationError, setYourDesignationError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setemailError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [industryError, setIndustryError] = useState('');
  const [servicesError, setServicesError] = useState('');
  const [DOJError, setDOJError] = useState('');

  // Initialize form with existing data
  useEffect(() => {
    if (businessData) {
      setCompanyName(businessData.companyName || '');
      setYourDesignation(businessData.yourDesignation || '');
      setPhone(businessData.phone || '');
      setEmail(businessData.email || '');
      setDescription(businessData.description || '');
      setIndustry(businessData.industry || '');
      setServices(businessData.services || '');
      setDOJ(businessData.DOJ || '');
    }
  }, [businessData]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      // Clear previous errors
      setCompanyError('');
      setYourDesignationError('');
      setPhoneError('');
      setemailError('');
      setDescriptionError('');
      setIndustryError('');
      setServicesError('');
      setDOJError('');

      // Validation logic (uncomment as needed)
      if (companyName.trim() === '') {
        setCompanyError('Company Name is required');
        isValid = false;
      }

      if (yourDesignation.trim() === '') {
        setYourDesignationError('Designation is required');
        isValid = false;
      }

      if (!/^\d{10}$/.test(phone)) {
        setPhoneError('Phone must be a 10-digit number');
        isValid = false;
      }

      if (email && !/\S+@\S+\.\S+/.test(email)) {
        setemailError('Enter a valid email');
        isValid = false;
      }

      if (description.trim() === '') {
        setDescriptionError('Description is required');
        isValid = false;
      }

      if (industry.trim() === '') {
        setIndustryError('Industry is required');
        isValid = false;
      }

      // Update Redux store with current form data
      if (isValid) {
        const formData = {
          companyName,
          yourDesignation,
          phone,
          email,
          description,
          industry,
          services,
          DOJ,
        };
        
        dispatch(updateBusinessBasicData(formData));
      }

      return isValid;
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
            <TextAreaBox
              label="Business Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter Description"
              keyboardType="default"
              required
              error={descriptionError}
            />
            <InputBox
              label="Industry"
              value={industry}
              onChangeText={setIndustry}
              placeholder="Select Industry"
              keyboardType="default"
              required
              error={industryError}
            />
            <TextAreaBox
              label="Services"
              value={services}
              onChangeText={setServices}
              placeholder="Enter Services (comma separated)"
              keyboardType="default"
              error={servicesError}
            />
            <DatePickerBox
              label="Event Date Associated with the Organization"
              value={DOJ}
              onChange={setDOJ}
              error={DOJError}
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
    paddingBottom: height * 0.1
  },
});

export default UpdateBasic;