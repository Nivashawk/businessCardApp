import {View, StyleSheet, Dimensions, FlatList, Text, RefreshControl} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import BusinessServiceCard from '../../components/cards/businessServiceCard';
import Upload from '../../../assets/store.png';
import Add from '../../../assets/add.png';
import {colors} from '../../theme/colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native'; // Add useFocusEffect
import {listBusiness} from '../../redux/slices/business/listBusinessSlices';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const numColumns = 2;
const cardMargin = 12;
const itemWidth = (width - cardMargin * (numColumns + 1)) / numColumns;

// Add + Placeholder formatter
const getFormattedData = (data, columns) => {
  const fullData = [
    ...data,
    {id: 'add', name: 'Add New Business', isAddCard: true, image: Add},
  ];
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

  // State for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  const listBusinessData = useSelector(
    state => state.listBusinessData?.data?.response?.result?.data ?? [],
  );
  const isLoading = useSelector(
    state => state.listBusinessData?.loading ?? false,
  );
  const listBusinessStatus = useSelector(
    state => state.listBusinessData?.status,
  );

  console.log('ListBusiness Data:', listBusinessData);
  console.log('Is Loading:', isLoading);

  // Function to fetch businesses
  const fetchBusinesses = useCallback(() => {
    console.log('Dispatching listBusiness action...');
    dispatch(listBusiness());
  }, [dispatch]);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, refreshing data...');
      fetchBusinesses();
    }, [fetchBusinesses])
  );

  // Monitor loading state to stop refreshing indicator
  useEffect(() => {
    if (!isLoading && refreshing) {
      setRefreshing(false);
    }
  }, [isLoading, refreshing]);

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleOnPress = item => {
    if (item.id === 'add') {
      console.log('Navigate to add new business');
      navigation.navigate('CreateBusiness');
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

    const cardImage = item.isAddCard ? Add : Upload;

    return (
      <View style={[styles.cardWrapper, {width: itemWidth}]}>
        <BusinessServiceCard
          item={item}
          image={cardImage}
          onPress={() => handleOnPress(item)}
          isAddCard={item.isAddCard}
        />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>My Businesses</Text>
      <Text style={styles.headerSubtitle}>Manage your business listings</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No businesses yet</Text>
      <Text style={styles.emptySubtitle}>
        Start by adding your first business
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background || '#F8FAFC', '#FFFFFF']}
      style={styles.container}>
      <FlatList
        data={getFormattedData(listBusinessData || [], numColumns)}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading && listBusinessData.length === 0 ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: cardMargin,
    paddingVertical: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  listContainer: {
    paddingHorizontal: cardMargin,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginHorizontal: cardMargin / 2,
    marginBottom: cardMargin,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ListBusiness;