// components/contacts/EmptyState.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {mainStyles} from './styles'; // Import styles

const EmptyState = ({activeTab, searchQuery, activeFilterCount}) => {
  const getEmptyMessage = () => {
    if (searchQuery || activeFilterCount > 0) {
      return 'Try adjusting your search or filters';
    } else {
      switch (activeTab) {
        case 'Shared Contacts':
          return "You haven't shared any business contacts yet.";
        case 'Received Contacts':
          return "You haven't received any business contacts yet.";
        case 'Manual Contacts':
          return "You haven't added any manual contacts yet. Data stored here is temporary and saved only in your device's local storage.";
        default:
          return "No contacts found.";
      }
    }
  };

  const getEmptyIcon = () => {
    switch (activeTab) {
      case 'Shared Contacts':
        return '📤';
      case 'Received Contacts':
        return '📥';
      case 'Manual Contacts':
        return '📝';
      default:
        return '📋';
    }
  };

  return (
    <View style={mainStyles.emptyContainer}>
      <Text style={mainStyles.emptyText}>
        {getEmptyIcon()}
      </Text>
      <Text style={mainStyles.emptyTitle}>
        No {activeTab.toLowerCase()} found
      </Text>
      <Text style={mainStyles.emptySubtitle}>{getEmptyMessage()}</Text>
    </View>
  );
};

export default EmptyState;