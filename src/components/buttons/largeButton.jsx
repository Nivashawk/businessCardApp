// components/LargeButton.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { typography } from '../../theme/typography';
import {buttons} from '../../theme/buttons';

const LargeButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={buttons.large} onPress={onPress}>
      <Text style={typography.button}>{title}</Text>
    </TouchableOpacity>
  );
};

export default LargeButton;