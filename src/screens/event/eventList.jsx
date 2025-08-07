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
            placeholderTextColor={colors.textSecondary}
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
            tintColor={colors.gold}
            colors={[colors.gold]}
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
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  tabButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 4,
  },

  tabButtonTextSelected: {
    color: colors.text_color_1,
  },

  tabCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  tabCountTextSelected: {
    color: colors.gold,
    fontWeight: '600',
  },

  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text_color_1,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterIconButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  filterIcon: {
    fontSize: 18,
    color: colors.background,
  },

  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeFiltersText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  clearFiltersText: {
    fontSize: 12,
    color: colors.gold,
    fontWeight: '600',
  },

  flatListContent: {
    padding: cardMargin,
    paddingBottom: 100,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 64,
    marginBottom: 20,
    opacity: 0.6,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 12,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },

  createEventButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  createEventButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: colors.goldDark,
  },

  floatingButtonText: {
    fontSize: 28,
    color: colors.background,
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text_color_1,
  },

  modalCloseText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 30,
  },

  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 16,
  },

  filterButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },

  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterButtonSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.goldDark,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  filterButtonTextSelected: {
    color: colors.background,
    fontWeight: '700',
  },

  modalActions: {
    flexDirection: 'row',
    gap: 14,
  },

  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  clearButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  applyButtonText: {
    fontSize: 16,
    color: colors.background,
    fontWeight: '700',
  },
});

export default ListEvent;