import React from 'react';
import {TouchableOpacity, Text, Image, Dimensions, StyleSheet} from 'react-native';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';
import {cards} from '../../theme/cards';
const {width, height} = Dimensions.get('window');

const ServiceCard = ({ title, image, onPress, disabled = false, bgColor = "" }) => {
  return (
    <TouchableOpacity
      style={[
        cards.serviceCard, {backgroundColor: bgColor},
        disabled && { opacity: 0.4 }, // faded look when disabled
      ]}
      onPress={disabled ? null : onPress} // prevent click if disabled
      activeOpacity={0.7}
      disabled={disabled} // disables touch feedback
    >
      <Image style={styles.image} source={image} />
      <Text
        style={[
          typography.inputText,
          {
            textAlign: 'center',
            fontWeight: 'bold',
            color: colors.primary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
    image:{
        height: height*0.05,
        width: width*0.1
    }
})

export default ServiceCard;
