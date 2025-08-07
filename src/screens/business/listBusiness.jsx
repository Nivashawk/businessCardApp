import {View, StyleSheet, Dimensions, FlatList, Text, RefreshControl} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import BusinessServiceCard from '../../components/cards/businessServiceCard';
import Upload from '../../../assets/store.png';
import Add from '../../../assets/add.png';
import {colors} from '../../theme/colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
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
      {/* <LinearGradient
        colors={[colors.gold, colors.goldDark]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.headerGradient}>
        <Text style={styles.headerTitle}>My Businesses</Text>
      </LinearGradient> */}
      <Text style={styles.headerSubtitle}>Manage your business listings</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <View style={styles.emptyIcon}>
          <View style={styles.emptyIconInner} />
        </View>
      </View>
      <Text style={styles.emptyTitle}>No businesses yet</Text>
      <Text style={styles.emptySubtitle}>
        Start by adding your first business to get started
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <View style={styles.shimmerContainer}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.shimmerCard}>
            <LinearGradient
              colors={[colors.surface, colors.shimmer, colors.surface]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.shimmerGradient}
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}>
      
      {/* Status Bar Overlay */}
      {/* <View style={styles.statusBarOverlay} /> */}
      
      <FlatList
        data={getFormattedData(listBusinessData || [], numColumns)}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          isLoading 
            ? renderLoadingState 
            : listBusinessData.length === 0 
              ? renderEmptyState 
              : null
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold}
            colors={[colors.gold, colors.goldDark]}
            progressBackgroundColor={colors.surface}
          />
        }
        style={styles.flatList}
      />
      
      {/* Bottom Gradient Fade */}
      <LinearGradient
        colors={['transparent', colors.background]}
        style={styles.bottomFade}
        pointerEvents="none"
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarOverlay: {
    height: 50,
    backgroundColor: 'transparent',
  },
  flatList: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: cardMargin,
    paddingVertical: 24,
    paddingBottom: 20,
    marginBottom: 8,
  },
  headerGradient: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.background,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginLeft: 4,
  },
  listContainer: {
    paddingHorizontal: cardMargin,
    paddingBottom: 40,
    flexGrow: 1,
  },
  cardWrapper: {
    marginHorizontal: cardMargin / 2,
    marginBottom: cardMargin,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  emptyIconInner: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.accent,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  shimmerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shimmerCard: {
    width: itemWidth,
    height: 140,
    borderRadius: 16,
    marginBottom: cardMargin,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  shimmerGradient: {
    flex: 1,
    opacity: 0.6,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    pointerEvents: 'none',
  },
});

export default ListBusiness;