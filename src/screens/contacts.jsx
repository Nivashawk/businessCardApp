// components/contacts/Contacts.js
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, Text, Modal, View, Image, Alert} from 'react-native'; // Import TouchableOpacity and Text for FAB
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

const Contacts = ({route}) => {
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

  const handleDeleteManualContact = useCallback(
    contactToDelete => {
      Alert.alert(
        'Delete Business Card',
        `Are you sure you want to delete "${contactToDelete.businessTitle}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              const updatedContacts = manualContacts.filter(contact => contact.id !== contactToDelete.id);
              saveManualContacts(updatedContacts);
            }
          }
        ]
      );
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
    navigation.navigate('ManualContactDetail', {
      contactId: item.id,
      onContactUpdated: (updatedContact) => {
        // Update the contact in the local state
        const updatedContacts = manualContacts.map(contact => 
          contact.id === updatedContact.id ? updatedContact : contact
        );
        setManualContacts(updatedContacts);
      }
    });
  }, [navigation, manualContacts]);

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

  // Handle navigation from home screen to open manual contact modal
  useEffect(() => {
    console.log('📋 Contacts screen mounted with route params:', route?.params);
    
    // Check immediately on mount or param change
    if (route?.params?.openManualContact) {
      console.log('✅ Detected openManualContact parameter - switching to Manual Contacts tab');
      
      // Switch to Manual Contacts tab immediately
      setActiveTab('Manual Contacts');
      
      // Open the manual contact modal after a short delay
      setTimeout(() => {
        console.log('✅ Opening manual contact modal');
        setShowManualContactModal(true);
      }, 300); // Reduced delay for better UX
      
      // Clear the parameter to prevent reopening on subsequent visits
      navigation.setParams({ openManualContact: undefined });
    }
  }, [route?.params?.openManualContact, navigation]); // Watch specific param to avoid unnecessary re-renders

  // Also check on screen focus for cases where navigation happens while screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Contacts screen focused with params:', route?.params);
      if (route?.params?.openManualContact) {
        console.log('🎯 useFocusEffect: Switching to Manual Contacts tab and opening modal');
        setActiveTab('Manual Contacts');
        setTimeout(() => {
          setShowManualContactModal(true);
        }, 300);
        navigation.setParams({ openManualContact: undefined });
      }
    }, [route?.params?.openManualContact, navigation])
  );

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
          onOpenFullScreenImage={openImageModal}
          onDelete={handleDeleteManualContact}
        />
      );
    }
  }, [activeTab, handleCardPress, handleManualCardPress, openImageModal, handleDeleteManualContact]);


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
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={closeImageModal}
          activeOpacity={1}>
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
              <TouchableOpacity 
                onPress={closeImageModal}
                activeOpacity={1}
                style={styles.imageWrapper}>
                <Image
                  source={{uri: selectedImage}}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Tap to close hint */}
          <View style={styles.tapToCloseArea}>
            <Text style={styles.tapToCloseText}>Tap anywhere to close</Text>
          </View>
        </TouchableOpacity>
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
  modalOverlay: {
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
  imageWrapper: {
    width: '100%',
    height: '100%',
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