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
  StyleSheet,
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
import { useNavigation } from '@react-navigation/native';

const {width} = Dimensions.get('window');
const data = [
  {label: 'Option 1', value: '1'},
  {label: 'Option 2', value: '2'},
  {label: 'Option 3', value: '3'},
  {label: 'Option 4', value: '4'},
  {label: 'Option 5', value: '5'},
];

const CreateEvent = () => {
  const navigation = useNavigation();
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
  

  const handleSelect = item => {
    setEventType(item);
  };

  const handleSubmit = () => {
    const formatted = format(eventdate, 'yyyy-MM-dd HH:mm:ss');
    console.log(event, description, formatted, eventType, venue);

    setEvent('');
    setDescription('');
    setEventDate('');
    setEventType('');
    setVenue('');
    
    dispatch(createEvents({ 
      name: event, 
      description, 
      event_type: eventType, 
      event_date: formatted, 
      event_address: venue, 
      event_organiser: "", 
      state: "draft"
    }));

    navigation.goBack();

  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        {/* Header Section */}
        {/* <View style={styles.headerContainer}>
          <Text style={[typography.heading, styles.headerTitle]}>
            Create Event
          </Text>
        </View> */}

        {/* Form Section */}
        <View style={styles.formWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            
            <View style={styles.cardContainer}>
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
                  placeholder="Enter Description"
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
                      placeholder="Select an event"
                    />
                  </View>
                </View>
              </View>

              {/* Venue */}
              <View style={styles.inputSection}>
                <TextAreaBox
                  label="Venue Name"
                  value={venue}
                  onChangeText={setVenue}
                  placeholder="Enter Venue Name"
                  keyboardType="default"
                  required
                  error={venueError}
                />
              </View>

          <View style={styles.buttonSection}>
            <SmallButton title="Create" onPress={handleSubmit} />
          </View>
              </View>
            </View>
          </ScrollView>

          {/* Button Section */}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  formWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formContent: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  rowSection: {
    marginBottom: 20,
    // backgroundColor: "black",
    alignItems: "center",
    justifyContent:"center"
  },
  columnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 1,
    marginRight: 8,
    //  backgroundColor:"grey"
  },
  rightColumn: {
    flex: 1,
    marginLeft: 8,
    // backgroundColor:"grey"
  },
  buttonSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
});

export default CreateEvent;