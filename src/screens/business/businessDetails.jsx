import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
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

const BusinessDetails = ({}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Business Details');
  const route = useRoute();
  const {data} = route.params;
  const id = data.id;
  const BusinessData = useSelector(
    state => state.getBusinessData?.data?.result?.data ?? [],
  );

  console.log(BusinessData);

  useEffect(() => {
    console.log('before api');
    dispatch(getBusiness({id}));
    console.log('aftyer api');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
        onPress={() => setActiveTab(tab)}
        style={[styles.tab, activeTab === tab && styles.activeTab]}>
        <Text
          style={[
            typography.description,
            activeTab === tab && styles.activeTabText,
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

  if (!BusinessData) {
    return (
      <View style={styles.content}>
        <Text>Loading business details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[typography.heading, styles.title]}>
        {BusinessData?.name}
      </Text>
      <Text style={[typography.description, styles.description]}>
        {BusinessData?.public_summary || 'N/A'}
      </Text>

      <View style={[styles.socialBg, {width:"35%"}]}>
        <PhoneIcon width={20} height={20} />
        <MailIcon width={20} height={20} />
        <WebsiteIcon width={20} height={20} />
      </View>

      <View style={styles.infoContainer}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={[typography.description, styles.label, {color: 'white'}]}>
            Industry
          </Text>
          <Text
            style={[typography.inputText, styles.infoText, {color: 'white'}]}>
            {BusinessData?.industry || 'N/A'}
          </Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={[typography.description, styles.label, {color: 'white'}]}>
            Services
          </Text>
          <Text
            style={[typography.inputText, styles.infoText, {color: 'white'}]}>
            {BusinessData?.gstNumber || 'N/A'}
          </Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={[typography.description, styles.label, {color: 'white'}]}>
            DOJ
          </Text>
          <Text
            style={[typography.inputText, styles.infoText, {color: 'white'}]}>
            {BusinessData?.gstNumber || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map Placeholder</Text>
      </View>

      <Text style={[typography.description, styles.label]}>GST NUMBER</Text>
      <Text style={[typography.inputText, styles.infoText]}>
        {BusinessData?.gstNumber || 'N/A'}
      </Text>

      <View style={styles.socialBg}>
        <Facebook width={20} height={20} />
        <Instagram width={20} height={20} />
        <LinkedIn width={20} height={20} />
        <Telegram width={20} height={20} />
      </View>

      <Text style={[typography.description, styles.label]}>Founder</Text>
      <Text style={[typography.description, styles.infoText]}>
        {BusinessData?.designation || 'N/A'}
      </Text>
    </ScrollView>
  );
};

const BusinessCard = () => (
  <ScrollView contentContainerStyle={styles.content}>
    <View style={styles.avatar} />
    <View style={styles.cardImage} />
    <View style={styles.cardImage} />
    <Text style={styles.videoLabel}>Video Link</Text>
    <Text style={styles.videoLink}>https://youtube.com/jhghjgjgfhjgdgfhj</Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  actionButton: {
    backgroundColor: '#004d40',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionLabel: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#eee',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapText: {
    color: '#aaa',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoText: {
    marginBottom: 12,
  },
  socialButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  socialButtonText: {
    color: colors.background,
    fontSize: 14,
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
  },
  videoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004d40',
  },
  videoLink: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  socialBg: {
    width: '55%',
    padding: 8,
    borderRadius: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoContainer: {
    width: '85%',
    padding: 8,
    borderRadius: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default BusinessDetails;
