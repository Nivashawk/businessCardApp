// CardStack.js
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Dimensions, // Keep Dimensions for initial window size
  TouchableOpacity,
  Image,
  Platform,
  Text,
  Linking,
  useWindowDimensions, // Import useWindowDimensions
  PixelRatio, // Import PixelRatio for font scaling
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
import WebsiteIcon from '../../../assets/socialIcons/website.svg'; // Assuming you have a website icon SVG

// Define base dimensions and aspect ratio for responsive scaling
const BASE_WIDTH = 375; // A common base width for design (e.g., iPhone 8/X)
const BASE_CARD_WIDTH_RATIO = 0.95; // Card takes 95% of screen width
const CARD_ASPECT_RATIO = 0.65; // Height / Width, e.g., for a card that's roughly 2/3 as tall as it is wide

const Card = React.memo(({card, style}) => {
  const navigation = useNavigation();
  const {width: windowWidth} = useWindowDimensions(); // Get current window dimensions

  // Calculate dynamic font sizes
  const scale = windowWidth / BASE_WIDTH;
  const getResponsiveFontSize = (baseFontSize) => {
    const newSize = baseFontSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  if (!card) {
    return null;
  }

  const hasSocialLinks = useMemo(() => {
    return (
      card.social_fb ||
      card.social_insta ||
      card.social_linkedin ||
      card.social_twitter ||
      card.social_youtube ||
      card.website
    );
  }, [card]);

  const handleWebsitePress = useCallback(() => {
    if (card.website) {
      const url = card.website.startsWith('http://') || card.website.startsWith('https://')
        ? card.website
        : `http://${card.website}`;
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  }, [card.website]);

  // Dynamic card styles
  const responsiveCardWidth = windowWidth * BASE_CARD_WIDTH_RATIO;
  const responsiveCardHeight = responsiveCardWidth * CARD_ASPECT_RATIO;

  // Responsive logo size
  const responsiveLogoSize = getResponsiveFontSize(50); // Base 50px

  return (
    <Animated.View style={[
      styles.card,
      style,
      {
        width: responsiveCardWidth,
        height: responsiveCardHeight,
        // Add min/max constraints if necessary for very small/large screens
        minHeight: 180, // Example min height
        maxHeight: 280, // Example max height
      }
    ]}>
      <View style={[styles.header]}>
        <View style={[styles.headerLeft]}>
          {card.logo ? (
            <Image source={{uri: `data:image/png;base64,${ card.logo}`}} style={[styles.logo, {width: responsiveLogoSize, height: responsiveLogoSize}]} />
          ) : (
            <EmptyLogo width={responsiveLogoSize} height={responsiveLogoSize} />
          )}
          <Animated.Text
            style={[typography.heading, styles.title, {fontSize: getResponsiveFontSize(18), lineHeight: getResponsiveFontSize(25)}]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {formatCompanyName(card.name || '')}
          </Animated.Text>
        </View>
        {card.active !== undefined && (
          <View
            style={[
              styles.activeStatusContainer,
              card.active ? styles.activeBackground : styles.inactiveBackground,
            ]}>
            <Text
              style={[
                styles.statusText,
                {fontSize: getResponsiveFontSize(12)}, // Apply responsive font size
                card.active ? styles.activeText : styles.inactiveText,
              ]}>
              {card.active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.descriptionContainer}>
        <Animated.Text style={[typography.description, styles.tagline, {fontSize: getResponsiveFontSize(14)}]}>
          {truncateText(card.public_summary || '', 70)}
        </Animated.Text>
      </View>
      <View style={styles.contactContainer}>
        {card.business_mobile ? (
          <View style={styles.contactItem}>
            <Image source={PhoneIcon} style={[styles.contactIcon, {width: getResponsiveFontSize(18), height: getResponsiveFontSize(18)}]} />
            <Text style={[typography.inputText, styles.contactText, {fontSize: getResponsiveFontSize(14)}]}>
              {card.business_mobile}
            </Text>
          </View>
        ) : null}
        {card.business_email ? (
          <View style={styles.contactItem}>
            <Image source={MailIcon} style={[styles.contactIcon, {width: getResponsiveFontSize(18), height: getResponsiveFontSize(18)}]} />
            <Text style={[typography.inputText, styles.contactText, {fontSize: getResponsiveFontSize(14)}]}>
              {card.business_email}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.socialContainer}>
        <View style={styles.socialleftContainer}>
          {hasSocialLinks ? (
            <View style={[styles.socialBg, {padding: getResponsiveFontSize(8), gap: getResponsiveFontSize(15)}]}>
              {card.social_fb ? <Facebook width={getResponsiveFontSize(20)} height={getResponsiveFontSize(20)} /> : null}
              {card.social_insta ? <Instagram width={getResponsiveFontSize(20)} height={getResponsiveFontSize(20)} /> : null}
              {card.social_linkedin ? <LinkedIn width={getResponsiveFontSize(20)} height={getResponsiveFontSize(20)} /> : null}
              {/* Add Twitter, YouTube if they become available in your data */}
              {/* {card.social_twitter ? <Twitter width={getResponsiveFontSize(20)} height={getResponsiveFontSize(20)} /> : null} */}
              {/* {card.social_youtube ? <YouTube width={getResponsiveFontSize(20)} height={getResponsiveFontSize(20)} /> : null} */}

              {card.website ? (
                <TouchableOpacity onPress={handleWebsitePress}>
                  <WebsiteIcon width={getResponsiveFontSize(20)} height={getResponsiveFontSize(20)} />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <Text style={[typography.description, styles.noSocialLinksText, {fontSize: getResponsiveFontSize(13)}]}>
              No social links added
            </Text>
          )}
        </View>
        <Animated.View style={styles.socialrightContainer}>
          {card.is_primary && (
            <Animated.Text style={[typography.description, {fontWeight:'bold', fontSize: getResponsiveFontSize(14)}]}>
              Primary
            </Animated.Text>
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
});

const EmptyCard = () => {
  const navigation = useNavigation();
  const {width: windowWidth} = useWindowDimensions();
  const scale = windowWidth / BASE_WIDTH;
  const getResponsiveFontSize = (baseFontSize) => {
    const newSize = baseFontSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  const responsiveCardWidth = windowWidth * BASE_CARD_WIDTH_RATIO;
  const responsiveCardHeight = responsiveCardWidth * CARD_ASPECT_RATIO;

  return (
    <TouchableOpacity
      style={[
        styles.emptyCard,
        {
          width: responsiveCardWidth,
          height: responsiveCardHeight,
          minHeight: 180,
          maxHeight: 280,
        }
      ]}
      onPress={() => navigation.navigate('CreateBusiness')}>
      <Animated.Text style={[styles.plusIcon, {fontSize: getResponsiveFontSize(50)}]}>
        +
      </Animated.Text>
    </TouchableOpacity>
  );
};

const CardStack = ({cardData}) => {
  // Use useWindowDimensions here as well for consistent scaling logic
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();

  console.log('CardStack Debug:', {
    cardDataExists: !!cardData,
    businessProfiles: cardData?.business_profiles,
    businessProfilesLength: cardData?.business_profiles?.length,
  });

  const safeCardData = useMemo(() => {
    const profiles = cardData?.business_profiles;
    return Array.isArray(profiles) ? profiles : [];
  }, [cardData?.business_profiles]);

  const [cards, setCards] = useState(safeCardData);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardLength = useMemo(() => cards.length, [cards.length]);

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const rotateZ = useDerivedValue(() => `${offsetX.value / 20}deg`);

  const marginTop = useMemo(() => {
    // Dynamically adjust margin based on window height and card count
    const baseMargin = Platform.OS === 'ios' ? windowHeight * 0.03 : windowHeight * 0.02;
    
    switch (cardLength) {
      case 0:
        return baseMargin;
      case 1:
        return baseMargin;
      case 2:
        return windowHeight * 0.04;
      default:
        return windowHeight * 0.06;
    }
  }, [cardLength, windowHeight]);

  useEffect(() => {
    console.log('CardStack: cardData changed, updating cards. New length:', safeCardData.length);
    setCards(safeCardData);
  }, [safeCardData]);

  const moveTopCardToBack = useCallback(() => {
    console.log('Moving top card to back, current cards length:', cards.length);
    if (cards.length <= 1) return;
    
    setCards(prev => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  }, [cards.length]);

  const resetAnimationState = useCallback(() => {
    console.log('Resetting animation state');
    setIsAnimating(false);
  }, []);

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
      const threshold = windowWidth * 0.25;
      
      if (Math.abs(e.translationX) > threshold) {
        console.log('Swiping card away');
        offsetX.value = withTiming(
          e.translationX > 0 ? windowWidth : -windowWidth,
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
        offsetX.value = withTiming(0, {duration: 150});
        offsetY.value = withTiming(0, {duration: 150}, (finished) => {
          if (finished) {
            runOnJS(resetAnimationState)();
          }
        });
      }
    });

  const topCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: offsetX.value},
      {translateY: offsetY.value},
      {rotateZ: rotateZ.value},
    ],
    marginTop: marginTop,
  }));

  const backgroundCards = useMemo(() => {
    console.log('Rendering background cards, cardLength:', cardLength);
    if (cardLength <= 1) return [];

    // Calculate responsive top offset for stacked cards
    const responsiveStackOffset = PixelRatio.roundToNearestPixel(windowWidth / BASE_WIDTH * 15);


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
              top: (index + 1) * -responsiveStackOffset, // Dynamic stacking
              zIndex: -(index + 1),
              marginTop: marginTop,
            },
          ]}
        />
      );
    }).filter(Boolean);
  }, [cards, cardLength, marginTop, windowWidth]); // Add windowWidth to dependencies

  return (
    <View style={[styles.container, {height: windowHeight * 0.5}]}>
      {cardLength === 0 ? (
        <EmptyCard />
      ) : (
        <GestureDetector gesture={pan}>
          <View style={[styles.stackContainer, {width: windowWidth * BASE_CARD_WIDTH_RATIO, height: windowWidth * BASE_CARD_WIDTH_RATIO * CARD_ASPECT_RATIO}]}>
            {backgroundCards}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.background,
    // Height is set dynamically in the component
  },
  stackContainer: {
    position: 'relative',
    // Width and Height are set dynamically in the component
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    // Width and Height are set dynamically in the component
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 0.3, // Takes 30% of card height
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1, // Allow text to shrink
  },
  logo: {
    borderRadius: 25, // Assuming circular logos
    resizeMode: 'cover',
    // Size is set dynamically in the component
  },
  activeStatusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
    marginLeft: 'auto', // Push to the right
  },
  activeBackground: {
    backgroundColor: '#4CAF50', // Green for active
  },
  inactiveBackground: {
    backgroundColor: '#BDBDBD', // Grey for inactive
  },
  statusText: {
    fontWeight: 'bold',
    // Font size is set dynamically
  },
  activeText: {
    color: '#FFFFFF', // White text for active
  },
  inactiveText: {
    color: '#333333', // Dark text for inactive
  },
  descriptionContainer: {
    // width: '80%', // Remove fixed width
    flex: 0.3, // Takes 30% of card height
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 10, // Add some padding to prevent text overflow at edges
  },
  contactContainer: {
    flex: 0.15, // Takes 15% of card height
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap', // Allow contact items to wrap
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contactIcon: {
    resizeMode: 'contain',
    // Size is set dynamically
  },
  contactText: {
    // Font size is set dynamically
  },
  socialContainer: {
    flex: 0.25, // Takes 25% of card height
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialleftContainer: {
    flex: 1, // Take available space
    flexWrap: 'wrap',
    justifyContent: 'center', // Center content when no social links
  },
  socialBg: {
    borderRadius: 15,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary
    // Padding and gap are set dynamically
    // background color remains constant
  },
  noSocialLinksText: {
    color: colors.text,
    fontStyle: 'italic',
    // Font size is set dynamically
  },
  socialrightContainer: {
    width: '40%', // Can remain percentage if it behaves well, or adjust to fixed relative
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  topCard: {
    zIndex: 1,
  },
  title: {
    flexShrink: 1,
    flexWrap: 'wrap',
    // lineHeight and font size set dynamically
  },
  emptyCard: {
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
    marginTop: 10,
    // Width and Height are set dynamically in the component
    // Margin top is set dynamically in CardStack
  },
  plusIcon: {
    color: colors.primary,
    // Font size is set dynamically
  },
});

export default CardStack;