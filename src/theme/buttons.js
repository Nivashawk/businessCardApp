import {colors} from './colors';
import {spacing} from './spacing';
import {
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('window');

export const buttons = {
  large: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 30,
    alignItems: 'center',
  },
  small: {
    width: width * 0.3,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm, // vertical padding
    paddingHorizontal: spacing.md, // horizontal padding for dynamic width
    borderRadius: 8,
    alignItems: 'center',
  },
};
