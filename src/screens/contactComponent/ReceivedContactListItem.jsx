// components/contacts/ReceivedContactListItem.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {listStyles} from './styles'; // Import styles

const ReceivedContactListItem = ({item, onPress}) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getEventColor = eventName => {
    const colorsMap = {
      TESTING: '#3B82F6',
      CONFERENCE: '#10B981',
      WORKSHOP: '#F59E0B',
      NETWORKING: '#8B5CF6',
      DEFAULT: '#6B7280',
    };
    return colorsMap[eventName?.toUpperCase()] || colorsMap.DEFAULT;
  };

  return (
    <TouchableOpacity
      style={listStyles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}>
      {/* Business Avatar */}
      <View style={listStyles.avatar}>
        <Text style={listStyles.avatarText}>
          {item.business_name?.charAt(0).toUpperCase() || 'N'}
        </Text>
      </View>

      {/* Main Content */}
      <View style={listStyles.content}>
        <View style={listStyles.topRow}>
          <Text style={listStyles.businessName} numberOfLines={1}>
            {item.business_name || 'Unknown Business'}
          </Text>
          <View style={listStyles.rightSection}>
            <View
              style={[
                listStyles.eventBadge,
                {backgroundColor: getEventColor(item.event_name)},
              ]}>
              <Text style={listStyles.eventText}>
                {item.event_name || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={listStyles.bottomRow}>
          <Text style={listStyles.dateText} numberOfLines={1}>
            📥 Received: {formatDate(item.share_date)}
          </Text>
          <Text style={listStyles.senderText} numberOfLines={1}>
            from {item.shared_by_name || 'Unknown'}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <View style={listStyles.chevron}>
        <Text style={listStyles.chevronText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReceivedContactListItem;