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
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {colors} from '../../theme/colors';

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
                cropping: true,
                cropperCircleOverlay: false,
                freeStyleCropEnabled: true,
                mediaType: 'photo',
                includeBase64: false,
              });
              setImage(image.path);
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
                cropping: true,
                cropperCircleOverlay: false,
                freeStyleCropEnabled: true,
                mediaType: 'photo',
                includeBase64: false,
              });
              setImage(image.path);
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
      id: Date.now().toString(),
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
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Manual Contact</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="E.g., John Doe - ABC Corp"
                placeholderTextColor={colors.textSecondary}
                value={businessTitle}
                onChangeText={setBusinessTitle}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Card Images</Text>
              <Text style={styles.sectionSubtitle}>Add at least one image</Text>
              
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={() => selectImage(setImage1Uri)}>
                  {image1Uri ? (
                    <>
                      <Image source={{uri: image1Uri}} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.clearImageButton}
                        onPress={() => setImage1Uri(null)}>
                        <Text style={styles.clearImageText}>✕</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.placeholderContent}>
                      <Text style={styles.addImageIcon}>📷</Text>
                      <Text style={styles.imagePlaceholderText}>
                        {image2Uri ? 'Image 1 (Optional)' : 'Add Image 1'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={() => selectImage(setImage2Uri)}>
                  {image2Uri ? (
                    <>
                      <Image source={{uri: image2Uri}} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.clearImageButton}
                        onPress={() => setImage2Uri(null)}>
                        <Text style={styles.clearImageText}>✕</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.placeholderContent}>
                      <Text style={styles.addImageIcon}>📷</Text>
                      <Text style={styles.imagePlaceholderText}>
                        Add Image 2 (Optional)
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: '85%',
    width: '100%',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text_color_1,
  },
  closeButtonContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text_color_1,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  imagePlaceholder: {
    flex: 1,
    height: 140,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  addImageIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  clearImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearImageText: {
    color: colors.text_color_1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManualContactModal;