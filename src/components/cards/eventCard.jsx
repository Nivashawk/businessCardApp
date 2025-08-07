import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Platform, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import {typography} from '../../theme/typography'; // Assuming these are defined and provide sensible defaults

// Define your new color palette directly in this file for self-containment
export const colors = {
  surface: '#2a2a2a', // Dark surface
  border: '#404040', // Dark borders
  textSecondary: '#C4C4C4', // Your secondary text color
  background: '#1a1a1a', // Dark background
  primary: '#1f1c2c', // Your primary color (used as a base for gradients now)
  secondary: '#2d2d2d', // Dark cards (used as a base for gradients now)
  text_color_1: '#FFFFFF', // White text
  text_color_2: '#C4C4C4', // Your secondary text
  status_green: '#80D97E', // Your green
  status_red: '#DA4035', // Your red
  accent: '#928dab', // Your surface color as accent
  gold: '#FFD700', // Bright gold
  goldDark: '#B8860B', // Darker gold
  goldLight: '#FFFF99', // Light gold for shimmer
  shadow: 'rgba(0, 0, 0, 0.5)', // Stronger shadow for depth
  cardGradient: ['#2d2d2d', '#1a1a1a'], // Darker gradient for cards
  shimmer: 'rgba(255, 215, 0, 0.3)', // Gold shimmer
};

const {width} = Dimensions.get('window'); // Only need width for horizontal padding

const EventCard = ({event, onPress, onEdit, onDelete}) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'running': return colors.status_green;
      case 'completed': return colors.textSecondary; // Grey for completed
      case 'upcoming': return colors.accent; // Blue-ish for upcoming
      case 'cancelled': return colors.status_red;
      default: return colors.textSecondary;
    }
  };

  // Helper function to parse event type
  const parseEventType = (eventType) => {
    try {
      if (typeof eventType === 'string') {
        const parsed = JSON.parse(eventType.replace(/'/g, '"'));
        return parsed.label || 'N/A';
      }
      return eventType?.label || 'N/A';
    } catch {
      return 'N/A';
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardWrapper} // Wrapper for shadow and gradient
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text style={styles.eventName} numberOfLines={2}>
              {event.name || 'Untitled Event'}
            </Text>
            <View style={[styles.statusBadge, {backgroundColor: getStatusColor(event.state)}]}>
              <Text style={styles.statusText}>{event.state || 'N/A'}</Text>
            </View>
          </View>

          <Text style={styles.eventDate}>
            {formatDate(event.event_date)}
          </Text>

          {/* Description Section */}
          {event.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText} numberOfLines={3}>
                {event.description}
              </Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Address Row */}
          <View style={styles.detailRow}> {/* Changed to detailRow for consistent spacing */}
            <Text style={styles.detailLabel}>Location</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.detailValueLocation}>
                {event.event_address || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Organizer Row */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Organizer</Text>
            <Text style={styles.detailValue}>
              {event.event_organiser || 'N/A'}
            </Text>
          </View>

          {/* Event Type Row */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>
              {parseEventType(event.event_type)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Action Buttons at Bottom */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Text style={styles.actionButtonIcon}>✏️</Text>
            <Text style={styles.actionLabelText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
            <Text style={styles.actionButtonIcon}>🗑️</Text>
            <Text style={styles.actionLabelText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Accent */}
        <View style={[styles.bottomAccent, {backgroundColor: colors.gold}]} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 16, // Consistent rounded corners
    marginVertical: 10,
    marginHorizontal: width * 0.04, // Responsive horizontal margin
    overflow: 'hidden', // Clip content to border radius
    // Premium shadow
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 }, // More pronounced shadow
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12, // For Android shadow
    borderWidth: 1, // Subtle border
    borderColor: colors.border, // Border color
  },
  gradientBackground: {
    flex: 1,
    padding: 0, // Padding handled by internal sections
  },
  headerSection: {
    padding: 20,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventName: {
    ...typography.headline, // Use a headline style if available
    fontSize: 20,
    fontWeight: '700',
    color: colors.text_color_1, // White text for main title
    flex: 1,
    marginRight: 12,
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Subtle text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12, // More rounded badge
    alignSelf: 'flex-start',
    minWidth: 70, // Ensure minimum width for consistency
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', // Subtle border for badge
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text_color_1, // White text for status
    textTransform: 'uppercase', // Uppercase for status
    letterSpacing: 0.5,
  },
  eventDate: {
    ...typography.body2, // Use a body style if available
    fontSize: 14,
    fontWeight: '500',
    color: colors.text_color_2, // Secondary text color for date
    marginTop: 4,
  },
  descriptionContainer: {
    marginTop: 16, // Increased margin
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border, // Divider color from palette
  },
  descriptionText: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '400',
    color: colors.text_color_2, // Secondary text color for description
    lineHeight: 22,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border, // Divider color from palette
    marginHorizontal: 20,
  },
  detailsSection: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationContainer: {
    flex: 1, // Allow location text to wrap and take available space
    marginTop: 4,
    paddingLeft: 0,
  },
  detailLabel: {
    ...typography.caption, // Use a caption style if available
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary, // Lighter gray for labels
    width: 80, // Fixed width for labels
    textTransform: 'uppercase',
    letterSpacing: 0.8, // More prominent letter spacing
  },
  detailValue: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '400',
    color: colors.text_color_1, // White text for values
    flex: 1,
    textAlign: 'right',
    lineHeight: 20,
  },
  detailValueLocation: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '400',
    color: colors.text_color_1, // White text for location
    lineHeight: 20,
    textAlign: 'right', // Align location text to the right
  },
  bottomAccent: {
    height: 4, // Slightly thicker accent line
    width: '100%',
    backgroundColor: colors.gold, // Use gold for the accent
  },
  actionButtonsContainer: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "flex-end", // Align buttons to the right
    gap: 15, // Space between buttons
  },
  actionButton: {
    flexDirection: 'row', // Icon and text side-by-side
    alignItems: 'center',
    backgroundColor: colors.surface, // Dark background for buttons
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10, // Rounded buttons
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow, // Subtle shadow for buttons
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonIcon: {
    fontSize: 18, // Size for emoji icons
    marginRight: 6, // Space between icon and text
  },
  actionLabelText: {
    ...typography.button, // Use a button text style if available
    fontSize: 14,
    fontWeight: '600',
    color: colors.text_color_1, // White text for button labels
  },
  deleteButton: {
    backgroundColor: colors.status_red, // Red background for delete button
    borderColor: colors.status_red,
  },
});

export default EventCard;
