import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView, // <-- Make sure ScrollView is imported
  Platform,
  RefreshControl, // <-- Import RefreshControl
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import CardStack from '../components/cards/cardStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import ServiceCard from '../components/cards/serviceCard';
import DescriptiveCard from '../components/cards/descriptiveCard';
import ReferralImage from '../../assets/serviceCard/referral.png';
import EventImage from '../../assets/serviceCard/event.png';
import ShareImage from '../../assets/serviceCard/share.png';
import {useNavigation} from '@react-navigation/native';
import ImageCropper from '../components/imageCropper';
import {useDispatch, useSelector} from 'react-redux';
import {getHome} from '../redux/slices/user/homeSlices';
// import {purpose} from '../redux/slices/auth/sendOTPSlices'; // `purpose` is already destructured from VerifyState
import {useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

// These handlers are not used in the component, can be removed or used if needed.
const handleReferral = () => {
  console.log('clicked referral');
};

const handleEvent = () => {
  console.log('clicked Event');
};

const handleShare = () => {
  console.log('clicked share');
};

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isHomeData, setIsHomeData] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // <-- New state for pull-to-refresh

  const VerifyState = useSelector(state => state.OTPData);
  const {purpose} = VerifyState; // Destructure purpose from VerifyState

  const partner_id_from_login = useSelector(
    state => state.login?.data?.result?.partner_id,
  );

  const partner_id_from_register = useSelector(
    state => state.register?.data?.result?.partner_id,
  );

  console.log('partner_id', partner_id_from_login, partner_id_from_register);

  const homeData =
    useSelector(state => state?.homeData?.data?.result?.data) ?? {};

  const homeLoading = useSelector(state => state?.homeData?.loading); // <-- Get loading state from Redux

  // Memoized computation to check if business profiles exist and have data
  const hasBusinessProfiles = useMemo(() => {
    return (
      homeData?.business_profiles &&
      Array.isArray(homeData.business_profiles) &&
      homeData.business_profiles.length > 0
    );
  }, [homeData?.business_profiles]);

  // Memoized computation for events
  const hasEvents = useMemo(() => {
    return (
      homeData?.events &&
      Array.isArray(homeData.events) &&
      homeData.events.length > 0
    );
  }, [homeData?.events]);

  // Function to fetch home data
  const fetchHomeData = useCallback(() => {
    if (!purpose) {
      console.log('No purpose found, cannot fetch home data.');
      return;
    }

    const partner_id =
      purpose === 'Login'
        ? partner_id_from_login
        : purpose === 'Register'
        ? partner_id_from_register
        : null;

    if (partner_id) {
      console.log(`Fetching home data for purpose: ${purpose}, partner_id: ${partner_id}`);
      dispatch(getHome({partner_id}));
    } else {
      console.log(`No partner_id found for ${purpose}, cannot fetch home data.`);
    }
  }, [dispatch, purpose, partner_id_from_login, partner_id_from_register]);

  // Fetch data on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, [fetchHomeData]),
  );

  // Stop refreshing indicator when data loading is complete
  useEffect(() => {
    if (!homeLoading && refreshing) {
      setRefreshing(false);
    }
  }, [homeLoading, refreshing]);

  // Logging for homeData updates (your existing logic)
  useEffect(() => {
    if (homeData) {
      console.log('HomeData updated:', homeData);
      console.log('Business profiles:', homeData.business_profiles);
      console.log('Has business profiles:', hasBusinessProfiles);
      setIsHomeData(true);
    }
  }, [homeData, hasBusinessProfiles]);

  const handlePress = id => {
    console.log('Event ID:', id);
    navigation.navigate('UpdateEvents', {id});
    // Do something with the ID
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start showing the refresh indicator
    fetchHomeData(); // Trigger the data fetch
  }, [fetchHomeData]);

  return (
    <ScrollView
      style={{backgroundColor: colors.background}}
      showsVerticalScrollIndicator={false} // Hide main scroll indicator
      refreshControl={ // <-- Add RefreshControl here
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary} // iOS spinner color
          colors={[colors.primary]}   // Android spinner color
        />
      }
    >
      <GestureHandlerRootView style={styles.container}>
        <CardStack cardData={homeData} />
      </GestureHandlerRootView>
      <View style={styles.serviceContainer}>
        <Text style={[typography.heading, {paddingLeft: 10}]}>Services</Text>
        <View style={styles.serviceWrapper}>
          <ServiceCard
            title={'My Referral'}
            image={ReferralImage}
            onPress={() => {
              navigation.navigate('Referral');
            }}
            disabled={!hasBusinessProfiles} // Reactive disable based on business profiles
          />
          {/* You had a commented out ServiceCard for "Create New Event" here.
              If you wish to re-enable it, uncomment and ensure navigation is correct.
          <ServiceCard
            title={'Create New Event'}
            image={EventImage}
            onPress={() => {
              navigation.navigate('CreateEvent');
            }}
          />
          */}
          <ServiceCard
            title={'Share My Business'}
            image={ShareImage}
            onPress={() => {
              navigation.navigate('GenerateQR');
            }}
            disabled={!hasBusinessProfiles} // Reactive disable based on business profiles
          />
        </View>
      </View>
      <View style={styles.eventContainer}>
        <Text style={[typography.heading, {paddingLeft: 10}]}>
          Upcoming Events
        </Text>
        {/* The inner horizontal ScrollView doesn't need RefreshControl itself */}
        <ScrollView
          contentContainerStyle={[
            styles.eventWrapper,
            hasEvents
              ? {paddingBottom: height * 0.09} // Adjusted if events exist
              : {paddingTop: height * 0.13},  // Adjusted if no events
          ]}
          // Removed unnecessary style={{...}}
          // The horizontal ScrollView below will handle its own scrolling.
        >
          {hasEvents ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContainer}
              style={styles.horizontalScroll}>
              {homeData?.events.map((card, index) => (
                <View key={card.id || index} style={styles.cardWrapper}> {/* Use card.id for key if available */}
                  <DescriptiveCard
                    title={card.name}
                    date={card.event_date}
                    description={card.description}
                    onPress={() => handlePress(card.id)}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text
              style={[
                typography.description,
                {fontWeight: 600, color: colors.primary, opacity: 0.3},
              ]}>
              NO EVENTS TO DISPLAY
            </Text>
          )}
        </ScrollView>
      </View>
    </ScrollView> // <-- End of main ScrollView
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1, // Removed flex: 1 as the outer ScrollView handles height
    height: Platform.OS == 'ios' ? height * 0.34 : height * 0.38,
    // backgroundColor:colors.background, // Handled by outer ScrollView
    // alignItems:'center' // Not needed if content is full width
  },
  serviceContainer: {
    height: height * 0.17,
    gap: 5,
    // paddingLeft: 10
    // backgroundColor: 'red'
  },
  serviceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  eventContainer: {
    // This container's height needs to be sufficient for its content within the ScrollView.
    // If it's the last element, it might need to push the ScrollView to enable scrolling.
    minHeight: height * 0.45, // Use minHeight to allow content to expand
    // backgroundColor: 'green'
  },
  eventWrapper: {
    // flex:1, // Not necessary here, content container style
    paddingVertical: 10,
    alignItems: 'center',
    // backgroundColor:'red',
    // justifyContent:'center',
    gap: 5,
    // paddingTop: height * 0.13, // This is conditional, handled inline
  },
  horizontalScrollContainer: {
    paddingHorizontal: 10, // Add some padding for horizontal scroll
    gap: 15, // Space between horizontal cards
    alignItems: 'flex-start', // Align items to the top if their heights vary
  },
  horizontalScroll: {
    // Specific styles for the horizontal ScrollView itself
    flexGrow: 0, // Prevent it from taking full vertical height if content is short
  },
  cardWrapper: {
    // Wrapper for each DescriptiveCard in the horizontal list
  }
});

export default Home;