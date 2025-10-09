import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DocumentScanner from 'react-native-document-scanner-plugin';
import ImageResizer from 'react-native-image-resizer';
import {colors} from '../theme/colors';
import {processImageOCR} from '../utils/ocrUtilsMLKit';

const {width: screenWidth} = Dimensions.get('window');

const DocumentScannerComponent = ({
  visible,
  onClose,
  onScanComplete,
  mode = 'businessCard', // 'businessCard' | 'document' | 'logo'
  title = 'Scan Document',
  enableOCR = true,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      progressAnim.setValue(0);
    }
  }, [isProcessing]);

  // Auto-start document scanner when component becomes visible
  useEffect(() => {
    if (visible && !isProcessing) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        startDocumentScan();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const startDocumentScan = async () => {
    try {
      setIsProcessing(true);
      setProcessingStep('Opening scanner...');

      // Configure scanner options based on mode
      const scannerOptions = {
        responseType: 'imageFilePath',
        quality: 1.0, // High quality for business cards
        maxNumDocuments: 1,
        letUserAdjustCrop: true,
        croppedImageQuality: 90,
      };

      // Add specific options for business cards
      if (mode === 'businessCard') {
        scannerOptions.maxNumDocuments = 1;
        scannerOptions.documentDetectionConfidence = 0.8;
      }

      // Add specific options for logo scanning
      if (mode === 'logo') {
        scannerOptions.maxNumDocuments = 1;
        scannerOptions.documentDetectionConfidence = 0.7; // More flexible for logos
        scannerOptions.croppedImageQuality = 95; // Higher quality for logos
        scannerOptions.quality = 1.0;
      }

      const result = await DocumentScanner.scanDocument(scannerOptions);

      if (result.status === 'success' && result.scannedImages?.length > 0) {
        const scannedImagePath = result.scannedImages[0];
        await processScannedImage(scannedImagePath);
      } else {
        throw new Error('Document scan cancelled or failed');
      }
    } catch (error) {
      console.error('Document scanner error:', error);
      setIsProcessing(false);
      
      if (error.message.includes('cancelled')) {
        onClose();
        return;
      }

      Alert.alert(
        'Scanner Error',
        'Failed to scan document. Would you like to try again or use regular camera?',
        [
          { text: 'Try Again', onPress: startDocumentScan },
          { text: 'Regular Camera', onPress: openFallbackCamera },
          { text: 'Cancel', onPress: onClose, style: 'cancel' }
        ]
      );
      
      if (onError) {
        onError(error);
      }
    }
  };

  const processScannedImage = async (imagePath) => {
    try {
      setProcessingStep('Optimizing image...');
      
      // Resize and optimize the image for better processing
      let width, height, quality;
      
      if (mode === 'logo') {
        width = 800;   // Square-ish for logos
        height = 800;
        quality = 95;  // High quality for logos
      } else if (mode === 'businessCard') {
        width = 1200;
        height = 800;
        quality = 85;
      } else {
        width = 1600;
        height = 1200;
        quality = 85;
      }

      const optimizedImage = await ImageResizer.createResizedImage(
        imagePath,
        width,
        height,
        'JPEG',
        quality,
        0,
        undefined,
        false,
        {
          mode: 'contain',
          onlyScaleDown: true,
        }
      );

      let extractedData = null;

      // Process OCR if enabled (skip for logos)
      if (enableOCR && mode !== 'logo') {
        setProcessingStep('Extracting text...');
        try {
          extractedData = await processImageOCR(optimizedImage.uri);
        } catch (ocrError) {
          console.warn('OCR processing failed:', ocrError);
          // Continue without OCR data
        }
      }

      setProcessingStep('Finalizing...');
      
      // Return results
      const result = {
        image: optimizedImage.uri,
        originalImage: imagePath,
        extractedData: extractedData || null,
        scanType: mode,
        timestamp: new Date().toISOString(),
      };

      setIsProcessing(false);
      onScanComplete(result);
      onClose();

    } catch (error) {
      console.error('Image processing error:', error);
      setIsProcessing(false);
      Alert.alert('Processing Error', 'Failed to process the scanned image.');
      if (onError) {
        onError(error);
      }
    }
  };

  const openFallbackCamera = () => {
    // Use regular camera as fallback
    const ImagePicker = require('react-native-image-crop-picker').default;
    
    ImagePicker.openCamera({
      cropping: true,
      cropperCircleOverlay: false,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      includeBase64: false,
      compressImageQuality: 0.8,
    })
    .then(image => {
      processScannedImage(image.path);
    })
    .catch(error => {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Fallback camera error:', error);
        Alert.alert('Camera Error', 'Failed to capture image.');
      }
      onClose();
    });
  };

  const getInstructionText = () => {
    switch (mode) {
      case 'businessCard':
        return 'Position the business card within the frame. The scanner will automatically detect edges and capture when ready.';
      case 'logo':
        return 'Position your logo or image within the frame. You can adjust the crop area after scanning for perfect results.';
      case 'document':
        return 'Position the document within the frame. Make sure all edges are visible and the document is well-lit.';
      default:
        return 'Position the document within the frame for scanning.';
    }
  };

  const renderProcessingView = () => (
    <View style={styles.processingContainer}>
      <View style={styles.processingCard}>
        <ActivityIndicator size="large" color={colors.gold} style={styles.processingSpinner} />
        
        <Text style={styles.processingTitle}>Processing Document</Text>
        <Text style={styles.processingStep}>{processingStep}</Text>
        
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                transform: [
                  {
                    translateX: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 100],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        
        <Text style={styles.processingHint}>
          Please wait while we process your document...
        </Text>
      </View>
    </View>
  );

  const renderScannerInterface = () => (
    <View style={styles.container}>
      <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          {getInstructionText()}
        </Text>
      </View>

      {/* Main Action Area */}
      <View style={styles.actionArea}>
        {/* Scanner Frame Indicator */}
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.frameHint}>
            {mode === 'businessCard' ? '📄 Business Card' : 
             mode === 'logo' ? '🏢 Logo' : 
             '📄 Document'}
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.autoScanIndicator}>
          <Text style={styles.autoScanText}>🔍 Auto-scanning will start...</Text>
          <Text style={styles.autoScanHint}>Position your document and wait</Text>
        </View>

        <TouchableOpacity 
          style={styles.fallbackButton}
          onPress={openFallbackCamera}
          activeOpacity={0.7}
        >
          <Text style={styles.fallbackButtonText}>📱 Use Regular Camera Instead</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {isProcessing ? renderProcessingView() : renderScannerInterface()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  instructionsText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  actionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  frameContainer: {
    alignItems: 'center',
  },
  frame: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.5, // Business card aspect ratio
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.gold,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  frameHint: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  autoScanIndicator: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  autoScanText: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  autoScanHint: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  fallbackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  fallbackButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  // Processing View Styles
  processingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  processingCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  processingSpinner: {
    marginBottom: 20,
  },
  processingTitle: {
    color: colors.text_color_1,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  processingStep: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    width: 100,
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  processingHint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DocumentScannerComponent;