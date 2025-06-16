import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const YearPickerBox = ({
  label,
  value,
  onChange,
  placeholder = 'Select Year',
  required = false,
  error = '',
  startYear = 1900,
  endYear = new Date().getFullYear(),
  disabled = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const flatListRef = useRef(null);

  const generateYears = () => {
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push({ id: year.toString(), year: year.toString() });
    }
    return years;
  };

  const years = generateYears();

  useEffect(() => {
    if (isModalVisible && value && flatListRef.current) {
      const selectedIndex = years.findIndex(item => item.year === value);
      if (selectedIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      }
    }
  }, [isModalVisible, value]);

  const handleYearSelect = selectedYear => {
    onChange(selectedYear);
    setIsModalVisible(false);
  };

  const renderYearItem = ({ item }) => {
    const isSelected = item.year === value;
    return (
      <TouchableOpacity
        style={[styles.yearItem, isSelected && styles.selectedYearItem]}
        onPress={() => handleYearSelect(item.year)}
      >
        <Text style={[styles.yearText, isSelected && styles.selectedYearText]}>
          {item.year}
        </Text>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data, index) => ({
    length: 50,
    offset: 50 * index,
    index,
  });

  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      {/* Input Field */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          disabled && styles.inputDisabled,
        ]}
        onPress={() => {
          if (!disabled) {
            console.log('Year picker clicked');
            setIsModalVisible(true);
          }
        }}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.inputText,
            !value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Debug Fallback */}
      {/* <Text
        style={{ color: 'blue', marginTop: 10 }}
        onPress={() => setIsModalVisible(true)}
      >
        Force Open Modal (debug)
      </Text> */}

      {/* Year Picker Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Year</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Year List */}
            <FlatList
              ref={flatListRef}
              data={years}
              renderItem={renderYearItem}
              keyExtractor={item => item.id}
              style={styles.yearList}
              showsVerticalScrollIndicator={true}
              getItemLayout={getItemLayout}
              initialNumToRender={10}
              maxToRenderPerBatch={20}
              windowSize={10}
              onScrollToIndexFailed={info => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                }, 500);
              }}
            />

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: height * 0.02,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: '#e74c3c',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  disabledText: {
    color: '#ccc',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.8,
    maxHeight: height * 0.7,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    color: '#007bff',
    fontSize: 16,
  },
  yearList: {
    maxHeight: height * 0.5,
  },
  yearItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'center',
    height: 50,
  },
  selectedYearItem: {
    backgroundColor: '#007bff',
  },
  yearText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedYearText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
});

export default YearPickerBox;
