import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Share,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {invite} from '../redux/slices/referral/inviteSlices';
import {getReferrals} from '../redux/slices/referral/getReferralsSlices';
import { colors } from '../theme/colors';

const {width} = Dimensions.get('window');

const ReferAndEarn = () => {
  const dispatch = useDispatch();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const inviteData = useSelector(state => state.invite?.data?.result ?? {});
  const MyReferralList = useSelector(
    state => state.getMyReferrals?.data?.result?.data ?? [],
  );

  // Calculate total earnings
  const totalEarnings = MyReferralList.reduce((sum, item) => {
    // Assuming you have earnings logic based on status
    return sum + (item.status === 'subscribed' ? 10 : 0);
  }, 0);

  const subscribedCount = MyReferralList.filter(item => 
    item.status === 'subscribed'
  ).length;

  useEffect(() => {
    dispatch(invite());
    dispatch(getReferrals());

    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: inviteData.referral_message || 
          `Join me on this amazing app! Use my referral code: ${inviteData.referral_code}`,
        title: 'Share referral code',
      });

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderReferralItem = ({item, index}) => (
    <Animated.View 
      style={[
        styles.referralCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 50],
                outputRange: [0, 50],
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.date}>Joined: {formatDate(item.create_date)}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            {backgroundColor: item.status === 'subscribed' ? '#4CAF50' : '#FF9800'}
          ]} />
          <Text style={[
            styles.status,
            {color: item.status === 'subscribed' ? '#4CAF50' : '#FF9800'}
          ]}>
            {item.status === 'subscribed' ? 'Active' : 'Pending'}
          </Text>
        </View>
        <Text style={styles.earned}>
          ₹{item.status === 'subscribed' ? '10' : '0'}
        </Text>
      </View>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>👥</Text>
      <Text style={styles.emptyStateTitle}>No Referrals Yet</Text>
      <Text style={styles.emptyStateText}>
        Start sharing your referral code to earn rewards!
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}]
          }
        ]}
      >
        <Text style={styles.heading}>Refer & Earn</Text>
        <Text style={styles.subHeading}>
          Invite friends and earn rewards together
        </Text>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}]
          }
        ]}
      >
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{MyReferralList.length}</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{subscribedCount}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>₹{totalEarnings}</Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
      </Animated.View>

      {/* Referral Code Card */}
      <Animated.View 
        style={[
          styles.referralBox,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}]
          }
        ]}
      >
        <View style={styles.referralHeader}>
          <Text style={styles.referralTitle}>Your Referral Code</Text>
          <Text style={styles.referralSubtitle}>
            Share this code with friends
          </Text>
        </View>
        
        <View style={styles.codeContainer}>
          <Text style={styles.referralCode}>
            {inviteData.referral_code || 'LOADING...'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.shareIcon}>📤</Text>
          <Text style={styles.shareText}>Share Now</Text>
        </TouchableOpacity>

        <View style={styles.rewardInfo}>
          <Text style={styles.rewardText}>
            💰 Earn ₹10 for each successful referral
          </Text>
        </View>
      </Animated.View>

      {/* Redeem Section */}
      <Animated.View 
        style={[
          styles.redeemBox,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}]
          }
        ]}
      >
        <View style={styles.redeemContent}>
          <Text style={styles.redeemAmount}>₹{totalEarnings}</Text>
          <Text style={styles.redeemLabel}>Available to Redeem</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.redeemButton,
            {opacity: totalEarnings > 0 ? 1 : 0.5}
          ]}
          disabled={totalEarnings === 0}
        >
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Referral History */}
      <Animated.View 
        style={[
          styles.historySection,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}]
          }
        ]}
      >
        <Text style={styles.historyHeading}>Referral History</Text>
        
        <FlatList
          data={MyReferralList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReferralItem}
          ListEmptyComponent={renderEmptyState}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004D45',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  referralBox: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    shadowColor: '#004D45',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  referralHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  referralTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  referralSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  codeContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  referralCode: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
  },
  shareButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 16,
    gap: 8,
  },
  shareIcon: {
    fontSize: 16,
  },
  shareText: {
    color: '#004D45',
    fontWeight: '600',
    fontSize: 16,
  },
  rewardInfo: {
    alignItems: 'center',
  },
  rewardText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  redeemBox: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  redeemContent: {
    flex: 1,
  },
  redeemAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004D45',
    marginBottom: 4,
  },
  redeemLabel: {
    fontSize: 14,
    color: '#666',
  },
  redeemButton: {
    backgroundColor: '#004D45',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  historySection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  referralCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#004D45',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  earned: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004D45',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ReferAndEarn;