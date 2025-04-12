// components/LargeButton.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { typography } from '../../theme/typography';
import {buttons} from '../../theme/buttons';

const SmallButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={buttons.small} onPress={onPress}>
      <Text style={typography.button}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SmallButton;