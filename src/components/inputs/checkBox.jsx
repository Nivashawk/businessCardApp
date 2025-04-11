import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const CustomCheckbox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <View style={styles.innerDot} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10, // circular
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    borderColor: '#004D40',
    backgroundColor: '#004D40',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default CustomCheckbox;
