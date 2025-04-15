import React from 'react';
import {TouchableOpacity, Text, View, Dimensions, StyleSheet} from 'react-native';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';
import {cards} from '../../theme/cards';

const DescriptiveCard = ({title, date, description, onPress}) => {
  return (
    <TouchableOpacity style={cards.descriptiveCard} onPress={onPress}>
        <View style={styles.descriptiveHeader}>
            <Text style={[typography.inputText, {textAlign:'center', fontWeight:'bold', color:colors.primary}]}>{title}</Text>
            <Text style={[typography.inputText, {textAlign:'center', fontWeight:'bold', color:colors.primary}]}>{date}</Text>
        </View>
        <Text style={[typography.description, {width:'100%', textAlign:'left'}]}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    descriptiveHeader:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between'
    }
})

export default DescriptiveCard;
