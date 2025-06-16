// components/InputBox.js
import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';

const InputBox = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  required = false,
  error = '',
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
          styles.input,
          showError && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
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

export default InputBox;
