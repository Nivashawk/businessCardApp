// components/contacts/Contacts.js
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, Text, Modal, View, Image} from 'react-native'; // Import TouchableOpacity and Text for FAB
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import {sharedBusiness} from '../redux/slices/business/sharedBusinessSlices';
import {receivedBusiness} from '../redux/slices/business/receivedBusinessSlices';

import {colors} from '../theme/colors';

import TabSwitcher from './contactComponent/TabSwitcher';
import FilterModal from './contactComponent/FilterModel';
// Import newly separated components
import ContactHeader from './contactComponent/ContactHeader';
import SearchBarAndFilter from './contactComponent/SearchBarAndFilter';
import ContactsList from './contactComponent/ContactsList';
import ManualContactModal from './contactComponent/ManualContactModal';

import {mainStyles} from './contactComponent/styles'; // Import main styles


import SharedContactListItem from './contactComponent/SharedContactListItem'; // Import directly here
import ReceivedContactListItem from './contactComponent/ReceivedContactListItem'; // Import directly here
import ManualContactListItem from './contactComponent/ManualContactListItem'; // Import directly here


const MANUAL_CONTACTS_KEY = '@manual_contacts';

const Contacts = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('Shared Contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showManualContactModal, setShowManualContactModal] = useState(false);
  const [filters, setFilters] = useState({
    eventType: 'ALL',
    dateRange: 'ALL',
    businessName: '',
    personName: '',
  });
  const [refreshing, setRefreshing] = useState(false);
  const [manualContacts, setManualContacts] = useState([]);

  // State for YOUR custom image modal
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState('');

  const sharedContactsData = useSelector(
    state => state.sharedBusiness?.data?.result?.data ?? [],
  );
  const sharedBusinessLoading = useSelector(
    state => state.sharedBusiness?.loading,
  );

  const receivedContactsData = useSelector(
    state => state.receivedBusiness?.data?.result?.data ?? [],
  );
  const receivedBusinessLoading = useSelector(
    state => state.receivedBusiness?.loading,
  );

  const isLoading = sharedBusinessLoading || receivedBusinessLoading;

  // --- Local Storage Functions for Manual Contacts ---
  const saveManualContacts = useCallback(async contacts => {
    try {
      const jsonValue = JSON.stringify(contacts);
      await AsyncStorage.setItem(MANUAL_CONTACTS_KEY, jsonValue);
      setManualContacts(contacts);
    } catch (e) {
      console.error('Error saving manual contacts:', e);
    }
  }, []);

  const loadManualContacts = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(MANUAL_CONTACTS_KEY);
      const loadedContacts = jsonValue != null ? JSON.parse(jsonValue) : [];
      setManualContacts(loadedContacts);
    } catch (e) {
      console.error('Error loading manual contacts:', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleSaveManualContact = useCallback(
    newContact => {
      const updatedContacts = [newContact, ...manualContacts];
      saveManualContacts(updatedContacts);
    },
    [manualContacts, saveManualContacts],
  );

  // New handler to open your custom full-screen image modal
  const openImageModal = useCallback((imageUri, title) => {
    setSelectedImage(imageUri);
    setSelectedImageTitle(title);
    setImageModalVisible(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setImageModalVisible(false);
    setSelectedImage(null);
    setSelectedImageTitle('');
  }, []);


  const handleManualCardPress = useCallback(item => {
    console.log('Manual Contact Card Pressed (List Item):', item);
    // This is the handler for the overall list item press, not specifically the image
    // You can choose to do something here, e.g., navigate to a detailed view of the manual contact
  }, []);

  const handleCardPress = useCallback(item => {
    console.log('Card pressed (Shared/Received):', item);
    if (item.recipient_id) {
      navigation.navigate('Business', {
        screen: 'BusinessDetails',
        params: {
          data: {id: item?.business_id},
        },
      });
    } else {
      navigation.navigate('Home', {
        screen: 'BusinessDetails2',
        params: {
          data: `https://erp.thumps.app/business/view?business_id=${item.business_id}&shared_by=${item.shared_by_id}&type=1`,
        },
      });
    }
  }, [navigation]);


  // --- Data Fetching and Refresh Logic ---
  const fetchAllContacts = useCallback(() => {
    dispatch(sharedBusiness());
    dispatch(receivedBusiness());
    loadManualContacts();
  }, [dispatch, loadManualContacts]);

  useEffect(() => {
    fetchAllContacts();
  }, [fetchAllContacts]);

  useEffect(() => {
    const allDataLoading = isLoading || (activeTab === 'Manual Contacts' && refreshing);
    if (!allDataLoading && refreshing) {
      setRefreshing(false);
    }
  }, [isLoading, refreshing, activeTab]);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllContacts();
  }, [fetchAllContacts]);

  // --- Data Filtering and Selection ---
  const getCurrentData = () => {
    if (activeTab === 'Shared Contacts') {
      return sharedContactsData;
    } else if (activeTab === 'Received Contacts') {
      return receivedContactsData;
    } else {
      return manualContacts;
    }
  };

  const filteredData = useMemo(() => {
    const currentData = getCurrentData();

    return currentData.filter(item => {
      if (activeTab === 'Manual Contacts') {
        const matchesSearch = item.businessTitle
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesSearch;
      }

      const searchFields = [
        item.business_name,
        item.event_name,
        activeTab === 'Shared Contacts'
          ? item.recipient_name
          : item.shared_by_name,
      ];

      const matchesSearch = searchFields.some(field =>
        field?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const matchesEventType =
        filters.eventType === 'ALL' ||
        item.event_name?.toUpperCase() === filters.eventType;

      const matchesBusinessName =
        !filters.businessName ||
        item.business_name
          ?.toLowerCase()
          .includes(filters.businessName.toLowerCase());

      const personName =
        activeTab === 'Shared Contacts'
          ? item.recipient_name
          : item.shared_by_name;
      const matchesPersonName =
        !filters.personName ||
        personName?.toLowerCase().includes(filters.personName.toLowerCase());

      let matchesDateRange = true;
      if (filters.dateRange !== 'ALL') {
        const dateField =
          activeTab === 'Shared Contacts' ? item.shared_at : item.share_date;

        const itemDate = new Date(dateField);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (isNaN(itemDate.getTime())) {
          return false;
        }
        itemDate.setHours(0, 0, 0, 0);

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
  }, [
    activeTab,
    searchQuery,
    filters,
    sharedContactsData,
    receivedContactsData,
    manualContacts,
  ]);

  const handleApplyFilters = useCallback(newFilters => {
    setFilters(newFilters);
  }, []);

  const getActiveFilterCount = useMemo(() => {
    if (activeTab === 'Manual Contacts') return 0;

    let count = 0;
    if (filters.eventType !== 'ALL') count++;
    if (filters.dateRange !== 'ALL') count++;
    if (filters.businessName) count++;
    if (filters.personName) count++;
    return count;
  }, [filters, activeTab]);

  useEffect(() => {
    setSearchQuery('');
    setFilters({
      eventType: 'ALL',
      dateRange: 'ALL',
      businessName: '',
      personName: '',
    });
    if (activeTab === 'Manual Contacts') {
      loadManualContacts();
    }
  }, [activeTab, loadManualContacts]);

  const renderListItem = useCallback(({item}) => {
    if (activeTab === 'Shared Contacts') {
      return <SharedContactListItem item={item} onPress={handleCardPress} />;
    } else if (activeTab === 'Received Contacts') {
      return <ReceivedContactListItem item={item} onPress={handleCardPress} />;
    } else {
      return (
        <ManualContactListItem
          item={item}
          onPress={handleManualCardPress}
          onOpenFullScreenImage={openImageModal} // Pass your custom modal opener
        />
      );
    }
  }, [activeTab, handleCardPress, handleManualCardPress, openImageModal]);


  const showFab = activeTab === 'Manual Contacts';

  return (
    <SafeAreaView style={mainStyles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <ContactHeader
        filteredCount={filteredData.length}
        totalCount={getCurrentData().length}
      />

      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

      <SearchBarAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        onShowFilterModal={() => setShowFilterModal(true)}
        activeFilterCount={getActiveFilterCount}
      />

      <ContactsList
        data={filteredData}
        activeTab={activeTab}
        onRefresh={onRefresh}
        refreshing={refreshing}
        isLoading={isLoading || (activeTab === 'Manual Contacts' && refreshing)}
        searchQuery={searchQuery}
        activeFilterCount={getActiveFilterCount}
        renderItem={renderListItem}
      />

      {/* Floating Action Button (FAB) */}
      {showFab && (
        <TouchableOpacity
          style={manualContactStyles.fab}
          onPress={() => setShowManualContactModal(true)}>
          <Text style={manualContactStyles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        activeTab={activeTab}
      />

      {/* Manual Contact Modal */}
      <ManualContactModal
        visible={showManualContactModal}
        onClose={() => setShowManualContactModal(false)}
        onSave={handleSaveManualContact}
      />

      {/* Your Existing Image Viewer Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
          
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeImageModal}
            activeOpacity={0.7}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Image Title */}
          {selectedImageTitle ? (
            <View style={styles.imageTitleContainer}>
              <Text style={styles.imageTitle}>{selectedImageTitle}</Text>
            </View>
          ) : null}

          {/* Full Screen Image */}
          <View style={styles.fullScreenImageContainer}>
            {selectedImage && ( // Only render Image if selectedImage exists
              <Image
                source={{uri: selectedImage}}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Tap to close hint */}
          <TouchableOpacity 
            style={styles.tapToCloseArea}
            onPress={closeImageModal}
            activeOpacity={1}>
            <Text style={styles.tapToCloseText}>Tap anywhere to close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const manualContactStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 32,
  },
});

// Styles for YOUR custom image modal
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)', // Semi-transparent black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40, // Adjust as needed
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)', // Slightly visible close button background
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageTitleContainer: {
    position: 'absolute',
    top: 40, // Adjust to be near close button or centered
    paddingHorizontal: 50, // Space for close button
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  imageTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fullScreenImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Important: Ensures the whole image is visible
  },
  tapToCloseArea: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  tapToCloseText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
});


export default Contacts;