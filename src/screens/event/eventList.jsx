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
  RefreshControl,
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
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('active'); // 'active' or 'expired'

  const listEventsData = useSelector(
    state => state.listEventsData?.data?.response?.result?.events ?? [],
  );
  const listEventsLoading = useSelector(
    state => state.listEventsData?.loading,
  );

  // Function to check if event is expired
  const isEventExpired = useCallback((eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    return event < today;
  }, []);

  // Function to fetch events
  const fetchEvents = useCallback(() => {
    dispatch(listEvents());
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents]),
  );

  // Effect to stop refresh indicator when data fetching completes
  useEffect(() => {
    if (!listEventsLoading && refreshing) {
      setRefreshing(false);
    }
  }, [listEventsLoading, refreshing]);

  // Separate events into active and expired
  const categorizedEvents = useMemo(() => {
    const active = [];
    const expired = [];
    
    listEventsData.forEach(event => {
      if (isEventExpired(event.event_date)) {
        expired.push(event);
      } else {
        active.push(event);
      }
    });
    
    return { active, expired };
  }, [listEventsData, isEventExpired]);

  // Filter events based on search, date, and selected tab
  const filteredEvents = useMemo(() => {
    let filtered = selectedTab === 'active' ? categorizedEvents.active : categorizedEvents.expired;

    // Filter by search text (name)
    if (searchText.trim()) {
      filtered = filtered.filter(event =>
        event.name?.toLowerCase().includes(searchText.toLowerCase().trim()),
      );
    }

    // Filter by date (works for both active and expired events)
    if (selectedDateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);

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
  }, [categorizedEvents, searchText, selectedDateFilter, selectedTab]);

  const handleEventPress = eventData => {
    // Only allow press for active events
    if (selectedTab === 'active' && !isEventExpired(eventData.event_date)) {
      console.log('eventData', eventData);
      // navigation.navigate('EventDetails', { event: eventData });
    }
  };

  const handleEdit = id => {
    // Find the event to check if it's expired
    const event = listEventsData.find(e => e.id === id);
    if (event && !isEventExpired(event.event_date)) {
      console.log('Edit event id:', id);
      navigation.navigate('UpdateEvents', {id});
    }
  };

  const handleDelete = id => {
    // Allow deletion for both active and expired events
    console.log('Delete event id:', id);
    dispatch(deleteEvent({event_id:id}))
      .unwrap()
      .then(() => {
        console.log('Event deleted successfully, refreshing list...');
        handleManualRefresh();
      })
      .catch(error => {
        console.error('Failed to delete event:', error);
      });
  };

  const handleAddNewEvent = () => {
    console.log('Navigate to add new event');
    navigation.navigate('CreateEvent');
  };

  const onPullToRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
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

  const TabButton = ({title, value, isSelected, count}) => (
    <TouchableOpacity
      style={[styles.tabButton, isSelected && styles.tabButtonSelected]}
      onPress={() => {
        setSelectedTab(value);
        // Clear filters when switching tabs
        setSearchText('');
        setSelectedDateFilter('all');
      }}>
      <Text style={[styles.tabButtonText, isSelected && styles.tabButtonTextSelected]}>
        {title}
      </Text>
      <Text style={[styles.tabCountText, isSelected && styles.tabCountTextSelected]}>
        ({count})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          title="Active Events"
          value="active"
          isSelected={selectedTab === 'active'}
          count={categorizedEvents.active.length}
        />
        <TabButton
          title="Expired Events"
          value="expired"
          isSelected={selectedTab === 'expired'}
          count={categorizedEvents.expired.length}
        />
      </View>

      {/* Search and Filter Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={selectedTab === 'active' ? "Search events by name..." : "Search expired events by name..."}
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
        {(searchText || selectedDateFilter !== 'all') && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>
              Filters: {searchText && `"${searchText}"`}{' '}
              {selectedDateFilter !== 'all' && `• ${selectedDateFilter.charAt(0).toUpperCase() + selectedDateFilter.slice(1)}`}
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
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
            isExpired={selectedTab === 'expired'}
            disabled={selectedTab === 'expired'}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={() => (
          !listEventsLoading && filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedTab === 'active' ? '📅' : '🗓️'}
              </Text>
              <Text style={styles.emptyTitle}>
                {selectedTab === 'active' ? 'No active events found' : 'No expired events found'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedTab === 'active'
                  ? (searchText || selectedDateFilter !== 'all'
                      ? 'Try adjusting your filters or clear them'
                      : 'Create your first event to see it here')
                  : 'No expired events to display'}
              </Text>
              {selectedTab === 'active' && !(searchText || selectedDateFilter !== 'all') && (
                <TouchableOpacity
                  style={styles.createEventButton}
                  onPress={handleAddNewEvent}>
                  <Text style={styles.createEventButtonText}>Create Event Now</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onPullToRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      {/* Floating Add Button - Only show for active events */}
      {selectedTab === 'active' && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleAddNewEvent}>
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Filter {selectedTab === 'active' ? 'Active' : 'Expired'} Events
              </Text>
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
              {selectedTab === 'active' ? (
                <>
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
                </>
              ) : (
                <>
                  <FilterButton
                    title="Past Week"
                    value="week"
                    isSelected={selectedDateFilter === 'week'}
                  />
                  <FilterButton
                    title="Past Month"
                    value="month"
                    isSelected={selectedDateFilter === 'month'}
                  />
                  <FilterButton
                    title="All Past"
                    value="past"
                    isSelected={selectedDateFilter === 'past'}
                  />
                </>
              )}
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

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },

  tabButtonSelected: {
    backgroundColor: colors.primary,
  },

  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },

  tabButtonTextSelected: {
    color: '#FFFFFF',
  },

  tabCountText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  tabCountTextSelected: {
    color: '#FFFFFF',
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

  clearSearchButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },

  clearSearchText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },

  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 8,
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
    paddingBottom: 100,
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
    marginBottom: 20,
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
    bottom: 30,
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