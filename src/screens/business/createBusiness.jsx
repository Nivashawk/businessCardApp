import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {createBusiness} from '../../redux/slices/business/createBusinessSlices';
import {updateBusinessSocialData} from '../../redux/slices/business/businessBasic';
import {TabBarStyle} from '../../theme/tabBar';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import Basic from './steps/basic';
import Address from './steps/address';
import Upload from './steps/upload';
import Social from './steps/social';

// const screenWidth = Dimensions.get('window').width;

const {width, height} = Dimensions.get('window');

const CreateBusiness = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessData);
  const [index, setIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('submit status', isSubmitted);
    console.log('businessData', businessData);
    if (isSubmitted) {
      console.log('submit status', isSubmitted);
      if (businessData) {
        console.log('businessData', businessData);
        dispatch(
          createBusiness({
            name:businessData.companyName,
            designation:businessData.designation,
            business_mobile:businessData.phone,
            business_email:businessData.email,
            description:businessData.description,
            industry:businessData.industry,
            services_products:businessData.services,
            date_of_joining:businessData.date_of_joining,
            street:businessData.street,
            street2:businessData.street2,
            city:businessData.city,
            zip:businessData.zip,
            state_id:33,
            country_id:91,
            website:businessData.website,
            promo_video:businessData.promo_video,
            business_card_front:businessData.business_card_front,
            business_card_back:businessData.business_card_back,
            logo:businessData.logo,
            social_insta:businessData.social_insta,
            social_linkedin:businessData.social_linkedin,
            social_twitter:businessData.social_twitter,
            social_fb:businessData.social_fb,
            social_youtube:businessData.social_youtube,
            social_google_business:businessData.social_google_business,
            active:businessData.active,
            is_primary:businessData.is_primary,
            is_public:businessData.is_public,
          }),
        );
        setIsSubmitted(false);
      }
    }
  }, [businessData, isSubmitted]);

  useFocusEffect(
    useCallback(() => {
      // Hide tab bar
      navigation.getParent()?.setOptions({
        tabBarStyle: {display: 'none'},
      });

      return () => {
        // Show tab bar again when navigating back
        navigation.getParent()?.setOptions({
          tabBarStyle: TabBarStyle,
        });
      };
    }, [navigation]),
  );

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
      // Optionally collect data here
    } else {
      setIndex(index + 1);
    }
  };

  const handleTabPress = i => {
    const currentRef = steps[index].ref;
    if (currentRef.current?.validate && !currentRef.current.validate()) return;

    setIndex(i);
  };

  const StepComponent = steps[index].Component;

  return (
    <View style={styles.container}>
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

      {/* Tab Navigation */}
      <View style={styles.tabs}>
        {steps.map((step, i) => (
          <TouchableOpacity
            key={step.key}
            onPress={() => handleTabPress(i)}
            style={styles.tab}>
            <Text style={[styles.tabText, index === i && styles.activeTabText]}>
              {step.label}
            </Text>
            {index === i && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Step Content with Swipe Support */}
      <Animated.View {...panResponder.panHandlers} style={styles.stepContainer}>
        <StepComponent ref={steps[index].ref} />
      </Animated.View>

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          style={[styles.button, index === 0 && styles.disabledButton]}
          disabled={index === 0}
          onPress={() => setIndex(index - 1)}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {isLastStep ? 'Create' : 'Next'}
          </Text>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: colors.primary,
  },
  activeTabIndicator: {
    height: 3,
    width: 30,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 6,
  },
  stepContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  navButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  button: {
    backgroundColor: '#0B5E4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
