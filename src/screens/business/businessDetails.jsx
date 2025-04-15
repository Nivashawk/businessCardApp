import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';

const BusinessDetails = ({}) => {
  const route = useRoute();
  const { data } = route.params;
  return (
    <View>
      <Text>Scanned QR Data: {data}</Text>
    </View>
  )
}

export default BusinessDetails