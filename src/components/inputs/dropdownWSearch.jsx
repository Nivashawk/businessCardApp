import React, { useState, useRef, useEffect } from 'react';
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

const DropdownWSearch = ({
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
  required = false,
  requiredText = 'This field is required',
}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [searchText, setSearchText] = useState('');
  const [touched, setTouched] = useState(false);
  const dropdownButtonRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const windowHeight = Dimensions.get('window').height;

  const showError = required && touched && !selected;

  const toggleDropdown = () => {
    if (disabled) return;
    setTouched(true);
    if (visible) close();
    else open();
  };

  const open = () => {
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
      setSearchText('');
    });
  };

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    close();
  };

  const filteredData = data.filter((item) =>
    item[labelField].toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        itemStyle,
        selected && item[valueField] === selected[valueField]
          ? [styles.selectedItem, selectedItemStyle]
          : {},
      ]}
      onPress={() => onItemPress(item)}
    >
      <Text>{item[labelField]}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
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
      <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
        <TouchableOpacity style={styles.overlay} onPress={close} activeOpacity={1}>
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
                  placeholder="Search..."
                  placeholderTextColor="#999"
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.searchInput}
                />
              </View>
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={true}
                style={styles.flatList}
                keyboardShouldPersistTaps="handled"
              />
            </SafeAreaView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, labelStyle, typography.inputLabel]}>{label} {required && <Text style={styles.required}>*</Text>}</Text>
      ) : null}
      <TouchableOpacity
        ref={dropdownButtonRef}
        style={[
          styles.button,
          dropdownStyle,
          disabled && styles.disabled,
          showError && styles.errorBorder,
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>
          {selected ? selected[labelField] : placeholder}
        </Text>
      </TouchableOpacity>
      {showError && <Text style={styles.errorText}>{requiredText}</Text>}
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
  },
    required: {
    color: colors.status_red,
  },
});

export default DropdownWSearch;

