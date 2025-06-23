import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {useDispatch, useSelector} from 'react-redux';
import {getBusiness} from '../../redux/slices/business/getBusinessSlices';
import { saveBusiness } from '../../redux/slices/business/saveBusinessSlices';
import PhoneIcon from '../../../assets/phone2.svg';
import MailIcon from '../../../assets/mail2.svg';
import WebsiteIcon from '../../../assets/website2.svg';
import Facebook from '../../../assets/socialIcons/facebook.svg';
import Instagram from '../../../assets/socialIcons/instagram.svg';
import LinkedIn from '../../../assets/socialIcons/linkedIn.svg';
import Telegram from '../../../assets/socialIcons/telegram.svg';
import Whatsapp from '../../../assets/whatsapp2.svg';
import { useNavigation } from '@react-navigation/native';

const {width} = Dimensions.get('window');

// Save Contact Modal Component
const SaveContactModal = ({visible, onClose, businessData, paramData, dispatch}) => {
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation();

  const handleSaveContact = async () => {
    try {
      setIsSaving(true);
      console.log("Saving contact with params:", paramData);

      // Ensure all required parameters are present
      if (!paramData.businessId) {
        Alert.alert('Error', 'Business ID is missing. Cannot save contact.');
        return;
      }

      // Dispatch the save business action with proper parameters
      const saveParams = {
        sharedBy: paramData.sharedBy || null,
        businessId: paramData.businessId,
        eventId: paramData.eventId || null
      };

      console.log("Dispatching saveBusiness with params:", saveParams);
      
      const result = await dispatch(saveBusiness(saveParams));
      
      // Check if the action was successful
      if (result.type.endsWith('/fulfilled')) {
        Alert.alert('Success', 'Business contact saved successfully!');
        onClose();
      } else {
        throw new Error('Save business action failed');
      }

    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'Failed to save contact. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
    navigation.goBack();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.header}>
            <View style={modalStyles.businessLogo}>
              <Text style={modalStyles.logoText}>
                {businessData?.name?.charAt(0) || 'B'}
              </Text>
            </View>
            <Text style={modalStyles.businessName}>
              {businessData?.name || 'Business Name'}
            </Text>
          </View>

          <View style={modalStyles.content}>
            <Text style={modalStyles.questionText}>
              Do you want to save this business to your contacts?
            </Text>
            <Text style={modalStyles.subText}>
              This will add the business contact information to your thumb's contact list.
            </Text>
          </View>

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.skipButton]}
              onPress={handleSkip}
              activeOpacity={0.7}
              disabled={isSaving}>
              <Text style={modalStyles.skipButtonText}>No, Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                modalStyles.button, 
                modalStyles.saveButton,
                isSaving && modalStyles.disabledButton
              ]}
              onPress={handleSaveContact}
              activeOpacity={0.7}
              disabled={isSaving}>
              <Text style={modalStyles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Yes, Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const BusinessDetails2 = ({}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Business Details');
  const [showSaveContactModal, setShowSaveContactModal] = useState(false);
  const route = useRoute();

  const [businessId, setBusinessId] = useState(null);
  const [sharedBy, setSharedBy] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [shouldShowModal, setShouldShowModal] = useState(true);

  // Get business data from Redux store
  const BusinessData = useSelector(
    state => state.getBusinessData?.data?.result?.data ?? null,
  );

  // Get loading state to know when data is fetched
  const isLoading = useSelector(
    state => state.getBusinessData?.loading ?? false,
  );

  // Get save business state for debugging
  const saveBusinessState = useSelector(
    state => state.saveBusinessData ?? {},
  );

  const parseParams = (url) => {
    const queryString = url.split('?')[1];
    const params = {};
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value || '');
      });
    }
    return params;
  };

  useEffect(() => {
    console.log("Route params received:", route.params);
    
    // Check if params are directly available (deep linking)
    if (route.params?.business_id) {
      console.log("Using direct params from deep link");
      setBusinessId(route.params.business_id);
      setSharedBy(route.params.shared_by || null);
      setEventId(route.params.event_id || null);
      setShouldShowModal(route.params.type !== '1');
    }
    // Check if params are inside a 'data' property (internal navigation)
    else if (route.params?.data) {
      console.log("Parsing params from data property");
      const params = parseParams(route.params.data);
      console.log("Parsed params:", params);
      setBusinessId(params.business_id);
      setSharedBy(params.shared_by || null);
      setEventId(params.event_id || null);
      setShouldShowModal(params.type !== '1');
    }
    // Handle other possible parameter structures
    else if (route.params) {
      console.log("Checking alternative parameter structures");
      // Sometimes deep link params might come in different formats
      const params = route.params;
      if (params.businessId || params.id) {
        setBusinessId(params.businessId || params.id);
        setSharedBy(params.sharedBy || params.shared_by || null);
        setEventId(params.eventId || params.event_id || null);
        setShouldShowModal(params.type !== '1');
      }
    }
  }, [route.params]);

  // Dispatch only when businessId is available
  useEffect(() => {
    console.log("Business ID changed:", businessId);
    console.log("Shared By:", sharedBy);

    if (businessId) {
      console.log("Fetching business data...");
      dispatch(getBusiness({id: businessId, sharedBy: sharedBy}));
    }
  }, [businessId, sharedBy, dispatch]);

  // Show modal when business data is successfully loaded AND shouldShowModal is true
  useEffect(() => {
    if (BusinessData && !isLoading && businessId && shouldShowModal) {
      console.log("Business data loaded, showing modal");
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowSaveContactModal(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [BusinessData, isLoading, businessId, shouldShowModal]);

  // Debug effect to log save business state changes
  useEffect(() => {
    console.log("Save business state:", saveBusinessState);
  }, [saveBusinessState]);

  const handleModalClose = () => {
    setShowSaveContactModal(false);
  };

  // Create param data object with proper validation
  const createParamData = () => {
    return {
      businessId: businessId,
      sharedBy: sharedBy,
      eventId: eventId
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      {/* Header without Edit Button */}
      <View style={styles.headerContainer}>
        <View style={styles.tabContainer}>
          {['Business Details', 'Business Card'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                console.log('Tab pressed:', tab);
                setActiveTab(tab);
              }}
              style={[
                styles.simpleTab,
                activeTab === tab && styles.activeSimpleTab,
              ]}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.simpleTabText,
                  activeTab === tab && styles.activeSimpleTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'Business Details' ? (
        <BusinessDetailsTab />
      ) : (
        <BusinessCard />
      )}

      {/* Save Contact Modal - Only render if shouldShowModal is true */}
      {shouldShowModal && (
        <SaveContactModal
          visible={showSaveContactModal}
          onClose={handleModalClose}
          businessData={BusinessData}
          paramData={createParamData()}
          dispatch={dispatch}
        />
      )}
    </SafeAreaView>
  );
};

const BusinessDetailsTab = () => {
  const BusinessData = useSelector(
    state => state.getBusinessData?.data?.result?.data ?? null,
  );

  const handleContactPress = (type, value) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'website':
        Linking.openURL(value);
        break;
    }
  };

  const handleSocialPress = (platform, value) => {
    // Check if the value is already a full URL
    const isFullUrl =
      value.startsWith('http://') || value.startsWith('https://');

    if (isFullUrl) {
      // If it's already a full URL, use it directly
      Linking.openURL(value);
      return;
    }

    // If it's not a full URL, construct the URL based on platform
    let url = '';
    switch (platform) {
      case 'instagram':
        // Handle both @username and username formats
        const instaHandle = value.startsWith('@') ? value.substring(1) : value;
        url = `https://instagram.com/${instaHandle}`;
        break;
      case 'facebook':
        url = `https://facebook.com/${value}`;
        break;
      case 'linkedin':
        url = `https://linkedin.com/in/${value}`;
        break;
      case 'twitter':
        // Handle both @username and username formats
        const twitterHandle = value.startsWith('@')
          ? value.substring(1)
          : value;
        url = `https://twitter.com/${twitterHandle}`;
        break;
      case 'youtube':
        // Handle different YouTube URL formats
        if (
          value.includes('channel/') ||
          value.includes('c/') ||
          value.includes('user/')
        ) {
          url = `https://www.youtube.com/${value}`;
        } else {
          url = `https://www.youtube.com/results?search_query=${value}`;
        }
        break;
      case 'google_business':
        url = value;
        break;
      default:
        url = value;
    }
    Linking.openURL(url);
  };

  // Function to get available social media platforms
  const getAvailableSocialMedia = () => {
    const socialMedia = [];

    if (BusinessData?.social_insta && BusinessData.social_insta.trim() !== '') {
      socialMedia.push({
        platform: 'instagram',
        value: BusinessData.social_insta,
        icon: Instagram,
      });
    }

    if (BusinessData?.social_fb && BusinessData.social_fb.trim() !== '') {
      socialMedia.push({
        platform: 'facebook',
        value: BusinessData.social_fb,
        icon: Facebook,
      });
    }

    if (
      BusinessData?.social_linkedin &&
      BusinessData.social_linkedin.trim() !== ''
    ) {
      socialMedia.push({
        platform: 'linkedin',
        value: BusinessData.social_linkedin,
        icon: LinkedIn,
      });
    }

    if (
      BusinessData?.social_twitter &&
      BusinessData.social_twitter.trim() !== ''
    ) {
      socialMedia.push({
        platform: 'twitter',
        value: BusinessData.social_twitter,
        icon: Telegram, // Using Telegram icon for Twitter as per your imports
      });
    }

    if (
      BusinessData?.social_youtube &&
      BusinessData.social_youtube.trim() !== ''
    ) {
      socialMedia.push({
        platform: 'youtube',
        value: BusinessData.social_youtube,
        icon: Telegram, // You might want to add a YouTube icon
      });
    }

    if (
      BusinessData?.social_google_business &&
      BusinessData.social_google_business.trim() !== ''
    ) {
      socialMedia.push({
        platform: 'google_business',
        value: BusinessData.social_google_business,
        icon: Telegram, // You might want to add a Google Business icon
      });
    }

    return socialMedia;
  };

  if (!BusinessData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading business details...</Text>
      </View>
    );
  }

  const availableSocialMedia = getAvailableSocialMedia();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.businessLogo}>
          <Text style={styles.logoText}>
            {BusinessData?.name?.charAt(0) || 'B'}
          </Text>
        </View>

        <Text style={styles.businessName}>
          {BusinessData?.name || 'Business Name'}
        </Text>

        <Text style={styles.businessDescription}>
          {BusinessData?.public_summary || 'No description available'}
        </Text>

        {/* Quick Contact Actions */}
        <View style={styles.quickContactContainer}>
          {BusinessData?.business_mobile && (
            <TouchableOpacity
              style={styles.quickContactButton}
              onPress={() =>
                handleContactPress('phone', BusinessData?.business_mobile)
              }>
              <PhoneIcon width={18} height={18} fill={'#ffffff'} />
            </TouchableOpacity>
          )}
          {BusinessData?.business_email && (
            <TouchableOpacity
              style={styles.quickContactButton}
              onPress={() =>
                handleContactPress('email', BusinessData?.business_email)
              }>
              <MailIcon width={18} height={18} />
            </TouchableOpacity>
          )}
          {BusinessData?.website && BusinessData.website.trim() !== '' && (
            <TouchableOpacity
              style={styles.quickContactButton}
              onPress={() =>
                handleContactPress('website', BusinessData?.website)
              }>
              <WebsiteIcon width={18} height={18} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.quickContactButton}>
            <Whatsapp width={18} height={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Business Info Cards */}
      <View style={styles.infoCardsContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoCardLabel}>Industry</Text>
          <Text style={styles.infoCardValue}>
            {BusinessData?.business_industry_name || 'Not specified'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardLabel}>Services</Text>
          <Text style={styles.infoCardValue}>
            {BusinessData?.services_products || 'General Services'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardLabel}>Founded</Text>
          <Text style={styles.infoCardValue}>
            {BusinessData?.founded_year || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
          <Text style={styles.addressText}>
            {BusinessData?.street ||
              BusinessData?.city ||
              'Address not available'}
          </Text>
        </View>
      </View>

      {/* Business Registration */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Registration Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Business ID</Text>
          <Text style={styles.detailValue}>
            {BusinessData?.id || 'Not available'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={styles.detailValue}>
            {BusinessData?.active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      {/* Leadership Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Leadership</Text>
        <View style={styles.founderCard}>
          <View style={styles.founderAvatar}>
            <Text style={styles.founderInitial}>
              {BusinessData?.partner_name?.charAt(0) || 'F'}
            </Text>
          </View>
          <View style={styles.founderInfo}>
            <Text style={styles.founderName}>
              {BusinessData?.partner_name || 'Partner Name'}
            </Text>
            <Text style={styles.founderDesignation}>
              {BusinessData?.designation || 'Position'}
            </Text>
          </View>
        </View>
      </View>

      {/* Social Media Section - Only show if there are social media accounts */}
      {availableSocialMedia.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialMediaContainer}>
            {availableSocialMedia.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.socialButton}
                  onPress={() =>
                    handleSocialPress(social.platform, social.value)
                  }>
                  <IconComponent width={20} height={20} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const BusinessCard = () => {
  const BusinessData = useSelector(
    state => state.getBusinessData?.data?.result?.data ?? null,
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Business Logo</Text>
        <View style={styles.businessCardAvatar}>
         <Image
            source={{
              uri: `data:image/jpeg;base64,${BusinessData?.logo}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Business Cards</Text>
        <View style={styles.businessCardImage}>
          <Image
            source={{
              uri: `data:image/jpeg;base64,${BusinessData?.business_card_front}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* <Text style={styles.cardPlaceholderText}>Front Card Design</Text> */}
        </View>
        <View style={styles.businessCardImage}>
          <Image
            source={{
              uri: `data:image/jpeg;base64,${BusinessData?.business_card_back}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Promotional Video</Text>
        <View style={styles.videoContainer}>
          <Text style={styles.videoLabel}>Company Introduction</Text>
          <Text style={styles.videoLink}>
            https://www.youtube.com/watch?v=YOUR_VIDEO_ID
          </Text>
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>▶ Play Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Modal Styles
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 340,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  businessLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  businessName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  content: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  saveButton: {
    backgroundColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    elevation: 0,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Updated header container without edit button
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabContainer: {
    flexDirection: 'row',
  },
  simpleTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeSimpleTab: {
    backgroundColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  simpleTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeSimpleTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollContent: {
    marginTop: 10,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  headerSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  businessLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  quickContactContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  quickContactButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  mapContainer: {
    height: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  founderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  founderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  founderInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  founderDesignation: {
    fontSize: 14,
    color: '#6b7280',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  // Business Card Tab Styles
  cardSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  businessCardAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  businessCardImage: {
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  videoContainer: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  videoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  videoLink: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  playButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default BusinessDetails2;