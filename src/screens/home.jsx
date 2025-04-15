import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import React from 'react';
import CardStack from '../components/cards/cardStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import ServiceCard from '../components/cards/serviceCard';
import DescriptiveCard from '../components/cards/descriptiveCard';
import ReferralImage from '../../assets/serviceCard/referral.png';
import EventImage from '../../assets/serviceCard/event.png';
import ShareImage from '../../assets/serviceCard/share.png';
import { useNavigation } from '@react-navigation/native';


const {width, height} = Dimensions.get('window');

const handleReferral = () => {
  console.log("clicked referral");
  
}

const handleEvent = () => {
  console.log("clicked Event");
  
}

const handleShare = () => {
  console.log("clicked share");
  
}


const Home = () => {
  const navigation = useNavigation();
  return (
  <View style={{backgroundColor:colors.background}}>
    <GestureHandlerRootView style={styles.container}>
      <CardStack />
    </GestureHandlerRootView>
    <View style={styles.serviceContainer}>
      <Text style={[typography.heading, {paddingLeft:10}]}>Services</Text>
      <View style={styles.serviceWrapper}>
        <ServiceCard title={'Refer & Earn'} image={ReferralImage} onPress={handleReferral}/>
        <ServiceCard title={'Create New Event'} image={EventImage} onPress={handleEvent}/>
        <ServiceCard title={'Share My Business'} image={ShareImage} onPress={()=>{navigation.navigate("GenerateQR")}}/>
      </View>
    </View>
    <View style={styles.eventContainer}>
      <Text style={[typography.heading, {paddingLeft:10}]}>Upcoming Events</Text>
      <ScrollView contentContainerStyle={styles.eventWrapper}>
        <DescriptiveCard title={'Madurai expo....'} date={"22/09/2025"} description={"Lorem Ipsum is simply dummy"} onPress={handleReferral}/>
        <DescriptiveCard title={'Madurai expo....'} date={"22/09/2025"}  description={"Lorem Ipsum is simply dummy"} onPress={handleEvent}/>
        <DescriptiveCard title={'Madurai expo....'} date={"22/09/2025"}  description={"Lorem Ipsum is simply dummy"} onPress={handleShare}/>
        <DescriptiveCard title={'Madurai expo....'} date={"22/09/2025"} description={"Lorem Ipsum is simply dummy"} onPress={handleReferral}/>
        <DescriptiveCard title={'Madurai expo....'} date={"22/09/2025"}  description={"Lorem Ipsum is simply dummy"} onPress={handleEvent}/>
        <DescriptiveCard title={'Madurai expo....'} date={"22/09/2025"}  description={"Lorem Ipsum is simply dummy"} onPress={handleShare}/>
      </ScrollView>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height:height * 0.38,
    // backgroundColor:'black',
  },
  serviceContainer:{
    height: height * 0.17,
    gap:5
    // paddingLeft: 10
    // backgroundColor: 'red'
  },
  serviceWrapper:{
    flexDirection: 'row',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  eventContainer:{
    height: height * 0.45,
    // backgroundColor: 'green'
  },
  eventWrapper: {
    paddingVertical: 10,
    alignItems: 'center',
    gap:5,
    paddingBottom: height * 0.09
  }

});

export default Home;
