import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Platform} from 'react-native';
import {typography} from '../../theme/typography'; // Assuming these are defined and provide sensible defaults
import {colors} from '../../theme/colors';     // Assuming these are defined and provide sensible defaults

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
      case 'running': return '#10B981';
      case 'completed': return '#6B7280';
      case 'upcoming': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Helper function to parse event type (kept as is, it's not style-related)
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

  const cardStyles = Platform.select({
    ios: styles.iosCardContainer,
    android: styles.androidCardContainer,
  });

  const nameStyles = Platform.select({
    ios: styles.iosEventName,
    android: styles.androidEventName,
  });

  const dateStyles = Platform.select({
    ios: styles.iosEventDate,
    android: styles.androidEventDate,
  });

  const descriptionTxtStyles = Platform.select({
    ios: styles.iosDescription,
    android: styles.androidDescription,
  });

  const detailLabelStyles = Platform.select({
    ios: styles.iosDetailLabel,
    android: styles.androidDetailLabel,
  });

  const detailValueStyles = Platform.select({
    ios: styles.iosDetailValue,
    android: styles.androidDetailValue,
  });

  const detailValueLocationStyles = Platform.select({
    ios: styles.iosDetailValueLocation,
    android: styles.androidDetailValueLocation,
  });


  return (
    <TouchableOpacity style={cardStyles} onPress={onPress}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <Text style={nameStyles} numberOfLines={2}>
            {event.name || 'Untitled Event'}
          </Text>
          <View style={[styles.statusBadge, {backgroundColor: getStatusColor(event.state)}]}>
            <Text style={styles.statusText}>{event.state || 'N/A'}</Text>
          </View>
        </View>

        <Text style={dateStyles}>
          {formatDate(event.event_date)}
        </Text>

        {/* Description Section */}
        {event.description && (
          <View style={styles.descriptionContainer}>
            <Text style={descriptionTxtStyles} numberOfLines={3}>
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
        <View style={styles.detailRowLocation}>
          <Text style={detailLabelStyles}>Location</Text>
          <View style={styles.locationContainer}>
            <Text style={detailValueLocationStyles}>
              {event.event_address || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Organizer Row */}
        <View style={styles.detailRow}>
          <Text style={detailLabelStyles}>Organizer</Text>
          <Text style={detailValueStyles}>
            {event.event_organiser || 'N/A'}
          </Text>
        </View>

        {/* Event Type Row */}
        <View style={styles.detailRow}>
          <Text style={detailLabelStyles}>Type</Text>
          <Text style={detailValueStyles}>
            {parseEventType(event.event_type)}
          </Text>
        </View>
      </View>

       <View style={styles.divider} />

      {/* Action Buttons at Bottom */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.actionButton, {alignItems:"center"}]} onPress={onEdit}>
          <Text style={styles.actionButtonText}>✏️</Text>
          <Text style={styles.actionLabel}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton, {alignItems:"center"}]} onPress={onDelete}>
          <Text style={styles.actionButtonText}>🗑️</Text>
          <Text style={styles.actionLabel}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Accent */}
      <View style={[styles.bottomAccent, {backgroundColor: colors.primary}]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base styles (common to both platforms or default Android)
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
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
  detailRowLocation: {
    marginBottom: 12,
  },
  locationContainer: {
    marginTop: 4,
    paddingLeft: 0,
  },
  bottomAccent: {
    height: 3,
    width: '100%',
  },
  actionButtonsContainer:{
    flexDirection: "row",
    padding:"5%",
    gap:"5%",
    alignItems:"center",
    justifyContent:"flex-end"
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginTop: 4,
  },


  // Android Specific Styles (largely from your original, with slight adjustments for clarity)
  androidCardContainer: {
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  androidEventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  androidEventDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  androidDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  androidDetailLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    width: 80,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  androidDetailValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
    flex: 1,
    textAlign: 'right',
    lineHeight: 20,
  },
  androidDetailValueLocation: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
    lineHeight: 20,
    textAlign: 'left',
  },

  // iOS Specific Styles
  iosCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Slightly less rounded corners often look better on iOS
    marginVertical: 10, // Adjust vertical margin
    marginHorizontal: 18, // Adjust horizontal margin
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3, // More pronounced shadow for iOS
    },
    shadowOpacity: 0.15, // Slightly higher opacity
    shadowRadius: 10, // Larger shadow radius
    overflow: 'visible', // Allow shadow to extend beyond bounds
  },
  iosEventName: {
    fontSize: 19, // Slightly larger font size
    fontWeight: '600', // Typically 'semibold' for titles on iOS
    color: '#2C2C2C', // Darker text for more contrast
    flex: 1,
    marginRight: 10,
    lineHeight: 25,
    // fontFamily: typography.ios.bodyBold, // Example: if you have platform-specific fonts
  },
  iosEventDate: {
    fontSize: 13, // Slightly smaller
    fontWeight: '400', // Regular weight
    color: '#8E8E93', // iOS gray color
    marginTop: 5,
    // fontFamily: typography.ios.body,
  },
  iosDescription: {
    fontSize: 13, // Smaller description text
    fontWeight: '300', // Lighter weight for italic text
    color: '#4A4A4A',
    lineHeight: 18,
    fontStyle: 'italic',
    // fontFamily: typography.ios.bodyLightItalic,
  },
  iosDetailLabel: {
    fontSize: 12, // Smaller label
    fontWeight: '500',
    color: '#C7C7CD', // Lighter gray for labels
    width: 70, // Adjust width if needed
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    // fontFamily: typography.ios.caption1,
  },
  iosDetailValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1C1C1E', // Darker value text
    flex: 1,
    textAlign: 'right',
    lineHeight: 20,
    // fontFamily: typography.ios.body,
  },
  iosDetailValueLocation: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1C1C1E', // Darker value text
    lineHeight: 20,
    textAlign: 'left',
    // fontFamily: typography.ios.body,
  },
  // You might want to adjust action button styles for iOS as well,
  // potentially using icons instead of emojis for better native feel.
  // For example, using react-native-vector-icons
  // iosActionButton: {
  //   backgroundColor: '#F0F0F0',
  //   borderRadius: 5,
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  // },
  // iosActionButtonText: {
  //   color: colors.primary,
  //   fontWeight: '600',
  // },
});

export default EventCard;