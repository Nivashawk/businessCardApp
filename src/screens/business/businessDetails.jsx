import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useDispatch, useSelector } from 'react-redux';
import { getBusiness } from '../../redux/slices/business/getBusinessSlices';
import PhoneIcon from '../../../assets/phone.png';
import MailIcon from '../../../assets/mailIcon.png';
import Facebook from '../../../assets/socialIcons/facebook.svg';
import Instagram from '../../../assets/socialIcons/instagram.svg';
import LinkedIn from '../../../assets/socialIcons/linkedIn.svg';
import Telegram from '../../../assets/socialIcons/telegram.svg';
import Whatsapp from '../../../assets/socialIcons/whatsapp.svg';

const BusinessDetails = ({}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Business Details');
  const route = useRoute();
  const {data} = route.params;
  const id = data.id

  // console.log(data);

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
          style={[typography.description, activeTab === tab && styles.activeTabText]}>
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const BusinessDetailsTab = () => (
  <ScrollView contentContainerStyle={styles.content}>
    <Text style={[typography.heading,styles.title]}>Zedbyte software solutions</Text>
    <Text style={[typography.description,styles.description]}>
      entrust us with the management of your internet business and forget about
      it. We are one team with you! Our goal is to provide the best service for
      our clients.
    </Text>

    <View style={styles.socialBg}>
      {/* <PhoneIcon width={20} height={20} />
      <MailIcon width={20} height={20} /> */}
      {/* <Whatsapp width={20} height={20} /> */}
      <Text style={{width:'100%', color:colors.secondary, textAlign:'center'}}>***Contact Icons***</Text>
    </View>

    <View style={styles.mapPlaceholder}>
      <Text style={styles.mapText}>Map Placeholder</Text>
    </View>

    <Text style={[typography.description,styles.label]}>GST NUMBER</Text>
    <Text style={[typography.inputText,styles.infoText]}>07ABCDE1234F2Z5</Text>

    {/* <TouchableOpacity style={styles.socialButton}> */}
      <View style={styles.socialBg}>
        <Facebook width={20} height={20} />
        <Instagram width={20} height={20} />
        <LinkedIn width={20} height={20} />
        <Telegram width={20} height={20} />
        <Whatsapp width={20} height={20} />
      </View>
    {/* </TouchableOpacity> */}

    <Text style={[typography.description,styles.label]}>Founder</Text>
    <Text style={[typography.description,styles.infoText]}>Nivas S</Text>
  </ScrollView>
);

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
    color: colors.primary
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
    width:'55%',
    padding: 8,
    borderRadius: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 15,
    backgroundColor: colors.primary,
    alignItems:'center',
    marginBottom: 20
  },
});

export default BusinessDetails;
