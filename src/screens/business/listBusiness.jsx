import {View, StyleSheet, Dimensions, FlatList} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ServiceCard from '../../components/cards/serviceCard';
import Upload from '../../../assets/serviceCard/event.png';
import {colors} from '../../theme/colors';
import {useNavigation} from '@react-navigation/native';
import {listBusiness} from '../../redux/slices/business/listBusinessSlices';

const {width} = Dimensions.get('window');
const numColumns = 3;
const cardMargin = 6;
const itemWidth = (width - cardMargin * (numColumns + 1)) / numColumns;

// Add + Placeholder formatter
const getFormattedData = (data, columns) => {
  const fullData = [...data, {id: 'add', name: 'Add New Business'}];
  const remainder = fullData.length % columns;
  if (remainder !== 0) {
    const placeholders = Array(columns - remainder)
      .fill()
      .map((_, index) => ({
        id: `empty-${index}`,
        empty: true,
      }));
    return [...fullData, ...placeholders];
  }
  return fullData;
};

const ListBusiness = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const listBusinessData = useSelector(
    state => state.listBusinessData?.data?.response?.result?.data ?? [],
  );
  console.log(listBusinessData);

  useEffect(() => {
    console.log('before api');
    dispatch(listBusiness());
    console.log('aftyer api');
  }, []);

  const handleOnPress = item => {
    if (item.id === 'add') {
      console.log('Navigate to add new business');
      return;
    }
    navigation.navigate('BusinessDetails', {
      data: {id: item?.id, name: item?.name},
    });
    console.log('Pressed:', item.name);
  };

  const renderItem = ({item}) => {
    if (item.empty) {
      return <View style={[styles.cardWrapper, {width: itemWidth}]} />;
    }

    return (
      <View style={[styles.cardWrapper, {width: itemWidth}]}>
        <ServiceCard
          title={item.name}
          image={Upload}
          onPress={() => handleOnPress(item)}
        />
      </View>
    );
  };

  return (
    <View style={{backgroundColor: colors.background}}>
      <FlatList
        data={getFormattedData(listBusinessData || [], numColumns)}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    // flex:1,
    padding: cardMargin,
    // backgroundColor: colors.background,
  },
  cardWrapper: {
    margin: cardMargin / 2,
  },
});

export default ListBusiness;
