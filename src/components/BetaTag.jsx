import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const BetaTag = ({ 
  style, 
  size = 'small', 
  variant = 'default',
  text = 'BETA' 
}) => {
  const sizeStyles = {
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 10,
    },
    medium: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      fontSize: 11,
    },
    large: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      fontSize: 12,
    }
  };

  const variantStyles = {
    default: {
      backgroundColor: colors.gold,
      color: colors.background,
    },
    secondary: {
      backgroundColor: colors.accent,
      color: colors.text_color_1,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.gold,
      color: colors.gold,
    },
    white: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      color: colors.primary,
    },
    dark: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: colors.text_color_1,
    }
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <View style={[
      styles.betaTag,
      {
        paddingHorizontal: currentSize.paddingHorizontal,
        paddingVertical: currentSize.paddingVertical,
        backgroundColor: currentVariant.backgroundColor,
        borderWidth: currentVariant.borderWidth || 0,
        borderColor: currentVariant.borderColor,
      },
      style
    ]}>
      <Text style={[
        styles.betaText,
        {
          fontSize: currentSize.fontSize,
          color: currentVariant.color,
        }
      ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  betaTag: {
    borderRadius: 8,
    alignSelf: 'flex-start',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  betaText: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default BetaTag;