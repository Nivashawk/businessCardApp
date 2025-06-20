// components/contacts/TabSwitcher.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {tabStyles} from './styles';

const TabSwitcher = ({activeTab, setActiveTab}) => (
  <View style={tabStyles.container}>
    {['Shared Contacts', 'Received Contacts', 'Manual Contacts'].map(tab => ( // Added 'Manual Contacts'
      <TouchableOpacity
        key={tab}
        onPress={() => setActiveTab(tab)}
        style={[tabStyles.tab, activeTab === tab && tabStyles.activeTab]}
        activeOpacity={0.7}>
        <Text
          style={[
            tabStyles.tabText,
            activeTab === tab && tabStyles.activeTabText,
          ]}>
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default TabSwitcher;