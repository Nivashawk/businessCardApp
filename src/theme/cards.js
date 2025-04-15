import {colors} from './colors';
import {spacing} from './spacing';
import {
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('window');

export const cards = {
  serviceCard: {
    width: width * 0.3,
    height: height * 0.12,
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap:5
  },
  descriptiveCard: {
    width: width * 0.95,
    height: height * 0.08,
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap:5,
    // paddingBottom: 50 
  }
};
