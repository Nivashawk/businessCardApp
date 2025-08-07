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

const {width, height} = Dimensions.get('window');

const BusinessDetails = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Business Details');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState('');

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

  const handleImagePress = (imageUri, title) => {
    setSelectedImage(imageUri);
    setSelectedImageTitle(title);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
    setSelectedImageTitle('');
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
        <BusinessDetailsTab
          handleEditBusiness={handleEditBusiness}
          handleImagePress={handleImagePress}
        />
      ) : (
        <BusinessCard handleImagePress={handleImagePress} />
      )}

      {/* Full-Screen Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <StatusBar
            backgroundColor="rgba(0,0,0,0.9)"
            barStyle="light-content"
          />

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeImageModal}
            activeOpacity={0.7}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Image Title */}
          {selectedImageTitle ? (
            <View style={styles.imageTitleContainer}>
              <Text style={styles.imageTitle}>{selectedImageTitle}</Text>
            </View>
          ) : null}

          {/* Full Screen Image */}
          <View style={styles.fullScreenImageContainer}>
            <Image
              source={{uri: selectedImage}}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>

          {/* Tap to close hint */}
          <TouchableOpacity
            style={styles.tapToCloseArea}
            onPress={closeImageModal}
            activeOpacity={1}>
            <Text style={styles.tapToCloseText}>Tap anywhere to close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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

const BusinessDetailsTab = ({handleEditBusiness, handleImagePress}) => {
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
        <TouchableOpacity
          style={styles.businessLogo}
          onPress={() =>
            BusinessData?.logo &&
            handleImagePress(
              `data:image/jpeg;base64,${BusinessData.logo}`,
              'Business Logo',
            )
          }
          activeOpacity={0.8}>
          {BusinessData?.logo ? (
            <Image
              source={{uri: `data:image/jpeg;base64,${BusinessData.logo}`}}
              style={styles.logoImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.logoText}>
              {BusinessData?.name?.charAt(0) || 'B'}
            </Text>
          )}
        </TouchableOpacity>

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
      {/* <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
          <Text style={styles.addressText}>
            {BusinessData?.street ||
              BusinessData?.city ||
              'Address not available'}
          </Text>
        </View>
      </View> */}

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

const BusinessCard = ({handleImagePress}) => {
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
        <TouchableOpacity
          style={styles.businessCardAvatar}
          onPress={() =>
            BusinessData?.logo &&
            handleImagePress(
              `data:image/jpeg;base64,${BusinessData.logo}`,
              'Business Logo',
            )
          }
          activeOpacity={0.8}>
          <Image
            source={{
              uri: `data:image/jpeg;base64,${BusinessData?.logo}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Business Cards</Text>
        <TouchableOpacity
          style={styles.businessCardImage}
          onPress={() =>
            BusinessData?.business_card_front &&
            handleImagePress(
              `data:image/jpeg;base64,${BusinessData.business_card_front}`,
              'Business Card - Front',
            )
          }
          activeOpacity={0.8}>
          <Image
            source={{
              uri: `data:image/jpeg;base64,${BusinessData?.business_card_front}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* <Text style={styles.cardPlaceholderText}>Front Card Design</Text> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.businessCardImage}
          onPress={() =>
            BusinessData?.business_card_back &&
            handleImagePress(
              `data:image/jpeg;base64,${BusinessData.business_card_back}`,
              'Business Card - Back',
            )
          }
          activeOpacity={0.8}>
          <Image
            source={{
              uri: `data:image/jpeg;base64,${BusinessData?.business_card_back}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
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
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  simpleTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeSimpleTabText: {
    color: colors.background,
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
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  businessLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.background,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text_color_1,
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
    color: colors.textSecondary,
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
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text_color_1,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text_color_1,
    marginBottom: 16,
  },
  mapContainer: {
    height: 120,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: colors.accent,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text_color_1,
  },
  founderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  founderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  founderInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
  },
  founderDesignation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSection: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  businessCardAvatar: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  businessCardImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  videoContainer: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  videoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 8,
  },
  videoLink: {
    fontSize: 12,
    color: colors.accent,
    marginBottom: 12,
  },
  playButton: {
    backgroundColor: colors.gold,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default BusinessDetails;
