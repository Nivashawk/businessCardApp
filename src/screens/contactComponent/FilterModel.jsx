// components/contacts/FilterModal.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import {colors} from '../../theme/colors';
import {filterStyles} from './styles'; // Import styles

const FilterModal = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  activeTab,
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const eventTypes = ['ALL', 'TESTING', 'CONFERENCE', 'WORKSHOP', 'NETWORKING'];
  const dateRanges = ['ALL', 'TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS'];

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      eventType: 'ALL',
      dateRange: 'ALL',
      businessName: '',
      personName: '',
    };
    setTempFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={filterStyles.overlay}>
        <View style={filterStyles.modalContainer}>
          <View style={filterStyles.header}>
            <Text style={filterStyles.title}>Filter {activeTab}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={filterStyles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Event Type Filter */}
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>Event Type</Text>
              <View style={filterStyles.optionContainer}>
                {eventTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      filterStyles.optionButton,
                      tempFilters.eventType === type &&
                        filterStyles.selectedOption,
                    ]}
                    onPress={() =>
                      setTempFilters({...tempFilters, eventType: type})
                    }>
                    <Text
                      style={[
                        filterStyles.optionText,
                        tempFilters.eventType === type &&
                          filterStyles.selectedOptionText,
                      ]}>
                      {type.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range Filter */}
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>Date Range</Text>
              <View style={filterStyles.optionContainer}>
                {dateRanges.map(range => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      filterStyles.optionButton,
                      tempFilters.dateRange === range &&
                        filterStyles.selectedOption,
                    ]}
                    onPress={() =>
                      setTempFilters({...tempFilters, dateRange: range})
                    }>
                    <Text
                      style={[
                        filterStyles.optionText,
                        tempFilters.dateRange === range &&
                          filterStyles.selectedOptionText,
                      ]}>
                      {range.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Business Name Filter */}
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>Business Name</Text>
              <TextInput
                style={filterStyles.textInput}
                placeholder="Enter business name..."
                value={tempFilters.businessName}
                onChangeText={text =>
                  setTempFilters({...tempFilters, businessName: text})
                }
              />
            </View>

            {/* Person Name Filter */}
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>
                {activeTab === 'Shared Contacts'
                  ? 'Recipient Name'
                  : 'Sender Name'}
              </Text>
              <TextInput
                style={filterStyles.textInput}
                placeholder={`Enter ${
                  activeTab === 'Shared Contacts' ? 'recipient' : 'sender'
                } name...`}
                value={tempFilters.personName}
                onChangeText={text =>
                  setTempFilters({...tempFilters, personName: text})
                }
              />
            </View>
          </ScrollView>

          <View style={filterStyles.buttonContainer}>
            <TouchableOpacity
              style={[filterStyles.button, filterStyles.resetButton]}
              onPress={handleReset}>
              <Text style={filterStyles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[filterStyles.button, filterStyles.applyButton]}
              onPress={handleApply}>
              <Text style={filterStyles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;