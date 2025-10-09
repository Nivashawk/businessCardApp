// components/contacts/ManualContactListItem.js
import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {listStyles} from './styles';

// Renamed onPressImage to onOpenFullScreenImage for clarity
const ManualContactListItem = ({item, onPress, onOpenFullScreenImage, onDelete}) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const imagesAvailable = item.frontImage || item.backImage || item.image1 || item.image2; // Support both old and new formats

  return (
    <TouchableOpacity
      style={listStyles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}>
      {/* Avatar (using first letter of business title) */}
      <View style={listStyles.avatar}>
        <Text style={listStyles.avatarText}>
          {item.businessTitle?.charAt(0).toUpperCase() || 'M'}
        </Text>
      </View>

      {/* Main Content */}
      <View style={listStyles.content}>
        <Text style={listStyles.businessName} numberOfLines={1}>
          {item.businessTitle || 'Untitled Manual Contact'}
        </Text>
        <Text style={listStyles.dateText} numberOfLines={1}>
          Added: {formatDate(item.createdAt)}
        </Text>
        
        {/* OCR Extracted Information */}
        {(item.name || item.businessName || item.phone || item.email || item.website || item.address) && (
          <View style={manualListItemStyles.ocrInfo}>
            {item.name && (
              <Text style={manualListItemStyles.ocrText} numberOfLines={1}>
                👤 {item.name}
              </Text>
            )}
            {item.businessName && (
              <Text style={manualListItemStyles.ocrText} numberOfLines={1}>
                🏢 {item.businessName}
              </Text>
            )}
            {item.phone && (
              <Text style={manualListItemStyles.ocrText} numberOfLines={1}>
                📞 {item.phone}
              </Text>
            )}
            {item.email && (
              <Text style={manualListItemStyles.ocrText} numberOfLines={1}>
                📧 {item.email}
              </Text>
            )}
            {item.website && (
              <Text style={manualListItemStyles.ocrText} numberOfLines={1}>
                🌐 {item.website}
              </Text>
            )}
            {item.address && (
              <Text style={manualListItemStyles.ocrText} numberOfLines={1}>
                📍 {item.address}
              </Text>
            )}
          </View>
        )}
        {imagesAvailable ? (
          <View style={manualListItemStyles.imageThumbnailContainer}>
            {/* Support new front/back structure */}
            {item.frontImage && (
              <TouchableOpacity onPress={() => onOpenFullScreenImage(item.frontImage, `${item.businessTitle} - Front`)}>
                <Image source={{uri: item.frontImage}} style={manualListItemStyles.imageThumbnail} />
              </TouchableOpacity>
            )}
            {item.backImage && (
              <TouchableOpacity onPress={() => onOpenFullScreenImage(item.backImage, `${item.businessTitle} - Back`)}>
                <Image source={{uri: item.backImage}} style={manualListItemStyles.imageThumbnail} />
              </TouchableOpacity>
            )}
            
            {/* Support old image1/image2 structure for backward compatibility */}
            {item.image1 && !item.frontImage && (
              <TouchableOpacity onPress={() => onOpenFullScreenImage(item.image1, `${item.businessTitle} - Card 1`)}>
                <Image source={{uri: item.image1}} style={manualListItemStyles.imageThumbnail} />
              </TouchableOpacity>
            )}
            {item.image2 && !item.backImage && (
              <TouchableOpacity onPress={() => onOpenFullScreenImage(item.image2, `${item.businessTitle} - Card 2`)}>
                <Image source={{uri: item.image2}} style={manualListItemStyles.imageThumbnail} />
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>

      {/* Action Buttons */}
      <View style={manualListItemStyles.actionButtons}>
        {onDelete && (
          <TouchableOpacity 
            style={manualListItemStyles.deleteButton}
            onPress={() => onDelete(item)}>
            <Text style={manualListItemStyles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
        <View style={listStyles.chevron}>
          <Text style={listStyles.chevronText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const manualListItemStyles = StyleSheet.create({
  imageThumbnailContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  imageThumbnail: {
    width: 50,
    height: 30,
    borderRadius: 4,
    resizeMode: 'cover',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  ocrInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
  },
  ocrText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default ManualContactListItem;