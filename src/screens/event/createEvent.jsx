import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {format} from 'date-fns';
import InputBox from '../../components/inputs/textInput';
import TextAreaBox from '../../components/inputs/textArea';
import DatePickerBox from '../../components/inputs/datePicker';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';
import SmallButton from '../../components/buttons/smallButton';
import Dropdown from '../../components/inputs/dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {createEvents} from '../../redux/slices/events/createEvents';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const data = [
  {label: 'Conference and Seminars', value: 'conference'},
  {label: 'Product Launch', value: 'product_launch'},
  {label: 'Trade Show', value: 'trade_show'},
  {label: 'Corporate Retreat', value: 'corp_retreat'},
  {label: 'Networking Events', value: 'networking_events'},
  {label: 'Workshops', value: 'workshops'},
  {label: 'Webinars', value: 'webinars'},
  {label: 'Hackathons', value: 'hackathons'},
  {label: 'Meetups', value: 'meetups'},
  {label: 'Fundraisers', value: 'fundraisers'},
  {label: 'Charity Events', value: 'charity_events'},
  {label: 'Social Events', value: 'social_events'},
  {label: 'Team Building', value: 'team_building'},
  {label: 'Conventions', value: 'conventions'},
  {label: 'Exhibitions', value: 'exhibitions'},
  {label: 'Product Demo', value: 'product_demo'},
  {label: 'Press Conference', value: 'press_conference'},
  {label: 'Award Ceremony', value: 'award_ceremony'},
  {label: 'Community Events', value: 'community_events'},
  {label: 'Festivals', value: 'festivals'},
  {label: 'Concerts', value: 'concerts'},
  {label: 'Sports Events', value: 'sports_events'},
  {label: 'Other', value: 'other'},
];

const CreateEvent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [event, setEvent] = useState('');

  const [eventError, setEventError] = useState('');
  const [organiser, setOrganiser] = useState('');
  const [organiserError, setOrganiserError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [venue, setVenue] = useState('');
  const [venueError, setVenueError] = useState('');
  const [eventdate, setEventDate] = useState(null);
  const [eventdateError, setEventDateError] = useState(null);
  const [eventType, setEventType] = useState('');

  const loginState = useSelector(state => state.login);
  const createEvent = useSelector(state => state?.eventData);

  const handleSelect = item => {
    setEventType(item?.value);
  };

  const handleSubmit = () => {
    const formatted = format(eventdate, 'yyyy-MM-dd HH:mm:ss');
    console.log(event, description, formatted, eventType, venue);

    setEvent('');
    setDescription('');
    setEventDate('');
    setEventType('');
    setOrganiser('');
    setVenue('');

    dispatch(
      createEvents({
        name: event,
        description,
        event_type: eventType,
        event_date: formatted,
        event_address: venue,
        event_organiser: organiser,
        state: 'draft',
      }),
    );

    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Create New Event</Text>
            <Text style={styles.headerSubtitle}>
              Fill in the details to create your event
            </Text>
          </View>
          <View style={styles.headerDecoration} />
        </View>

        {/* Content and Button Container */}
        <View style={styles.contentContainer}>
          
          {/* Scrollable Content */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
              style={styles.flexOne}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}>
              
              <ScrollView
                style={styles.flexOne}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={true}>
                
                {/* Form Card */}
                <View style={styles.cardContainer}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Event Information</Text>
                    <View style={styles.cardTitleUnderline} />
                  </View>
                  
                  <View style={styles.formContent}>
                    {/* Event Name */}
                    <View style={styles.inputSection}>
                      <InputBox
                        label="Event Name"
                        value={event}
                        onChangeText={setEvent}
                        placeholder="Enter Event Name"
                        keyboardType="default"
                        required
                        error={eventError}
                      />
                    </View>

                    {/* Description */}
                    <View style={styles.inputSection}>
                      <TextAreaBox
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter Event Description"
                        keyboardType="default"
                        required
                        error={descriptionError}
                      />
                    </View>

                    {/* Date and Event Type Row */}
                    <View style={styles.rowSection}>
                      <View style={styles.columnWrapper}>
                        <View style={styles.leftColumn}>
                          <DatePickerBox
                            label="Event Date"
                            value={eventdate}
                            onChange={setEventDate}
                            required
                            error={eventdateError}
                          />
                        </View>
                        <View style={styles.rightColumn}>
                          <Dropdown
                            label="Event Type"
                            data={data}
                            onSelect={handleSelect}
                            placeholder="Select an event type"
                          />
                        </View>
                      </View>
                    </View>

                    {/* Event Organiser */}
                    <View style={styles.inputSection}>
                      <InputBox
                        label="Event Organiser"
                        value={organiser}
                        onChangeText={setOrganiser}
                        placeholder="Enter Event Organiser"
                        keyboardType="default"
                        required
                        error={organiserError}
                      />
                    </View>

                    {/* Venue */}
                    <View style={styles.inputSection}>
                      <TextAreaBox
                        label="Venue & Address"
                        value={venue}
                        onChangeText={setVenue}
                        placeholder="Enter venue name and address"
                        keyboardType="default"
                        required
                        error={venueError}
                      />
                    </View>

                    {/* Button Section - Inside the form card */}
                    <View style={styles.buttonSection}>
                      <SmallButton 
                        title="Create Event" 
                        onPress={handleSubmit}
                        style={styles.createButton}
                      />
                    </View>

                  </View>
                </View>

                {/* Bottom Spacer */}
                <View style={styles.bottomSpacer} />

              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>

        </View>
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

  flexOne: {
    flex: 1,
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

  // Content Container
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 24,
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

  // Input Sections
  inputSection: {
    marginBottom: 20,
  },

  rowSection: {
    marginBottom: 20,
  },

  columnWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },

  leftColumn: {
    flex: 1,
  },

  rightColumn: {
    flex: 1,
  },

  // Button Section - Now inside the card
  buttonSection: {
    marginTop: 32,
    marginBottom: 8,
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  createButton: {
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

  // Bottom spacer for extra scroll room
  bottomSpacer: {
    height: 40,
  },
});

export default CreateEvent;