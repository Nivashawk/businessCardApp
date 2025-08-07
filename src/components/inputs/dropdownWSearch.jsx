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
  Dimensions,
  ActivityIndicator
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
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
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
      });
    });
  }, [windowHeight, data.length, fadeAnim, scaleAnim]);

  const close = useCallback(() => {
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        setSearchText('');
      });
    });
  }, [fadeAnim, scaleAnim]);

  const onItemPress = useCallback((item) => {
    setSelected(item);
    onSelect(item);
    close();
  }, [onSelect, close]);

  const renderItem = useCallback(({ item, index }) => {
    const isSelected = selected && item[valueField] === selected[valueField];
    const isLastItem = index === filteredData.length - 1;
    
    return (
      <TouchableOpacity
        style={[
          styles.item,
          itemStyle,
          isSelected ? [styles.selectedItem, selectedItemStyle] : {},
          isLastItem && styles.lastItem,
        ]}
        onPress={() => onItemPress(item)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.itemText,
          isSelected && styles.selectedItemText
        ]}>
          {item[labelField]}
        </Text>
        {isSelected && (
          <Text style={styles.checkIcon}>✓</Text>
        )}
      </TouchableOpacity>
    );
  }, [selected, valueField, itemStyle, selectedItemStyle, onItemPress, labelField, filteredData.length]);

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
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <SafeAreaView style={listContainerStyle}>
              <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                    placeholder={searchPlaceholder}
                    placeholderTextColor={colors.text_color_2}
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchText('')}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearIcon}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
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
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={colors.gold} />
                      <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                  ) : (
                    <Text style={styles.noDataText}>{noDataText}</Text>
                  )}
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
    scaleAnim, 
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
        <Text style={[styles.label, labelStyle, typography?.inputLabel]}>
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
          visible && styles.activeButton,
        ]}
        onPress={toggleDropdown}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText,
          (!selected && !loading) && styles.placeholderText,
          (disabled || loading) && styles.disabledText,
        ]}>
          {displayText}
        </Text>
        <View style={styles.iconContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.gold} />
          ) : (
            <Text style={[
              styles.dropdownIcon,
              visible && styles.activeIcon,
            ]}>
              ▼
            </Text>
          )}
        </View>
      </TouchableOpacity>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      {visible && renderDropdown()}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text_color_1,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeButton: {
    borderColor: colors.gold,
    elevation: 4,
    shadowColor: colors.gold,
    shadowOpacity: 0.2,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    color: colors.gold,
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
    minWidth: 20,
    alignItems: 'center',
  },
  dropdownIcon: {
    fontSize: 14,
    color: colors.text_color_2,
    fontWeight: '600',
    transform: [{ rotate: '0deg' }],
  },
  activeIcon: {
    color: colors.gold,
    transform: [{ rotate: '180deg' }],
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: colors.surface,
  },
  errorBorder: {
    borderColor: colors.status_red,
    borderWidth: 1.5,
  },
  errorText: {
    color: colors.status_red,
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  dropdownModal: {
    position: 'absolute',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  dropdown: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 320,
    overflow: 'hidden',
  },
  flatList: {
    flexGrow: 0,
  },
  searchContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 42,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: colors.text_color_2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text_color_1,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.text_color_2,
    fontWeight: '300',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.secondary,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text_color_1,
    fontWeight: '500',
  },
  selectedItem: {
    backgroundColor: colors.gold + '15', // 15% opacity
  },
  selectedItemText: {
    color: colors.gold,
    fontWeight: '600',
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
    marginHorizontal: 16,
  },
  required: {
    color: colors.status_red,
    fontWeight: 'bold',
  },
  noDataContainer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: colors.text_color_2,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DropdownWSearch;