// components/contacts/EmptyState.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {mainStyles} from './styles'; // Import styles

const EmptyState = ({activeTab, searchQuery, activeFilterCount}) => {
  const getEmptyMessage = () => {
    if (searchQuery || activeFilterCount > 0) {
      return 'Try adjusting your search or filters';
    } else {
      return activeTab === 'Shared Contacts'
        ? "You haven't shared any business contacts yet."
        : "You haven't received any business contacts yet.";
    }
  };

  return (
    <View style={mainStyles.emptyContainer}>
      <Text style={mainStyles.emptyText}>
        {activeTab === 'Shared Contacts' ? '📤' : '📥'}
      </Text>
      <Text style={mainStyles.emptyTitle}>
        No {activeTab.toLowerCase()} found
      </Text>
      <Text style={mainStyles.emptySubtitle}>{getEmptyMessage()}</Text>
    </View>
  );
};

export default EmptyState;