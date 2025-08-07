import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../theme/colors';
import Add from '../../../assets/add.png';

const {width} = Dimensions.get('window');

const BusinessServiceCard = ({item, image, onPress, isAddCard = false}) => {
  // Simple placeholder for the icon
  const DefaultIconPlaceholder = ({ size, color }) => (
    <View style={{ 
      width: size, 
      height: size, 
      borderRadius: size / 2, 
      backgroundColor: colors.surface, 
      justifyContent: 'center', 
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border
    }}>
      <View style={{
        width: size * 0.6,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: 2
      }} />
    </View>
  );

  // --- Add Card Rendering ---
  if (isAddCard) {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity style={iosStyles.addCard} onPress={onPress}>
          <View style={iosStyles.addCardContent}>
            <View style={iosStyles.addIconContainer}>
              <Image source={Add} style={iosStyles.addCardIcon} />
            </View>
            <Text style={iosStyles.addCardText}>Add New Business</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={androidStyles.addCard} onPress={onPress}>
          <View style={androidStyles.addCardContent}>
            <View style={androidStyles.addIconContainer}>
              {Add ? (
                <Image source={Add} style={androidStyles.addCardIcon} />
              ) : (
                <DefaultIconPlaceholder size={28} color={colors.primary} />
              )}
            </View>
            <Text style={androidStyles.addCardText}>Add New{'\n'}Business</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  // --- Regular Business Card Rendering ---
  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity style={iosStyles.card} onPress={onPress}>
        <View style={iosStyles.contentContainer}>
          <View style={iosStyles.imageAndDetailsContainer}>
            {/* Business Image/Icon */}
            <View style={iosStyles.imageContainer}>
              {image ? (
                <Image source={image} style={iosStyles.businessImage} />
              ) : (
                <View style={iosStyles.defaultIconContainer}>
                  <DefaultIconPlaceholder size={38} color={colors.accent} />
                </View>
              )}
            </View>

            <View style={iosStyles.textDetailsContainer}>
              {/* Business Name */}
              <Text style={iosStyles.title} numberOfLines={2}>
                {item?.name}
              </Text>

              {/* Status Indicator */}
              <View style={iosStyles.statusContainer}>
                <View
                  style={[
                    iosStyles.statusDot,
                    {backgroundColor: item?.active ? colors.status_green : colors.status_red},
                  ]}
                />
                <Text style={iosStyles.statusText}>
                  {item?.active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>

          {/* Arrow Icon */}
          <View style={iosStyles.arrowContainer}>
            <View style={iosStyles.arrowIcon} />
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={androidStyles.card} onPress={onPress}>
        <LinearGradient
          colors={colors.cardGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={androidStyles.gradientBackground}>
          
          {/* Business Image/Icon */}
          <View style={androidStyles.imageContainer}>
            {image ? (
              <Image source={image} style={androidStyles.businessImage} />
            ) : (
              <DefaultIconPlaceholder size={45} color={colors.accent} />
            )}
          </View>

          {/* Business Name */}
          <View style={androidStyles.titleContainer}>
            <Text style={androidStyles.title} numberOfLines={2}>
              {item?.name}
            </Text>
          </View>

          {/* Status Indicator */}
          <View style={androidStyles.statusContainer}>
            <View
              style={[
                androidStyles.statusDot,
                {backgroundColor: item?.active ? colors.status_green : colors.status_red},
              ]}
            />
            <Text style={androidStyles.statusText}>
              {item?.active ? 'Active' : 'Inactive'}
            </Text>
          </View>

          {/* Arrow Icon */}
          <View style={androidStyles.arrowContainer}>
            <View style={androidStyles.arrowIcon} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
};

const androidStyles = StyleSheet.create({
  card: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    margin: 4,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  businessImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text_color_1,
    textAlign: 'center',
    lineHeight: 18,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: colors.text_color_2,
    fontWeight: '500',
  },
  arrowContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  arrowIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.text_color_2,
  },

  // Add Card Styles (Android)
  addCard: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    margin: 4,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  addIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addCardIcon: {
    width: 28,
    height: 28,
    tintColor: colors.accent,
  },
  addCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text_color_1,
    textAlign: 'center',
    lineHeight: 16,
  },
});

const iosStyles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100,
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  imageAndDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  imageContainer: {
    marginRight: 12,
  },
  businessImage: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  defaultIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDetailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text_color_1,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.text_color_2,
    fontWeight: '400',
  },
  arrowContainer: {
    paddingLeft: 8,
  },
  arrowIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.text_color_2,
  },

  // iOS Add Card Styles
  addCard: {
    flex: 1,
    height: 100,
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  addIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addCardIcon: {
    width: 24,
    height: 24,
    tintColor: colors.accent,
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text_color_1,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default BusinessServiceCard;