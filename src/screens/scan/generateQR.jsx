import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Share,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import QrCode from '../../../assets/QRcode.png';
import SmallButton from '../../components/buttons/smallButton';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import DropdownWSearch from '../../components/inputs/dropdownWSearch';
import {useDispatch, useSelector} from 'react-redux';
import {getBusinessQR, resetQRData} from '../../redux/slices/business/generateQRSlices';
import {listBusiness} from '../../redux/slices/business/listBusinessSlices';
import {listEvents} from '../../redux/slices/events/listEvents';
import {useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const GenerateQR = () => {
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Redux selectors
  const {
    data: businessListData,
    loading: businessLoading,
    error: businessError,
  } = useSelector(state => state.listBusinessData);

  const {
    data: eventListData,
    loading: eventLoading,
    error: eventError,
  } = useSelector(state => state.listEventsData);

  const {
    data: qrData,
    loading: qrLoading,
    error: qrError,
  } = useSelector(state => state.QRData);

  // Combine Redux loading states
  const overallLoading = businessLoading || eventLoading || qrLoading;

  // Memoized data transformations
  const BusinessListData = businessListData?.response?.result?.data ?? [];
  const EventListData = eventListData?.response?.result?.events ?? [];
  const QRData = qrData?.result?.data ?? null;

  const businessOptions = useMemo(
    () => BusinessListData?.map(c => ({label: c.name, value: c.id})) ?? [],
    [BusinessListData],
  );

  const eventOptions = useMemo(
    () => EventListData?.map(c => ({label: c.name, value: c.id})) ?? [],
    [EventListData],
  );

  // Find the selected business option for dropdown display
  const selectedBusinessOption = useMemo(() => {
    return businessOptions.find(option => option.value === selectedBusiness) || null;
  }, [businessOptions, selectedBusiness]);

  const selectedEventOption = useMemo(() => {
    return eventOptions.find(option => option.value === selectedEvent) || null;
  }, [eventOptions, selectedEvent]);

  const selectedBusinessName = useMemo(() => {
    return selectedBusinessOption?.label || '';
  }, [selectedBusinessOption]);

  const selectedEventName = useMemo(() => {
    return selectedEventOption?.label || '';
  }, [selectedEventOption]);
  
  const hasQRCode = QRData?.qr_code;
  const hasBusinessUrl = QRData?.business_url;

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log('Fetching business and events data...');
    dispatch(listBusiness());
    dispatch(listEvents());
  }, []);

  // Effect to set primary business as default when business list loads
  useEffect(() => {
    if (BusinessListData && BusinessListData.length > 0 && businessOptions.length > 0 && !selectedBusiness) {
      const primaryBusiness = BusinessListData.find(business => business.is_primary === true);
      
      if (primaryBusiness) {
        // Find the matching option from businessOptions
        const primaryBusinessOption = businessOptions.find(option => option.value === primaryBusiness.id);
        
        if (primaryBusinessOption) {
          console.log('Setting primary business as default:', primaryBusinessOption);
          setSelectedBusiness(primaryBusiness.id);
          // Generate QR for primary business (without event initially)
          generateQR(primaryBusiness.id, selectedEvent);
        }
      }
    }
  }, [BusinessListData, businessOptions, selectedBusiness, selectedEvent]);

  // useFocusEffect to reset state when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('GenerateQR screen unfocused, cleanup...');
        dispatch(resetQRData());
      };
    }, []) 
  );

  const generateQR = useCallback((businessId, eventId) => {
    if (businessId) { // Only generate QR if we have a business ID
      dispatch(getBusinessQR({business_id: businessId, event_id: eventId}));
    }
  }, [dispatch]);

  // Use useEffect to manage local isLoading based on Redux loading
  useEffect(() => {
    // This can be used to show a local spinner, but overallLoading covers it
    // setIsLoading(qrLoading);
  }, [qrLoading]);

  const handleSelectBusiness = useCallback(item => {
    console.log('Selected Business:', item);
    setSelectedBusiness(item.value);
    generateQR(item.value, selectedEvent);
  }, [selectedEvent, generateQR]);

  const handleSelectEvent = useCallback(item => {
    console.log('Selected Event:', item);
    setSelectedEvent(item.value);
    generateQR(selectedBusiness, item.value);
  }, [selectedBusiness, generateQR]);

  const handleShare = async () => {
    if (!hasBusinessUrl) {
      Alert.alert('Error', 'No business URL available to share.');
      return;
    }

    try {
      const message = selectedEventName
        ? `Join us at ${selectedEventName} for ${selectedBusinessName}! ${QRData.business_url}`
        : `Check out ${selectedBusinessName}! ${QRData.business_url}`;

      const result = await Share.share({
        message: message,
        title: 'Share My Business',
        url: QRData.business_url, // iOS specific
      });

      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const handleDownloadQR = () => {
    // Placeholder for QR download functionality
    Alert.alert('Download', 'QR code download functionality to be implemented');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[typography.heading, styles.headerText]}>
          Generate QR Code
        </Text>
        <Text style={[typography.description, styles.subHeaderText]}>
          Create and share QR codes for your business and events
        </Text>
      </View>

      {/* QR Code Display */}
      <View style={styles.qrContainer}>
        {hasQRCode ? (
          <View style={styles.qrWrapper}>
            <View style={styles.qrInnerWrapper}>
              <Image
                style={styles.qrCode}
                source={{uri: `data:image/png;base64,${QRData.qr_code}`}}
                resizeMode="contain"
              />
            </View>
            <View style={styles.qrGlow} />
            {overallLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.gold} />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderQR}>
            <View style={styles.shimmerOverlay} />
            <Image
              source={QrCode}
              style={styles.placeholderImage}
              resizeMode="contain"
            />
            <Text style={[typography.description, styles.placeholderText]}>
              {selectedBusiness ? 'Generating QR code...' : 'Select business and event to generate QR code'}
            </Text>
          </View>
        )}

        {/* QR Info Card */}
        {(selectedBusinessName || selectedEventName) && (
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader} />
            {selectedBusinessName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Business:</Text>
                <Text style={styles.infoValue}>{selectedBusinessName}</Text>
              </View>
            )}
            {selectedEventName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Event:</Text>
                <Text style={styles.infoValue}>{selectedEventName}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Selection Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.dropdownContainer}>
          <DropdownWSearch
            label="Select Business"
            data={businessOptions}
            onSelect={handleSelectBusiness}
            placeholder={selectedBusinessOption?.label || "Choose your business"}
            value={selectedBusinessOption} // Pass the full option object
          />
        </View>

        <View style={styles.dropdownContainer}>
          <DropdownWSearch
            label="Select Event (Optional)"
            data={eventOptions}
            onSelect={handleSelectEvent}
            placeholder={selectedEventOption?.label || "Choose an event"}
            value={selectedEventOption} // Pass the full option object
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {hasQRCode && (
          <>
            {/* <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleDownloadQR}>
              <Text style={styles.secondaryButtonText}>Download QR</Text>
            </TouchableOpacity> */}
            <SmallButton
              title="Share QR"
              onPress={handleShare}
              disabled={!hasBusinessUrl}
            />
          </>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionsHeader}>
          <Text style={styles.instructionsIcon}>💡</Text>
          <Text style={[typography.description, styles.instructionsTitle]}>
            How to use:
          </Text>
        </View>
        <Text style={[typography.description, styles.instructionsText]}>
          1. Your primary business is selected by default{'\n'}
          2. Optionally select an event{'\n'}
          3. QR code will be generated automatically{'\n'}
          4. Share or download your QR code
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    color: colors.text_color_1,
    marginBottom: 5,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeaderText: {
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.9,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrWrapper: {
    position: 'relative',
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  qrInnerWrapper: {
    backgroundColor: colors.text_color_1,
    borderRadius: 12,
    padding: 15,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  qrGlow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: colors.gold,
    opacity: 0.1,
    borderRadius: 16,
    zIndex: 0,
  },
  qrCode: {
    height: height * 0.3,
    width: width * 0.7,
    zIndex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  placeholderQR: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.shimmer,
    opacity: 0.1,
  },
  placeholderImage: {
    height: height * 0.2,
    width: width * 0.5,
    opacity: 0.4,
    tintColor: colors.textSecondary,
  },
  placeholderText: {
    marginTop: 15,
    textAlign: 'center',
    color: colors.textSecondary,
    opacity: 0.8,
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 16,
    width: width * 0.8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  infoCardHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.gold,
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gold,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text_color_1,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
    fontWeight: '500',
  },
  controlsContainer: {
    marginBottom: 30,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionsIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  instructionsTitle: {
    fontWeight: '600',
    color: colors.text_color_1,
  },
  instructionsText: {
    lineHeight: 22,
    color: colors.textSecondary,
    opacity: 0.9,
    paddingLeft: 4,
  },
});

export default GenerateQR;