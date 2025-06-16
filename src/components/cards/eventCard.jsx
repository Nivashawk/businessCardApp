import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';

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
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
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
            <Text style={styles.description} numberOfLines={3}>
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
            {event.event_type || 'N/A'}
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
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },

  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
    fontStyle: 'italic',
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
  
  eventDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
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

  detailValueLocation: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
    lineHeight: 20,
    textAlign: 'left',
  },
  
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    width: 80,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  detailValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
    flex: 1,
    textAlign: 'right',
    lineHeight: 20,
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
  }
});

export default EventCard;