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
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';
import InputBox from '../../components/inputs/textInput';
import TextAreaBox from '../../components/inputs/textArea';
import DatePickerBox from '../../components/inputs/datePicker';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';
import SmallButton from '../../components/buttons/smallButton';
import Dropdown from '../../components/inputs/dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {createEvents} from '../../redux/slices/events/createEvents';
import {useRoute} from '@react-navigation/native';
import {getEvent} from '../../redux/slices/events/getEvents';
import {updateEvents} from '../../redux/slices/events/updateEvents';
import {useNavigation} from '@react-navigation/native';
import {resetUpdateEvents} from '../../redux/slices/events/updateEvents';
import {resetGetEvents} from '../../redux/slices/events/getEvents';

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
  const [hasCheckedExpiry, setHasCheckedExpiry] = useState(false);

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
    if (typeof resetGetEvents === 'function') {
      dispatch(resetGetEvents());
    }
    
    if (id) {
      dispatch(getEvent({event_id: id}));
    }

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

  // Event validation and modal display
  useEffect(() => {
    if (eventData && eventData.event_date && !hasCheckedExpiry) {
      const eventDate = new Date(eventData.event_date);
      const today = new Date();
      
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const eventDateStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      setHasCheckedExpiry(true);
      
      if (eventDateStart.getTime() < todayStart.getTime()) {
        showModal(
          'Event Expired',
          'This event has already expired and cannot be updated.',
          () => navigation.goBack()
        );
      } 
      else if (eventDateStart.getTime() === todayStart.getTime()) {
        showModal(
          'Cannot Update',
          'You cannot update an event that is scheduled for today.',
          () => navigation.goBack()
        );
      }
    }
  }, [eventData, navigation, hasCheckedExpiry]);

  // Handle update response
  useEffect(() => {
    if (updateEventData) {
      if (updateEventData?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: updateEventData?.message,
        });
        dispatch(resetUpdateEvents());
        if (typeof resetGetEvents === 'function') {
          dispatch(resetGetEvents());
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Update Event</Text>
            <Text style={styles.headerSubtitle}>
              Modify your event details
            </Text>
          </View>
          <View style={styles.headerDecoration} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
              style={styles.keyboardContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}>
              
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={true}>
                
                <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
                  
                  {/* Form Card */}
                  <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>Event Information</Text>
                      <View style={styles.cardTitleUnderline} />
                    </View>
                    
                    <View style={styles.formContent}>
                      
                      {/* Event Name & Date Row */}
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
                          />
                        </View>
                      </View>

                      {/* Event Type */}
                      <View style={styles.inputSection}>
                        <Dropdown
                          label="Event Type"
                          data={eventTypeData}
                          onSelect={handleSelect}
                          placeholder={eventTypePlaceholder || 'Select event type'}
                          selectedValue={eventType}
                        />
                      </View>

                      {/* Description */}
                      <View style={styles.inputSection}>
                        <TextAreaBox
                          label="Description"
                          value={description}
                          onChangeText={setDescription}
                          placeholder="Describe your event..."
                          keyboardType="default"
                          required
                          error={descriptionError}
                        />
                      </View>

                      {/* Venue */}
                      <View style={styles.inputSection}>
                        <TextAreaBox
                          label="Venue & Address"
                          value={venue}
                          onChangeText={setVenue}
                          placeholder="Enter event venue address"
                          keyboardType="default"
                          required
                          error={venueError}
                        />
                      </View>

                      {/* Update Button - Inside card */}
                      <View style={styles.buttonSection}>
                        <TouchableOpacity
                          style={[
                            styles.updateButton, 
                            loading && styles.updateButtonDisabled
                          ]}
                          onPress={handleSubmit}
                          disabled={loading}>
                          <Text style={styles.updateButtonText}>
                            {loading ? 'Updating...' : 'Update Event'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </View>

                  {/* Bottom Spacer */}
                  <View style={styles.bottomSpacer} />

                </Animated.View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>

        <CustomModal />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Styles
  headerContainer: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  headerContent: {
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 6,
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  headerDecoration: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 2,
  },

  // Main Content
  mainContent: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 24,
  },

  content: {
    flex: 1,
  },

  // Card Styles
  cardContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },

  cardHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 8,
  },

  cardTitleUnderline: {
    width: 40,
    height: 2,
    backgroundColor: colors.gold,
    borderRadius: 1,
  },

  formContent: {
    padding: 24,
  },

  // Form Layout
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },

  formColumnHalf: {
    flex: 1,
  },

  inputSection: {
    marginBottom: 20,
  },

  // Button Section
  buttonSection: {
    marginTop: 32,
    marginBottom: 8,
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  updateButton: {
    width: width * 0.8,
    maxWidth: 350,
    paddingVertical: 18,
    backgroundColor: colors.gold,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.goldDark,
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  updateButtonDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
    textAlign: 'center',
  },

  // Bottom spacer
  bottomSpacer: {
    height: 40,
  },

  // Modal Styles - Dark Theme
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
  },

  modalContent: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text_color_1,
    textAlign: 'center',
    marginBottom: 12,
  },

  modalMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },

  modalButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.goldDark,
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    textAlign: 'center',
  },
});

export default UpdateEvent