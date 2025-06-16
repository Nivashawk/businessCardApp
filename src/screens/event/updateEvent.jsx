import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';
import InputBox from '../../components/inputs/textInput';
import TextAreaBox from '../../components/inputs/textArea';
import DatePickerBox from '../../components/inputs/datePicker';
import {typography} from '../../theme/typography';
import SmallButton from '../../components/buttons/smallButton';
import Dropdown from '../../components/inputs/dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {createEvents} from '../../redux/slices/events/createEvents';
import {useRoute} from '@react-navigation/native';
import {getEvent} from '../../redux/slices/events/getEvents';
import {updateEvents} from '../../redux/slices/events/updateEvents';
import {useNavigation} from '@react-navigation/native';
import {resetUpdateEvents} from '../../redux/slices/events/updateEvents';
// Add this import for resetting getEvent state
import {resetGetEvents} from '../../redux/slices/events/getEvents'; // You'll need to create this action

const {width, height} = Dimensions.get('window');

const eventTypeData = [
  {label: 'Conference', value: 'conference', emoji: '👥'},
  {label: 'Product Launch', value: 'product_launch', emoji: '🚀'},
  {label: 'Trade Show', value: 'trade_show', emoji: '🛍️'},
  {label: 'Corporate Retreat', value: 'corp_retreat', emoji: '💼'},
  {label: 'Networking', value: 'networking_events', emoji: '🤝'},
  {label: 'Workshop', value: 'workshops', emoji: '🔧'},
  {label: 'Webinar', value: 'webinars', emoji: '💻'},
  {label: 'Hackathon', value: 'hackathons', emoji: '⚡'},
  {label: 'Meetup', value: 'meetups', emoji: '☕'},
  {label: 'Fundraiser', value: 'fundraisers', emoji: '💖'},
  {label: 'Social Event', value: 'social_events', emoji: '🥳'},
  {label: 'Team Building', value: 'team_building', emoji: '👨‍👩‍👧‍👦'},
  {label: 'Convention', value: 'conventions', emoji: '🗺️'},
  {label: 'Exhibition', value: 'exhibitions', emoji: '👁️'},
  {label: 'Award Ceremony', value: 'award_ceremony', emoji: '🏆'},
  {label: 'Festival', value: 'festivals', emoji: '🎵'},
  {label: 'Concert', value: 'concerts', emoji: '🎧'},
  {label: 'Sports Event', value: 'sports_events', emoji: '🏃'},
  {label: 'Other', value: 'other', emoji: '📋'},
];

