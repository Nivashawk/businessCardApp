// components/TextAreaBox.js
import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';

const TextAreaBox = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  required = false,
  error = '',
  numberOfLines = 4,
}) => {
  const showError = error && error.length > 0;

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[typography.inputLabel, styles.label]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TextInput
        style={[
          typography.inputText,
          styles.textArea,
          showError && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        placeholderTextColor="#c4c4c4"
      />
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
  textArea: {
    borderWidth: 0.5,
    borderColor: colors.text_color_2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 100,
    backgroundColor: colors.background,
    textAlignVertical: 'top', // Important for Android
  },
  inputError: {
    borderColor: colors.status_red,
  },
  errorText: {
    marginTop: 4,
  },
});

export default TextAreaBox;
