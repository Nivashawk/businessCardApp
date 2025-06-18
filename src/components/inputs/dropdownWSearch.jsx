import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  Animated,
  Dimensions
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const DropdownWSearch = React.memo(({
  data = [],
  label = '',
  placeholder = 'Select an item',
  onSelect = () => {},
  valueField = 'value',
  labelField = 'label',
  selectedValue = null,
  containerStyle = {},
  dropdownStyle = {},
  itemStyle = {},
  selectedItemStyle = {},
  labelStyle = {},
  disabled = false,
  required = false,
  requiredText = 'This field is required',
  error = '',
  searchPlaceholder = 'Search...',
  noDataText = 'No data found',
  loading = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [searchText, setSearchText] = useState('');
  const [touched, setTouched] = useState(false);
  
  const dropdownButtonRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const windowHeight = Dimensions.get('window').height;

  // Memoize the comparison value to prevent unnecessary re-renders
  const selectedValueKey = useMemo(() => {
    return selectedValue ? `${selectedValue[valueField]}-${selectedValue[labelField]}` : null;
  }, [selectedValue, valueField, labelField]);

  // Use useCallback to prevent unnecessary re-creation of the effect
  const updateSelectedValue = useCallback(() => {
    // Only update if selectedValue has actually changed
    if (!selectedValue && selected) {
      setSelected(null);
      return;
    }
    
    if (selectedValue && (!selected || selected[valueField] !== selectedValue[valueField])) {
      setSelected(selectedValue);
    }
  }, [selectedValue, selected, valueField]);

  // Fixed useEffect to prevent infinite loops
  useEffect(() => {
    updateSelectedValue();
  }, [selectedValueKey]); // Use the memoized key instead of the object

  // Memoize filtered data to prevent unnecessary filtering
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    if (!searchText.trim()) {
      return data;
    }
    
    return data.filter((item) =>
      item[labelField]?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText, labelField]);

  const showError = (required && touched && !selected) || !!error;

  const toggleDropdown = useCallback(() => {
    if (disabled || loading) return;
    setTouched(true);
    if (visible) {
      close();
    } else {
      open();
    }
  }, [disabled, loading, visible]);

  const open = useCallback(() => {
    if (!dropdownButtonRef.current) return;
    
    dropdownButtonRef.current.measure((fx, fy, width, height, px, py) => {
      const spaceBelow = windowHeight - py - height;
      const spaceNeeded = Math.min(300, data.length * 50);

      setDropdownPosition({
        top: py + height,
        left: px,
        width: width,
        above: spaceBelow < spaceNeeded,
      });

      setVisible(true);
      
      // Use requestAnimationFrame to avoid scheduling updates during render
      requestAnimationFrame(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    });
  }, [windowHeight, data.length, fadeAnim]);

  const close = useCallback(() => {
    requestAnimationFrame(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        setSearchText('');
      });
    });
  }, [fadeAnim]);

  const onItemPress = useCallback((item) => {
    setSelected(item);
    onSelect(item);
    close();
  }, [onSelect, close]);

  const renderItem = useCallback(({ item }) => {
    const isSelected = selected && item[valueField] === selected[valueField];
    
    return (
      <TouchableOpacity
        style={[
          styles.item,
          itemStyle,
          isSelected ? [styles.selectedItem, selectedItemStyle] : {},
        ]}
        onPress={() => onItemPress(item)}
      >
        <Text style={styles.itemText}>{item[labelField]}</Text>
      </TouchableOpacity>
    );
  }, [selected, valueField, itemStyle, selectedItemStyle, onItemPress, labelField]);

  const renderDropdown = useCallback(() => {
    const modalStyles = [
      styles.dropdownModal,
      dropdownPosition.above
        ? { bottom: windowHeight - dropdownPosition.top + 10 }
        : { top: dropdownPosition.top },
    ];

    const listContainerStyle = [
      styles.dropdown,
      { width: dropdownPosition.width },
      dropdownStyle,
    ];

    return (
      <Modal 
        visible={visible} 
        transparent 
        animationType="none" 
        onRequestClose={close}
        statusBarTranslucent={true}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={close} 
          activeOpacity={1}
        >
          <Animated.View
            style={[
              modalStyles,
              {
                opacity: fadeAnim,
                left: dropdownPosition.left,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [dropdownPosition.above ? -10 : 10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <SafeAreaView style={listContainerStyle}>
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#999"
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.searchInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {filteredData.length > 0 ? (
                <FlatList
                  data={filteredData}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `${item[valueField]}-${index}`}
                  showsVerticalScrollIndicator={true}
                  style={styles.flatList}
                  keyboardShouldPersistTaps="handled"
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>
                    {loading ? 'Loading...' : noDataText}
                  </Text>
                </View>
              )}
            </SafeAreaView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  }, [
    visible, 
    dropdownPosition, 
    windowHeight, 
    dropdownStyle, 
    fadeAnim, 
    searchPlaceholder, 
    searchText, 
    filteredData, 
    renderItem, 
    valueField, 
    loading, 
    noDataText, 
    close
  ]);

  const errorMessage = error || (showError ? requiredText : '');

  const displayText = useMemo(() => {
    if (loading) return 'Loading...';
    if (selected) return selected[labelField];
    return placeholder;
  }, [loading, selected, labelField, placeholder]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, labelStyle, typography.inputLabel]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      ) : null}
      <TouchableOpacity
        ref={dropdownButtonRef}
        style={[
          styles.button,
          dropdownStyle,
          (disabled || loading) && styles.disabled,
          (showError || error) && styles.errorBorder,
        ]}
        onPress={toggleDropdown}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.buttonText,
          (!selected && !loading) && styles.placeholderText
        ]}>
          {displayText}
        </Text>
        <Text style={styles.dropdownIcon}>
          {loading ? '⟳' : (visible ? '▲' : '▼')}
        </Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {visible && renderDropdown()}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  dropdownModal: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 300,
  },
  flatList: {
    flexGrow: 0,
  },
  item: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItem: {
    backgroundColor: '#e6f7ff',
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  required: {
    color: colors.status_red,
  },
  noDataContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 14,
  },
});

export default DropdownWSearch;