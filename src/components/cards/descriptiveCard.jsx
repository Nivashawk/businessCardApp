import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';
import { truncateText } from '../../utlis/stringHandler';

const DescriptiveCard = ({title, date, description, onPress, priority = 'normal'}) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return colors.error || '#FF4444';
      case 'medium': return colors.warning || '#FF8C00';
      case 'low': return colors.success || '#4CAF50';
      default: return colors.primary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, {borderLeftColor: getPriorityColor()}]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Priority indicator */}
      <View style={[styles.priorityIndicator, {backgroundColor: getPriorityColor()}]} />
      
      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {title}
        </Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Description section */}
      <Text style={styles.description}>
        {truncateText(description, 20)}
      </Text>
      
      {/* Footer with action indicator */}
      <View style={styles.footer}>
        <View style={styles.actionIndicator}>
          <Text style={styles.actionText}>Tap to view details</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flex: 1, // Takes full width of the wrapper
  },
  
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 12,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 20, // Space for priority indicator
  },
  
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  
  dateContainer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  
  date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6C757D',
    textAlign: 'center',
  },
  
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginBottom: 12,
  },
  
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#495057',
    marginBottom: 16,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  actionText: {
    fontSize: 11,
    color: '#6C757D',
    fontWeight: '500',
    marginRight: 4,
  },
  
  arrow: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: 'bold',
  },
});

export default DescriptiveCard;