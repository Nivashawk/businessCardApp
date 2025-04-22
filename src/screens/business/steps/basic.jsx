import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {format} from 'date-fns';
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

const {width, height} = Dimensions.get('window');

const Basic = forwardRef((props, ref) => {
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

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

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

      //   if (!services || services.length === 0) {
      //     setServicesError('Select at least one service');
      //     isValid = false;
      //   } else {
      //     setServicesError('');
      //   }

      //   if (!DOJ) {
      //     setDOJError('Date of Joining is required');
      //     isValid = false;
      //   } else {
      //     setDOJError('');
      //   }

      if (isValid) {
        const formData = {
          companyName,
          yourDesignation,
          phone,
          email,
          description,
          industry,
          services,
        };
        console.log('Form Data:', formData);
      }

      return isValid;
    },

    getData: () => ({
      companyName,
      yourDesignation,
      phone,
      email,
      description,
      industry,
      services,
      DOJ,
    }),
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
              label="Your Desigination (Nivas S)"
              value={yourDesignation}
              onChangeText={setYourDesignation}
              placeholder="Enter your email address"
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
              placeholder="Enter Services(comma separated)"
              keyboardType="default"
              // required
              error={servicesError}
            />
            <DatePickerBox
              label="Event Date Associated with the Organization"
              value={DOJ}
              onChange={setDOJ}
              // required
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
    // padding: 16,
    flexGrow: 1,
    paddingTop: height*0.025,
    paddingBottom: height*0.1
  },
});

export default Basic;
