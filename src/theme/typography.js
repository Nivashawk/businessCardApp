import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from './colors';


export const fontSize = {
  heading_1 : RFValue(48), // For placeholder LOGO or COMPANY NAME 
  heading_2 : RFValue(20), // For page titles
  paragraph_1 : RFValue(16), // For page tabs, details page field labels
  paragraph_2 : RFValue(14), // For input_labels, input_placeholder, input_text, button_text 
  paragraph_3 : RFValue(12) // error messae, inforamtions
}

export const typography = {
  logo:{
    fontSize: fontSize.heading_1,
    color: colors.primary,
    fontWeight: 'bold',
  },
  description:{
    fontSize: fontSize.paragraph_1,
    color: colors.primary,
    fontWeight: '400',
  },
  footerText:{
    fontSize: fontSize.paragraph_2,
    color: colors.text_color_1,
  },
  button: {
    fontSize: fontSize.paragraph_2,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: fontSize.heading_2,
    color: colors.primary,
    fontWeight: 'bold',
  },
  inputLabel:{
    fontSize: fontSize.paragraph_2,
    fontWeight: '600',
    color: colors.text_color_2
  },
  inputText:{
    fontSize: fontSize.paragraph_2,
    color: colors.text_color_2
  },
  inputError:{
    fontSize: fontSize.paragraph_3,
    color: colors.status_red,
  },
  linkText:{
    color: colors.primary,
    fontWeight: 'bold',
  }
};
