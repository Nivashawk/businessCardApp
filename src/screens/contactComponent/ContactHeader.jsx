// components/contacts/ContactHeader.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {mainStyles} from './styles'; // Import styles

const ContactHeader = ({filteredCount, totalCount}) => (
  <View style={mainStyles.header}>
    <Text style={mainStyles.headerTitle}>Business Contacts</Text>
    <Text style={mainStyles.headerSubtitle}>
      {filteredCount} of {totalCount} contacts
    </Text>
  </View>
);

export default ContactHeader;