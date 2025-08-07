import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updateBusiness} from '../../redux/slices/business/updateBusinessSlices';
import {getCountry} from '../../redux/slices/business/getCountrySlices';
import {getState} from '../../redux/slices/business/getStateSlices';
// Import custom components
import DropdownWSearch from '../../components/inputs/dropdownWSearch';
import DatePickerBox from '../../components/inputs/datePicker';

// Import for image selection and cropper
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ImageCropper from '../../components/imageCropper';
import RNFS from 'react-native-fs';
import {getIndustry} from '../../redux/slices/business/getIndustrySlices';

// Your custom colors
const colors = {
  surface: '#2a2a2a',
  border: '#404040',
  textSecondary: '#C4C4C4',
  background: '#1a1a1a',
  primary: '#1f1c2c',
  secondary: '#2d2d2d',
  text_color_1: '#FFFFFF',
  text_color_2: '#C4C4C4',
  status_green: '#80D97E',
  status_red: '#DA4035',
  accent: '#928dab',
  gold: '#FFD700',
  goldDark: '#B8860B',
  goldLight: '#FFFF99',
  shadow: 'rgba(0, 0, 0, 0.3)',
  cardGradient: ['#2d2d2d', '#2a2a2a'],
  shimmer: 'rgba(255, 215, 0, 0.3)',
};

const {width, height} = Dimensions.get('window');

