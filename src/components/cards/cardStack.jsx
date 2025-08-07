import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Linking,
  useWindowDimensions,
  PixelRatio,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

// Import your existing utilities and assets
import { formatCompanyName, truncateText } from '../../utlis/stringHandler';
import { colors } from '../../theme/colors';
import EmptyLogo from '../../../assets/emptylogo.svg';
import PhoneIcon from '../../../assets/phone.png';
import MailIcon from '../../../assets/mailIcon.png';
import Facebook from '../../../assets/socialIcons/facebook.svg';
import Instagram from '../../../assets/socialIcons/instagram.svg';
import LinkedIn from '../../../assets/socialIcons/linkedIn.svg';
import WebsiteIcon from '../../../assets/socialIcons/website.svg';

const BASE_WIDTH = 375;
const CARD_WIDTH_RATIO = 0.92;
const CARD_HEIGHT = 240;
const STACK_OFFSET = 14;
const STACK_SCALE = 0.03;
const STACK_ROTATION = 1.5;
const MAX_VISIBLE_CARDS = 4;

const StackedCard = React.memo(({
  card,
  index,
  totalCards,
  currentIndex,
  translateX,
  isFrontCard,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  // Calculate responsive sizes
  const scale = windowWidth / BASE_WIDTH;
  const cardWidth = windowWidth * CARD_WIDTH_RATIO;

  const getResponsiveFontSize = (baseFontSize) => {
    const newSize = baseFontSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  // Check if card has social links
  const hasSocialLinks = useMemo(() => {
    return !!(card?.social_fb || card?.social_insta || card?.social_linkedin || card?.website);
  }, [card?.social_fb, card?.social_insta, card?.social_linkedin, card?.website]);

  // Handle website press
  const handleWebsitePress = useCallback(() => {
    if (card?.website) {
      const url = card.website.startsWith('http://') || card.website.startsWith('https://')
        ? card.website
        : `http://${card.website}`;
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  }, [card?.website]);

  // Calculate card position in stack based on its index relative to the current front card
  const position = (index - currentIndex + totalCards) % totalCards;
  const isVisible = position < MAX_VISIBLE_CARDS;

  // Animated styles for stacking effect
  const cardAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    
    // Only animate cards that are visible in the stack
    if (!isVisible) {
      return {
        opacity: 0,
        transform: [
          { scale: 0.7 },
          { translateY: STACK_OFFSET * 3 },
          { translateX: 0 },
          { rotateZ: '0deg' }
        ],
        zIndex: -1,
      };
    }
    
    // Determine the animated position, which is a key change.
    // If it's the front card, its position is directly from the gesture (translateX).
    // Otherwise, its position is static relative to the stack.
    let animatedPosition;
    if (isFrontCard) {
      animatedPosition = interpolate(
        Math.abs(translateX.value),
        [0, windowWidth],
        [0, 1],
        Extrapolate.CLAMP
      );
    } else {
      animatedPosition = position;
    }
    
    const absPosition = isFrontCard ? animatedPosition : position;

    const scale = interpolate(
      absPosition,
      [0, 1, 2, 3],
      [1, 1 - STACK_SCALE, 1 - STACK_SCALE * 2, 1 - STACK_SCALE * 3],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      absPosition,
      [0, 1, 2, 3],
      [0, STACK_OFFSET, STACK_OFFSET * 1.8, STACK_OFFSET * 2.5],
      Extrapolate.CLAMP
    );

    const staticTranslateX = interpolate(
      absPosition,
      [0, 1, 2, 3],
      [0, -2, 2, -1],
      Extrapolate.CLAMP
    );

    const rotateZ = interpolate(
      absPosition,
      [0, 1, 2, 3],
      [0, -STACK_ROTATION, STACK_ROTATION * 0.8, -STACK_ROTATION * 0.5],
      Extrapolate.CLAMP
    );
    
    // The opacity of the front card is animated based on its swipe
    // The opacity of the other cards is static based on their position
    const opacity = isFrontCard
      ? interpolate(
          Math.abs(translateX.value),
          [0, windowWidth],
          [1, 0],
          Extrapolate.CLAMP
        )
      : interpolate(
          absPosition,
          [0, 1, 2, 3],
          [1, 0.85, 0.7, 0.5],
          Extrapolate.CLAMP
        );
    
    // The main transform property.
    // The front card gets the gesture's translateX
    // The other cards get a static translateX
    let swipeTranslateX = isFrontCard ? translateX.value : 0;
    
    // The rotation is also driven by the front card's swipe
    let swipeRotation = isFrontCard
      ? interpolate(
          translateX.value,
          [-windowWidth / 2, 0, windowWidth / 2],
          [-10, 0, 10],
          Extrapolate.CLAMP
        )
      : 0;

    return {
      opacity,
      transform: [
        { scale },
        { translateY },
        { translateX: staticTranslateX + swipeTranslateX },
        { rotateZ: `${rotateZ + swipeRotation}deg` }
      ],
      zIndex: MAX_VISIBLE_CARDS - Math.floor(position),
    };
  }, [index, currentIndex, totalCards, windowWidth, isFrontCard, translateX, isVisible]);

  return (
    <Animated.View
      style={[
        styles.card,
        cardAnimatedStyle,
        {
          width: cardWidth,
          height: CARD_HEIGHT,
        }
      ]}
      pointerEvents={isFrontCard ? 'auto' : 'none'}
    >
      {/* Card background */}
      <View style={styles.cardBackground} />

      {/* Gold accent border */}
      <View style={styles.goldBorder} />

      {/* Card content */}
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              {card.logo ? (
                <Image
                  source={{ uri: `data:image/png;base64,${card.logo}` }}
                  style={[styles.logo, {
                    width: getResponsiveFontSize(40),
                    height: getResponsiveFontSize(40)
                  }]}
                />
              ) : (
                <View style={[styles.emptyLogoContainer, {
                  width: getResponsiveFontSize(40),
                  height: getResponsiveFontSize(40)
                }]}>
                  <EmptyLogo width={getResponsiveFontSize(24)} height={getResponsiveFontSize(24)} />
                </View>
              )}
            </View>
            <View style={styles.titleContainer}>
              <Text
                style={[styles.companyName, { fontSize: getResponsiveFontSize(16) }]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {formatCompanyName(card.name || '')}
              </Text>
              {card.public_summary && (
                <Text style={[styles.tagline, { fontSize: getResponsiveFontSize(11) }]} numberOfLines={2}>
                  {truncateText(card.public_summary, 60)}
                </Text>
              )}
            </View>
          </View>

          {card.active !== undefined && (
            <View style={[
              styles.statusContainer,
              card.active ? styles.activeBackground : styles.inactiveBackground,
            ]}>
              <Text style={[
                styles.statusText,
                { fontSize: getResponsiveFontSize(9) },
                card.active ? styles.activeText : styles.inactiveText,
              ]}>
                {card.active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          )}
        </View>

        {/* Contact info */}
        <View style={styles.contactSection}>
          {card.business_mobile && (
            <View style={styles.contactItem}>
              <Image
                source={PhoneIcon}
                style={[styles.contactIcon, {
                  width: getResponsiveFontSize(12),
                  height: getResponsiveFontSize(12)
                }]}
              />
              <Text style={[styles.contactText, { fontSize: getResponsiveFontSize(11) }]}>
                {card.business_mobile}
              </Text>
            </View>
          )}

          {card.business_email && (
            <View style={styles.contactItem}>
              <Image
                source={MailIcon}
                style={[styles.contactIcon, {
                  width: getResponsiveFontSize(12),
                  height: getResponsiveFontSize(12)
                }]}
              />
              <Text style={[styles.contactText, { fontSize: getResponsiveFontSize(11) }]}>
                {card.business_email}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom section with social links and primary badge */}
        <View style={styles.bottomSection}>
          <View style={styles.socialContainer}>
            {hasSocialLinks ? (
              <View style={styles.socialIcons}>
                {card.social_fb && (
                  <Facebook width={getResponsiveFontSize(14)} height={getResponsiveFontSize(14)} />
                )}
                {card.social_insta && (
                  <Instagram width={getResponsiveFontSize(14)} height={getResponsiveFontSize(14)} />
                )}
                {card.social_linkedin && (
                  <LinkedIn width={getResponsiveFontSize(14)} height={getResponsiveFontSize(14)} />
                )}
                {card.website && (
                  <TouchableOpacity onPress={handleWebsitePress}>
                    <WebsiteIcon width={getResponsiveFontSize(14)} height={getResponsiveFontSize(14)} />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={[styles.noSocialText, { fontSize: getResponsiveFontSize(9) }]}>
                No social links
              </Text>
            )}
          </View>

          {card.is_primary && (
            <View style={styles.primaryBadge}>
              <Text style={[styles.primaryText, { fontSize: getResponsiveFontSize(8) }]}>
                PRIMARY
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom accent */}
      <View style={styles.cardAccent} />
    </Animated.View>
  );
});

const EmptyCard = ({ onPress }) => {
  const { width: windowWidth } = useWindowDimensions();
  const scale = windowWidth / BASE_WIDTH;
  const cardWidth = windowWidth * CARD_WIDTH_RATIO;

  const getResponsiveFontSize = (baseFontSize) => {
    const newSize = baseFontSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  return (
    <TouchableOpacity
      style={[styles.emptyCard, { width: cardWidth, height: CARD_HEIGHT }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.emptyCardContent}>
        <View style={styles.plusContainer}>
          <Text style={[styles.plusIcon, { fontSize: getResponsiveFontSize(24) }]}>+</Text>
        </View>
        <Text style={[styles.emptyTitle, { fontSize: getResponsiveFontSize(14) }]}>
          Create New Business
        </Text>
        <Text style={[styles.emptySubtitle, { fontSize: getResponsiveFontSize(10) }]}>
          Tap to get started
        </Text>
      </View>
      <View style={styles.emptyCardAccent} />
    </TouchableOpacity>
  );
};

const CardStack = ({ cardData }) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useNavigation();
  const isAnimatingRef = useRef(false);

  // Process card data safely
  const safeCardData = useMemo(() => {
    const profiles = cardData?.business_profiles;
    if (!Array.isArray(profiles)) return [];
    return profiles.filter(profile => profile != null);
  }, [cardData?.business_profiles]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  // Navigation functions with animation lock
  const goToNext = useCallback(() => {
    if (safeCardData.length <= 1 || isAnimatingRef.current) return;
    setCurrentIndex(prevIndex => (prevIndex + 1) % safeCardData.length);
  }, [safeCardData.length]);

  const goToPrevious = useCallback(() => {
    if (safeCardData.length <= 1 || isAnimatingRef.current) return;
    setCurrentIndex(prevIndex => (prevIndex === 0 ? safeCardData.length - 1 : prevIndex - 1));
  }, [safeCardData.length]);

  // Gesture handling with proper cleanup
  const gesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(safeCardData.length > 1)
      .onUpdate((event) => {
        'worklet';
        translateX.value = event.translationX;
      })
      .onEnd((event) => {
        'worklet';
        const threshold = windowWidth * 0.25;

        if (event.translationX > threshold) {
          // Swipe right - previous card
          translateX.value = withTiming(windowWidth, { duration: 200 }, () => {
            runOnJS(goToPrevious)();
            translateX.value = 0;
          });
        } else if (event.translationX < -threshold) {
          // Swipe left - next card
          translateX.value = withTiming(-windowWidth, { duration: 200 }, () => {
            runOnJS(goToNext)();
            translateX.value = 0;
          });
        } else {
          // Snap back
          translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        }
      })
      .onFinalize(() => {
        'worklet';
        // Always reset translateX if it's not already 0 to prevent stale state
        if (translateX.value !== 0) {
            cancelAnimation(translateX);
            translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        }
      });
  }, [safeCardData.length, windowWidth, goToNext, goToPrevious, translateX]);

  // Handle indicator press
  const handleIndicatorPress = useCallback((index) => {
    if (index === currentIndex || isAnimatingRef.current) return;

    // A small animation to make the change smoother
    isAnimatingRef.current = true;
    translateX.value = withTiming((index > currentIndex ? -1 : 1) * 20, { duration: 150 }, () => {
      translateX.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(() => {
          setCurrentIndex(index);
          isAnimatingRef.current = false;
        })();
      });
    });
  }, [currentIndex, translateX]);


  if (safeCardData.length === 0) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <EmptyCard onPress={() => navigation.navigate('CreateBusiness')} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.stackContainer}>
          {safeCardData.map((card, index) => (
            <StackedCard
              key={card?.id || `card-${index}`}
              card={card}
              index={index}
              totalCards={safeCardData.length}
              currentIndex={currentIndex}
              translateX={translateX}
              isFrontCard={index === currentIndex}
            />
          ))}
        </View>
      </GestureDetector>

      {/* Card indicators */}
      {safeCardData.length > 1 && (
        <View style={styles.indicatorContainer}>
          {safeCardData.map((_, index) => (
            <TouchableOpacity
              key={`indicator-${index}`}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator
              ]}
              onPress={() => handleIndicatorPress(index)}
              disabled={isAnimatingRef.current}
            />
          ))}
        </View>
      )}

      {/* Card counter */}
      {safeCardData.length > 1 && (
        <Text style={styles.cardCounter}>
          {currentIndex + 1} of {safeCardData.length}
        </Text>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 20,
  },
  stackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CARD_HEIGHT + STACK_OFFSET * 4,
    width: '100%',
  },
  card: {
    position: 'absolute',
    backgroundColor: colors.secondary,
    borderRadius: 22,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: colors.goldDark,
    overflow: 'hidden',
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    opacity: 0.05,
  },
  goldBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    padding: 22,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 14,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    borderRadius: 10,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: colors.goldLight,
  },
  emptyLogoContainer: {
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.goldDark,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  companyName: {
    fontWeight: '700',
    color: colors.text_color_1,
    lineHeight: 22,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  tagline: {
    color: colors.textSecondary,
    lineHeight: 16,
    opacity: 0.9,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 55,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  activeBackground: {
    backgroundColor: colors.status_green,
  },
  inactiveBackground: {
    backgroundColor: colors.text_color_2,
  },
  statusText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#FFFFFF',
  },
  contactSection: {
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactIcon: {
    resizeMode: 'contain',
    opacity: 0.8,
    tintColor: colors.goldLight,
  },
  contactText: {
    color: colors.text_color_1,
    fontWeight: '500',
    flex: 1,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialContainer: {
    flex: 1,
  },
  socialIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.goldDark,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  noSocialText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  primaryBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.goldLight,
  },
  primaryText: {
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.gold,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  // Empty card styles
  emptyCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.goldDark,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  emptyCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: colors.goldLight,
  },
  plusIcon: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.text_color_1,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyCardAccent: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 4,
    backgroundColor: colors.gold,
    borderRadius: 2,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  // Indicators
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: colors.goldDark,
  },
  activeIndicator: {
    backgroundColor: colors.gold,
    width: 24,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
    borderColor: colors.goldLight,
  },
  cardCounter: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CardStack;