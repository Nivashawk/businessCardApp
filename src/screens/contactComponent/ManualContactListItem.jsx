// components/contacts/ManualContactListItem.js
import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {listStyles} from './styles';

// Renamed onPressImage to onOpenFullScreenImage for clarity
const ManualContactListItem = ({item, onPress, onOpenFullScreenImage}) => {
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

  const imagesAvailable = item.image1 || item.image2;

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
        {imagesAvailable ? (
          <View style={manualListItemStyles.imageThumbnailContainer}>
            {item.image1 && (
              // When image1 is pressed, pass its URI and a title
              <TouchableOpacity onPress={() => onOpenFullScreenImage(item.image1, `${item.businessTitle} - Card 1`)}>
                <Image source={{uri: item.image1}} style={manualListItemStyles.imageThumbnail} />
              </TouchableOpacity>
            )}
            {item.image2 && (
              // When image2 is pressed, pass its URI and a title
              <TouchableOpacity onPress={() => onOpenFullScreenImage(item.image2, `${item.businessTitle} - Card 2`)}>
                <Image source={{uri: item.image2}} style={manualListItemStyles.imageThumbnail} />
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>

      {/* Chevron */}
      <View style={listStyles.chevron}>
        <Text style={listStyles.chevronText}>›</Text>
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
});

export default ManualContactListItem;