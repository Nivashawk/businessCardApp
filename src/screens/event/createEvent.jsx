import React, {useState} from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { createEvents } from '../../redux/slices/events/createEvents';

const {width} = Dimensions.get('window');
const data = [
  {label: 'Option 1', value: '1'},
  {label: 'Option 2', value: '2'},
  {label: 'Option 3', value: '3'},
  {label: 'Option 1', value: '1'},
  {label: 'Option 2', value: '2'},
];

const CreateEvent = () => {
  const dispatch = useDispatch();
  const [event, setEvent] = useState('');
  const [eventError, setEventError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [venue, setVenue] = useState('');
  const [venueError, setVenueError] = useState('');
  const [eventdate, setEventDate] = useState(null);
  const [eventdateError, setEventDateError] = useState(null);
  const [eventType, setEventType] = useState('');
  const loginState = useSelector(state => state.login);
  console.log("loginState",loginState);
  
  const {partner_id} = loginState.data.result; 
  // const [eventTypeError, setEventTypeError] = useState('');

  const handleSelect = item => {
    setEventType(item)
    // console.log('Selected:', item);
  };

  const handleSubmit = () => {
    const formatted = format(eventdate, 'yyyy-MM-dd HH:mm:ss');
    console.log(event, description, formatted, eventType, venue);

    setEvent('');
    setDescription('');
    setEventDate('');
    setEventDate('');
    setEventType('');
    setVenue('');
    dispatch(createEvents({
      partner_id, name:event, description, event_type:eventType, event_date:formatted, event_address:venue, event_organiser: "", state: "draft"
    }))
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
            Create Event
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
          />
          <Dropdown
            label="Select Event"
            data={data}
            onSelect={handleSelect}
            placeholder="Select an event"
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
            <SmallButton title="Create" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default CreateEvent;
