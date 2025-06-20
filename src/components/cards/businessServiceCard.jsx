import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform, // Import Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Keep for Android only
import {colors} from '../../theme/colors';
import Add from '../../../assets/add.png'; // Assuming this path is correct for your asset

// If you have 'react-native-vector-icons' installed, uncomment the line below
// import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const BusinessServiceCard = ({item, image, onPress, isAddCard = false}) => {
  // A simple placeholder for the icon if react-native-vector-icons is not used
  const DefaultIconPlaceholder = ({ size, color }) => (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#FFFFFF20', justifyContent: 'center', alignItems: 'center' }}>
      {/* You could add an SVG or another Image here if needed */}
    </View>
  );

  // --- Conditional Rendering for Add Card ---
  if (isAddCard) {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity style={iosStyles.addCard} onPress={onPress}>
          <View style={iosStyles.addCardContent}>
            <Image source={Add} style={iosStyles.addCardIcon} />
            <Text style={iosStyles.addCardText}>Add New Business</Text>
          </View>
        </TouchableOpacity>
      );
    } else { // Android Add Card
      return (
        <TouchableOpacity style={androidStyles.addCard} onPress={onPress}>
          <View style={androidStyles.addCardContent}>
            <View style={androidStyles.addIconContainer}>
              {Add ? (
                <Image source={Add} style={androidStyles.businessImage} />
              ) : (
                // Fallback if Add image is not loaded
                <DefaultIconPlaceholder size={28} color="#FFFFFF" />
                // <Icon name="business" size={28} color="#FFFFFF" /> // Uncomment if using Icon
              )}
            </View>
            <Text style={androidStyles.addCardText}>Add New{'\n'}Business</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  // --- Conditional Rendering for Regular Business Card ---
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
                   {/* <Icon name="business" size={24} color={iosStyles.defaultIconColor.color} /> */}
                   {/* Or a different placeholder if not using Icon */}
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
                    {backgroundColor: item?.active ? '#34C759' : '#FF3B30'}, // iOS-specific green/red
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
            {/* <Icon name="arrow-forward-ios" size={16} color="#C7C7CC" /> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  } else { // Android Regular Card (original logic)
    return (
      <TouchableOpacity style={androidStyles.card} onPress={onPress}>
        <LinearGradient
          colors={['#1e7d95', '#204E5A']}
          start={{x: 1, y: 0}}
          end={{x: 1, y: 1}}
          style={androidStyles.gradientBackground}>
          {/* Business Image/Icon */}
          <View style={androidStyles.imageContainer}>
            {image ? (
              <Image source={image} style={androidStyles.businessImage} />
            ) : (
              <DefaultIconPlaceholder size={28} color="#FFFFFF" />
              // <Icon name="business" size={28} color="#FFFFFF" /> // Uncomment if using Icon
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
                {backgroundColor: item?.active ? '#4ADE80' : 'red'},
              ]}
            />
            <Text style={androidStyles.statusText}>
              {item?.active ? 'Active' : 'Inactive'}
            </Text>
          </View>

          {/* Arrow Icon */}
          <View style={androidStyles.arrowContainer}>
            {/* <Icon name="arrow-forward-ios" size={14} color="#FFFFFF80" /> */}
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
    elevation: 8, // Android shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  },
  defaultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
    backgroundColor: '#4ADE80',
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF80',
    fontWeight: '500',
  },
  arrowContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  // Add Card Styles (Android)
  addCard: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    margin: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

const iosStyles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100, // Shorter card for iOS
    borderRadius: 10, // Slightly less rounded corners
    marginVertical: 6, // Adjusted vertical margin
    marginHorizontal: 12, // Adjusted horizontal margin
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2, // Subtle shadow for depth
    },
    shadowOpacity: 0.1, // Light shadow
    shadowRadius: 4,
  },
  contentContainer: {
    flexDirection: 'row', // Horizontal layout for iOS
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 12, // Reduced padding
    flex: 1,
  },
  imageAndDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10, // Space between text details and arrow
  },
  imageContainer: {
    // marginRight: 12, // Space between image and text
  },
  businessImage: {
    width: 38, // Smaller image/icon size
    height: 38,
    borderRadius: 8, // Slightly rounded image corners
  },
  defaultIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#E0E0E0', // Lighter background for default icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIconColor: {
    color: '#8E8E93', // iOS gray color for icon
  },
  textDetailsContainer: {
    flex: 1, // Allows text to take available space
  },
  title: {
    fontSize: 15, // Slightly larger font size
    fontWeight: '600', // Semibold weight common in iOS
    color: '#1C1C1E', // Darker text for better contrast
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // Closer to title
  },
  statusDot: {
    width: 7, // Slightly larger status dot
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#8E8E93', // iOS-specific gray for secondary text
    fontWeight: '400',
  },
  arrowContainer: {
    paddingLeft: 8, // Padding for arrow to ensure it's clickable
  },

  // iOS Specific Add Card Styles
  addCard: {
    flex: 1,
    height: 100,
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: '#F9F9F9', // Lighter background for add card
    borderWidth: 1,
    borderColor: '#D1D1D6', // Subtle, solid border
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05, // Very subtle shadow
    shadowRadius: 2,
  },
  addCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  addCardIcon: {
    width: 40,
    height: 40,
    tintColor: colors.primary, // Apply primary theme color to the Add icon
    marginBottom: 6,
  },
  addCardText: {
    fontSize: 14, // Slightly larger font for readability
    fontWeight: '500', // Medium font weight
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default BusinessServiceCard;