const UpdateBusiness = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const industryData = useSelector(
    state => state.industries?.data?.result?.data ?? [],
  );
  const {businessData} = route.params || {};

  const countries = useSelector(state => state?.countries?.data?.result?.data);
  const states = useSelector(state => state?.states?.data?.result?.data);

  useEffect(() => {
    dispatch(getIndustry());
    dispatch(getCountry());
    if (formData.country_id) {
      dispatch(getState({country_code: formData.country_id}));
    }
  }, [formData?.country_id, dispatch]);

  // For now, using mock data - replace with actual Redux selectors
  const [countriesData, setCountriesData] = useState([
    {id: 1, name: 'India'},
    {id: 2, name: 'United States'},
    {id: 3, name: 'United Kingdom'},
    // Add more countries as needed
  ]);

  const [statesData, setStatesData] = useState([
    {id: 1, name: 'Tamil Nadu', country_id: 1},
    {id: 2, name: 'Karnataka', country_id: 1},
    {id: 3, name: 'Maharashtra', country_id: 1},
    {id: 4, name: 'California', country_id: 2},
    {id: 5, name: 'Texas', country_id: 2},
    // Add more states as needed
  ]);

  const [formData, setFormData] = useState({
    name: '',
    active: true,
    business_email: '',
    business_mobile: '',
    industry: '',
    business_type: 'individual',
    designation: '',
    is_primary: true,
    website: '',
    street: '',
    street2: '',
    city: '',
    zip: '',
    state_id: '',
    country_id: null,
    logo: '',
    business_card_front: '',
    business_card_back: '',
    promo_video: '',
    is_public: true,
    public_summary: '',
    partner_id: null,
    partner_name: '',
    social_insta: '',
    social_fb: '',
    social_twitter: '',
    social_linkedin: '',
    social_youtube: '',
    social_google_business: '',
    gst: '',
    pan: '',
    services_products: '',
    mobile_2: '',
    associated_date: '',
    founded_year: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // State for image handling from upload.jsx
  const [selectedFrontImage, setSelectedFrontImage] = useState(null);
  const [selectedBackImage, setSelectedBackImage] = useState(null);
  const [selectedLogoImage, setSelectedLogoImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  // Helper function to reconstruct image object from base64
  const reconstructImageFromBase64 = (base64String, imageType) => {
    if (!base64String || typeof base64String !== 'string') return null;

    const uri = base64String.startsWith('data:')
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;

    return {
      base64: base64String.replace(/^data:image\/\w+;base64,/, ''),
      uri: uri,
      type: 'image/jpeg',
      fileName: `${imageType}_image.jpg`,
      width: 1000,
      height: 1000,
    };
  };

  // Initialize form with existing business data
  useEffect(() => {
    if (businessData) {
      const initialIndustry = businessData.business_industry
        ? {
            label: businessData.business_industry_name,
            value: String(businessData.business_industry),
          }
        : null;

      const initialCountry = businessData.business_country_id
        ? {
            label: businessData.business_country_id_name,
            value: String(businessData.business_country_id),
          }
        : null;

      const initialState = businessData.business_state_id
        ? {
            label: businessData.business_state_id_name,
            value: String(businessData.business_state_id),
          }
        : null;
      setFormData({
        name: businessData.name || '',
        active: businessData.active !== undefined ? businessData.active : true,
        business_email: businessData.business_email || '',
        business_mobile: businessData.business_mobile || '',
        industry: parseInt(initialIndustry?.value) || '',
        industryObject: initialIndustry,
        business_type: businessData.business_type || 'individual',
        designation: businessData.designation || '',
        is_primary:
          businessData.is_primary !== undefined
            ? businessData.is_primary
            : true,
        website: businessData.website || '',
        street: businessData.street || '',
        street2: businessData.street2 || '',
        city: businessData.city || '',
        zip: businessData.zip || '',
        state_id: parseInt(initialState?.value) || '',
        stateObject: initialState,
        country_id: parseInt(initialCountry?.value) || '',
        countryObject: initialCountry,
        logo: '',
        business_card_front: '',
        business_card_back: '',
        promo_video: businessData.promo_video || '',
        is_public:
          businessData.is_public !== undefined ? businessData.is_public : true,
        public_summary: businessData.public_summary || '',
        partner_id: businessData.partner_id || null,
        partner_name: businessData.partner_name || '',
        social_insta: businessData.social_insta || '',
        social_fb: businessData.social_fb || '',
        social_twitter: businessData.social_twitter || '',
        social_linkedin: businessData.social_linkedin || '',
        social_youtube: businessData.social_youtube || '',
        social_google_business: businessData.social_google_business || '',
        gst: businessData.gst || '',
        pan: businessData.pan || '',
        services_products: businessData.services_products || '',
        mobile_2: businessData.mobile_2 || '',
        associated_date: businessData.associated_date || '',
        founded_year: businessData.founded_year || '',
      });

      // Initialize image states
      if (businessData.business_card_front) {
        setSelectedFrontImage(
          reconstructImageFromBase64(businessData.business_card_front, 'front'),
        );
      }
      if (businessData.business_card_back) {
        setSelectedBackImage(
          reconstructImageFromBase64(businessData.business_card_back, 'back'),
        );
      }
      if (businessData.logo) {
        setSelectedLogoImage(
          reconstructImageFromBase64(businessData.logo, 'logo'),
        );
      }
    }
  }, [businessData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Handle industry selection
  const handleSelectIndustry = item => {
    setFormData(prev => ({
      ...prev,
      industry: item.value,
      industryObject: item,
    }));
    setErrors(prev => ({...prev, industry: null}));
  };

  // Handle country selection
  const handleSelectCountry = item => {
    setFormData(prev => ({
      ...prev,
      country_id: item.value,
      countryObject: item,
      state_id: '',
      stateObject: null,
    }));
    setErrors(prev => ({
      ...prev,
      country_id: null,
      state_id: null,
    }));

    dispatch(getState({country_code: item.value}));
  };

  // Handle state selection
  const handleSelectState = item => {
    setFormData(prev => ({
      ...prev,
      state_id: item.value,
      stateObject: item,
    }));
    setErrors(prev => ({...prev, state_id: null}));
  };

  // Handle date change
  const handleDateChange = date => {
    handleInputChange('associated_date', date);
    setErrors(prev => ({...prev, associated_date: null}));
  };

  // Bottom Sheet functions for image selection
  const openBottomSheet = useCallback(type => {
    setCurrentImageType(type);
    bottomSheetModalRef.current?.present();
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleImageSelected = async (type, image) => {
    if (!image?.path) return;

    try {
      bottomSheetModalRef.current?.dismiss();

      setTimeout(async () => {
        try {
          const base64Data = await RNFS.readFile(image.path, 'base64');
          const imageData = {
            ...image,
            base64: base64Data,
            uri: `data:image/jpeg;base64,${base64Data}`,
          };

          switch (type) {
            case 'front':
              setSelectedFrontImage(imageData);
              break;
            case 'back':
              setSelectedBackImage(imageData);
              break;
            case 'logo':
              setSelectedLogoImage(imageData);
              break;
          }
        } catch (err) {
          console.error('Error reading image file:', err);
          Alert.alert('Error', 'Failed to read image file. Please try again.');
        }
      }, 300);
    } catch (err) {
      console.error('Error in handleImageSelected:', err);
    }
  };

  const handleSheetChanges = useCallback(index => {
    console.log('Bottom Sheet state changed to index:', index);
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!formData.business_email.trim()) {
      newErrors.business_email = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.business_email)) {
      newErrors.business_email = 'Please enter a valid email address';
    }

    if (!formData.business_mobile.trim()) {
      newErrors.business_mobile = 'Business mobile is required';
    } else if (!/^\d{10}$/.test(formData.business_mobile.replace(/\D/g, ''))) {
      newErrors.business_mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (
      formData.mobile_2 &&
      !/^\d{10}$/.test(formData.mobile_2.replace(/\D/g, ''))
    ) {
      newErrors.mobile_2 = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website URL should start with http:// or https://';
    }

    if (formData.zip && !/^\d{5,6}$/.test(formData.zip)) {
      newErrors.zip = 'Please enter a valid postal code';
    }

    if (
      formData.gst &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.gst,
      )
    ) {
      newErrors.gst = 'Please enter a valid GST number';
    }

    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = 'Please enter a valid PAN number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors before submitting',
      );
      return;
    }

    setLoading(true);

    try {
      const {countryObject, stateObject, industryObject, ...filteredFormData} = formData;
      const updateData = {
        id: businessData.id,
        ...filteredFormData,
        logo: selectedLogoImage?.base64 || '',
        business_card_front: selectedFrontImage?.base64 || '',
        business_card_back: selectedBackImage?.base64 || '',
      };

      await dispatch(updateBusiness(updateData)).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Update business error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update business details. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        {
          text: 'Keep Editing',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  // Render image preview
  const renderImagePreview = (imageData, label) => {
    if (!imageData || (!imageData.uri && !imageData.base64)) return null;

    let imageUri = imageData.uri;
    if (!imageUri && imageData.base64) {
      imageUri = `data:image/jpeg;base64,${imageData.base64}`;
    }

    return (
      <View style={styles.imagePreview}>
        <Text style={styles.imagePreviewLabel}>{label}</Text>
        <Image
          source={{uri: imageUri}}
          style={styles.previewImage}
          resizeMode="cover"
          onError={error =>
            console.error(
              `Error loading ${label} image:`,
              error.nativeEvent.error,
            )
          }
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar
            backgroundColor={colors.background}
            barStyle="light-content"
          />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Update Business</Text>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              disabled={loading}>
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                {/* Basic Information */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <Text style={styles.sectionIcon}>🏢</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Name *</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.name && styles.inputError,
                      ]}
                      value={formData.name}
                      onChangeText={value => handleInputChange('name', value)}
                      placeholder="Enter business name"
                      placeholderTextColor={colors.textSecondary}
                    />
                    {errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                      style={[styles.textInput, styles.multilineInput]}
                      value={formData.public_summary}
                      onChangeText={value =>
                        handleInputChange('public_summary', value)
                      }
                      placeholder="Describe your business"
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <DropdownWSearch
                      label="Industry"
                      data={
                        industryData?.map(c => ({
                          label: c.name,
                          value: String(c.id),
                        })) ?? []
                      }
                      onSelect={handleSelectIndustry}
                      selectedValue={formData.industryObject}
                      placeholder="Select an industry"
                      error={errors.industry}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Type</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.business_type}
                      onChangeText={value =>
                        handleInputChange('business_type', value)
                      }
                      placeholder="e.g., individual, company, partnership"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Services/Products</Text>
                    <TextInput
                      style={[styles.textInput, styles.multilineInput]}
                      value={formData.services_products}
                      onChangeText={value =>
                        handleInputChange('services_products', value)
                      }
                      placeholder="What services or products do you offer?"
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Founded Year</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.founded_year}
                      onChangeText={value =>
                        handleInputChange('founded_year', value)
                      }
                      placeholder="e.g., 2020"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <DatePickerBox
                      label="Date Associated with Organization"
                      value={formData.associated_date}
                      onChange={handleDateChange}
                      error={errors.associated_date}
                      restrictPastDates={false}
                    />
                  </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <Text style={styles.sectionIcon}>📞</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Mobile *</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.business_mobile && styles.inputError,
                      ]}
                      value={formData.business_mobile}
                      onChangeText={value =>
                        handleInputChange('business_mobile', value)
                      }
                      placeholder="Enter mobile number"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="phone-pad"
                    />
                    {errors.business_mobile && (
                      <Text style={styles.errorText}>
                        {errors.business_mobile}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Secondary Mobile</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.mobile_2 && styles.inputError,
                      ]}
                      value={formData.mobile_2}
                      onChangeText={value =>
                        handleInputChange('mobile_2', value)
                      }
                      placeholder="Enter secondary mobile number"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="phone-pad"
                    />
                    {errors.mobile_2 && (
                      <Text style={styles.errorText}>{errors.mobile_2}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Email *</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.business_email && styles.inputError,
                      ]}
                      value={formData.business_email}
                      onChangeText={value =>
                        handleInputChange('business_email', value)
                      }
                      placeholder="Enter email address"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {errors.business_email && (
                      <Text style={styles.errorText}>
                        {errors.business_email}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Website</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.website && styles.inputError,
                      ]}
                      value={formData.website}
                      onChangeText={value =>
                        handleInputChange('website', value)
                      }
                      placeholder="https://www.example.com"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                    {errors.website && (
                      <Text style={styles.errorText}>{errors.website}</Text>
                    )}
                  </View>
                </View>

                {/* Location */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <Text style={styles.sectionIcon}>📍</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Location</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Street Address</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.street}
                      onChangeText={value => handleInputChange('street', value)}
                      placeholder="Enter street address"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Street Address 2</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.street2}
                      onChangeText={value =>
                        handleInputChange('street2', value)
                      }
                      placeholder="Enter additional address info"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.city}
                      onChangeText={value => handleInputChange('city', value)}
                      placeholder="Enter city name"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Postal Code</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.zip && styles.inputError,
                      ]}
                      value={formData.zip}
                      onChangeText={value => handleInputChange('zip', value)}
                      placeholder="Enter postal code"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                    {errors.zip && (
                      <Text style={styles.errorText}>{errors.zip}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <DropdownWSearch
                      label="Country"
                      data={countries?.map(country => ({
                        label: country.name,
                        value: String(country.id),
                      }))}
                      onSelect={handleSelectCountry}
                      selectedValue={formData.countryObject}
                      placeholder="Select a country"
                      error={errors.country_id}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <DropdownWSearch
                      label="State"
                      data={states?.map(state => ({
                        label: state.name,
                        value: String(state.id),
                      }))}
                      onSelect={handleSelectState}
                      selectedValue={formData.stateObject}
                      placeholder="Select a state"
                      error={errors.state_id}
                      disabled={!formData.country_id}
                    />
                  </View>
                </View>

                {/* Leadership */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <Text style={styles.sectionIcon}>👤</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Leadership</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Partner/Owner Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.partner_name}
                      onChangeText={value =>
                        handleInputChange('partner_name', value)
                      }
                      placeholder="Enter partner/owner name"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Designation</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.designation}
                      onChangeText={value =>
                        handleInputChange('designation', value)
                      }
                      placeholder="e.g., CEO, Founder, Manager"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>

                {/* Business Documents */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <Text style={styles.sectionIcon}>📄</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Business Documents</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>GST Number</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.gst && styles.inputError,
                      ]}
                      value={formData.gst}
                      onChangeText={value =>
                        handleInputChange('gst', value.toUpperCase())
                      }
                      placeholder="Enter GST number"
                      placeholderTextColor={colors.textSecondary}
                      autoCapitalize="characters"
                    />
                    {errors.gst && (
                      <Text style={styles.errorText}>{errors.gst}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>PAN Number</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        errors.pan && styles.inputError,
                      ]}
                      value={formData.pan}
                      onChangeText={value =>
                        handleInputChange('pan', value.toUpperCase())
                      }
                      placeholder="Enter PAN number"
                      placeholderTextColor={colors.textSecondary}
                      autoCapitalize="characters"
                    />
                    {errors.pan && (
                      <Text style={styles.errorText}>{errors.pan}</Text>
                    )}
                  </View>
                </View>

                {/* Business Media */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <Text style={styles.sectionIcon}>📸</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Business Media</Text>
                  </View>

                  {/* Logo */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Logo</Text>
                    <TouchableOpacity
                      style={styles.imagePickerButton}
                      onPress={() => openBottomSheet('logo')}>
                      <View style={styles.imagePickerContent}>
                        <Text style={styles.imagePickerIcon}>🏢</Text>
                        <Text style={styles.imagePickerText}>
                          {selectedLogoImage ? 'Change Logo' : 'Upload Logo'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {renderImagePreview(selectedLogoImage, 'Current Logo')}
                  </View>

                  {/* Business Card Front */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Card (Front)</Text>
                    <TouchableOpacity
                      style={styles.imagePickerButton}
                      onPress={() => openBottomSheet('front')}>
                      <View style={styles.imagePickerContent}>
                        <Text style={styles.imagePickerIcon}>🎴</Text>
                        <Text style={styles.imagePickerText}>
                          {selectedFrontImage
                            ? 'Change Card Front'
                            : 'Upload Card Front'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {renderImagePreview(
                      selectedFrontImage,
                      'Current Card Front',
                    )}
                  </View>

                  {/* Business Card Back */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Card (Back)</Text>
                    <TouchableOpacity
                      style={styles.imagePickerButton}
                      onPress={() => openBottomSheet('back')}>
                      <View style={styles.imagePickerContent}>
                        <Text style={styles.imagePickerIcon}>🎴</Text>
                        <Text style={styles.imagePickerText}>
                          {selectedBackImage
                            ? 'Change Card Back'
                            : 'Upload Card Back'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {renderImagePreview(selectedBackImage, 'Current Card Back')}
                  </View>

                  {/* Promo Video URL */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Promotional Video URL</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.promo_video}
                      onChangeText={value =>
                        handleInputChange('promo_video', value)
                      }
                      placeholder="Enter promotional video URL"
                      placeholderTextColor={colors.textSecondary}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Social Media */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <Text style={styles.sectionIcon}>📱</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Social Media</Text>
                  </View>

                  <View style={styles.socialMediaGrid}>
                    <View style={styles.socialInputContainer}>
                      <Text style={styles.inputLabel}>Instagram</Text>
                      <View style={styles.socialInputWrapper}>
                        <Text style={styles.socialIcon}>📷</Text>
                        <TextInput
                          style={styles.socialTextInput}
                          value={formData.social_insta}
                          onChangeText={value =>
                            handleInputChange('social_insta', value)
                          }
                          placeholder="@username"
                          placeholderTextColor={colors.textSecondary}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.socialInputContainer}>
                      <Text style={styles.inputLabel}>Facebook</Text>
                      <View style={styles.socialInputWrapper}>
                        <Text style={styles.socialIcon}>📘</Text>
                        <TextInput
                          style={styles.socialTextInput}
                          value={formData.social_fb}
                          onChangeText={value =>
                            handleInputChange('social_fb', value)
                          }
                          placeholder="Username"
                          placeholderTextColor={colors.textSecondary}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.socialInputContainer}>
                      <Text style={styles.inputLabel}>LinkedIn</Text>
                      <View style={styles.socialInputWrapper}>
                        <Text style={styles.socialIcon}>💼</Text>
                        <TextInput
                          style={styles.socialTextInput}
                          value={formData.social_linkedin}
                          onChangeText={value =>
                            handleInputChange('social_linkedin', value)
                          }
                          placeholder="Username"
                          placeholderTextColor={colors.textSecondary}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.socialInputContainer}>
                      <Text style={styles.inputLabel}>Twitter</Text>
                      <View style={styles.socialInputWrapper}>
                        <Text style={styles.socialIcon}>🐦</Text>
                        <TextInput
                          style={styles.socialTextInput}
                          value={formData.social_twitter}
                          onChangeText={value =>
                            handleInputChange('social_twitter', value)
                          }
                          placeholder="@username"
                          placeholderTextColor={colors.textSecondary}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.socialInputContainer}>
                      <Text style={styles.inputLabel}>YouTube</Text>
                      <View style={styles.socialInputWrapper}>
                        <Text style={styles.socialIcon}>📺</Text>
                        <TextInput
                          style={styles.socialTextInput}
                          value={formData.social_youtube}
                          onChangeText={value =>
                            handleInputChange('social_youtube', value)
                          }
                          placeholder="Channel URL"
                          placeholderTextColor={colors.textSecondary}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.socialInputContainer}>
                      <Text style={styles.inputLabel}>Google Business</Text>
                      <View style={styles.socialInputWrapper}>
                        <Text style={styles.socialIcon}>🏪</Text>
                        <TextInput
                          style={styles.socialTextInput}
                          value={formData.social_google_business}
                          onChangeText={value =>
                            handleInputChange('social_google_business', value)
                          }
                          placeholder="Profile URL"
                          placeholderTextColor={colors.textSecondary}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Bottom spacing for keyboard */}
                <View style={styles.bottomSpacing} />
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* Bottom Sheet Modal for Image Cropper */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          enableOverDrag={false}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          backgroundStyle={styles.bottomSheetBackground}>
          <BottomSheetView style={styles.modalContentContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Image</Text>
              <TouchableOpacity
                onPress={closeBottomSheet}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ImageCropper
              navigation={navigation}
              type={currentImageType}
              onImageSelected={handleImageSelected}
              onClose={closeBottomSheet}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text_color_1,
    textAlign: 'center',
    flex: 1,
  },
  saveButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: colors.accent,
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    color: colors.background,
    fontWeight: 'bold',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: colors.secondary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text_color_1,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text_color_1,
    backgroundColor: colors.surface,
    minHeight: 50,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  inputError: {
    borderColor: colors.status_red,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 13,
    color: colors.status_red,
    marginTop: 6,
    fontWeight: '500',
  },
  imagePickerButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  imagePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePickerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  imagePickerText: {
    fontSize: 16,
    color: colors.gold,
    fontWeight: '600',
  },
  imagePreview: {
    alignItems: 'center',
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePreviewLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  previewImage: {
    width: width * 0.5,
    height: width * 0.35,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  socialMediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialInputContainer: {
    width: '48%',
    marginBottom: 16,
  },
  socialInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  socialIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  socialTextInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text_color_1,
    paddingVertical: 10,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomSheetBackground: {
    borderRadius: 20,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalContentContainer: {
    padding: 20,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text_color_1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
});

export default UpdateBusiness;