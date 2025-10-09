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
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {colors} from '../../theme/colors';
// import {processImageOCR} from '../../utils/ocrUtils'; // Original with vision-camera
// import {processImageOCR} from '../../utils/ocrUtilsMLKit'; // ML Kit alternative
import {processImageOCR} from '../../utils/ocrUtilsMLKit'; // ML Kit OCR implementation
import {useNavigation} from '@react-navigation/native';
import ManualOCRModal from '../../components/ManualOCRModal';

const ManualContactModal = ({visible, onClose, onSave}) => {
  const navigation = useNavigation();
  const [businessTitle, setBusinessTitle] = useState('');
  const [frontImageUri, setFrontImageUri] = useState(null);
  const [backImageUri, setBackImageUri] = useState(null);
  
  // OCR extracted fields
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [showManualOCRModal, setShowManualOCRModal] = useState(false);
  const [currentImageForOCR, setCurrentImageForOCR] = useState(null);
  const [ocrProcessedImages, setOcrProcessedImages] = useState(new Set());

  const selectImage = async (setImage, cardType) => {
    Alert.alert(
      `Add ${cardType} of Business Card`,
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
              // Auto-process OCR after image selection
              processOCRFromImage(image.path);
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
              // Auto-process OCR after image selection
              processOCRFromImage(image.path);
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

  const processOCRFromImage = async (imagePath) => {
    if (ocrProcessedImages.has(imagePath)) {
      return; // Already processed this image
    }

    try {
      setIsProcessingOCR(true);
      const extracted = await processImageOCR(imagePath);
      
      // Check if OCR extracted meaningful data
      const hasExtractedData = extracted.name || extracted.businessName || 
                              extracted.phone || extracted.email || 
                              extracted.website || extracted.address;
      
      if (hasExtractedData) {
        // Merge with existing data (don't overwrite if user already filled)
        if (!name && extracted.name) setName(extracted.name);
        if (!businessName && extracted.businessName) setBusinessName(extracted.businessName);
        if (!phone && extracted.phone) setPhone(extracted.phone);
        if (!email && extracted.email) setEmail(extracted.email);
        if (!website && extracted.website) setWebsite(extracted.website);
        if (!address && extracted.address) setAddress(extracted.address);
        
        // Set business title if not already set
        if (!businessTitle && (extracted.name || extracted.businessName)) {
          setBusinessTitle(`${extracted.name} - ${extracted.businessName}`.replace(' - ', extracted.businessName ? ' - ' : ''));
        }
        
        setOcrProcessedImages(prev => new Set([...prev, imagePath]));
        Alert.alert('OCR Success', 'Business card information extracted successfully! You can edit the details below.');
      } else {
        // OCR didn't extract meaningful data, offer manual entry
        Alert.alert(
          'OCR Incomplete', 
          'Could not extract complete information from the image. Would you like to manually enter the text from this business card?',
          [
            { text: 'Skip', style: 'cancel' },
            { 
              text: 'Manual Entry', 
              onPress: () => {
                setCurrentImageForOCR(imagePath);
                setShowManualOCRModal(true);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('OCR Error:', error);
      // Fallback to manual entry on OCR failure
      Alert.alert(
        'OCR Failed',
        'Could not process the image automatically. Would you like to manually enter the text from this business card?',
        [
          { text: 'Skip', style: 'cancel' },
          { 
            text: 'Manual Entry', 
            onPress: () => {
              setCurrentImageForOCR(imagePath);
              setShowManualOCRModal(true);
            }
          }
        ]
      );
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const handleSave = () => {
    if (!businessTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter a business title.');
      return;
    }
    if (!frontImageUri && !backImageUri) {
      Alert.alert('Missing Images', 'Please add at least one business card image (front or back).');
      return;
    }

    onSave({
      id: Date.now().toString(),
      businessTitle,
      frontImage: frontImageUri,
      backImage: backImageUri,
      // OCR extracted fields
      name,
      businessName,
      phone,
      email,
      website,
      address,
      createdAt: new Date().toISOString(),
    });
    
    // Reset fields
    setBusinessTitle('');
    setFrontImageUri(null);
    setBackImageUri(null);
    setName('');
    setBusinessName('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setAddress('');
    setOcrProcessedImages(new Set());
    onClose();
  };

  return (
    <>
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

            {/* OCR Extracted Fields */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <Text style={styles.sectionSubtitle}>Automatically extracted from business card images</Text>
              
              <TextInput
                style={styles.textInput}
                placeholder="Name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
              
              <TextInput
                style={styles.textInput}
                placeholder="Business Name"
                placeholderTextColor={colors.textSecondary}
                value={businessName}
                onChangeText={setBusinessName}
              />
              
              <TextInput
                style={styles.textInput}
                placeholder="Phone Number"
                placeholderTextColor={colors.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.textInput}
                placeholder="Website"
                placeholderTextColor={colors.textSecondary}
                value={website}
                onChangeText={setWebsite}
                keyboardType="url"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.textInput}
                placeholder="Address"
                placeholderTextColor={colors.textSecondary}
                value={address}
                onChangeText={setAddress}
                multiline={true}
                numberOfLines={2}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Card Images</Text>
              <Text style={styles.sectionSubtitle}>Add front and/or back of business card (OCR will auto-extract information)</Text>
              
              {isProcessingOCR && (
                <View style={styles.ocrProcessing}>
                  <Text style={styles.ocrProcessingText}>🔍 Processing image and extracting information...</Text>
                </View>
              )}
              
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={() => selectImage(setFrontImageUri, "Front Side")}>
                  {frontImageUri ? (
                    <>
                      <Image source={{uri: frontImageUri}} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.clearImageButton}
                        onPress={() => setFrontImageUri(null)}>
                        <Text style={styles.clearImageText}>✕</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.placeholderContent}>
                      <Text style={styles.addImageIcon}>📷</Text>
                      <Text style={styles.imagePlaceholderText}>
                        {backImageUri ? 'Front Side (Optional)' : 'Add Front Side'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={() => selectImage(setBackImageUri, "Back Side")}>
                  {backImageUri ? (
                    <>
                      <Image source={{uri: backImageUri}} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.clearImageButton}
                        onPress={() => setBackImageUri(null)}>
                        <Text style={styles.clearImageText}>✕</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.placeholderContent}>
                      <Text style={styles.addImageIcon}>📷</Text>
                      <Text style={styles.imagePlaceholderText}>
                        Add Back Side (Optional)
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
      
      {/* Manual OCR Modal */}
      <ManualOCRModal
        visible={showManualOCRModal}
        onClose={() => {
          setShowManualOCRModal(false);
          setCurrentImageForOCR(null);
        }}
        onExtract={(extractedData) => {
          // Merge with existing data (don't overwrite if user already filled)
          if (!name && extractedData.name) setName(extractedData.name);
          if (!businessName && extractedData.businessName) setBusinessName(extractedData.businessName);
          if (!phone && extractedData.phone) setPhone(extractedData.phone);
          if (!email && extractedData.email) setEmail(extractedData.email);
          if (!website && extractedData.website) setWebsite(extractedData.website);
          if (!address && extractedData.address) setAddress(extractedData.address);
          
          // Set business title if not already set
          if (!businessTitle && (extractedData.name || extractedData.businessName)) {
            setBusinessTitle(`${extractedData.name} - ${extractedData.businessName}`.replace(' - ', extractedData.businessName ? ' - ' : ''));
          }
          
          Alert.alert('Success', 'Business card information extracted successfully!');
        }}
        imagePath={currentImageForOCR}
      />
    </Modal>
    </>
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
  ocrProcessing: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  ocrProcessingText: {
    color: colors.text_color_1,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ManualContactModal;