const UpdateEvent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const {id} = route.params;
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const eventData = useSelector(state => state?.getEventData?.data?.result?.data);
  const updateEventData = useSelector(state => state?.updateEventData?.data?.result);

  // State variables
  const [event, setEvent] = useState('');
  const [eventError, setEventError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [venue, setVenue] = useState('');
  const [venueError, setVenueError] = useState('');
  const [eventdate, setEventDate] = useState(null);
  const [eventdateError, setEventDateError] = useState(null);
  const [eventType, setEventType] = useState('');
  const [eventDatePlaceholder, setEventDatePlaceholder] = useState('');
  const [eventTypePlaceholder, setEventTypePlaceholder] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasCheckedExpiry, setHasCheckedExpiry] = useState(false); // Add this state

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);

  // Animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Clear Redux state on component mount and unmount
  useEffect(() => {
    // Clear any existing event data when component mounts
    if (typeof resetGetEvents === 'function') {
      dispatch(resetGetEvents());
    }
    
    // Fetch fresh event data
    if (id) {
      dispatch(getEvent({event_id: id}));
    }

    // Cleanup on unmount
    return () => {
      if (typeof resetGetEvents === 'function') {
        dispatch(resetGetEvents());
      }
      dispatch(resetUpdateEvents());
    };
  }, [id, dispatch]);

  // Show modal helper function
  const showModal = (title, message, action = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalAction(() => action);
    setModalVisible(true);
  };

  // Event validation and modal display - Modified to prevent duplicate checks
  useEffect(() => {
    if (eventData && eventData.event_date && !hasCheckedExpiry) {
      const eventDate = new Date(eventData.event_date);
      const today = new Date();
      
      // Set time to start of day for accurate date comparison
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const eventDateStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      setHasCheckedExpiry(true); // Mark as checked to prevent duplicate checks
      
      // Check if event date is in the past (expired)
      if (eventDateStart.getTime() < todayStart.getTime()) {
        showModal(
          'Event Expired',
          'This event has already expired and cannot be updated.',
          () => navigation.goBack()
        );
      } 
      // Check if event is today
      else if (eventDateStart.getTime() === todayStart.getTime()) {
        showModal(
          'Cannot Update',
          'You cannot update an event that is scheduled for today.',
          () => navigation.goBack()
        );
      }
      // If eventDateStart > todayStart, it's a future event - allow editing (no modal)
    }
  }, [eventData, navigation, hasCheckedExpiry]);

  // Handle update response
  useEffect(() => {
    if (updateEventData) {
      if (updateEventData?.status === 'Success') {
        Toast.show({
          type: 'success',
          text1: updateEventData?.message,
        });
        dispatch(resetUpdateEvents());
        // Clear the getEvent data as well
        if (typeof resetGetEvent === 'function') {
          dispatch(resetGetEvent());
        }
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } else if (updateEventData?.status === 'Error' || updateEventData?.message) {
        Toast.show({
          type: 'error',
          text1: updateEventData?.message || 'Something went wrong',
        });
        dispatch(resetUpdateEvents());
      }
      setLoading(false);
    }
  }, [updateEventData, navigation, dispatch]);

  // Populate form fields when eventData is loaded
  useEffect(() => {
    if (eventData) {
      setEvent(eventData.name || '');
      setDescription(eventData.description || '');
      setVenue(eventData.event_address || '');

      if (eventData.event_date) {
        const dateObj = new Date(eventData.event_date);
        setEventDate(dateObj);
        setEventDatePlaceholder(eventData.event_date);
      }

      if (eventData.event_type) {
        const foundType = eventTypeData.find(
          item => item.value === eventData.event_type,
        );

        if (foundType) {
          setEventType(foundType.label);
          setEventTypePlaceholder(foundType.label);
        } else {
          setEventType(eventData.event_type);
          setEventTypePlaceholder(eventData.event_type);
        }
      }
    }
  }, [eventData]);

  const handleSelect = item => {
    setEventType(item);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Validation
    let hasError = false;
    const errors = {};

    if (!event.trim()) {
      errors.event = 'Event name is required';
      hasError = true;
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
      hasError = true;
    }
    if (!venue.trim()) {
      errors.venue = 'Venue is required';
      hasError = true;
    }
    if (!eventdate) {
      errors.eventdate = 'Event date is required';
      hasError = true;
    }

    if (hasError) {
      setEventError(errors.event || '');
      setDescriptionError(errors.description || '');
      setVenueError(errors.venue || '');
      setEventDateError(errors.eventdate || '');
      setLoading(false);
      return;
    }

    // Clear errors
    setEventError('');
    setDescriptionError('');
    setVenueError('');
    setEventDateError('');

    const formatted = format(eventdate, 'yyyy-MM-dd HH:mm:ss');
    
    let eventTypeValue = eventType;
    const foundEventType = eventTypeData.find(item => item.label === eventType);
    if (foundEventType) {
      eventTypeValue = foundEventType.value;
    }

    dispatch(
      updateEvents({
        event_id: id,
        name: event,
        description: description,
        event_type: eventTypeValue,
        event_date: formatted,
        event_address: venue,
        event_organiser: '',
        state: 'draft',
      }),
    );
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalAction) {
      modalAction();
    }
  };

  const CustomModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleModalClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            
            <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
              
              {/* Form Grid */}
              <View style={styles.formGrid}>
                
                {/* Row 1: Event Name & Date */}
                <View style={styles.formRow}>
                  <View style={styles.formColumnHalf}>
                    <InputBox
                      label="Event Name"
                      value={event}
                      onChangeText={setEvent}
                      placeholder="Enter event name"
                      keyboardType="default"
                      required
                      error={eventError}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.formColumnHalf}>
                    <DatePickerBox
                      label="Event Date"
                      value={eventdate}
                      onChange={setEventDate}
                      required
                      error={eventdateError}
                      placeholder={eventDatePlaceholder}
                      style={styles.input}
                    />
                  </View>
                </View>

                {/* Row 2: Event Type */}
                <View style={styles.formRow}>
                  <View style={styles.formColumnFull}>
                    <Dropdown
                      label="Event Type"
                      data={eventTypeData}
                      onSelect={handleSelect}
                      placeholder={eventTypePlaceholder || 'Select event type'}
                      selectedValue={eventType}
                      style={styles.input}
                    />
                  </View>
                </View>

                {/* Row 3: Description */}
                <View style={styles.formRow}>
                  <View style={styles.formColumnFull}>
                    <TextAreaBox
                      label="Description"
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Describe your event..."
                      keyboardType="default"
                      required
                      error={descriptionError}
                      style={[styles.input, styles.textAreaCompact]}
                    />
                  </View>
                </View>

                {/* Row 4: Venue */}
                <View style={styles.formRow}>
                  <View style={styles.formColumnFull}>
                    <TextAreaBox
                      label="Venue"
                      value={venue}
                      onChangeText={setVenue}
                      placeholder="Enter event venue address"
                      keyboardType="default"
                      required
                      error={venueError}
                      style={[styles.input, styles.textAreaCompact]}
                    />
                  </View>
                </View>

              </View>

              {/* Submit Button */}
              <View style={styles.submitContainer}>
                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}>
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Updating...' : 'Update Event'}
                  </Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        <CustomModal />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 36,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  formGrid: {
    flex: 1,
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formColumnHalf: {
    flex: 1,
  },
  formColumnFull: {
    flex: 1,
  },
  input: {
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    fontSize: 14,
  },
  textAreaCompact: {
    minHeight: 60,
    maxHeight: 80,
  },
  submitContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 'auto',
  },
  submitButton: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    maxWidth: 350,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 60,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default UpdateEvent;