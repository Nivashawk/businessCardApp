import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  RefreshControl, // <-- Import RefreshControl
} from 'react-native';
import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import EventCard from '../../components/cards/eventCard';
import {colors} from '../../theme/colors';
import {useNavigation} from '@react-navigation/native';
import {listEvents} from '../../redux/slices/events/listEvents';
import { deleteEvent } from '../../redux/slices/events/deleteEvents';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const cardMargin = 6;

const ListEvent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all'); // all, today, week, month, past
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // <-- New state for refreshing

  const listEventsData = useSelector(
    state => state.listEventsData?.data?.response?.result?.events ?? [],
  );
  const listEventsLoading = useSelector( // Get loading state for events
    state => state.listEventsData?.loading,
  );

  // Function to fetch events
  const fetchEvents = useCallback(() => {
    dispatch(listEvents());
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents(); // Fetch events when screen gains focus
    }, [fetchEvents]),
  );

  // Effect to stop refresh indicator when data fetching completes
  useEffect(() => {
    if (!listEventsLoading && refreshing) {
      setRefreshing(false);
    }
  }, [listEventsLoading, refreshing]);


  // Filter events based on search and date
  const filteredEvents = useMemo(() => {
    let filtered = listEventsData;

    // Filter by search text (name)
    if (searchText.trim()) {
      filtered = filtered.filter(event =>
        event.name?.toLowerCase().includes(searchText.toLowerCase().trim()),
      );
    }

    // Filter by date
    if (selectedDateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to start of day for accurate comparisons

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0); // Normalize event date to start of day

        switch (selectedDateFilter) {
          case 'today':
            return eventDate.getTime() === today.getTime();
          case 'week':
            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= endOfWeek;
          case 'month':
            const endOfMonth = new Date(today);
            endOfMonth.setMonth(today.getMonth() + 1);
            return eventDate >= today && eventDate <= endOfMonth;
          case 'past':
            return eventDate < today;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [listEventsData, searchText, selectedDateFilter]);

  const handleEventPress = eventData => {
    console.log('eventData', eventData);
    // You might want to navigate to a detailed event view here
    // navigation.navigate('EventDetails', { event: eventData });
  };

  const handleEdit = id => {
    console.log('Edit event id:', id);
    navigation.navigate('UpdateEvents', {id}); // Assuming 'UpdateEvents' is your edit screen
  };

  const handleDelete = id => {
    console.log('Delete event id:', id);
    dispatch(deleteEvent({event_id:id}))
      .unwrap() // Use unwrap to handle pending/fulfilled/rejected status
      .then(() => {
        console.log('Event deleted successfully, refreshing list...');
        handleManualRefresh(); // Refresh list after successful deletion
      })
      .catch(error => {
        console.error('Failed to delete event:', error);
        // Handle error, e.g., show a toast message
      });
  };

  const handleAddNewEvent = () => {
    console.log('Navigate to add new event');
    navigation.navigate('CreateEvent');
  };

  // Pull-to-refresh handler
  const onPullToRefresh = useCallback(() => {
    setRefreshing(true); // Start showing the refresh indicator
    fetchEvents(); // Trigger the fetch
  }, [fetchEvents]);

  // Manual refresh for after delete
  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true); // Show indicator for manual refresh too
    fetchEvents();
  };


  const clearFilters = () => {
    setSearchText('');
    setSelectedDateFilter('all');
    setShowFilterModal(false);
  };

  const FilterButton = ({title, value, isSelected}) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
      onPress={() => setSelectedDateFilter(value)}>
      <Text
        style={[
          styles.filterButtonText,
          isSelected && styles.filterButtonTextSelected,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search and Filter Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events by name..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => setShowFilterModal(true)}>
            <Text style={styles.filterIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Active Filters Display */}
        {(searchText || selectedDateFilter !== 'all') ? ( // Only show if filters are active
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>
              Filters: {searchText && `"${searchText}"`}{' '}
              {selectedDateFilter !== 'all' && `• ${selectedDateFilter.charAt(0).toUpperCase() + selectedDateFilter.slice(1)}`}
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <EventCard
            event={item}
            onPress={() => handleEventPress(item)}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={() => (
          !listEventsLoading && filteredEvents.length === 0 ? ( // Only show empty state if not loading and filtered list is truly empty
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📅</Text>
              <Text style={styles.emptyTitle}>No events found</Text>
              <Text style={styles.emptySubtitle}>
                {searchText || selectedDateFilter !== 'all'
                  ? 'Try adjusting your filters or clear them'
                  : 'Create your first event to see it here'}
              </Text>
              {!(searchText || selectedDateFilter !== 'all') && ( // Offer to create event only if no filters are active
                <TouchableOpacity
                  style={styles.createEventButton}
                  onPress={handleAddNewEvent}
                >
                  <Text style={styles.createEventButtonText}>Create Event Now</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null // Don't show empty component if loading or data is available
        )}
        // Pull-to-refresh implementation
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onPullToRefresh}
            tintColor={colors.primary} // iOS spinner color
            colors={[colors.primary]} // Android spinner color
          />
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddNewEvent}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Events</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>Filter by Date</Text>
            <View style={styles.filterButtonsContainer}>
              <FilterButton
                title="All"
                value="all"
                isSelected={selectedDateFilter === 'all'}
              />
              <FilterButton
                title="Today"
                value="today"
                isSelected={selectedDateFilter === 'today'}
              />
              <FilterButton
                title="This Week"
                value="week"
                isSelected={selectedDateFilter === 'week'}
              />
              <FilterButton
                title="This Month"
                value="month"
                isSelected={selectedDateFilter === 'month'}
              />
              <FilterButton
                title="Past Events"
                value="past"
                isSelected={selectedDateFilter === 'past'}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  filterIconButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },

  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 8, // Added margin for spacing
  },

  activeFiltersText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  clearFiltersText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  flatListContent: {
    padding: cardMargin,
    paddingBottom: 100, // Space for floating button
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20, // Added margin below subtitle
  },

  createEventButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  createEventButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  floatingButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  modalCloseText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },

  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },

  filterButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  filterButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  filterButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },

  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },

  clearButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },

  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },

  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ListEvent;