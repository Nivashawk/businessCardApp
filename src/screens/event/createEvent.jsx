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
import { format } from 'date-fns';
import InputBox from '../../components/inputs/textInput';
import TextAreaBox from '../../components/inputs/textArea';
import DatePickerBox from '../../components/inputs/datePicker';
import {typography} from '../../theme/typography';
import SmallButton from '../../components/buttons/smallButton';

const {width} = Dimensions.get('window');

const CreateEvent = () => {
  const [event, setEvent] = useState('');
  const [eventError, setEventError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [venue, setVenue] = useState('');
  const [venueError, setVenueError] = useState('');
  const [eventdate, setEventDate] = useState(null);
  const [eventdateError, setEventDateError] = useState(null);

  const handleSubmit = () => {
    const formatted = format(eventdate, 'dd-MM-yyyy');
    console.log(event, description, formatted, venue);

    setEvent('');
    setDescription('');
    setEventDate('');
    setEventDate('');
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
          <InputBox
            label="Venue Name"
            value={venue}
            onChangeText={setVenue}
            placeholder="Enter Venue Name"
            keyboardType="default"
            required
            error={venueError}
          />
          <View style={{marginTop: 20, alignItems:'flex-end'}}>
            <SmallButton title="Create" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default CreateEvent;
