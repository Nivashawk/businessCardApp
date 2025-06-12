// CardStack.js
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {formatCompanyName, truncateText} from '../../utlis/stringHandler';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import Editicon from '../../../assets/edit.svg';
import EmptyLogo from '../../../assets/emptylogo.svg';
import PhoneIcon from '../../../assets/phone.png';
import MailIcon from '../../../assets/mailIcon.png';
import Facebook from '../../../assets/socialIcons/facebook.svg';
import Instagram from '../../../assets/socialIcons/instagram.svg';
import LinkedIn from '../../../assets/socialIcons/linkedIn.svg';
import Telegram from '../../../assets/socialIcons/telegram.svg';
import Whatsapp from '../../../assets/socialIcons/whatsapp.svg';

const {width, height} = Dimensions.get('window');

const Card = React.memo(({card, style}) => {
  const navigation = useNavigation();

  // Add validation for card data
  if (!card) {
    return null;
  }

  return (
    <Animated.View style={[styles.card, style]}>
      <View style={[styles.header]}>
        <View style={[styles.headerLeft]}>
          <EmptyLogo width={50} height={50} />
          <Animated.Text
            style={[typography.heading, styles.title]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {formatCompanyName(card.name || '')}
          </Animated.Text>
        </View>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateBusiness');
          }}>
          <Editicon width={20} height={20} />
        </TouchableOpacity> */}
      </View>
      <View style={styles.descriptionContainer}>
        <Animated.Text style={[typography.description, styles.tagline]}>
          {truncateText(card.public_summary || '', 70)}
        </Animated.Text>
      </View>
      <View style={styles.contactContainer}>
        <View style={styles.contact1}>
          <Animated.Image source={PhoneIcon} />
          <Animated.Text style={[typography.inputText]}>
            {card.business_mobile || ''}
          </Animated.Text>
        </View>
        <View style={styles.contact2}>
          <Animated.Image source={MailIcon} />
          <Animated.Text style={[typography.inputText]}>
            {card.business_email || ''}
          </Animated.Text>
        </View>
      </View>
      <View style={styles.socialContainer}>
        <Animated.View style={styles.socialleftContainer}>
          <View style={styles.socialBg}>
            <Facebook width={20} height={20} />
            <Instagram width={20} height={20} />
            <LinkedIn width={20} height={20} />
            <Telegram width={20} height={20} />
            <Whatsapp width={20} height={20} />
          </View>
        </Animated.View>
        <Animated.View style={styles.socialrightContainer}>
          <Animated.Text style={[typography.description]}>
            Primary
          </Animated.Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
});

const EmptyCard = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.emptyCard}
      onPress={() => navigation.navigate('CreateBusiness')}>
      <Animated.Text style={styles.plusIcon}>+</Animated.Text>
    </TouchableOpacity>
  );
};

