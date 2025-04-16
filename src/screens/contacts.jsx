import React, {useState} from 'react';import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import InputBox from '../components/inputs/textInput';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
// import Icon from 'react-native-vector-icons/MaterialIcons';

const eventData = [
  {
    id: '1',
    event: 'Madurai Grand Expo',
    date: '22-09-2024',
    businessName: 'Zedbyte software solutions',
    status: 'Mutual',
  },
  {
    id: '2',
    event: 'Madurai Grand Expo',
    date: '22-09-2024',
    businessName: 'Zedbyte software solutions',
    status: 'Mutual',
  },
  {
    id: '3',
    event: 'Madurai Grand Expo',
    date: '22-09-2024',
    businessName: 'Zedbyte software solutions',
    status: 'Mutual',
  },
];

const {width, height} = Dimensions.get('window');

const Contacts = () => {
    const [name, setName] = useState('');
  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {/* <View style={styles.cardTop}>
        <Text style={typography.inputText}>Event</Text>
        <Text style={typography.inputText}>Date</Text>
      </View> */}
      <View style={styles.cardTop}>
        <Text style={typography.description}>{item.event}</Text>
        <Text style={typography.description}>{item.date}</Text>
      </View>
      <Text style={[typography.description,styles.businessTitle]}>Business Name</Text>
      <Text style={typography.linkText}>{item.businessName}</Text>
      <Text style={[typography.linkText,styles.status]}>{item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* Search */}
      <View style={{width:'90%', justifyContent:'center', marginTop:10}}>

      <InputBox
        value={name}
        onChangeText={setName}
        placeholder="Search by Name"
        />
        </View>

      {/* List */}
      <FlatList
        data={eventData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
      />

      {/* Filter Button */}
      {/* <TouchableOpacity style={styles.filterBtn}>
        <Icon name="filter-list" size={28} color="#004d40" />
      </TouchableOpacity> */}

    </SafeAreaView>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },

  list: {
    width:width,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    // width:'100%',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
  },
  cardValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  businessTitle: {
    marginTop: 10,
  },
  businessName: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
  },
  status: {
    textAlign: 'right',
  },
  filterBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 30,
    padding: 12,
    elevation: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#004d40',
    paddingVertical: 12,
  },
});