import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import InputBox from './textInput';

const CountryCodeModal = ({
  modalVisible,
  setModalVisible,
  countryCodes,
  handleSelectCode,
}) => {
  const [search, setSearch] = useState('');
  const [filteredCodes, setFilteredCodes] = useState(countryCodes || []);

  useEffect(() => {
    const filtered = countryCodes.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredCodes(filtered);
  }, [search, countryCodes]);

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <InputBox
            value={search}
            onChangeText={setSearch}
            placeholder="Search country"
            keyboardType="email-address"
          />
          <FlatList
            data={filteredCodes}
            keyExtractor={(item, index) => item.code + index}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.codeItem}
                onPress={() => {
                  handleSelectCode(item.code);
                  setModalVisible(false);
                }}>
                <Text>{`${item.name} (${item.code})`}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noResult}>No country found</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  codeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noResult: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#999',
  },
});

export default CountryCodeModal;
