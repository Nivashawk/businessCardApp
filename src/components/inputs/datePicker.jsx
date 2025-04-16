// components/DatePickerBox.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';
import moment from 'moment'; // For formatting dates

const DatePickerBox = ({
  label,
  value,
  onChange,
  required = false,
  error = '',
  placeholder = 'Select a date',
  mode = 'date',
  display = 'default',
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const showError = error && error.length > 0;

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[typography.inputLabel, styles.label]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          typography.inputText,
          styles.input,
          showError && styles.inputError,
        ]}>
        <Text style={{color: value ? colors.text_color : '#c4c4c4'}}>
          {value ? moment(value).format('YYYY-MM-DD') : placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={display}
          onChange={onChangeDate}
        />
      )}

      {showError && (
        <Text style={[typography.inputError, styles.errorText]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  required: {
    color: colors.status_red,
  },
  input: {
    borderWidth: 0.5,
    borderColor: colors.text_color_2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.status_red,
  },
  errorText: {
    marginTop: 4,
  },
});

export default DatePickerBox;
