import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import CountryCodeModal from './countryCodeModel';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';

const PhoneInputBox = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  error = '',
  selectedCode,
  onSelectCode,
}) => {
  const showError = error && error.length > 0;
  const [modalVisible, setModalVisible] = useState(false);
  // const [selectedCode, setSelectedCode] = useState('+91');
  const [countryCodes, setCountryCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const data = response.data
          .map(country => ({
            code: country.idd?.root + (country.idd?.suffixes?.[0] || ''),
            name: country.name.common,
          }))
          .filter(item => item.code);

        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        console.log(sortedData);

        setCountryCodes(sortedData);
        setFetchError(null);
      } catch (err) {
        setFetchError('Failed to load country codes');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryCodes();
  }, []);

  const handleSelectCode = code => {
    onSelectCode(code);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[typography.inputLabel, styles.label]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={[styles.inputWrapper, showError && styles.inputError]}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setModalVisible(true);
            console.log(true);
            console.log('Modal Visible:', modalVisible);
          }}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#555" />
          ) : (
            <Text style={styles.prefixText}>{selectedCode}</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={[typography.inputText, styles.input]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType="phone-pad"
          placeholderTextColor="#c4c4c4"
        />
      </View>
      {showError && (
        <Text style={[typography.inputError, styles.errorText]}>{error}</Text>
      )}

      <CountryCodeModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        countryCodes={countryCodes}
        handleSelectCode={handleSelectCode}
      />
    </View>
  );
};

export default PhoneInputBox;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  required: {
    color: colors.status_red,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.text_color_2,
    borderRadius: 8,
    paddingHorizontal: 0, // Changed from 10
    backgroundColor: colors.background,
    overflow: 'hidden', // ensures child borders don’t break container shape
  },
  dropdown: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: colors.secondary,
    marginRight: 8,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  prefixText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12, // to match dropdown spacing
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.status_red,
  },
  errorText: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '60%',
    backgroundColor: colors.background,
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  codeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.text_color_1,
  },
  inputError: {
    borderColor: colors.status_red,
  },
});
