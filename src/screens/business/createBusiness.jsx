// Enhanced CreateBusiness.js with better upload handling and updated colors

import React, {useRef, useState, useEffect, useCallback} from 'react';
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
  StatusBar,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import {createBusiness} from '../../redux/slices/business/createBusinessSlices';
import {
  updateBusinessBasicData,
  updateBusinessAddressData,
  updateBusinessUploadData,
  updateBusinessSocialData,
  resetBusinessData,
  setCurrentTab, // Add this import
} from '../../redux/slices/business/businessBasic';

import {TabBarStyle} from '../../theme/tabBar';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {resetCreateBusiness} from '../../redux/slices/business/createBusinessSlices';
import {colors} from '../../theme/colors';
import Basic from './steps/basic';
import Address from './steps/address';
import Upload from './steps/upload';
import Social from './steps/social';
import Toast from 'react-native-toast-message';

const {width, height} = Dimensions.get('window');

const CreateBusiness = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const businessData = useSelector(state => state.businessData);

  // Get current tab from Redux state
  const currentTabFromRedux = useSelector(
    state => state.businessData.currentTab || 0,
  );

  // Get initial tab from route params (this takes priority)
  const initialTabFromRoute = route.params?.initialTab;

  // Determine which tab to start with
  const initialTab =
    initialTabFromRoute !== undefined
      ? initialTabFromRoute
      : currentTabFromRedux;

  const [index, setIndex] = useState(initialTab);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasNavigatedAway, setHasNavigatedAway] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const progress = useRef(new Animated.Value(initialTab / 4)).current;

  const BusinessCreated = useSelector(
    state => state.createBusiness?.data?.result ?? [],
  );

  // Update Redux whenever tab changes
  useEffect(() => {
    dispatch(setCurrentTab(index));
  }, [index, dispatch]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Reset component state when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Handle route params for initial tab
      if (route.params?.initialTab !== undefined) {
        setIndex(route.params.initialTab);
        progress.setValue(route.params.initialTab / 4);
        // Clear the route param so it doesn't interfere with future navigation
        navigation.setParams({initialTab: undefined});
      } else {
        // Use Redux state for tab persistence
        setIndex(currentTabFromRedux);
        progress.setValue(currentTabFromRedux / 4);
      }

      setIsSubmitted(false);
      setHasNavigatedAway(false);
      dispatch(resetCreateBusiness());

      return () => {
        setHasNavigatedAway(true);
      };
    }, [route.params?.initialTab, currentTabFromRedux, navigation, dispatch]),
  );

  // // Reset tab state when component unmounts completely
  // useEffect(() => {
  //   return () => {
  //     // Only reset tab if we're navigating away from the entire flow
  //     if (hasNavigatedAway) {
  //       dispatch(setCurrentTab(0));
  //     }
  //   };
  // }, [hasNavigatedAway, dispatch]);

  useEffect(() => {
    console.log('submit status', isSubmitted);
    console.log('businessData', businessData);

    if (isSubmitted && index === 3 && !hasNavigatedAway) {
      console.log('Triggering API call from last step');
      if (businessData) {
        console.log('businessData', businessData);
        dispatch(
          createBusiness({
            name: businessData.companyName,
            founded_year: businessData.foundedYear,
            designation: businessData.yourDesignation,
            gst: businessData.gstNumber,
            business_mobile: businessData.phone,
            business_email: businessData.email,
            public_summary: businessData.description,
            industry: businessData.industry,
            services_products: businessData.services,
            date_of_joining: businessData.DOJ || businessData.date_of_joining,
            street: businessData.street,
            street2: businessData.street2,
            city: businessData.city,
            zip: businessData.zip,
            state_id: businessData.state_id,
            country_id: businessData.country_id,
            website: businessData.website,
            promo_video: businessData.promo_video,
            business_card_front: businessData.business_card_front?.base64,
            business_card_back: businessData.business_card_back?.base64,
            logo: businessData.logo?.base64,
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

  useEffect(() => {
    console.log('BusinessCreated state:', BusinessCreated);
    if (
      BusinessCreated?.status === 'Success' &&
      !hasNavigatedAway &&
      isSubmitted
    ) {
      dispatch(resetBusinessData());
      dispatch(setCurrentTab(0)); // Reset tab after successful creation
      Toast.show({
        type: 'success',
        text1: BusinessCreated.message,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [BusinessCreated, navigation, hasNavigatedAway, isSubmitted, dispatch]);

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

  // Enhanced function to save current step data to Redux
  const saveCurrentStepData = () => {
    const currentRef = steps[index].ref;
    if (currentRef.current?.getData) {
      const stepData = currentRef.current.getData();
      console.log(`Saving step ${index} data:`, stepData);

      switch (index) {
        case 0: // Basic step
          dispatch(updateBusinessBasicData(stepData));
          break;
        case 1: // Address step
          dispatch(updateBusinessAddressData(stepData));
          break;
        case 2: // Upload step
          const uploadData = {
            website: stepData.website || '',
            promo_video: stepData.promo_video || stepData.promoVideo || null,
            business_card_front:
              stepData.business_card_front ||
              stepData.businessCardFront ||
              null,
            business_card_back:
              stepData.business_card_back || stepData.businessCardBack || null,
            logo: stepData.logo || null,
          };
          console.log('Saving upload data:', uploadData);
          dispatch(updateBusinessUploadData(uploadData));
          break;
        case 3: // Social step
          dispatch(
            updateBusinessSocialData({
              social_insta: stepData.instagram || '',
              social_linkedin: stepData.linkedin || '',
              social_twitter: stepData.twitter || '',
              social_fb: stepData.facebook || '',
              social_youtube: stepData.youtube || '',
              social_google_business: stepData.business || '',
            }),
          );
          break;
      }
    }
  };

  const handleNext = () => {
    const currentRef = steps[index].ref;
    if (currentRef.current?.validate && !currentRef.current.validate()) return;

    saveCurrentStepData();

    if (isLastStep) {
      console.log('Form submitted ✅');
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
      setIndex(index + 1);
    }
  };

  const handlePrevious = () => {
    saveCurrentStepData();
    setIsSubmitted(false);
    setIndex(index - 1);
  };

  const handleTabPress = i => {
    const currentRef = steps[index].ref;
    if (currentRef.current?.validate && !currentRef.current.validate()) return;

    saveCurrentStepData();
    setIsSubmitted(false);
    setIndex(i);
  };

  // Enhanced function to get current step data with better upload handling
  const getCurrentStepData = () => {
    console.log('Getting data for step:', index, 'businessData:', businessData);

    switch (index) {
      case 0: // Basic step
        return {
          companyName: businessData.companyName || '',
          yourDesignation: businessData.yourDesignation || '',
          phone: businessData.phone || '',
          email: businessData.email || '',
          description: businessData.description || '',
          industry: businessData.industry || '',
          services: businessData.services || '',
          DOJ: businessData.DOJ || businessData.date_of_joining || '',
          foundedYear: businessData.foundedYear || '',
          gstNumber: businessData.gstNumber || '',
        };
      case 1: // Address step
        return {
          street: businessData.street || '',
          street2: businessData.street2 || '',
          city: businessData.city || '',
          zip: businessData.zip || '',
          pinCode: businessData.zip || '',
          state_id: businessData.state_id || '',
          state: businessData.state_id || '',
          country_id: businessData.country_id || '',
          country: businessData.country_id || '',
          area: businessData.area || '',
        };
      case 2: // Upload step
        const uploadData = {
          website: businessData.website || '',
          promo_video: businessData.promo_video || null,
          promoVideo: businessData.promo_video || null,
          business_card_front: businessData.business_card_front || null,
          businessCardFront: businessData.business_card_front || null,
          business_card_back: businessData.business_card_back || null,
          businessCardBack: businessData.business_card_back || null,
          logo: businessData.logo || null,
        };
        console.log('Returning upload data to component:', uploadData);
        return uploadData;
      case 3: // Social step
        return {
          instagram: businessData.social_insta || '',
          linkedin: businessData.social_linkedin || '',
          twitter: businessData.social_twitter || '',
          facebook: businessData.social_fb || '',
          youtube: businessData.social_youtube || '',
          business: businessData.social_google_business || '',
        };
      default:
        return {};
    }
  };

  const StepComponent = steps[index].Component;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.secondary}
        translucent={false}
      />
      <View style={styles.safeArea}>
        {/* Status Bar Spacer */}
        <View style={{ height: insets.top, backgroundColor: colors.secondary }} />
        
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}>
          
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

          {/* Tab Navigation with Back Button */}
          <View style={styles.tabsContainer}>
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {/* Stepper Tabs */}
            <View style={styles.tabs}>
            {steps.map((step, i) => (
              <TouchableOpacity
                key={step.key}
                onPress={() => handleTabPress(i)}
                style={[styles.tab, index === i && styles.activeTab]}>
                <View
                  style={[
                    styles.stepNumber,
                    index === i && styles.activeStepNumber,
                    i < index && styles.completedStepNumber,
                  ]}>
                  <Text
                    style={[
                      styles.stepNumberText,
                      index === i && styles.activeStepNumberText,
                      i < index && styles.completedStepNumberText,
                    ]}>
                    {i + 1}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.tabText,
                    index === i && styles.activeTabText,
                    i < index && styles.completedTabText,
                  ]}>
                  {step.label}
                </Text>

                {index === i && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            ))}
            </View>
          </View>

          {/* Step Content */}
          <Animated.ScrollView 
            style={styles.stepContainer}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            {...panResponder.panHandlers}>
            <StepComponent
              ref={steps[index].ref}
              initialData={getCurrentStepData()}
              onDataChange={
                index === 2
                  ? data => {
                      console.log('Upload component data changed:', data);
                    }
                  : undefined
              }
            />
          </Animated.ScrollView>
        </KeyboardAvoidingView>

        {/* Navigation Buttons - Outside KeyboardAvoidingView */}
        <View style={[
          styles.navButtons, 
          { 
            paddingBottom: keyboardVisible 
              ? 12 // Minimal padding when keyboard is visible
              : Math.max(insets.bottom + 10, 20) // Normal safe area padding when keyboard is hidden
          }
        ]}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, index === 0 && styles.disabledButton]}
            disabled={index === 0}
            onPress={handlePrevious}>
            <Text style={[styles.buttonText, styles.secondaryButtonText, index === 0 && styles.disabledButtonText]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={handleNext}>
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              {isLastStep ? 'Create Business' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CreateBusiness;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  progressContainer: {
    height: 6,
    width: '100%',
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 10,
    paddingLeft: 4,
    paddingRight: 8,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: 14,
    color: colors.text_color_1,
    fontWeight: '600',
    opacity: 0.9,
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 60,
    position: 'relative',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: colors.gold + '20', // 20% opacity
    transform: [{scale: 1.02}],
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeStepNumber: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
    elevation: 4,
    shadowColor: colors.gold,
    shadowOpacity: 0.3,
  },
  completedStepNumber: {
    backgroundColor: colors.status_green,
    borderColor: colors.status_green,
    elevation: 3,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text_color_2,
  },
  activeStepNumberText: {
    color: colors.text_color_1,
    fontSize: 13,
  },
  completedStepNumberText: {
    color: colors.text_color_1,
    fontSize: 12,
  },
  tabText: {
    fontSize: 10,
    color: colors.text_color_2,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 2,
  },
  activeTabText: {
    color: colors.gold,
    fontWeight: 'bold',
    fontSize: 11,
  },
  completedTabText: {
    color: colors.status_green,
    fontWeight: '600',
    fontSize: 10,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 2,
    elevation: 2,
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // Space for navigation buttons
    backgroundColor: colors.background,
  },
  navButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: colors.gold,
    elevation: 4,
    shadowColor: colors.gold,
    shadowOpacity: 0.3,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledButton: {
    backgroundColor: colors.border,
    borderColor: colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  primaryButtonText: {
    color: colors.primary,
  },
  secondaryButtonText: {
    color: colors.text_color_1,
  },
  disabledButtonText: {
    color: colors.text_color_2,
  },
});