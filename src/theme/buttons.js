import {colors} from './colors';
import {spacing} from './spacing';
import {
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export const buttons = {
  // Primary Gold Button (Main Actions)
  large: {
    backgroundColor: colors.gold,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.goldDark,
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Small Flexible Button
  small: {
    backgroundColor: colors.gold,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: width * 0.25, // Minimum width instead of fixed
    maxWidth: width * 0.8, // Maximum width for flexibility
    borderWidth: 1,
    borderColor: colors.goldDark,
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  // Secondary Button (Outline style)
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderWidth: 2,
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Subtle Button (Dark theme secondary)
  subtle: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // Danger Button (For delete/cancel actions)
  danger: {
    backgroundColor: colors.status_red,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#B71C1C', // Darker red
    shadowColor: colors.status_red,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  // Success Button (For confirm actions)
  success: {
    backgroundColor: colors.status_green,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#4CAF50', // Darker green
    shadowColor: colors.status_green,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  // Icon Button (Small circular)
  icon: {
    backgroundColor: colors.secondary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // Floating Action Button
  fab: {
    backgroundColor: colors.gold,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.goldDark,
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  // Text Styles for Buttons
  text: {
    large: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.background, // Dark text on gold background
      textAlign: 'center',
    },
    small: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.background,
      textAlign: 'center',
    },
    secondary: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.gold, // Gold text on transparent background
      textAlign: 'center',
    },
    subtle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text_color_1, // White text
      textAlign: 'center',
    },
    danger: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text_color_1, // White text
      textAlign: 'center',
    },
    success: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text_color_1, // White text
      textAlign: 'center',
    },
    icon: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text_color_1,
      textAlign: 'center',
    },
  },

  // Pressed States (for onPressIn/onPressOut)
  pressed: {
    large: {
      backgroundColor: colors.goldDark,
      transform: [{scale: 0.98}],
    },
    small: {
      backgroundColor: colors.goldDark,
      transform: [{scale: 0.96}],
    },
    secondary: {
      backgroundColor: colors.shimmer, // Light gold background when pressed
    },
    subtle: {
      backgroundColor: colors.surface,
    },
    danger: {
      backgroundColor: '#B71C1C',
      transform: [{scale: 0.98}],
    },
    success: {
      backgroundColor: '#4CAF50',
      transform: [{scale: 0.98}],
    },
    icon: {
      backgroundColor: colors.surface,
      transform: [{scale: 0.94}],
    },
    fab: {
      backgroundColor: colors.goldDark,
      transform: [{scale: 0.94}],
    },
  },

  // Disabled States
  disabled: {
    large: {
      backgroundColor: colors.border,
      borderColor: colors.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    small: {
      backgroundColor: colors.border,
      borderColor: colors.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    secondary: {
      borderColor: colors.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    subtle: {
      backgroundColor: colors.surface,
      borderColor: colors.surface,
      shadowOpacity: 0,
      elevation: 0,
    },
    text: {
      color: colors.textSecondary,
    },
  },

  // Gradient Variants (if you want to use LinearGradient)
  gradient: {
    large: {
      colors: [colors.gold, colors.goldDark],
      start: {x: 0, y: 0},
      end: {x: 1, y: 1},
    },
    small: {
      colors: [colors.gold, colors.goldDark],
      start: {x: 0, y: 0},
      end: {x: 1, y: 0},
    },
    fab: {
      colors: [colors.goldLight, colors.gold, colors.goldDark],
      start: {x: 0, y: 0},
      end: {x: 1, y: 1},
    },
  },
};