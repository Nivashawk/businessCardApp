import React, {useRef, useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {createBusiness} from '../../redux/slices/business/createBusinessSlices';
import {updateBusinessSocialData} from '../../redux/slices/business/businessBasic';

import {TabBarStyle} from '../../theme/tabBar';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import { resetCreateBusiness } from '../../redux/slices/business/createBusinessSlices';
import {colors} from '../../theme/colors';
import Basic from './steps/basic';
import Address from './steps/address';
import Upload from './steps/upload';
import Social from './steps/social';

const {width, height} = Dimensions.get('window');

const CreateBusiness = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessData);
  const [index, setIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasNavigatedAway, setHasNavigatedAway] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const BusinessCreated = useSelector(
    state => state.createBusiness?.data?.result ?? [],
  );

  // Reset component state when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reset all states when entering the screen
      setIndex(0);
      setIsSubmitted(false);
      setHasNavigatedAway(false);
      
      // Reset progress bar
      progress.setValue(0);
      
      // IMPORTANT: Clear the previous business creation state from Redux
      // You might need to dispatch a reset action here
      dispatch(resetCreateBusiness()); // Add this action to your Redux slice
      
      return () => {
        // Cleanup when leaving the screen
        setHasNavigatedAway(true);
      };
    }, [])
  );

  useEffect(() => {
    console.log('submit status', isSubmitted);
    console.log('businessData', businessData);
    
    // Only trigger API call if:
    // 1. Form is submitted
    // 2. We're on the last step (index 3)
    // 3. We haven't navigated away from the screen
    if (isSubmitted && index === 3 && !hasNavigatedAway) {
      console.log('Triggering API call from last step');
      if (businessData) {
        console.log('businessData', businessData);
        dispatch(
          createBusiness({
            name: businessData.companyName,
            designation: businessData.yourDesignation,
            business_mobile: businessData.phone,
            business_email: businessData.email,
            public_summary: businessData.description,
            industry: businessData.industry,
            services_products: businessData.services,
            date_of_joining: businessData.date_of_joining,
            street: businessData.street,
            street2: businessData.street2,
            city: businessData.city,
            zip: businessData.zip,
            state_id: 33,
            country_id: 91,
            website: businessData.website,
            promo_video: businessData.promo_video,
            business_card_front: businessData.business_card_front,
            business_card_back: businessData.business_card_back,
            logo: businessData.logo,
            social_insta: businessData.social_insta,
            social_linkedin: businessData.social_linkedin,
            social_twitter: businessData.social_twitter,
            social_fb: businessData.social_fb,
            social_youtube: businessData.social_youtube,
            social_google_business: businessData.social_google_business,
            active: businessData.active,
            is_primary: businessData.is_primary,
            is_public: businessData.is_public,
          }),
        );
      }
    }
  }, [businessData, isSubmitted, index, hasNavigatedAway, dispatch]);

  // Monitor Redux state changes - but only respond to NEW success states
  useEffect(() => {
    console.log("BusinessCreated state:", BusinessCreated);
    // Only navigate if:
    // 1. Business was successfully created
    // 2. We haven't navigated away yet
    // 3. We actually submitted the form (prevents navigation on re-entry)
    if (BusinessCreated?.status === "Success" && !hasNavigatedAway && isSubmitted) {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [BusinessCreated, navigation, hasNavigatedAway, isSubmitted]);

  const basicRef = useRef();
  const addressRef = useRef();
  const uploadRef = useRef();
  const socialRef = useRef();

  const steps = [
    {key: 'basic', label: 'Basic', ref: basicRef, Component: Basic},
    {key: 'address', label: 'Address', ref: addressRef, Component: Address},
    {key: 'upload', label: 'Upload', ref: uploadRef, Component: Upload},
    {key: 'social', label: 'Social', ref: socialRef, Component: Social},
  ];

  const isLastStep = index === steps.length - 1;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (index + 1) / steps.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [index]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        // Only capture horizontal gestures
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 100 && index > 0) {
          setIndex(index - 1);
        } else if (gestureState.dx < -100 && index < steps.length - 1) {
          setIndex(index + 1);
        }
      },
    }),
  ).current;

  const handleNext = () => {
    const currentRef = steps[index].ref;
    if (currentRef.current?.validate && !currentRef.current.validate()) return;

    if (isLastStep) {
      console.log('Form submitted ✅');
      const socialData = currentRef.current?.getData?.();
      console.log('Final socialData:', socialData);
      dispatch(
        updateBusinessSocialData({
          social_insta: socialData.instagram,
          social_linkedin: socialData.linkedin,
          social_twitter: socialData.twitter,
          social_fb: socialData.facebook,
          social_youtube: socialData.youtube,
          social_google_business: socialData.business,
        }),
      );
      setIsSubmitted(true);
    } else {
      // Reset submission state when navigating to other steps
      setIsSubmitted(false);
      setIndex(index + 1);
    }
  };

  const handlePrevious = () => {
    // Reset submission state when going back
    setIsSubmitted(false);
    setIndex(index - 1);
  };

  const handleTabPress = i => {
    const currentRef = steps[index].ref;
    if (currentRef.current?.validate && !currentRef.current.validate()) return;

    // Reset submission state when navigating via tabs
    setIsSubmitted(false);
    setIndex(i);
  };

  const StepComponent = steps[index].Component;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Tab Navigation with Enhanced Active Indicator */}
      <View style={styles.tabs}>
        {steps.map((step, i) => (
          <TouchableOpacity
            key={step.key}
            onPress={() => handleTabPress(i)}
            style={[
              styles.tab,
              index === i && styles.activeTab
            ]}>
            {/* Step Number Circle */}
            <View style={[
              styles.stepNumber,
              index === i && styles.activeStepNumber,
              i < index && styles.completedStepNumber
            ]}>
              <Text style={[
                styles.stepNumberText,
                index === i && styles.activeStepNumberText,
                i < index && styles.completedStepNumberText
              ]}>
                {i + 1}
              </Text>
            </View>
            
            {/* Step Label */}
            <Text style={[
              styles.tabText, 
              index === i && styles.activeTabText,
              i < index && styles.completedTabText
            ]}>
              {step.label}
            </Text>
            
            {/* Active Tab Bottom Indicator */}
            {index === i && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Step Content with Swipe Support */}
      <Animated.View {...panResponder.panHandlers} style={styles.stepContainer}>
        <StepComponent ref={steps[index].ref} />
      </Animated.View>

      {/* Navigation Buttons - Now with better positioning */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          style={[styles.button, index === 0 && styles.disabledButton]}
          disabled={index === 0}
          onPress={handlePrevious}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {isLastStep ? 'Create' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateBusiness;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    height: 4,
    width: '100%',
    backgroundColor: colors.secondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: colors.background,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 70,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: colors.primary + '10', // 10% opacity
    borderRadius: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  activeStepNumber: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  completedStepNumber: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  activeStepNumberText: {
    color: '#fff',
  },
  completedStepNumberText: {
    color: '#fff',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  completedTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -16,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 80, // Add padding to prevent overlap with nav buttons
  },
  navButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Account for iOS safe area
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});