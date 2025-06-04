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
import React, {useState, useEffect, useMemo} from 'react';
import QrCode from '../../../assets/QRcode.png';
import SmallButton from '../../components/buttons/smallButton';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import DropdownWSearch from '../../components/inputs/dropdownWSearch';
import {useDispatch, useSelector} from 'react-redux';
import {getBusinessQR} from '../../redux/slices/business/generateQRSlices';
import {listBusiness} from '../../redux/slices/business/listBusinessSlices';
import {listEvents} from '../../redux/slices/events/listEvents';

const {width, height} = Dimensions.get('window');

const GenerateQR = () => {
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Redux selectors
  const BusinessListData = useSelector(
    state => state?.listBusinessData?.data?.response?.result?.data ?? [],
  );
  const EventListData = useSelector(
    state => state.listEventsData?.data?.response?.result?.events ?? [],
  );
  const QRData = useSelector(
    state => state.QRData?.data?.result?.data ?? null,
  );

  // Memoized data transformations
  const businessOptions = useMemo(
    () => BusinessListData?.map(c => ({label: c.name, value: c.id})) ?? [],
    [BusinessListData],
  );

  const eventOptions = useMemo(
    () => EventListData?.map(c => ({label: c.name, value: c.id})) ?? [],
    [EventListData],
  );

  const selectedBusinessName = useMemo(() => {
    const business = BusinessListData?.find(b => b.id === selectedBusiness);
    return business?.name || '';
  }, [BusinessListData, selectedBusiness]);

  const selectedEventName = useMemo(() => {
    const event = EventListData?.find(e => e.id === selectedEvent);
    return event?.name || '';
  }, [EventListData, selectedEvent]);

  const hasQRCode = QRData?.qr_code;
  const hasBusinessUrl = QRData?.business_url;

  useEffect(() => {
    console.log('Fetching business and events data...');
    dispatch(listBusiness());
    dispatch(listEvents());
  }, [dispatch]);

  const handleSelectBusiness = item => {
    console.log('Selected Business:', item);
    setSelectedBusiness(item.value);
    generateQR(item.value, selectedEvent);
  };

  const handleSelectEvent = item => {
    console.log('Selected Event:', item);
    setSelectedEvent(item.value);
    generateQR(selectedBusiness, item.value);
  };

  const generateQR = (businessId, eventId) => {
    setIsLoading(true);
    try {
      dispatch(getBusinessQR({business_id: businessId, event_id: eventId}));
    } catch (error) {
      console.error('Error generating QR:', error);
      Alert.alert('Error', 'Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Image
              style={styles.qrCode}
              source={{uri: `data:image/png;base64,${QRData.qr_code}`}}
              resizeMode="contain"
            />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderQR}>
            <Image
              source={QrCode}
              style={styles.placeholderImage}
              resizeMode="contain"
            />
            <Text style={[typography.description, styles.placeholderText]}>
              Select business and event to generate QR code
            </Text>
          </View>
        )}

        {/* QR Info Card */}
        {(selectedBusinessName || selectedEventName) && (
          <View style={styles.infoCard}>
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
            placeholder="Choose your business"
          />
        </View>

        <View style={styles.dropdownContainer}>
          <DropdownWSearch
            label="Select Event (Optional)"
            data={eventOptions}
            onSelect={handleSelectEvent}
            placeholder="Choose an event"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {hasQRCode && (
          <>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleDownloadQR}>
              <Text style={styles.secondaryButtonText}>Download QR</Text>
            </TouchableOpacity>
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
        <Text style={[typography.description, styles.instructionsTitle]}>
          How to use:
        </Text>
        <Text style={[typography.description, styles.instructionsText]}>
          1. Select your business from the dropdown{'\n'}
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
    color: colors.text,
    marginBottom: 5,
  },
  subHeaderText: {
    color: colors.textSecondary || colors.text,
    textAlign: 'center',
    opacity: 0.7,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrWrapper: {
    position: 'relative',
    backgroundColor: colors.white || '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrCode: {
    height: height * 0.3,
    width: width * 0.7,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  placeholderQR: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.surface || colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border || colors.primary,
    borderStyle: 'dashed',
  },
  placeholderImage: {
    height: height * 0.2,
    width: width * 0.5,
    opacity: 0.3,
  },
  placeholderText: {
    marginTop: 15,
    textAlign: 'center',
    color: colors.textSecondary || colors.text,
    opacity: 0.6,
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: colors.surface || colors.primary,
    padding: 15,
    borderRadius: 12,
    width: width * 0.8,
    opacity: 0.9,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary || colors.white,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text || colors.white,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  controlsContainer: {
    marginBottom: 30,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface || colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: colors.surface || colors.background,
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  instructionsTitle: {
    fontWeight: '600',
    marginBottom: 10,
    color: colors.text,
  },
  instructionsText: {
    lineHeight: 20,
    color: colors.textSecondary || colors.text,
    opacity: 0.8,
  },
});

export default GenerateQR