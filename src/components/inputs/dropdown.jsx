import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  Animated,
  Dimensions
} from 'react-native';
import { colors } from '../../theme/colors';


/**
 * Reusable Dropdown Component for React Native
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of objects to display in dropdown
 * @param {string} props.label - Label for the dropdown
 * @param {string} props.placeholder - Placeholder text when no item is selected
 * @param {Function} props.onSelect - Function called when an item is selected
 * @param {string} props.valueField - Object key to use as value (default: 'value')
 * @param {string} props.labelField - Object key to use as label (default: 'label')
 * @param {Object} props.containerStyle - Style for the dropdown container
 * @param {Object} props.dropdownStyle - Style for the dropdown button
 * @param {Object} props.itemStyle - Style for individual dropdown items
 * @param {Object} props.selectedItemStyle - Style for the selected item
 * @param {Object} props.labelStyle - Style for the dropdown label
 * @param {boolean} props.disabled - Whether the dropdown is disabled
 */

const Dropdown = ({
  data = [],
  label = '',
  placeholder = 'Select an item',
  onSelect = () => {},
  valueField = 'value',
  labelField = 'label',
  containerStyle = {},
  dropdownStyle = {},
  itemStyle = {},
  selectedItemStyle = {},
  labelStyle = {},
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownButtonRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const windowHeight = Dimensions.get('window').height;

  const toggleDropdown = () => {
    if (disabled) return;
    
    if (visible) {
      close();
    } else {
      open();
    }
  };

  const open = () => {
    dropdownButtonRef.current.measure((fx, fy, width, height, px, py) => {
      // Calculate if dropdown should appear above or below the button
      const spaceBelow = windowHeight - py - height;
      const spaceNeeded = Math.min(300, data.length * 50); // Estimate dropdown height
      
      setDropdownPosition({
        top: py + height,
        left: px,
        width: width,
        above: spaceBelow < spaceNeeded
      });
      
      setVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const close = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    close();
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      style={[
        styles.item, 
        itemStyle,
        selected && item[valueField] === selected[valueField] ? [styles.selectedItem, selectedItemStyle] : {}
      ]} 
      onPress={() => onItemPress(item)}
    >
      <Text>{item[labelField]}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    const modalStyles = [
      styles.dropdownModal,
      dropdownPosition.above ? { bottom: windowHeight - dropdownPosition.top + 10 } : { top: dropdownPosition.top }
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
                transform: [{ 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [dropdownPosition.above ? -10 : 10, 0]
                  }) 
                }]
              }
            ]}
          >
            <SafeAreaView style={listContainerStyle}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={true}
                style={styles.flatList}
              />
            </SafeAreaView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <TouchableOpacity
        ref={dropdownButtonRef}
        style={[styles.button, dropdownStyle, disabled && styles.disabled]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>
          {selected ? selected[labelField] : placeholder}
        </Text>
      </TouchableOpacity>
      {visible && renderDropdown()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
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
  },
  disabled: {
    opacity: 0.5,
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
  selectedItem: {
    backgroundColor: '#e6f7ff',
  },
});

export default Dropdown;