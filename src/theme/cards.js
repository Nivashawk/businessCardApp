import {colors} from './colors';
import {spacing} from './spacing';
import {
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('window');

export const cards = {
  serviceCard: {
    width: width * 0.45,
    height: height * 0.12,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap:5,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
