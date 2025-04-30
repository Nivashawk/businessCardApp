import {View, Text, Image, Dimensions, StyleSheet, Share} from 'react-native';
import React, {useState, useEffect} from 'react';
import QrCode from '../../../assets/QRcode.png';
import InputBox from '../../components/inputs/textInput';
import SmallButton from '../../components/buttons/smallButton';
import { colors } from '../../theme/colors';

const {width, height} = Dimensions.get('window');

const GenerateQR = () => {
  const [email, setEmail] = useState('');

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this cool app! https://zedbyte.in',
        title: 'Share My Business',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View
      style={{
        height: height * 0.82,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.background
      }}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 15,
        }}>
        <Image style={styles.Qrcode} source={QrCode} />
        <Text>ZEDEBYTE SOFTWARE SOLUTIONS</Text>
      </View>
      <View style={{width: '90%'}}>
        <InputBox
          label="Select Event"
          value={email}
          onChangeText={setEmail}
          placeholder="Select Event"
          keyboardType="email-address"
        />
      </View>
      <SmallButton title="Share" onPress={handleShare} />
    </View>
  );
};

const styles = StyleSheet.create({
  Qrcode: {
    height: height * 0.4,
    width: width * 0.8,
  },
});

export default GenerateQR;
