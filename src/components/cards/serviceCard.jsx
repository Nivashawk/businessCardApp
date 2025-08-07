import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';

const ServiceCard = ({
  title,
  subtitle,
  image,
  onPress,
  disabled = false,
  style,
  isNew = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (isNew) {
      // Pulse animation for new cards
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Shimmer animation for new cards
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isNew]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{scale: isNew ? pulseAnim : 1}],
          },
        ]}
      >
        <LinearGradient
          colors={
            isNew
              ? ['rgba(255, 215, 0, 0.15)', colors.surface, colors.secondary]
              : disabled
              ? ['rgba(45, 45, 45, 0.5)', 'rgba(42, 42, 42, 0.5)']
              : [colors.surface, colors.secondary]
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}
        >
          {/* Shimmer Effect for New Cards */}
          {isNew && (
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  transform: [
                    {
                      translateX: shimmerAnim.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-200, 200],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}

          {/* New Badge */}
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <View
                style={[
                  styles.imageWrapper,
                  disabled && styles.disabledImageWrapper,
                  isNew && styles.newImageWrapper,
                ]}
              >
                <Image
                  source={image}
                  style={[styles.image, disabled && styles.disabledImage]}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.title,
                  disabled && styles.disabledText,
                  isNew && styles.newTitle,
                ]}
                numberOfLines={2}
              >
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, isNew && styles.newSubtitle]}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {/* Overlay for disabled state */}
          {disabled && <View style={styles.disabledOverlay} />}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 120,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gradient: {
    flex: 1,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    transform: [{skewX: '-20deg'}],
    zIndex: 1,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.background,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageContainer: {
    marginBottom: 12,
  },
  imageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  newImageWrapper: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledImageWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  image: {
    width: 32,
    height: 32,
    tintColor: colors.text_color_1,
  },
  disabledImage: {
    tintColor: colors.text_color_2,
    opacity: 0.5,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text_color_1,
    textAlign: 'center',
    lineHeight: 18,
  },
  newTitle: {
    color: colors.text_color_1,
    fontWeight: '700',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text_color_2,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  newSubtitle: {
    color: colors.gold,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  },
  disabledText: {
    color: colors.text_color_2,
    opacity: 0.6,
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 2,
  },
});

export default ServiceCard;