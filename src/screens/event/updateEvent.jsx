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
} from 'react-native';
import {format} from 'date-fns';
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

const {width} = Dimensions.get('window');
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

const UpdateEvent = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const {id} = route.params;
  console.log('Event ID received:', id);
  const eventData = useSelector(
    state => state?.getEventData?.data?.result?.data,
  );
  console.log('loginState', eventData);

  useEffect(() => {
    if (id) {
      dispatch(getEvent({event_id: id}));
    }
  }, []);

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

  useEffect(() => {
    if (eventData) {
      setEvent(eventData.name || '');
      setDescription(eventData.description || '');
      setVenue(eventData.event_address || '');
      setEventDatePlaceholder(eventData.event_date || null);
      setEventTypePlaceholder(eventData.event_type || null)

      // Safely parse event_type
      let parsedType = null;
      try {
        parsedType = JSON.parse(eventData.event_type.replace(/'/g, '"'));
        console.log(parsedType.label);
      } catch (e) {
        console.error('Failed to parse event_type', e);
      }

      setEventType(parsedType?.label || '');
    }
  }, [eventData]);

  // const [eventTypeError, setEventTypeError] = useState('');

  const handleSelect = item => {
    setEventType(item);
    // console.log('Selected:', item);
  };

  const handleSubmit = () => {
    const formatted = format(eventdate, 'yyyy-MM-dd HH:mm:ss');
    console.log(event, description, formatted, eventType, venue);

    dispatch(
      updateEvents({
        event_id:id,
        name: event,
        description: description,
        event_type: eventType,
        event_date: eventdate,
        event_address: venue,
        event_organiser: '',
        state: 'draft',
      }),
    );

    setEvent('');
    setDescription('');
    setEventDate('');
    setEventDate('');
    setEventType('');
    setVenue('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          keyboardShouldPersistTaps="handled">
          <Text
            style={[
              typography.heading,
              {textAlign: 'center', marginBottom: 10, marginTop: 10},
            ]}>
            Update Event
          </Text>

          <InputBox
            label="Event Name"
            value={event}
            onChangeText={setEvent}
            placeholder="Enter Event Name"
            keyboardType="default"
            required
            error={eventError}
          />
          <TextAreaBox
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter Description"
            keyboardType="default"
            required
            error={descriptionError}
          />
          <DatePickerBox
            label="Event Date"
            value={eventdate}
            onChange={setEventDate}
            required
            error={eventdateError}
            placeholder={eventDatePlaceholder}
          />
          <Dropdown
            label="Select Event"
            data={data}
            onSelect={handleSelect}
            placeholder={eventTypePlaceholder || 'select a event'}
          />
          <TextAreaBox
            label="Venue Name"
            value={venue}
            onChangeText={setVenue}
            placeholder="Enter Venue Name"
            keyboardType="default"
            required
            error={venueError}
          />
          <View style={{marginTop: 20, alignItems: 'flex-end'}}>
            <SmallButton title="Update" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default UpdateEvent;
