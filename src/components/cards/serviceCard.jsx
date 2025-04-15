import React from 'react';
import {TouchableOpacity, Text, Image, Dimensions, StyleSheet} from 'react-native';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';
import {cards} from '../../theme/cards';
const {width, height} = Dimensions.get('window');

const ServiceCard = ({title, image, onPress}) => {
  return (
    <TouchableOpacity style={cards.serviceCard} onPress={onPress}>
      <Image style={styles.image} source={image} />
      <Text style={[typography.inputText, {textAlign:'center', fontWeight:'bold', color:colors.primary}]}>{title}</Text>
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
