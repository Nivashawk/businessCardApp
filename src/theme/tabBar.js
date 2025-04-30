import { colors } from "./colors";
import { Dimensions} from 'react-native';

const {height} = Dimensions.get('window');


export const TabBarStyle = {
  backgroundColor: colors.secondary,
  height: height * 0.09,
  // paddingBottom: 10,
  paddingTop: 10,
  position: 'absolute',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  elevation: 5,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: {width: 0, height: -2},
  shadowRadius: 4,
};
