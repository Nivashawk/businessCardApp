import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {typography} from '../../theme/typography';
import { truncateText } from '../../utlis/stringHandler';

export const colors = {
  surface: '#2a2a2a',
  border: '#404040',
  textSecondary: '#C4C4C4',
  background: '#1a1a1a',
  primary: '#1f1c2c',
  secondary: '#2d2d2d',
  text_color_1: '#FFFFFF',
  text_color_2: '#C4C4C4',
  status_green: '#80D97E',
  status_red: '#DA4035',
  accent: '#928dab',
  gold: '#FFD700',
  goldDark: '#B8860B',
  goldLight: '#FFFF99',
  shadow: 'rgba(0, 0, 0, 0.5)',
  cardGradient: ['#2d2d2d', '#1a1a1a'],
  premiumGradient: ['#2a2d3a', '#1f1f2e', '#1a1a1a'],
  shimmer: 'rgba(255, 215, 0, 0.3)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHighlight: 'rgba(255, 255, 255, 0.05)',
};

const {width} = Dimensions.get('window');
const CARD_HEIGHT = 220; // Fixed height for all cards
const CARD_WIDTH = width * 0.92; // Consistent width

const DescriptiveCard = ({title, date, description, onPress, priority = 'normal'}) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'high': 
        return {
          color: colors.status_red,
          gradient: ['rgba(218, 64, 53, 0.2)', 'rgba(218, 64, 53, 0.05)'],
          glow: 'rgba(218, 64, 53, 0.3)'
        };
      case 'medium': 
        return {
          color: colors.accent,
          gradient: ['rgba(146, 141, 171, 0.2)', 'rgba(146, 141, 171, 0.05)'],
          glow: 'rgba(146, 141, 171, 0.3)'
        };
      case 'low': 
        return {
          color: colors.status_green,
          gradient: ['rgba(128, 217, 126, 0.2)', 'rgba(128, 217, 126, 0.05)'],
          glow: 'rgba(128, 217, 126, 0.3)'
        };
      default: 
        return {
          color: colors.gold,
          gradient: ['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.03)'],
          glow: 'rgba(255, 215, 0, 0.2)'
        };
    }
  };

  const priorityConfig = getPriorityConfig();

  return (
    <TouchableOpacity
      style={[styles.cardWrapper, {
        shadowColor: priorityConfig.glow,
        borderColor: priorityConfig.color,
      }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Main gradient background */}
      <LinearGradient
        colors={colors.premiumGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Priority accent gradient overlay */}
        <LinearGradient
          colors={priorityConfig.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.priorityOverlay}
        />
        
        {/* Glass effect highlight */}
        <View style={styles.glassHighlight} />

        {/* Priority indicator with enhanced design */}
        <View style={styles.priorityIndicatorContainer}>
          <View style={[styles.priorityIndicator, {backgroundColor: priorityConfig.color}]}>
            <View style={[styles.priorityDot, {backgroundColor: colors.text_color_1}]} />
          </View>
        </View>

        {/* Content container with fixed layout */}
        <View style={styles.contentContainer}>
          {/* Header section */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>

          {/* Elegant divider with gradient */}
          <LinearGradient
            colors={['transparent', priorityConfig.color, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.divider}
          />

          {/* Description section with fixed height */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={3}>
              {truncateText(description, 85)}
            </Text>
          </View>

          {/* Premium footer */}
          <View style={styles.footer}>
            <LinearGradient
              colors={[priorityConfig.color, colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>View Details</Text>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    marginVertical: 12,
    marginHorizontal: width * 0.04,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
    borderWidth: 1,
    alignSelf: 'center',
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  priorityOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: colors.glassHighlight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  priorityIndicatorContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 3,
  },
  priorityIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.glassBorder,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    ...typography.headline,
    fontSize: 19,
    fontWeight: '800',
    color: colors.text_color_1,
    lineHeight: 26,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dateContainer: {
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backdropFilter: 'blur(10px)',
  },
  date: {
    ...typography.body2,
    fontSize: 11,
    fontWeight: '600',
    color: colors.text_color_1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1.5,
    marginVertical: 12,
    borderRadius: 1,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    ...typography.body2,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text_color_2,
    letterSpacing: 0.3,
    opacity: 0.9,
  },
  footer: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: 'rgba(255, 215, 0, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  actionText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.background,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  arrowContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 14,
    color: colors.background,
    fontWeight: 'bold',
  },
});

export default DescriptiveCard;