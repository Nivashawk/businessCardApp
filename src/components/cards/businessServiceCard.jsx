import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../theme/colors';
import Add from '../../../assets/add.png';

// import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const BusinessServiceCard = ({item, image, onPress, isAddCard = false}) => {
  if (isAddCard) {
    return (
      <TouchableOpacity style={styles.addCard} onPress={onPress}>
        <View style={styles.addCardContent}>
          <View style={styles.addIconContainer}>
            {Add ? (
              <Image source={Add} style={styles.businessImage} />
            ) : (
              <View style={styles.defaultIconContainer}>
                <Icon name="business" size={28} color="#FFFFFF" />
              </View>
            )}
          </View>
          <Text style={styles.addCardText}>Add New{'\n'}Business</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={['#1e7d95', '#204E5A']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        {/* Business Image/Icon */}
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={image} style={styles.businessImage} />
          ) : (
            <View style={styles.defaultIconContainer}>
              <Icon name="business" size={28} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Business Name */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item?.name}
          </Text>
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              {backgroundColor: item?.active ? '#4ADE80' : 'red'},
            ]}
          />
          <Text style={styles.statusText}>
            {item?.active ? 'Active' : 'Inactive'}
          </Text>
        </View>

        {/* Arrow Icon */}
        <View style={styles.arrowContainer}>
          {/* <Icon name="arrow-forward-ios" size={14} color="#FFFFFF80" /> */}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 140,
    borderRadius: 16,
    marginBottom: 8,
    elevation: 8,
    shadowColor: '#6C63FF',
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
    // backgroundColor: colors.background,
    alignItems: 'center',
    marginBottom: 12,
  },
  businessImage: {
    width: 45,
    height: 45,
    // borderRadius: 50,
    // backgroundColor: '#fff',
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

  // Add Card Styles
  addCard: {
    height: 140,
    borderRadius: 16,
    marginBottom: 8,
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
    borderRadius: 50,
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

export default BusinessServiceCard;
