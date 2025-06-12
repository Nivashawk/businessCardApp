import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import CardStack from '../components/cards/cardStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

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
  
  // State to store partner_id from AsyncStorage
  const [partnerIdFromAsync, setPartnerIdFromAsync] = useState(null);
  const [isHomeData, setIsHomeData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const homeData =
    useSelector(state => state?.homeData?.data?.result?.data) ?? {};

  const homeLoading = useSelector(state => state?.homeData?.loading);

  // Function to get partner_id from AsyncStorage
  const getPartnerIdFromStorage = useCallback(async () => {
    try {
      const partnerId = await AsyncStorage.getItem('partner_id');
      setPartnerIdFromAsync(parseInt(partnerId));
    } catch (error) {
      console.error('Error getting partner_id from AsyncStorage:', error);
      setPartnerIdFromAsync(null);
    }
  }, []);

  // Load partner_id from AsyncStorage on component mount
  useEffect(() => {
    getPartnerIdFromStorage();
  }, [getPartnerIdFromStorage]);

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

  // Get partner_id from AsyncStorage
  const getPartnerId = useCallback(() => {
    if (partnerIdFromAsync) {
      return partnerIdFromAsync;
    }
    return null;
  }, [partnerIdFromAsync]);

  // Function to fetch home data
  const fetchHomeData = useCallback(() => {
    const partner_id = getPartnerId();
    
    if (partner_id) {
      dispatch(getHome({partner_id}));
    }
  }, [dispatch, getPartnerId]);

  // Fetch data on screen focus - only when AsyncStorage partner_id is available
  useFocusEffect(
    useCallback(() => {
      if (partnerIdFromAsync) {
        fetchHomeData();
      }
    }, [fetchHomeData, partnerIdFromAsync]),
  );

  // Stop refreshing indicator when data loading is complete
  useEffect(() => {
    if (!homeLoading && refreshing) {
      setRefreshing(false);
    }
  }, [homeLoading, refreshing]);

  // Update home data state when data changes
  useEffect(() => {
    if (homeData) {
      setIsHomeData(true);
    }
  }, [homeData]);

  const handlePress = id => {
    navigation.navigate('UpdateEvents', {id});
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHomeData();
  }, [fetchHomeData]);

  return (
    <ScrollView
      style={{backgroundColor: colors.background}}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
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
            disabled={!hasBusinessProfiles}
          />
          <ServiceCard
            title={'Share My Business'}
            image={ShareImage}
            onPress={() => {
              navigation.navigate('GenerateQR');
            }}
            disabled={!hasBusinessProfiles}
          />
        </View>
      </View>
      <View style={styles.eventContainer}>
        <Text style={[typography.heading, {paddingLeft: 10}]}>
          Upcoming Events
        </Text>
        <ScrollView
          contentContainerStyle={[
            styles.eventWrapper,
            hasEvents
              ? {paddingBottom: height * 0.09}
              : {paddingTop: height * 0.13},
          ]}
        >
          {hasEvents ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContainer}
              style={styles.horizontalScroll}>
              {homeData?.events.map((card, index) => (
                <View key={card.id || index} style={styles.cardWrapper}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'ios' ? height * 0.34 : height * 0.38,
  },
  serviceContainer: {
    height: height * 0.17,
    gap: 5,
  },
  serviceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  eventContainer: {
    minHeight: height * 0.45,
  },
  eventWrapper: {
    paddingVertical: 10,
    alignItems: 'center',
    gap: 5,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 10,
    gap: 15,
    alignItems: 'flex-start',
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  cardWrapper: {
    // Wrapper for each DescriptiveCard in the horizontal list
  }
});

export default Home;