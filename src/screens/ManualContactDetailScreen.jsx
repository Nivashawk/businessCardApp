import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';
import {colors} from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MANUAL_CONTACTS_KEY = '@manual_contacts';

const ManualContactDetailScreen = ({route, navigation}) => {
  const {contactId, onContactUpdated} = route.params;
  const [contact, setContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [businessTitle, setBusinessTitle] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  
  // Image modal state
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState('');

  useEffect(() => {
    loadContact();
  }, [contactId]);

  const loadContact = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(MANUAL_CONTACTS_KEY);
      const contacts = jsonValue != null ? JSON.parse(jsonValue) : [];
      const foundContact = contacts.find(c => c.id === contactId);
      
      if (foundContact) {
        setContact(foundContact);
        // Initialize edit form with current values
        setBusinessTitle(foundContact.businessTitle || '');
        setName(foundContact.name || '');
        setBusinessName(foundContact.businessName || '');
        setPhone(foundContact.phone || '');
        setEmail(foundContact.email || '');
        setWebsite(foundContact.website || '');
        setAddress(foundContact.address || '');
      } else {
        Alert.alert('Error', 'Contact not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading contact:', error);
      Alert.alert('Error', 'Failed to load contact');
    }
  };

  const saveContact = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(MANUAL_CONTACTS_KEY);
      const contacts = jsonValue != null ? JSON.parse(jsonValue) : [];
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      
      if (contactIndex !== -1) {
        const updatedContact = {
          ...contacts[contactIndex],
          businessTitle,
          name,
          businessName,
          phone,
          email,
          website,
          address,
          updatedAt: new Date().toISOString(),
        };
        
        contacts[contactIndex] = updatedContact;
        await AsyncStorage.setItem(MANUAL_CONTACTS_KEY, JSON.stringify(contacts));
        
        setContact(updatedContact);
        setIsEditing(false);
        
        // Notify parent component of update
        if (onContactUpdated) {
          onContactUpdated(updatedContact);
        }
        
        Alert.alert('Success', 'Business card updated successfully!');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const deleteContact = async () => {
    Alert.alert(
      'Delete Business Card',
      `Are you sure you want to delete "${contact?.businessTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const jsonValue = await AsyncStorage.getItem(MANUAL_CONTACTS_KEY);
              const contacts = jsonValue != null ? JSON.parse(jsonValue) : [];
              const updatedContacts = contacts.filter(c => c.id !== contactId);
              await AsyncStorage.setItem(MANUAL_CONTACTS_KEY, JSON.stringify(updatedContacts));
              
              Alert.alert('Deleted', 'Business card deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', 'Failed to delete contact');
            }
          }
        }
      ]
    );
  };

  const openImageModal = (imageUri, title) => {
    setSelectedImage(imageUri);
    setSelectedImageTitle(title);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
    setSelectedImageTitle('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!contact) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          {!isEditing ? (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteContact} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveContact} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Title</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={businessTitle}
              onChangeText={setBusinessTitle}
              placeholder="Enter business title"
              placeholderTextColor={colors.textSecondary}
            />
          ) : (
            <Text style={styles.fieldValue}>{contact.businessTitle || 'Not provided'}</Text>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>👤 Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.fieldValue}>{contact.name || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>🏢 Business Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Enter business name"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.fieldValue}>{contact.businessName || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>📞 Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{contact.phone || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>📧 Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>{contact.email || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>🌐 Website</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={website}
                onChangeText={setWebsite}
                placeholder="Enter website"
                placeholderTextColor={colors.textSecondary}
                keyboardType="url"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>{contact.website || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>📍 Address</Text>
            {isEditing ? (
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
                placeholderTextColor={colors.textSecondary}
                multiline={true}
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.fieldValue}>{contact.address || 'Not provided'}</Text>
            )}
          </View>
        </View>

        {/* Business Card Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Card Images</Text>
          <View style={styles.imageContainer}>
            {/* Support new front/back structure */}
            {contact.frontImage && (
              <TouchableOpacity 
                style={styles.imageCard}
                onPress={() => openImageModal(contact.frontImage, `${contact.businessTitle} - Front`)}>
                <Image source={{uri: contact.frontImage}} style={styles.cardImage} />
                <Text style={styles.imageLabel}>Front Side</Text>
              </TouchableOpacity>
            )}
            
            {contact.backImage && (
              <TouchableOpacity 
                style={styles.imageCard}
                onPress={() => openImageModal(contact.backImage, `${contact.businessTitle} - Back`)}>
                <Image source={{uri: contact.backImage}} style={styles.cardImage} />
                <Text style={styles.imageLabel}>Back Side</Text>
              </TouchableOpacity>
            )}
            
            {/* Support old image1/image2 structure for backward compatibility */}
            {contact.image1 && !contact.frontImage && (
              <TouchableOpacity 
                style={styles.imageCard}
                onPress={() => openImageModal(contact.image1, `${contact.businessTitle} - Card 1`)}>
                <Image source={{uri: contact.image1}} style={styles.cardImage} />
                <Text style={styles.imageLabel}>Card 1</Text>
              </TouchableOpacity>
            )}
            
            {contact.image2 && !contact.backImage && (
              <TouchableOpacity 
                style={styles.imageCard}
                onPress={() => openImageModal(contact.image2, `${contact.businessTitle} - Card 2`)}>
                <Image source={{uri: contact.image2}} style={styles.cardImage} />
                <Text style={styles.imageLabel}>Card 2</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.metadataText}>
            Created: {formatDate(contact.createdAt)}
          </Text>
          {contact.updatedAt && (
            <Text style={styles.metadataText}>
              Updated: {formatDate(contact.updatedAt)}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Full Screen Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeImageModal}
            activeOpacity={0.7}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {selectedImageTitle ? (
            <View style={styles.imageTitleContainer}>
              <Text style={styles.imageTitle}>{selectedImageTitle}</Text>
            </View>
          ) : null}

          <View style={styles.fullScreenImageContainer}>
            {selectedImage && (
              <Image
                source={{uri: selectedImage}}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </View>

          <TouchableOpacity 
            style={styles.tapToCloseArea}
            onPress={closeImageModal}
            activeOpacity={1}>
            <Text style={styles.tapToCloseText}>Tap anywhere to close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text_color_1,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text_color_1,
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text_color_1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  imageCard: {
    flex: 1,
    minWidth: 150,
    maxWidth: '48%',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  metadataText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageTitleContainer: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 80,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  imageTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fullScreenImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  tapToCloseArea: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  tapToCloseText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
});

export default ManualContactDetailScreen;