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
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getBusiness} from '../../redux/slices/business/getBusinessSlices';
import PhoneIcon from '../../../assets/phone2.svg';
import MailIcon from '../../../assets/mail2.svg';
import WebsiteIcon from '../../../assets/website2.svg';
import Facebook from '../../../assets/socialIcons/facebook.svg';
import Instagram from '../../../assets/socialIcons/instagram.svg';
import LinkedIn from '../../../assets/socialIcons/linkedIn.svg';
import Telegram from '../../../assets/socialIcons/telegram.svg';
import Whatsapp from '../../../assets/whatsapp2.svg';

const {width} = Dimensions.get('window');

const BusinessDetails = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Business Details');
  const route = useRoute();
  const {data} = route.params;
  const id = data.id;
  const BusinessData = useSelector(
    state => state.getBusinessData?.data?.result?.data ?? [],
  );

  useEffect(() => {
    dispatch(getBusiness({id}));
  }, []);

  const handleEditBusiness = () => {
    // Navigate to edit screen or show edit modal
    console.log('Edit business pressed');
    // You can add navigation here like:
    navigation.navigate('UpdateBusiness', {businessData: BusinessData});
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
        <BusinessDetailsTab handleEditBusiness={handleEditBusiness} />
      ) : (
        <BusinessCard />
      )}

      {/* Option 2: Floating Action Button - Uncomment to use */}
      {/* 
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handleEditBusiness}
        activeOpacity={0.7}>
        <Text style={styles.fabButtonText}>✏️</Text>
      </TouchableOpacity>
      */}
    </SafeAreaView>
  );
};

const BusinessDetailsTab = ({handleEditBusiness}) => {
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
          url = `https://youtube.com/${value}`;
        } else {
          url = `https://youtube.com/c/${value}`;
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
      {/* Header Section with Edit Button - Option 1 */}
      <View style={styles.headerSection}>
        <View style={styles.businessLogo}>
          <Text style={styles.logoText}>
            {BusinessData?.name?.charAt(0) || 'B'}
          </Text>
        </View>

        <View style={styles.businessNameContainer}>
          <Text style={styles.businessName}>
            {BusinessData?.name || 'Business Name'}
          </Text>
          <TouchableOpacity
            style={styles.headerEditButton}
            onPress={handleEditBusiness}
            activeOpacity={0.7}>
            <Text style={styles.headerEditButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.businessDescription}>
          {BusinessData?.public_summary || 'No description available'}
        </Text>

        {/* Quick Contact Actions - Option 3 Alternative */}
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

          {/* Option 3: Edit Button in Quick Actions - Uncomment to use instead of Option 1 */}
          {/*           
          <TouchableOpacity 
            style={[styles.quickContactButton, styles.editQuickButton]}
            onPress={handleEditBusiness}
            activeOpacity={0.7}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
          */}
        </View>
      </View>

      {/* Business Info Cards */}
      <View style={styles.infoCardsContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoCardLabel}>Industry</Text>
          <Text style={styles.infoCardValue}>
            {BusinessData?.industry || 'Not specified'}
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

  const isValidUrl = url => {
    if (!url) return false;

    // Check if it's a valid URL format
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return (
      urlPattern.test(url) ||
      url.includes('youtube.com') ||
      url.includes('youtu.be')
    );
  };

  const handlePlayVideo = async () => {
    const videoUrl = BusinessData?.promo_video;

    if (!videoUrl) {
      Alert.alert('Error', 'No video URL available');
      return;
    }

    if (!isValidUrl(videoUrl)) {
      Alert.alert('Error', 'Invalid video URL format');
      return;
    }

    try {
      await Linking.openURL(videoUrl);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to open video. Please check if you have YouTube app installed or try opening in browser.',
      );
      console.error('Error opening video:', error);
    }
  };

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
          <Text style={styles.videoLink}>{BusinessData?.promo_video}</Text>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayVideo}>
            <Text style={styles.playButtonText}>▶ Play Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
  // Option 1: Header section edit button styles
  businessNameContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerEditButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerEditButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  // Option 2: Floating Action Button styles
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  // Option 3: Quick action edit button styles
  editQuickButton: {
    backgroundColor: '#f59e0b', // Different color to distinguish from other actions
  },
  editIcon: {
    fontSize: 18,
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
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
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
    fontSize: 18,
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
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // Business Card Styles
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  businessCardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
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
    alignItems: 'center',
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
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  image: {
    // marginTop: 15,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default BusinessDetails;
