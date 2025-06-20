// components/contacts/SearchBarAndFilter.js
import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {mainStyles} from './styles'; // Import styles

const SearchBarAndFilter = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  onShowFilterModal,
  activeFilterCount,
}) => (
  <View style={mainStyles.searchFilterContainer}>
    <View style={mainStyles.searchContainer}>
      <Text style={mainStyles.searchIcon}>🔍</Text>
      <TextInput
        style={mainStyles.searchInput}
        placeholder={`Search ${activeTab.toLowerCase()}...`}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#9CA3AF"
      />
      {searchQuery !== '' && (
        <TouchableOpacity
          onPress={() => setSearchQuery('')}
          style={mainStyles.clearButton}>
          <Text style={mainStyles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>

    <TouchableOpacity
      style={[
        mainStyles.filterButton,
        activeFilterCount > 0 && mainStyles.activeFilterButton,
      ]}
      onPress={onShowFilterModal}>
      <Text
        style={[
          mainStyles.filterIcon,
          activeFilterCount > 0 && mainStyles.activeFilterIcon,
        ]}>
        ⚙️
      </Text>
      {activeFilterCount > 0 && (
        <View style={mainStyles.filterBadge}>
          <Text style={mainStyles.filterBadgeText}>{activeFilterCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  </View>
);

export default SearchBarAndFilter;