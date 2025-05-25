import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useEffect, useState,useCallback} from 'react';
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
import {purpose} from '../redux/slices/auth/sendOTPSlices';
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
  const [isHomeData, setIsHomeData] = useState(false);
  const VerifyState = useSelector(state => state.OTPData);
  const {purpose} = VerifyState;
  const partner_id_from_login = useSelector(
    state => state.login?.data?.result?.partner_id,
  );
  const partner_id_from_register = useSelector(
    state => state.register?.data?.result?.partner_id,
  );
  const homeData = useSelector(state => state?.homeData?.data?.result?.data);

  useFocusEffect(

    useCallback(() => {
      if (!purpose) {
        console.log('No purpose found');
        return;
      }
      
      const partner_id =
      purpose === 'Login'
      ? partner_id_from_login
      : purpose === 'Register'
      ? partner_id_from_register
      : null;
      
      if (partner_id) {
        console.log('Purpose available:', purpose);
        dispatch(getHome({partner_id}));
      } else {
        console.log(`No partner_id found for ${purpose}`);
      }
    }, [purpose, partner_id_from_login, partner_id_from_register])
  );
    
    useEffect(() => {
    if (homeData) {
      console.log(homeData);
      setIsHomeData(true);
    }
  }, [homeData]);

  const handlePress = (id) => {
  console.log("Event ID:", id)
  navigation.navigate('UpdateEvents', {id})
  // Do something with the ID
}

  return (
    <View style={{backgroundColor: colors.background}}>
      <GestureHandlerRootView style={styles.container}>
        {isHomeData ? (
          <CardStack cardData={homeData.business_profiles}/>
        ) : (
          <Text style={[typography.heading, {paddingLeft: 10}]}>Loading</Text>
        )}
      </GestureHandlerRootView>
      <View style={styles.serviceContainer}>
        <Text style={[typography.heading, {paddingLeft: 10}]}>Services</Text>
        <View style={styles.serviceWrapper}>
          <ServiceCard
            title={'My Business'}
            image={ReferralImage}
            onPress={() => {
              navigation.navigate('Referral');
            }}
            disabled={false}
          />
          <ServiceCard
            title={'Create New Event'}
            image={EventImage}
            onPress={() => {
              navigation.navigate('CreateEvent');
            }}
          />
          <ServiceCard
            title={'Share My Business'}
            image={ShareImage}
            onPress={() => {
              navigation.navigate('GenerateQR');
            }}
            // disabled = {true}
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
            homeData?.events.length > 0
              ? {paddingBottom: height * 0.09}
              : {paddingTop: height * 0.13},
          ]}>
          {homeData?.events.length > 0 ? (
            homeData?.events.map((card, index) => (
              <DescriptiveCard
                key={index}
                title={card.name}
                date={card.event_date}
                description={card.description}
                onPress={() => handlePress(card.id)} 
              />
            ))
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: Platform.OS == 'ios' ? height * 0.34 : height * 0.38,
    // backgroundColor:colors.background,
    // alignItems:'center'
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
    height: height * 0.45,

    // backgroundColor: 'green'
  },
  eventWrapper: {
    // flex:1,
    paddingVertical: 10,
    alignItems: 'center',
    // backgroundColor:'red',
    // justifyContent:'center',
    gap: 5,
    // paddingTop: height * 0.13,
  },
});

export default Home;
