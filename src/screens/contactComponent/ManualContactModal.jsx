// components/contacts/ManualContactModal.js
import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Platform, // Import Platform to handle OS-specific permissions/messages
} from 'react-native';
// Import react-native-image-crop-picker
import ImagePicker from 'react-native-image-crop-picker';
import {colors} from '../../theme/colors';
import {filterStyles} from './styles'; // Reusing some filter styles for modal structure

const ManualContactModal = ({visible, onClose, onSave}) => {
  const [businessTitle, setBusinessTitle] = useState('');
  const [image1Uri, setImage1Uri] = useState(null);
  const [image2Uri, setImage2Uri] = useState(null);

  const selectImage = async (setImage) => {
    Alert.alert(
      "Add Business Card Image",
      "Choose how you'd like to add the image.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Take Photo",
          onPress: async () => {
            try {
              const image = await ImagePicker.openCamera({
                // width: 700, // Optimize for business card dimensions
                // height: 400, // Adjust aspect ratio as needed
                cropping: true, // Enable cropping
                cropperCircleOverlay: false, // Don't use circular crop
                 freeStyleCropEnabled: true,
                mediaType: 'photo',
                includeBase64: false, // Set to true if you need base64 for upload/OCR
                // cropperToolbarTitle: 'Crop Business Card', // Custom title for cropper
              });
              setImage(image.path); // Use image.path for the URI
            } catch (error) {
              if (error.code === 'E_PICKER_CANCELLED') {
                console.log('User cancelled image selection');
              } else if (error.code === 'E_NO_CAMERA_PERMISSION') {
                 Alert.alert('Permission Denied', 'Please grant camera permission in your device settings to take photos.');
              } else {
                console.error('ImagePicker Error: ', error);
                Alert.alert('Error', 'Failed to pick image. Please try again.');
              }
            }
          }
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            try {
              const image = await ImagePicker.openPicker({
                // width: 700, // Optimize for business card dimensions
                // height: 400, // Adjust aspect ratio as needed
                cropping: true, // Enable cropping
                cropperCircleOverlay: false,
                freeStyleCropEnabled: true,
                mediaType: 'photo',
                includeBase64: false, // Set to true if you need base64 for upload/OCR
              });
              setImage(image.path); // Use image.path for the URI
            } catch (error) {
              if (error.code === 'E_PICKER_CANCELLED') {
                console.log('User cancelled image selection');
              } else if (error.code === 'E_NO_LIBRARY_PERMISSION' || error.code === 'E_NO_PHOTO_LIBRARY_PERMISSION') {
                 Alert.alert('Permission Denied', 'Please grant photo library permission in your device settings to select images.');
              } else {
                console.error('ImagePicker Error: ', error);
                Alert.alert('Error', 'Failed to pick image. Please try again.');
              }
            }
          }
        }
      ]
    );
  };

  const handleSave = () => {
    if (!businessTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter a business title.');
      return;
    }
    if (!image1Uri && !image2Uri) {
      Alert.alert('Missing Images', 'Please add at least one business card image.');
      return;
    }

    onSave({
      id: Date.now().toString(), // Unique ID for the contact
      businessTitle,
      image1: image1Uri,
      image2: image2Uri,
      createdAt: new Date().toISOString(),
    });
    // Reset fields
    setBusinessTitle('');
    setImage1Uri(null);
    setImage2Uri(null);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={filterStyles.overlay}>
        <View style={manualModalStyles.modalContainer}>
          <View style={filterStyles.header}>
            <Text style={filterStyles.title}>Add Manual Contact</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={filterStyles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={manualModalStyles.scrollViewContent}>
            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>Business Title</Text>
              <TextInput
                style={filterStyles.textInput}
                placeholder="E.g., John Doe - ABC Corp"
                value={businessTitle}
                onChangeText={setBusinessTitle}
              />
            </View>

            <View style={filterStyles.section}>
              <Text style={filterStyles.sectionTitle}>Business Card Images</Text>
              <View style={manualModalStyles.imagePickerContainer}>
                <TouchableOpacity
                  style={manualModalStyles.imagePlaceholder}
                  onPress={() => selectImage(setImage1Uri)}>
                  {image1Uri ? (
                    <Image source={{uri: image1Uri}} style={manualModalStyles.imagePreview} />
                  ) : (
                    <Text style={manualModalStyles.imagePlaceholderText}>
                      {image2Uri ? 'Image 1 (Optional)' : 'Add Image 1'}
                    </Text>
                  )}
                  {image1Uri && (
                    <TouchableOpacity
                      style={manualModalStyles.clearImageButton}
                      onPress={() => setImage1Uri(null)}>
                      <Text style={manualModalStyles.clearImageText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={manualModalStyles.imagePlaceholder}
                  onPress={() => selectImage(setImage2Uri)}>
                  {image2Uri ? (
                    <Image source={{uri: image2Uri}} style={manualModalStyles.imagePreview} />
                  ) : (
                    <Text style={manualModalStyles.imagePlaceholderText}>
                      Add Image 2 (Optional)
                    </Text>
                  )}
                  {image2Uri && (
                    <TouchableOpacity
                      style={manualModalStyles.clearImageButton}
                      onPress={() => setImage2Uri(null)}>
                      <Text style={manualModalStyles.clearImageText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={filterStyles.buttonContainer}>
            <TouchableOpacity
              style={[filterStyles.button, filterStyles.applyButton]}
              onPress={handleSave}>
              <Text style={filterStyles.applyButtonText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const manualModalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
  },
  imagePlaceholder: {
    width: '48%', // Roughly half width
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden', // Ensures image doesn't bleed out
  },
  imagePlaceholderText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  clearImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ManualContactModal;