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
  Dimensions, // Import Dimensions
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {updateBusiness} from '../../redux/slices/business/updateBusinessSlices';

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
import ImageCropper from '../../components/imageCropper'; // Adjust path as needed
import RNFS from 'react-native-fs'; // Import RNFS

const {width, height} = Dimensions.get('window'); // Destructure width and height

const UpdateBusiness = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  
  const {businessData} = route.params || {};
  
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
    
    // Check if the base64String already contains the data URI prefix
    const uri = base64String.startsWith('data:') 
      ? base64String 
      : `data:image/jpeg;base64,${base64String}`;

    return {
      base64: base64String.replace(/^data:image\/\w+;base64,/, ''), // Ensure only base64 part is stored
      uri: uri,
      type: 'image/jpeg', // Assuming JPEG for simplicity or detect from base64String
      fileName: `${imageType}_image.jpg`,
      width: 1000, // Placeholder
      height: 1000, // Placeholder
    };
  };

  // Initialize form with existing business data
  useEffect(() => {
    if (businessData) {
      setFormData({
        name: businessData.name || '',
        active: businessData.active !== undefined ? businessData.active : true,
        business_email: businessData.business_email || '',
        business_mobile: businessData.business_mobile || '',
        industry: businessData.industry || '',
        business_type: businessData.business_type || 'individual',
        designation: businessData.designation || '',
        is_primary: businessData.is_primary !== undefined ? businessData.is_primary : true,
        website: businessData.website || '',
        street: businessData.street || '',
        street2: businessData.street2 || '',
        city: businessData.city || '',
        zip: businessData.zip || '',
        state_id: businessData.state_id || '',
        country_id: businessData.country_id || null,
        // These will be managed by selectedImage states
        logo: '', 
        business_card_front: '',
        business_card_back: '',
        promo_video: businessData.promo_video || '',
        is_public: businessData.is_public !== undefined ? businessData.is_public : true,
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
        setSelectedFrontImage(reconstructImageFromBase64(businessData.business_card_front, 'front'));
      }
      if (businessData.business_card_back) {
        setSelectedBackImage(reconstructImageFromBase64(businessData.business_card_back, 'back'));
      }
      if (businessData.logo) {
        setSelectedLogoImage(reconstructImageFromBase64(businessData.logo, 'logo'));
      }
    }
  }, [businessData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Handle country selection
  const handleSelectCountry = (item) => {
    handleInputChange('country_id', item.value);
    // Reset state when country changes
    handleInputChange('state_id', '');
    setErrors(prev => ({...prev, country_id: null}));
  };

  // Handle state selection
  const handleSelectState = (item) => {
    handleInputChange('state_id', item.value);
    setErrors(prev => ({...prev, state_id: null}));
  };

  // Handle date change
  const handleDateChange = (date) => {
    handleInputChange('associated_date', date);
    setErrors(prev => ({...prev, associated_date: null}));
  };

  // Filter states based on selected country
  const getFilteredStates = () => {
    if (!formData.country_id) return [];
    return statesData.filter(state => state.country_id === parseInt(formData.country_id));
  };

  // Get selected country name
  const getSelectedCountryName = () => {
    if (!formData.country_id) return '';
    const country = countriesData.find(c => c.id === parseInt(formData.country_id));
    return country ? country.name : '';
  };

  // Get selected state name
  const getSelectedStateName = () => {
    if (!formData.state_id) return '';
    const state = statesData.find(s => s.id === parseInt(formData.state_id));
    return state ? state.name : '';
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
      
      // Add a small delay to allow the bottom sheet to dismiss visually
      setTimeout(async () => {
        try {
          const base64Data = await RNFS.readFile(image.path, 'base64');
          const imageData = {
            ...image,
            base64: base64Data,
            uri: `data:image/jpeg;base64,${base64Data}`, // Ensure URI is set for preview
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
      }, 300); // 300ms delay
      
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

    if (formData.mobile_2 && !/^\d{10}$/.test(formData.mobile_2.replace(/\D/g, ''))) {
      newErrors.mobile_2 = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website URL should start with http:// or https://';
    }

    if (formData.zip && !/^\d{5,6}$/.test(formData.zip)) {
      newErrors.zip = 'Please enter a valid postal code';
    }

    if (formData.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst)) {
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
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare update data with business ID and base64 images
      const updateData = {
        id: businessData.id,
        ...formData,
        logo: selectedLogoImage?.base64 || '',
        business_card_front: selectedFrontImage?.base64 || '',
        business_card_back: selectedBackImage?.base64 || '',
      };

      // Dispatch update action
      await dispatch(updateBusiness(updateData)).unwrap(); // Await the unwrap() for better error handling
      
      Alert.alert('Success', 'Business details updated successfully!');
      navigation.goBack();
      
    } catch (error) {
      console.error('Update business error:', error);
      Alert.alert('Error', error.message || 'Failed to update business details. Please try again.');
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
          style: 'cancel'
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
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
          onError={(error) => console.error(`Error loading ${label} image:`, error.nativeEvent.error)}
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
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
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Name *</Text>
                    <TextInput
                      style={[styles.textInput, errors.name && styles.inputError]}
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                      placeholder="Enter business name"
                      placeholderTextColor="#9ca3af"
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                      style={[styles.textInput, styles.multilineInput]}
                      value={formData.public_summary}
                      onChangeText={(value) => handleInputChange('public_summary', value)}
                      placeholder="Describe your business"
                      placeholderTextColor="#9ca3af"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Industry</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.industry}
                      onChangeText={(value) => handleInputChange('industry', value)}
                      placeholder="e.g., Technology, Healthcare, Retail"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Type</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.business_type}
                      onChangeText={(value) => handleInputChange('business_type', value)}
                      placeholder="e.g., individual, company, partnership"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Services/Products</Text>
                    <TextInput
                      style={[styles.textInput, styles.multilineInput]}
                      value={formData.services_products}
                      onChangeText={(value) => handleInputChange('services_products', value)}
                      placeholder="What services or products do you offer?"
                      placeholderTextColor="#9ca3af"
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
                      onChangeText={(value) => handleInputChange('founded_year', value)}
                      placeholder="e.g., 2020"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Updated Associated Date with DatePickerBox */}
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
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Mobile *</Text>
                    <TextInput
                      style={[styles.textInput, errors.business_mobile && styles.inputError]}
                      value={formData.business_mobile}
                      onChangeText={(value) => handleInputChange('business_mobile', value)}
                      placeholder="Enter mobile number"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                    />
                    {errors.business_mobile && <Text style={styles.errorText}>{errors.business_mobile}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Secondary Mobile</Text>
                    <TextInput
                      style={[styles.textInput, errors.mobile_2 && styles.inputError]}
                      value={formData.mobile_2}
                      onChangeText={(value) => handleInputChange('mobile_2', value)}
                      placeholder="Enter secondary mobile number"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                    />
                    {errors.mobile_2 && <Text style={styles.errorText}>{errors.mobile_2}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Email *</Text>
                    <TextInput
                      style={[styles.textInput, errors.business_email && styles.inputError]}
                      value={formData.business_email}
                      onChangeText={(value) => handleInputChange('business_email', value)}
                      placeholder="Enter email address"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {errors.business_email && <Text style={styles.errorText}>{errors.business_email}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Website</Text>
                    <TextInput
                      style={[styles.textInput, errors.website && styles.inputError]}
                      value={formData.website}
                      onChangeText={(value) => handleInputChange('website', value)}
                      placeholder="https://www.example.com"
                      placeholderTextColor="#9ca3af"
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                    {errors.website && <Text style={styles.errorText}>{errors.website}</Text>}
                  </View>
                </View>

                {/* Location */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Location</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Street Address</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.street}
                      onChangeText={(value) => handleInputChange('street', value)}
                      placeholder="Enter street address"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Street Address 2</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.street2}
                      onChangeText={(value) => handleInputChange('street2', value)}
                      placeholder="Enter additional address info"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.city}
                      onChangeText={(value) => handleInputChange('city', value)}
                      placeholder="Enter city name"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Postal Code</Text>
                    <TextInput
                      style={[styles.textInput, errors.zip && styles.inputError]}
                      value={formData.zip}
                      onChangeText={(value) => handleInputChange('zip', value)}
                      placeholder="Enter postal code"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                    />
                    {errors.zip && <Text style={styles.errorText}>{errors.zip}</Text>}
                  </View>

                  {/* Updated Country with DropdownWSearch */}
                  <View style={styles.inputContainer}>
                    <DropdownWSearch
                      label="Country"
                      data={countriesData.map(country => ({
                        label: country.name,
                        value: String(country.id),
                      }))}
                      onSelect={handleSelectCountry}
                      value={String(formData.country_id || '')}
                      placeholder="Select a country"
                      error={errors.country_id}
                    />
                  </View>

                  {/* Updated State with DropdownWSearch */}
                  <View style={styles.inputContainer}>
                    <DropdownWSearch
                      label="State"
                      data={getFilteredStates().map(state => ({
                        label: state.name,
                        value: String(state.id),
                      }))}
                      onSelect={handleSelectState}
                      value={String(formData.state_id || '')}
                      placeholder="Select a state"
                      error={errors.state_id}
                      disabled={!formData.country_id}
                    />
                  </View>
                </View>

                {/* Leadership */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Leadership</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Partner/Owner Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.partner_name}
                      onChangeText={(value) => handleInputChange('partner_name', value)}
                      placeholder="Enter partner/owner name"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Designation</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.designation}
                      onChangeText={(value) => handleInputChange('designation', value)}
                      placeholder="e.g., CEO, Founder, Manager"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>

                {/* Business Documents */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Business Documents</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>GST Number</Text>
                    <TextInput
                      style={[styles.textInput, errors.gst && styles.inputError]}
                      value={formData.gst}
                      onChangeText={(value) => handleInputChange('gst', value.toUpperCase())}
                      placeholder="Enter GST number"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="characters"
                    />
                    {errors.gst && <Text style={styles.errorText}>{errors.gst}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>PAN Number</Text>
                    <TextInput
                      style={[styles.textInput, errors.pan && styles.inputError]}
                      value={formData.pan}
                      onChangeText={(value) => handleInputChange('pan', value.toUpperCase())}
                      placeholder="Enter PAN number"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="characters"
                    />
                    {errors.pan && <Text style={styles.errorText}>{errors.pan}</Text>}
                  </View>
                </View>

                {/* Business Media */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Business Media</Text>
                  
                  {/* Logo */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Logo</Text>
                    <TouchableOpacity 
                      style={styles.imagePickerButton}
                      onPress={() => openBottomSheet('logo')}>
                      <Text style={styles.imagePickerText}>
                        {selectedLogoImage ? 'Change Logo' : 'Upload Logo'}
                      </Text>
                    </TouchableOpacity>
                    {renderImagePreview(selectedLogoImage, 'Current Logo')}
                  </View>

                  {/* Business Card Front */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Card (Front)</Text>
                    <TouchableOpacity 
                      style={styles.imagePickerButton}
                      onPress={() => openBottomSheet('front')}>
                      <Text style={styles.imagePickerText}>
                        {selectedFrontImage ? 'Change Card Front' : 'Upload Card Front'}
                      </Text>
                    </TouchableOpacity>
                    {renderImagePreview(selectedFrontImage, 'Current Card Front')}
                  </View>

                  {/* Business Card Back */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Card (Back)</Text>
                    <TouchableOpacity 
                      style={styles.imagePickerButton}
                      onPress={() => openBottomSheet('back')}>
                      <Text style={styles.imagePickerText}>
                        {selectedBackImage ? 'Change Card Back' : 'Upload Card Back'}
                      </Text>
                    </TouchableOpacity>
                    {renderImagePreview(selectedBackImage, 'Current Card Back')}
                  </View>

                  {/* Promo Video URL */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Promotional Video URL</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.promo_video}
                      onChangeText={(value) => handleInputChange('promo_video', value)}
                      placeholder="Enter promotional video URL"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Social Media */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Social Media</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Instagram</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.social_insta}
                      onChangeText={(value) => handleInputChange('social_insta', value)}
                      placeholder="@username or full URL"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Facebook</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.social_fb}
                      onChangeText={(value) => handleInputChange('social_fb', value)}
                      placeholder="Username or full URL"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>LinkedIn</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.social_linkedin}
                      onChangeText={(value) => handleInputChange('social_linkedin', value)}
                      placeholder="Username or full URL"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Twitter</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.social_twitter}
                      onChangeText={(value) => handleInputChange('social_twitter', value)}
                      placeholder="@username or full URL"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>YouTube</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.social_youtube}
                      onChangeText={(value) => handleInputChange('social_youtube', value)}
                      placeholder="Channel URL"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Google Business</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.social_google_business}
                      onChangeText={(value) => handleInputChange('social_google_business', value)}
                      placeholder="Google Business profile URL"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                    />
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
          backgroundStyle={{
            borderRadius: 16,
            backgroundColor: colors.secondary,
          }}>
          <BottomSheetView style={styles.modalContentContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Image</Text>
              <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
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
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  imagePickerButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  imagePreview: {
    marginTop: 8,
    alignItems: 'center', // Center the image preview
  },
  imagePreviewLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  previewImage: {
    width: width * 0.4, // Make it responsive
    height: width * 0.3, // Make it responsive, adjust aspect ratio as needed
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  bottomSpacing: {
    height: 100,
  },
  // Styles for BottomSheetModal from upload.jsx
  modalContentContainer: {
    padding: 16,
    marginBottom: height * 0.01,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text || '#000',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default UpdateBusiness;