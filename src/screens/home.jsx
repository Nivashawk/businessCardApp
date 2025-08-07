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
// Add NFC card image - you'll need to add this image to your assets
import NFCImage from '../../assets/serviceCard/event.png'; // Create this image
import {useNavigation} from '@react-navigation/native';
import ImageCropper from '../components/imageCropper';
import {useDispatch, useSelector} from 'react-redux';
import {getHome} from '../redux/slices/user/homeSlices';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

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
  const [partnerIdInitialized, setPartnerIdInitialized] = useState(false);

  const homeData =
    useSelector(state => state?.homeData?.data?.result?.data) ?? {};

  const homeLoading = useSelector(state => state?.homeData?.loading);
  
  // Get partner_id from Redux store (assuming it's stored in user or auth slice)
  // Adjust the path according to your Redux store structure
  const partnerIdFromRedux = useSelector(state => state?.login?.data?.result?.partner_id || state?.register.data?.result?.partner_id);
  console.log('partnerIdFromRedux', partnerIdFromRedux);
  

  // Function to save partner_id to AsyncStorage
  const savePartnerIdToStorage = useCallback(async (partnerId) => {
    try {
      await AsyncStorage.setItem('partner_id', partnerId.toString());
      console.log('Partner ID saved to AsyncStorage:', partnerId);
    } catch (error) {
      console.error('Error saving partner_id to AsyncStorage:', error);
    }
  }, []);

  // Function to get partner_id from AsyncStorage
  const getPartnerIdFromStorage = useCallback(async () => {
    try {
      const partnerId = await AsyncStorage.getItem('partner_id');
      if (partnerId) {
        setPartnerIdFromAsync(parseInt(partnerId));
        return parseInt(partnerId);
      }
      return null;
    } catch (error) {
      console.error('Error getting partner_id from AsyncStorage:', error);
      setPartnerIdFromAsync(null);
      return null;
    }
  }, []);

  // Initialize partner_id: prioritize Redux, then AsyncStorage
  const initializePartnerId = useCallback(async () => {
    try {
      let finalPartnerId = null;

      // First priority: Redux store (for initial login/register)
      if (partnerIdFromRedux) {
        finalPartnerId = partnerIdFromRedux;
        console.log('Using partner_id from Redux:', finalPartnerId);
        
        // Save to AsyncStorage for future use
        await savePartnerIdToStorage(finalPartnerId);
        setPartnerIdFromAsync(finalPartnerId);
      } else {
        // Second priority: AsyncStorage (for subsequent uses)
        const storedPartnerId = await getPartnerIdFromStorage();
        if (storedPartnerId) {
          finalPartnerId = storedPartnerId;
          console.log('Using partner_id from AsyncStorage:', finalPartnerId);
        }
      }

      setPartnerIdInitialized(true);
      return finalPartnerId;
    } catch (error) {
      console.error('Error initializing partner_id:', error);
      setPartnerIdInitialized(true);
      return null;
    }
  }, [partnerIdFromRedux, getPartnerIdFromStorage, savePartnerIdToStorage]);

  // Initialize partner_id on component mount
  useEffect(() => {
    initializePartnerId();
  }, [initializePartnerId]);

  // Update AsyncStorage when Redux partner_id changes (on new login)
  useEffect(() => {
    if (partnerIdFromRedux && partnerIdFromRedux !== partnerIdFromAsync) {
      console.log('Redux partner_id changed, updating AsyncStorage');
      savePartnerIdToStorage(partnerIdFromRedux);
      setPartnerIdFromAsync(partnerIdFromRedux);
    }
  }, [partnerIdFromRedux, partnerIdFromAsync, savePartnerIdToStorage]);

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

  // Get the current partner_id (prioritize Redux, fallback to AsyncStorage)
  const getCurrentPartnerId = useCallback(() => {
    // First priority: Redux store
    if (partnerIdFromRedux) {
      return partnerIdFromRedux;
    }
    
    // Second priority: AsyncStorage
    if (partnerIdFromAsync) {
      return partnerIdFromAsync;
    }
    
    return null;
  }, [partnerIdFromRedux, partnerIdFromAsync]);

  // Function to fetch home data
  const fetchHomeData = useCallback(() => {
    const partner_id = getCurrentPartnerId();
    
    if (partner_id) {
      console.log('Fetching home data with partner_id:', partner_id);
      dispatch(getHome({partner_id}));
    } else {
      console.log('No partner_id available for fetching home data');
    }
  }, [dispatch, getCurrentPartnerId]);

  // Fetch data on screen focus - only when partner_id is available and initialized
  useFocusEffect(
    useCallback(() => {
      if (partnerIdInitialized && getCurrentPartnerId()) {
        fetchHomeData();
      }
    }, [fetchHomeData, partnerIdInitialized, getCurrentPartnerId]),
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

  // Premium section header component
  const SectionHeader = ({title, subtitle, icon}) => (
    <View style={styles.sectionHeaderContainer}>
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'transparent']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.sectionHeaderGradient}
      />
      <View style={styles.sectionHeaderContent}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
        {icon && <View style={styles.sectionIcon}>{icon}</View>}
      </View>
      <View style={styles.sectionDivider} />
    </View>
  );

  return (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.gold}
          colors={[colors.gold, colors.accent]}
          progressBackgroundColor={colors.surface}
        />
      }
    >
      {/* Hero Section - Card Stack */}
      <View style={styles.heroSection}>
        <GestureHandlerRootView style={styles.cardStackContainer}>
          <CardStack cardData={homeData} />
        </GestureHandlerRootView>
      </View>

      {/* Services Section - Updated with NFC Card */}
      <View style={styles.contentSection}>
        <SectionHeader 
          title="Services" 
          subtitle="Manage your business tools & products"
        />
        
        <View style={styles.servicesGrid}>
          <View style={styles.serviceRow}>
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
          
          {/* Second row with NFC Card */}
          <View style={[styles.serviceRow, styles.nfcCardRow]}>
            <ServiceCard
              title={'NFC Business Card'}
              subtitle={'Coming Soon'}
              image={NFCImage}
              onPress={() => {
                navigation.navigate('NFCCardPage');
              }}
              style={styles.nfcCard}
              isNew={true}
            />
          </View>
        </View>
      </View>

      {/* Events Section */}
      <View style={styles.contentSection}>
        <SectionHeader 
          title="Upcoming Events" 
          subtitle={hasEvents ? `${homeData?.events?.length} events found` : "Stay tuned for updates"}
        />
        
        <View style={styles.eventsContainer}>
          {hasEvents ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsScrollContent}
              style={styles.eventsScroll}
              decelerationRate="normal"
              pagingEnabled={false}
              scrollEventThrottle={16}
              bounces={true}
              bouncesZoom={false}
            >
              {homeData?.events.map((card, index) => (
                <View key={card.id || index} style={styles.eventCardContainer}>
                  <DescriptiveCard
                    title={card.name}
                    date={card.event_date}
                    description={card.description}
                    onPress={() => handlePress(card.id)}
                    priority={index === 0 ? 'high' : index === 1 ? 'medium' : 'normal'}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyEventsContainer}>
              <LinearGradient
                colors={['rgba(146, 141, 171, 0.1)', 'rgba(146, 141, 171, 0.05)']}
                style={styles.emptyEventsGradient}
              >
                <View style={styles.emptyEventsIcon}>
                  <Text style={styles.emptyEventsIconText}>📅</Text>
                </View>
                <Text style={styles.emptyEventsTitle}>No Events Scheduled</Text>
                <Text style={styles.emptyEventsSubtitle}>
                  Check back later for upcoming events and announcements
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </View>

      {/* Bottom spacing for better scroll experience */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    height: Platform.OS === 'ios' ? height * 0.4 : height * 0.4,
    marginBottom: 25,
  },
  cardStackContainer: {
    flex: 1,
  },
  contentSection: {
    marginBottom: 32,
  },
  sectionHeaderContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  sectionHeaderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(42, 42, 42, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text_color_1,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionSubtitle: {
    ...typography.body2,
    fontSize: 13,
    color: colors.text_color_2,
    marginTop: 4,
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  sectionDivider: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  servicesGrid: {
    paddingHorizontal: 16,
    gap: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  nfcCardRow: {
    justifyContent: 'center',
  },
  nfcCard: {
    flex: 1,
    maxWidth: width * 0.7,
    // borderWidth: 2,
    // borderColor: colors.gold,
    // shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  eventsContainer: {
    minHeight: 220,
  },
  eventsScroll: {
    flexGrow: 0,
  },
  eventsScrollContent: {
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'flex-start',
  },
  eventCardContainer: {
    marginRight: 34,
    width: width * 0.85, // Slightly smaller for better fit
  },
  emptyEventsContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyEventsGradient: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(146, 141, 171, 0.2)',
  },
  emptyEventsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(146, 141, 171, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(146, 141, 171, 0.2)',
  },
  emptyEventsIconText: {
    fontSize: 24,
  },
  emptyEventsTitle: {
    ...typography.headline,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyEventsSubtitle: {
    ...typography.body2,
    fontSize: 14,
    color: colors.text_color_2,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
    maxWidth: 280,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default Home;