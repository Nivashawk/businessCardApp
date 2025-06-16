import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, Switch} from 'react-native';

const SocialInputBox = ({
  IconComponent,
  label,
  placeholder,
  value,
  onChangeText,
  isEnabled,
  onToggle,
  keyboardType = 'default',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <IconComponent width={24} height={24} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
        <Switch value={isEnabled} onValueChange={onToggle} />
      </View>
      <TextInput
        style={[
          styles.input,
          {backgroundColor: isEnabled ? '#fff' : '#f0f0f0'},
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={isEnabled}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },
});

export default SocialInputBox;
