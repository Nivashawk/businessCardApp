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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Business Details' ? (
        <BusinessDetailsTab />
      ) : (
        <BusinessCard />
      )}
    </SafeAreaView>
  );
};

const TabSwitcher = ({activeTab, setActiveTab}) => (
  <View style={styles.tabContainer}>
    {['Business Details', 'Business Card'].map(tab => (
      <TouchableOpacity
        key={tab}
        onPress={() => {
          console.log('Tab pressed:', tab);
          setActiveTab(tab);
        }}
        style={[styles.simpleTab, activeTab === tab && styles.activeSimpleTab]}
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
);

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

  if (!BusinessData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading business details...</Text>
      </View>
    );
  }

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
          <TouchableOpacity 
            style={styles.quickContactButton}
            onPress={() => handleContactPress('phone', BusinessData?.phone)}>
            <PhoneIcon width={18} height={18} fill={"#"}/>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickContactButton}
            onPress={() => handleContactPress('email', BusinessData?.email)}>
            <MailIcon width={18} height={18} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickContactButton}
            onPress={() => handleContactPress('website', BusinessData?.website)}>
            <WebsiteIcon width={18} height={18} />
          </TouchableOpacity>
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
            {BusinessData?.foundedDate || '2020'}
          </Text>
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
          <Text style={styles.addressText}>
            {BusinessData?.address || 'Address not available'}
          </Text>
        </View>
      </View>

      {/* Business Registration */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Registration Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>GST Number</Text>
          <Text style={styles.detailValue}>
            {BusinessData?.gstNumber || 'Not registered'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Business Type</Text>
          <Text style={styles.detailValue}>
            {BusinessData?.businessType || 'Private Limited'}
          </Text>
        </View>
      </View>

      {/* Leadership Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Leadership</Text>
        <View style={styles.founderCard}>
          <View style={styles.founderAvatar}>
            <Text style={styles.founderInitial}>
              {BusinessData?.designation?.charAt(0) || 'F'}
            </Text>
          </View>
          <View style={styles.founderInfo}>
            <Text style={styles.founderName}>
              {BusinessData?.designation || 'Founder Name'}
            </Text>
            <Text style={styles.founderDesignation}>
              {BusinessData?.partner_name || 'Chief Executive Officer'}
            </Text>
          </View>
        </View>
      </View>

      {/* Social Media Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Connect With Us</Text>
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Facebook width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Instagram width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <LinkedIn width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Telegram width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const BusinessCard = () => (
  <ScrollView 
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}>
    
    <View style={styles.cardSection}>
      <Text style={styles.sectionTitle}>Business Avatar</Text>
      <View style={styles.businessCardAvatar}>
        <Text style={styles.avatarText}>BC</Text>
      </View>
    </View>

    <View style={styles.cardSection}>
      <Text style={styles.sectionTitle}>Business Cards</Text>
      <View style={styles.businessCardImage}>
        <Text style={styles.cardPlaceholderText}>Front Card Design</Text>
      </View>
      <View style={styles.businessCardImage}>
        <Text style={styles.cardPlaceholderText}>Back Card Design</Text>
      </View>
    </View>

    <View style={styles.cardSection}>
      <Text style={styles.sectionTitle}>Promotional Video</Text>
      <View style={styles.videoContainer}>
        <Text style={styles.videoLabel}>Company Introduction</Text>
        <Text style={styles.videoLink}>https://youtube.com/company-intro</Text>
        <TouchableOpacity style={styles.playButton}>
          <Text style={styles.playButtonText}>▶ Play Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    shadowOffset: { width: 0, height: 2 },
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
  tabBackground: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    borderRadius: 25,
    padding: 4,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    zIndex: 1,
  },
  activeTab: {
    backgroundColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollContent: {
    marginTop:10,
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BusinessDetails;