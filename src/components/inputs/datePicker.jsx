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
  restrictPastDates = true, // New flag to control minimum date
  disabled = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const showError = error && error.length > 0;

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate && onChange) {
      onChange(selectedDate);
    }
  };

  const handlePress = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    
    try {
      return moment(date).format('DD MMM YYYY');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const displayText = value ? formatDate(value) : placeholder;

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[typography?.inputLabel, styles.label]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.input,
          showError && styles.inputError,
          disabled && styles.inputDisabled,
        ]}>
        <Text style={[
          styles.inputText,
          !value && styles.placeholderText,
          disabled && styles.disabledText,
        ]}>
          {displayText}
        </Text>
        
        <View style={styles.iconContainer}>
          <Text style={[
            styles.calendarIcon,
            disabled && styles.disabledIcon,
          ]}>
            📅
          </Text>
        </View>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={display}
          onChange={onChangeDate}
          minimumDate={restrictPastDates ? new Date() : undefined} // Conditional minimum date
          // Enhanced styling for iOS
          textColor={colors.text_color_1}
          accentColor={colors.gold}
          themeVariant="dark"
        />
      )}

      {showError && (
        <Text style={[typography?.inputError, styles.errorText]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gold,
    marginBottom: 8,
  },
  required: {
    color: colors.status_red,
    fontWeight: 'bold',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: colors.secondary,
    minHeight: 52,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputError: {
    borderColor: colors.status_red,
    borderWidth: 1.5,
  },
  inputDisabled: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    opacity: 0.6,
  },
  inputText: {
    fontSize: 16,
    color: colors.gold,
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: colors.text_color_2,
    fontWeight: '400',
  },
  disabledText: {
    color: colors.text_color_2,
  },
  iconContainer: {
    marginLeft: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 18,
    color: colors.gold,
  },
  disabledIcon: {
    color: colors.text_color_2,
  },
  errorText: {
    color: colors.status_red,
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
});

export default DatePickerBox;