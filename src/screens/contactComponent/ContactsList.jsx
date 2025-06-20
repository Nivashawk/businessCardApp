// components/contacts/ContactsList.js
import React from 'react';
import {FlatList, View, RefreshControl} from 'react-native';
import {colors} from '../../theme/colors';
import EmptyState from './EmptyState';
import {mainStyles, listStyles} from './styles';

const ContactsList = ({
  data,
  activeTab,
  onRefresh,
  refreshing,
  isLoading,
  searchQuery,
  activeFilterCount,
  renderItem, // This prop is now used directly
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={item => `${activeTab}-${item.id || item.log_id}`}
      renderItem={renderItem} // Use the passed renderItem prop
      contentContainerStyle={mainStyles.listContainer}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={listStyles.separator} />}
      ListEmptyComponent={
        !isLoading && data.length === 0 ? (
          <EmptyState
            activeTab={activeTab}
            searchQuery={searchQuery}
            activeFilterCount={activeFilterCount}
          />
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    />
  );
};

export default ContactsList;