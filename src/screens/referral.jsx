import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Share } from 'react-native';
// import Share from 'react-native-share';

const referralData = [
  {
    name: 'Bharath',
    date: '22/09/2025',
    status: 'not subscribed yet',
    earned: '0Rs.',
  },
  {
    name: 'Sharukh',
    date: '22/09/2025',
    status: 'subscribed',
    earned: '10Rs.',
  },
];

const ReferAndEarn = () => {
  const referralCode = 'AA20FIT100';

  const handleShare = async () => {
    const shareOptions = {
      message: `Use my referral code ${referralCode} and earn Rs.10!`,
    };
    try {
      await Share.open(shareOptions);
    } catch (err) {
      console.log('Share canceled or failed:', err);
    }
  };

  const renderReferralItem = ({ item }) => (
    <View style={styles.referralCard}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.status}>Status : {item.status}</Text>
      <Text style={styles.earned}>Earned : {item.earned}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Refer & Earn</Text>

      <View style={styles.referralBox}>
        <Text style={styles.earnedLabel}>💌 100 Rs</Text>
        <Text style={styles.referralCode}>{referralCode}</Text>
        <Text style={styles.earnInfo}>Earn Rs.10 for every refer</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.redeemBox}>
        <Text style={styles.redeemText}>[xxx] Redeem total amount</Text>
      </View>

      <Text style={styles.historyHeading}>Referral History</Text>
      <FlatList
        data={referralData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderReferralItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  referralBox: {
    backgroundColor: '#004D45',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  earnedLabel: {
    color: '#fff',
    marginBottom: 8,
  },
  referralCode: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  earnInfo: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  shareButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  shareText: {
    color: '#004D45',
    fontWeight: '600',
  },
  redeemBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  redeemText: {
    color: '#333',
    fontWeight: '500',
  },
  historyHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  referralCard: {
    backgroundColor: '#f4f4f4',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#004D45',
    fontSize: 12,
    marginBottom: 6,
  },
  status: {
    color: '#555',
  },
  earned: {
    fontWeight: '600',
  },
});

export default ReferAndEarn;
