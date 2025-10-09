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
import DocumentScannerComponent from '../../components/DocumentScanner';
import {useDocumentScanner} from '../../hooks/useDocumentScanner';

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
  
  // Document Scanner state
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [currentScanType, setCurrentScanType] = useState(null);
  const {processScanResult, extractBusinessCardData, showScanResultSummary} = useDocumentScanner();

  // Function to clear all form data
  const clearFormData = () => {
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
    setIsProcessingOCR(false);
    setShowManualOCRModal(false);
    setCurrentImageForOCR(null);
    setShowDocumentScanner(false);
    setCurrentScanType(null);
  };

  // Handle modal close with form clearing
  const handleClose = () => {
    clearFormData();
    onClose();
  };

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
          text: "📷 Document Scanner",
          onPress: () => {
            setCurrentScanType(cardType.toLowerCase());
            setShowDocumentScanner(true);
          }
        },
        {
          text: "📱 Take Photo",
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

  // Document Scanner Functions
  const handleDocumentScanComplete = async (scanResult) => {
    try {
      console.log('Manual contact document scan completed:', scanResult);
      
      // Process the scan result
      const processedResult = await processScanResult(scanResult);
      
      // Update the appropriate image based on scan type
      const imageUri = processedResult.imageUri;
      
      if (currentScanType === 'front side') {
        setFrontImageUri(imageUri);
      } else if (currentScanType === 'back side') {
        setBackImageUri(imageUri);
      }

      // Process OCR data if available
      if (processedResult.ocrData && processedResult.hasOCRData) {
        const extractedData = extractBusinessCardData(processedResult.ocrData);
        
        // Merge with existing data (don't overwrite if user already filled)
        if (!name && extractedData.name) setName(extractedData.name);
        if (!businessName && extractedData.businessName) setBusinessName(extractedData.businessName);
        if (!phone && extractedData.phone) setPhone(extractedData.phone);
        if (!email && extractedData.email) setEmail(extractedData.email);
        if (!website && extractedData.website) setWebsite(extractedData.website);
        if (!address && extractedData.address) setAddress(extractedData.address);
        
        // Set business title if not already set
        if (!businessTitle && (extractedData.name || extractedData.businessName)) {
          setBusinessTitle(`${extractedData.name || ''} - ${extractedData.businessName || ''}`.replace(' - ', extractedData.businessName ? ' - ' : ''));
        }
        
        showScanResultSummary(processedResult);
      }

      // Mark as processed to avoid reprocessing
      setOcrProcessedImages(prev => new Set([...prev, imageUri]));
      
    } catch (error) {
      console.error('Error handling manual contact document scan:', error);
      Alert.alert('Scan Error', 'Failed to process the scanned document');
    } finally {
      setShowDocumentScanner(false);
      setCurrentScanType(null);
    }
  };

  const handleDocumentScanError = (error) => {
    console.error('Manual contact document scanner error:', error);
    Alert.alert('Scanner Error', 'Document scanner encountered an error. Please try again.');
    setShowDocumentScanner(false);
    setCurrentScanType(null);
  };

  const closeDocumentScanner = () => {
    setShowDocumentScanner(false);
    setCurrentScanType(null);
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
    
    // Reset fields and close
    clearFormData();
    onClose();
  };

  return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Manual Contact</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={true}
            indicatorStyle="default">
            
            {/* AI-Powered Document Scanner Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroHeader}>
                {/* <Text style={styles.heroIcon}>🤖</Text> */}
                <View style={styles.heroTitleContainer}>
                  <Text style={styles.heroTitle}>AI-Powered Business Card Scanner</Text>
                  <Text style={styles.heroSubtitle}>Scan & extract information instantly</Text>
                </View>
              </View>
              
              <View style={styles.featureHighlights}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>⚡</Text>
                  <Text style={styles.featureText}>Instant text extraction</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🎯</Text>
                  <Text style={styles.featureText}>Smart field detection</Text>
                </View>
                {/* <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🌍</Text>
                  <Text style={styles.featureText}>Multi-language support</Text>
                </View> */}
              </View>

              {isProcessingOCR && (
                <View style={styles.ocrProcessing}>
                  <Text style={styles.ocrProcessingText}>🔍 AI is processing and extracting information...</Text>
                </View>
              )}
              
              <View style={styles.scannerContainer}>
                <Text style={styles.scannerTitle}>📸 Scan Business Card</Text>
                <Text style={styles.scannerSubtitle}>Recommended: Let AI do the work for you!</Text>
                
                <View style={styles.imagePickerContainer}>
                  <TouchableOpacity
                    style={styles.primaryImagePlaceholder}
                    onPress={() => selectImage(setFrontImageUri, "Front Side")}>
                    {frontImageUri ? (
                      <>
                        <Image source={{uri: frontImageUri}} style={styles.imagePreview} />
                        <TouchableOpacity
                          style={styles.clearImageButton}
                          onPress={() => setFrontImageUri(null)}>
                          <Text style={styles.clearImageText}>✕</Text>
                        </TouchableOpacity>
                        <View style={styles.imageLabel}>
                          <Text style={styles.imageLabelText}>Front Side</Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.primaryPlaceholderContent}>
                        <Text style={styles.primaryImageIcon}>📱</Text>
                        <Text style={styles.primaryImageText}>Scan Front Side</Text>
                        <Text style={styles.primaryImageSubtext}>AI will extract all details</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryImagePlaceholder}
                    onPress={() => selectImage(setBackImageUri, "Back Side")}>
                    {backImageUri ? (
                      <>
                        <Image source={{uri: backImageUri}} style={styles.imagePreview} />
                        <TouchableOpacity
                          style={styles.clearImageButton}
                          onPress={() => setBackImageUri(null)}>
                          <Text style={styles.clearImageText}>✕</Text>
                        </TouchableOpacity>
                        <View style={styles.imageLabel}>
                          <Text style={styles.imageLabelText}>Back Side</Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.secondaryPlaceholderContent}>
                        <Text style={styles.secondaryImageIcon}>📷</Text>
                        <Text style={styles.secondaryImageText}>Scan Back Side</Text>
                        <Text style={styles.secondaryImageSubtext}>Optional</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Scroll Indicator */}
              <View style={styles.scrollIndicator}>
                <Text style={styles.scrollText}>📝 Scroll down to edit details or add manually</Text>
                <Text style={styles.scrollArrow}>⬇️</Text>
              </View>
            </View>

            {/* Form Preview Indicator */}
            {/* <View style={styles.formPreview}>
              <View style={styles.formPreviewHeader}>
                <Text style={styles.formPreviewIcon}>📋</Text>
                <Text style={styles.formPreviewTitle}>Contact Form Below</Text>
              </View>
              <Text style={styles.formPreviewText}>
                Business Title • Name • Phone • Email • Address & More
              </Text>
            </View> */}

            {/* Business Title */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Card Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="E.g., John Doe - ABC Corp"
                placeholderTextColor={colors.textSecondary}
                value={businessTitle}
                onChangeText={setBusinessTitle}
              />
            </View>

            {/* Manual Entry Section */}
            <View style={styles.section}>
              <View style={styles.manualEntryHeader}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.manualEntryBadge}>
                  <Text style={styles.manualEntryBadgeText}>✏️ Manual Entry</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>Edit or manually enter details (AI extracted fields appear here automatically)</Text>
              
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
      
      {/* Document Scanner Modal */}
      <DocumentScannerComponent
        visible={showDocumentScanner}
        onClose={closeDocumentScanner}
        onScanComplete={handleDocumentScanComplete}
        onError={handleDocumentScanError}
        mode="businessCard"
        title={`Scan ${currentScanType === 'front side' ? 'Front' : 'Back'} Business Card`}
        enableOCR={true}
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
  // New hero section styles
  heroSection: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  heroTitleContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  featureHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  scannerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  scannerSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.95,
  },
  primaryImagePlaceholder: {
    flex: 1,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.gold,
    borderStyle: 'dashed',
  },
  secondaryImagePlaceholder: {
    flex: 1,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginLeft: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
  },
  primaryPlaceholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  secondaryPlaceholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  primaryImageIcon: {
    fontSize: 40,
    marginBottom: 8,
    color: colors.primary,
  },
  secondaryImageIcon: {
    fontSize: 32,
    marginBottom: 8,
    color: colors.textSecondary,
  },
  primaryImageText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  secondaryImageText: {
    color: colors.text_color_1,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 2,
  },
  primaryImageSubtext: {
    color: colors.gold,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  secondaryImageSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  imageLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
  },
  imageLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  manualEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  manualEntryBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  manualEntryBadgeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // Scroll indicator styles
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollText: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.9,
  },
  scrollArrow: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  // Form preview styles
  formPreview: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  formPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formPreviewIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  formPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
  },
  formPreviewText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default ManualContactModal;