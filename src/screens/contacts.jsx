import React, {useState, useEffect, useMemo, useCallback} from 'react'; // Import useCallback
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList,
  StatusBar,
  Dimensions,
  RefreshControl, // <-- Import RefreshControl
} from 'react-native';
import {colors} from '../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import {sharedBusiness} from '../redux/slices/business/sharedBusinessSlices';
import {receivedBusiness} from '../redux/slices/business/receivedBusinessSlices';

const {width} = Dimensions.get('window');

// Tab Switcher Component
const TabSwitcher = ({activeTab, setActiveTab}) => (
  <View style={tabStyles.container}>
    {['Shared Contacts', 'Received Contacts'].map(tab => (
      <TouchableOpacity
        key={tab}
        onPress={() => setActiveTab(tab)}
        style={[tabStyles.tab, activeTab === tab && tabStyles.activeTab]}
        activeOpacity={0.7}>
        <Text
          style={[
            tabStyles.tabText,
            activeTab === tab && tabStyles.activeTabText,
          ]}>
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// Filter Modal Component
const FilterModal = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  activeTab,
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  // Consider making these dynamic based on actual data if possible,
  // or fetching them from an API if they are truly exhaustive.
  const eventTypes = ['ALL', 'TESTING', 'CONFERENCE', 'WORKSHOP', 'NETWORKING'];
  const dateRanges = ['ALL', 'TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS'];

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      eventType: 'ALL',
      dateRange: 'ALL',
      businessName: '',
      personName: '',
    };
    setTempFilters(resetFilters);
    onApplyFilters(resetFilters); // Apply reset filters immediately
    onClose();
  };

  // Keep tempFilters in sync with external filters prop
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={filterStyles.overlay}>
        <View style={filterStyles.modalContainer}>
          <View style={filterStyles.header}>
            <Text style={filterStyles.title}>Filter {activeTab}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={filterStyles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Event Type Filter */}
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>Event Type</Text>
              <View style={filterStyles.optionContainer}>
                {eventTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      filterStyles.optionButton,
                      tempFilters.eventType === type &&
                        filterStyles.selectedOption,
                    ]}
                    onPress={() =>
                      setTempFilters({...tempFilters, eventType: type})
                    }>
                    <Text
                      style={[
                        filterStyles.optionText,
                        tempFilters.eventType === type &&
                          filterStyles.selectedOptionText,
                      ]}>
                      {type.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range Filter */}
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>Date Range</Text>
              <View style={filterStyles.optionContainer}>
                {dateRanges.map(range => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      filterStyles.optionButton,
                      tempFilters.dateRange === range &&
                        filterStyles.selectedOption,
                    ]}
                    onPress={() =>
                      setTempFilters({...tempFilters, dateRange: range})
                    }>
                    <Text
                      style={[
                        filterStyles.optionText,
                        tempFilters.dateRange === range &&
                          filterStyles.selectedOptionText,
                      ]}>
                      {range.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Business Name Filter */}
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>Business Name</Text>
              <TextInput
                style={filterStyles.textInput}
                placeholder="Enter business name..."
                value={tempFilters.businessName}
                onChangeText={text =>
                  setTempFilters({...tempFilters, businessName: text})
                }
              />
            </View>

            {/* Person Name Filter */}
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>
                {activeTab === 'Shared Contacts'
                  ? 'Recipient Name'
                  : 'Sender Name'}
              </Text>
              <TextInput
                style={filterStyles.textInput}
                placeholder={`Enter ${
                  activeTab === 'Shared Contacts' ? 'recipient' : 'sender'
                } name...`}
                value={tempFilters.personName}
                onChangeText={text =>
                  setTempFilters({...tempFilters, personName: text})
                }
              />
            </View>
          </ScrollView>

          <View style={filterStyles.buttonContainer}>
            <TouchableOpacity
              style={[filterStyles.button, filterStyles.resetButton]}
              onPress={handleReset}>
              <Text style={filterStyles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[filterStyles.button, filterStyles.applyButton]}
              onPress={handleApply}>
              <Text style={filterStyles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Shared Contact Card Component
const SharedContactCard = ({item, onPress}) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Return original if invalid date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    return colorsMap[eventName?.toUpperCase()] || colorsMap.DEFAULT; // Ensure uppercase for matching
  };

  return (
    <TouchableOpacity
      style={cardStyles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}>
      {/* Header with Business Name and Event Badge */}
      <View style={cardStyles.header}>
        <View style={cardStyles.businessInfo}>
          <View style={cardStyles.businessLogo}>
            <Text style={cardStyles.logoText}>
              {item.business_name?.charAt(0).toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={cardStyles.businessDetails}>
            <Text style={cardStyles.businessName} numberOfLines={1}>
              {item.business_name || 'Unknown Business'}
            </Text>
            <Text style={cardStyles.businessId}>ID: {item.business_id || 'N/A'}</Text>
          </View>
        </View>
        <View
          style={[
            cardStyles.eventBadge,
            {backgroundColor: getEventColor(item.event_name)},
          ]}>
          <Text style={cardStyles.eventText}>{item.event_name || 'N/A'}</Text>
        </View>
      </View>

      {/* Recipient Information */}
      <View style={cardStyles.recipientSection}>
        <Text style={cardStyles.sectionTitle}>Shared with:</Text>
        <View style={cardStyles.recipientInfo}>
          <View style={cardStyles.recipientAvatar}>
            <Text style={cardStyles.recipientInitial}>
              {item.recipient_name?.charAt(0).toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={cardStyles.recipientDetails}>
            <Text style={cardStyles.recipientName}>{item.recipient_name || 'Unknown Recipient'}</Text>
            <Text style={cardStyles.recipientId}>
              Recipient ID: {item.recipient_id || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer with Date and Log ID */}
      <View style={cardStyles.footer}>
        <Text style={cardStyles.dateText}>
          📤 Shared: {formatDate(item.shared_at)}
        </Text>
        <Text style={cardStyles.logId}>Log #{item.log_id || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Received Contact Card Component
const ReceivedContactCard = ({item, onPress}) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Return original if invalid date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    return colorsMap[eventName?.toUpperCase()] || colorsMap.DEFAULT; // Ensure uppercase for matching
  };

  return (
    <TouchableOpacity
      style={cardStyles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}>
      {/* Header with Business Name and Event Badge */}
      <View style={cardStyles.header}>
        <View style={cardStyles.businessInfo}>
          <View style={cardStyles.businessLogo}>
            <Text style={cardStyles.logoText}>
              {item.business_name?.charAt(0).toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={cardStyles.businessDetails}>
            <Text style={cardStyles.businessName} numberOfLines={1}>
              {item.business_name || 'Unknown Business'}
            </Text>
            <Text style={cardStyles.businessId}>ID: {item.business_id || 'N/A'}</Text>
          </View>
        </View>
        <View
          style={[
            cardStyles.eventBadge,
            {backgroundColor: getEventColor(item.event_name)},
          ]}>
          <Text style={cardStyles.eventText}>{item.event_name || 'N/A'}</Text>
        </View>
      </View>

      {/* Sender Information */}
      <View style={cardStyles.recipientSection}>
        <Text style={cardStyles.sectionTitle}>Received from:</Text>
        <View style={cardStyles.recipientInfo}>
          <View style={cardStyles.senderAvatar}>
            <Text style={cardStyles.recipientInitial}>
              {item.shared_by_name?.charAt(0).toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={cardStyles.recipientDetails}>
            <Text style={cardStyles.recipientName}>{item.shared_by_name || 'Unknown Sender'}</Text>
            <Text style={cardStyles.recipientId}>
              Sender ID: {item.shared_by_id || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer with Date and Log ID */}
      <View style={cardStyles.footer}>
        <Text style={cardStyles.dateText}>
          📥 Received: {formatDate(item.share_date)}
        </Text>
        <Text style={cardStyles.logId}>Log #{item.log_id || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Main Component
const Contacts = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Shared Contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    eventType: 'ALL',
    dateRange: 'ALL',
    businessName: '',
    personName: '',
  });
  const [refreshing, setRefreshing] = useState(false); // <-- New state for pull-to-refresh

  const sharedContactsData = useSelector(
    state => state.sharedBusiness?.data?.result?.data ?? [],
  );
  const sharedBusinessLoading = useSelector(state => state.sharedBusiness?.loading); // <-- Get loading state

  const receivedContactsData = useSelector(
    state => state.receivedBusiness?.data?.result?.data ?? [],
  );
  const receivedBusinessLoading = useSelector(state => state.receivedBusiness?.loading); // <-- Get loading state

  // Combined loading state for refresh control
  const isLoading = sharedBusinessLoading || receivedBusinessLoading;


  // Function to fetch all contacts
  const fetchAllContacts = useCallback(() => {
    dispatch(sharedBusiness());
    dispatch(receivedBusiness());
  }, []);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAllContacts();
  }, [fetchAllContacts]);

  // Effect to stop refresh indicator when data fetching completes
  useEffect(() => {
    if (!isLoading && refreshing) {
      setRefreshing(false);
    }
  }, [isLoading, refreshing]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start showing the refresh indicator
    fetchAllContacts(); // Trigger fetch for both types
  }, [fetchAllContacts]);


  // Get current data based on active tab
  const getCurrentData = () => {
    return activeTab === 'Shared Contacts'
      ? sharedContactsData
      : receivedContactsData;
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    const currentData = getCurrentData();

    return currentData.filter(item => {
      // Search filter
      const searchFields = [
        item.business_name,
        item.event_name,
        activeTab === 'Shared Contacts'
          ? item.recipient_name
          : item.shared_by_name, // Changed sender_name to shared_by_name for received contacts
      ];

      const matchesSearch = searchFields.some(field =>
        field?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      // Event type filter
      const matchesEventType =
        filters.eventType === 'ALL' || item.event_name?.toUpperCase() === filters.eventType;

      // Business name filter
      const matchesBusinessName =
        !filters.businessName ||
        item.business_name
          ?.toLowerCase()
          .includes(filters.businessName.toLowerCase());

      // Person name filter
      const personName =
        activeTab === 'Shared Contacts'
          ? item.recipient_name
          : item.shared_by_name; // Changed sender_name to shared_by_name for received contacts
      const matchesPersonName =
        !filters.personName ||
        personName?.toLowerCase().includes(filters.personName.toLowerCase());

      // Date range filter
      let matchesDateRange = true;
      if (filters.dateRange !== 'ALL') {
        const dateField =
          activeTab === 'Shared Contacts' ? item.shared_at : item.share_date; // Corrected to share_date for received
        
        const itemDate = new Date(dateField);
        const now = new Date();
        now.setHours(0,0,0,0); // Normalize 'now' to start of day

        // Handle invalid dates from backend
        if (isNaN(itemDate.getTime())) {
          return false; // Exclude items with invalid dates
        }
        itemDate.setHours(0,0,0,0); // Normalize itemDate to start of day


        switch (filters.dateRange) {
          case 'TODAY':
            matchesDateRange = itemDate.getTime() === now.getTime();
            break;
          case 'LAST_7_DAYS':
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            matchesDateRange = itemDate >= sevenDaysAgo && itemDate <= now;
            break;
          case 'LAST_30_DAYS':
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(now.getDate() - 30);
            matchesDateRange = itemDate >= thirtyDaysAgo && itemDate <= now;
            break;
        }
      }

      return (
        matchesSearch &&
        matchesEventType &&
        matchesBusinessName &&
        matchesPersonName &&
        matchesDateRange
      );
    });
  }, [activeTab, searchQuery, filters, sharedContactsData, receivedContactsData]); // Add data dependencies

  const handleCardPress = item => {
    console.log('Card pressed:', item);
    // You can navigate to a detail screen or perform other actions here
  };

  const handleApplyFilters = newFilters => {
    setFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.eventType !== 'ALL') count++;
    if (filters.dateRange !== 'ALL') count++;
    if (filters.businessName) count++;
    if (filters.personName) count++;
    return count;
  };

  // Reset filters and search query when switching tabs
  useEffect(() => {
    setSearchQuery('');
    setFilters({
      eventType: 'ALL',
      dateRange: 'ALL',
      businessName: '',
      personName: '',
    });
  }, [activeTab]);

  const renderCard = ({item}) => {
    if (activeTab === 'Shared Contacts') {
      return <SharedContactCard item={item} onPress={handleCardPress} />;
    } else {
      return <ReceivedContactCard item={item} onPress={handleCardPress} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Contacts</Text>
        <Text style={styles.headerSubtitle}>
          {filteredData.length} of {getCurrentData().length} contacts
        </Text>
      </View>

      {/* Tab Switcher */}
      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Search and Filter Bar */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery !== '' && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            getActiveFilterCount() > 0 && styles.activeFilterButton,
          ]}
          onPress={() => setShowFilterModal(true)}>
          <Text
            style={[
              styles.filterIcon,
              getActiveFilterCount() > 0 && styles.activeFilterIcon,
            ]}>
            ⚙️
          </Text>
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {getActiveFilterCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      <FlatList
        data={filteredData}
        keyExtractor={item => `${activeTab}-${item.log_id}`}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading && filteredData.length === 0 ? ( // Only show empty state if not loading and data is empty
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'Shared Contacts' ? '📤' : '📥'}
              </Text>
              <Text style={styles.emptyTitle}>
                No {activeTab.toLowerCase()} found
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || getActiveFilterCount() > 0
                  ? 'Try adjusting your search or filters'
                  : activeTab === 'Shared Contacts'
                  ? "You haven't shared any business contacts yet."
                  : "You haven't received any business contacts yet."}
              </Text>
            </View>
          ) : null
        }
        // Pull-to-refresh implementation
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary} // iOS spinner color
            colors={[colors.primary]}   // Android spinner color
          />
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        activeTab={activeTab}
      />
    </SafeAreaView>
  );
};

// Tab Styles
const tabStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

// Main Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterIcon: {
    fontSize: 16,
  },
  activeFilterIcon: {
    color: '#FFFFFF',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
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
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

// Card Styles
const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  businessLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  businessDetails: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  businessId: {
    fontSize: 12,
    color: '#6B7280',
  },
  eventBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  eventText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recipientSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  senderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recipientInitial: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  recipientId: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  logId: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
});

// Filter Styles - Complete
const filterStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
    padding: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Contacts;