const CardStack = ({cardData}) => {
  // Debug logging
  console.log('CardStack Debug:', {
    cardDataExists: !!cardData,
    businessProfiles: cardData?.business_profiles,
    businessProfilesLength: cardData?.business_profiles?.length,
  });

  // Memoize the safe card data to prevent unnecessary re-renders
  const safeCardData = useMemo(() => {
    const profiles = cardData?.business_profiles;
    return Array.isArray(profiles) ? profiles : [];
  }, [cardData?.business_profiles]);

  // Initialize cards state with safe data
  const [cards, setCards] = useState(safeCardData);
  
  // Separate state for managing card interactions
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Memoize card length to prevent recalculation
  const cardLength = useMemo(() => cards.length, [cards.length]);

  // ALWAYS declare shared values - they don't cause re-renders
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // ALWAYS declare derived values
  const rotateZ = useDerivedValue(() => `${offsetX.value / 20}deg`);

  // Calculate margin top based on card count and platform
  const marginTop = useMemo(() => {
    const baseMargin = Platform.OS === 'ios' ? height * 0.03 : height * 0.02;
    
    switch (cardLength) {
      case 0:
        return baseMargin;
      case 1:
        return baseMargin;
      case 2:
        return height * 0.04;
      default:
        return height * 0.06;
    }
  }, [cardLength]);

  // Update cards when cardData changes
  useEffect(() => {
    console.log('CardStack: cardData changed, updating cards. New length:', safeCardData.length);
    setCards(safeCardData);
  }, [safeCardData]);

  // Callback to move top card to back
  const moveTopCardToBack = useCallback(() => {
    console.log('Moving top card to back, current cards length:', cards.length);
    if (cards.length <= 1) return; // Don't rotate if only one card
    
    setCards(prev => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  }, [cards.length]);

  // Reset animation state
  const resetAnimationState = useCallback(() => {
    console.log('Resetting animation state');
    setIsAnimating(false);
  }, []);

  // Pan gesture with improved handling
  const pan = Gesture.Pan()
    .onStart(() => {
      console.log('Pan gesture started');
      runOnJS(setIsAnimating)(true);
    })
    .onUpdate(e => {
      offsetX.value = e.translationX;
      offsetY.value = e.translationY;
    })
    .onEnd(e => {
      console.log('Pan gesture ended, translationX:', e.translationX);
      const threshold = width * 0.25; // Reduced threshold for easier swiping
      
      if (Math.abs(e.translationX) > threshold) {
        console.log('Swiping card away');
        // Swipe away animation
        offsetX.value = withTiming(
          e.translationX > 0 ? width : -width,
          {duration: 250},
          (finished) => {
            if (finished) {
              offsetX.value = 0;
              offsetY.value = 0;
              runOnJS(moveTopCardToBack)();
              runOnJS(resetAnimationState)();
            }
          },
        );
      } else {
        console.log('Snapping card back');
        // Snap back animation
        offsetX.value = withTiming(0, {duration: 150});
        offsetY.value = withTiming(0, {duration: 150}, (finished) => {
          if (finished) {
            runOnJS(resetAnimationState)();
          }
        });
      }
    });

  // ALWAYS declare animated style
  const topCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: offsetX.value},
      {translateY: offsetY.value},
      {rotateZ: rotateZ.value},
    ],
    marginTop: marginTop,
  }));

  // Render function for background cards
  const backgroundCards = useMemo(() => {
    console.log('Rendering background cards, cardLength:', cardLength);
    if (cardLength <= 1) return [];

    return cards.slice(1).map((card, index) => {
      if (!card?.id) {
        console.log('Skipping card without ID at index:', index);
        return null;
      }
      
      console.log('Rendering background card:', card.id, 'at index:', index);
      return (
        <Card
          key={`${card.id}-${index}`}
          card={card}
          style={[
            {
              top: (index + 1) * -15, // Positive value to stack downward slightly
              zIndex: -(index + 1),
              marginTop: marginTop,
            },
          ]}
        />
      );
    }).filter(Boolean);
  }, [cards, cardLength, marginTop]);

  // Main render - conditional rendering happens here, not in hooks
  return (
    <View style={styles.container}>
      {cardLength === 0 ? (
        <EmptyCard />
      ) : (
        <GestureDetector gesture={pan}>
          <View style={styles.stackContainer}>
            {/* Render background cards */}
            {backgroundCards}
            
            {/* Render top card with gesture */}
            {cards[0] && (
              <Card 
                card={cards[0]} 
                style={[topCardAnimatedStyle, styles.topCard]} 
              />
            )}
          </View>
        </GestureDetector>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.5, // Increased from 0.4 to 0.5
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  stackContainer: {
    width: width * 0.95,
    height: height * 0.4,
    position: 'relative',
  },
  card: {
    width: width * 0.95,
    height: height * 0.3,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    height: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  descriptionContainer: {
    width: '80%',
    height: '30%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  contactContainer: {
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  contact1: {
    flexDirection: 'row',
    gap: 5,
  },
  contact2: {
    flexDirection: 'row',
    gap: 5,
  },
  socialContainer: {
    width: '100%',
    height: '25%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialleftContainer: {
    width: '60%',
    flexWrap: 'wrap',
  },
  socialBg: {
    padding: 8,
    borderRadius: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 15,
    backgroundColor: colors.primary,
  },
  socialrightContainer: {
    width: '40%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  topCard: {
    zIndex: 1,
  },
  title: {
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
  emptyCard: {
    marginTop: height * 0.02,
    width: width * 0.95,
    height: height * 0.3,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 50,
    color: colors.primary,
  },
});

export default CardStack;