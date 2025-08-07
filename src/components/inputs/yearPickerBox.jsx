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
  Animated,
} from 'react-native';
import { colors } from '../../theme/colors';

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
        }, 300);
      }
    }
  }, [isModalVisible, value]);

  useEffect(() => {
    if (isModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isModalVisible]);

  const handleYearSelect = selectedYear => {
    onChange(selectedYear);
    setIsModalVisible(false);
  };

  const openModal = () => {
    if (!disabled) {
      console.log('Year picker clicked');
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderYearItem = ({ item, index }) => {
    const isSelected = item.year === value;
    const isLastItem = index === years.length - 1;
    
    return (
      <TouchableOpacity
        style={[
          styles.yearItem,
          isSelected && styles.selectedYearItem,
          isLastItem && styles.lastYearItem,
        ]}
        onPress={() => handleYearSelect(item.year)}
        activeOpacity={0.7}
      >
        <Text style={[styles.yearText, isSelected && styles.selectedYearText]}>
          {item.year}
        </Text>
        {isSelected && (
          <Text style={styles.checkIcon}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data, index) => ({
    length: 56,
    offset: 56 * index,
    index,
  });

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      {/* Input Field */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          disabled && styles.inputDisabled,
        ]}
        onPress={openModal}
        disabled={disabled}
        activeOpacity={0.8}
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
        <View style={styles.iconContainer}>
          <Text style={[
            styles.dropdownIcon,
            disabled && styles.disabledIcon,
          ]}>
            📅
          </Text>
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Year Picker Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <Text style={styles.modalTitle}>Select Year</Text>
                <Text style={styles.modalSubtitle}>
                  Choose from {startYear} to {endYear}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Year List */}
            <View style={styles.listContainer}>
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
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onScrollToIndexFailed={info => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToIndex({
                      index: info.index,
                      animated: true,
                    });
                  }, 500);
                }}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
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
    fontWeight: '600',
    color: colors.gold,
  },
  required: {
    color: colors.status_red,
    fontWeight: 'bold',
  },
  inputContainer: {
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
    flex: 1,
    fontWeight: '500',
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
  dropdownIcon: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    width: width * 0.85,
    maxHeight: height * 0.75,
    flex: 1,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.text_color_2,
    fontWeight: '500',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  closeIcon: {
    fontSize: 24,
    color: colors.text_color_2,
    fontWeight: '300',
    lineHeight: 24,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  yearList: {
    flex: 1,
  },
  yearItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.secondary,
    minHeight: 56,
  },
  lastYearItem: {
    borderBottomWidth: 0,
  },
  selectedYearItem: {
    backgroundColor: colors.gold + '20', // 20% opacity
  },
  yearText: {
    fontSize: 17,
    color: colors.text_color_1,
    fontWeight: '500',
    flex: 1,
  },
  selectedYearText: {
    color: colors.gold,
    fontWeight: '700',
  },
  checkIcon: {
    fontSize: 16,
    color: colors.gold,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    backgroundColor: colors.background,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.text_color_1,
    fontWeight: '600',
  },
});

export default YearPickerBox;