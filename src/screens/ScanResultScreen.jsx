import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import OCRDataBottomSheet from '../components/OCRDataBottomSheet';
import { extractBusinessCardInfo } from '../utils/ocrUtilsMLKit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MANUAL_CONTACTS_KEY = '@manual_contacts';

const ScanResultScreen = ({ route, navigation }) => {
  const { imageUri, rawText } = route.params;
  const [extractedData, setExtractedData] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    processOCR();
  }, []);

  const processOCR = async () => {
    try {
      setIsProcessing(true);
      
      // Add delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process the OCR text
      const result = extractBusinessCardInfo(rawText);
      setExtractedData(result);
      
      // Auto-show bottom sheet after processing
      setTimeout(() => {
        setShowBottomSheet(true);
      }, 500);
      
    } catch (error) {
      console.error('Error processing OCR:', error);
      Alert.alert('Error', 'Failed to process business card');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async (finalData) => {
    try {
      const contactId = Date.now().toString();
      
      const contact = {
        id: contactId,
        businessTitle: finalData.businessName || finalData.name || 'Unnamed Contact',
        name: finalData.name || '',
        businessName: finalData.businessName || '',
        jobTitle: finalData.jobTitle || '',
        phone: finalData.phone || '',
        telephone: finalData.telephone || '',
        fax: finalData.fax || '',
        email: finalData.email || '',
        website: finalData.website || '',
        address: finalData.address || '',
        rawText: rawText,
        extractedData: finalData,
        frontImage: imageUri,
        createdAt: new Date().toISOString(),
        source: 'ocr_scan'
      };
      
      // Save to AsyncStorage
      const jsonValue = await AsyncStorage.getItem(MANUAL_CONTACTS_KEY);
      const contacts = jsonValue != null ? JSON.parse(jsonValue) : [];
      contacts.unshift(contact);
      await AsyncStorage.setItem(MANUAL_CONTACTS_KEY, JSON.stringify(contacts));
      
      setShowBottomSheet(false);
      
      Alert.alert(
        'Success! 🎉', 
        'Business card saved successfully!',
        [
          {
            text: 'View Contacts',
            onPress: () => navigation.navigate('Contacts')
          },
          {
            text: 'Scan Another',
            onPress: () => navigation.goBack()
          }
        ]
      );
      
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'Failed to save contact');
    }
  };

  const handleClose = () => {
    setShowBottomSheet(false);
  };

  const handleRetry = () => {
    processOCR();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
      
      {/* Status Bar Spacer */}
      <View style={{ height: insets.top, backgroundColor: colors.background }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Scan Result</Text>
        
        <TouchableOpacity 
          onPress={handleRetry}
          style={styles.retryButton}
          disabled={isProcessing}
        >
          <Text style={styles.retryButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Business Card Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.cardImage} />
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={colors.gold} />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          )}
        </View>

        {/* Processing Status or Results Preview */}
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Text style={styles.processingTitle}>🔍 Analyzing Business Card</Text>
            <Text style={styles.processingSubtitle}>
              Extracting contact information using AI...
            </Text>
            
            <View style={styles.processingSteps}>
              <View style={styles.step}>
                <View style={[styles.stepDot, styles.stepCompleted]}>
                  <Text style={styles.stepText}>✓</Text>
                </View>
                <Text style={styles.stepLabel}>Image Captured</Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepDot, styles.stepCompleted]}>
                  <Text style={styles.stepText}>✓</Text>
                </View>
                <Text style={styles.stepLabel}>Text Extracted</Text>
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepDot, styles.stepActive]}>
                  <ActivityIndicator size="small" color="white" />
                </View>
                <Text style={styles.stepLabel}>Processing Data</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>✨ Extraction Complete!</Text>
            <Text style={styles.resultsSubtitle}>
              Found {Object.values(extractedData || {}).filter(v => v && v.length > 0).length} contact fields
            </Text>
            
            {/* Quick Preview */}
            <View style={styles.quickPreview}>
              {extractedData?.name && (
                <View style={styles.previewItem}>
                  <Text style={styles.previewIcon}>👤</Text>
                  <Text style={styles.previewText}>{extractedData.name}</Text>
                </View>
              )}
              {extractedData?.businessName && (
                <View style={styles.previewItem}>
                  <Text style={styles.previewIcon}>🏢</Text>
                  <Text style={styles.previewText}>{extractedData.businessName}</Text>
                </View>
              )}
              {extractedData?.phone && (
                <View style={styles.previewItem}>
                  <Text style={styles.previewIcon}>📱</Text>
                  <Text style={styles.previewText}>{extractedData.phone}</Text>
                </View>
              )}
            </View>

            {/* Action Button */}
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={() => setShowBottomSheet(true)}
            >
              <Text style={styles.reviewButtonText}>📄 Review Full Data</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>

      {/* OCR Data Bottom Sheet */}
      <OCRDataBottomSheet
        visible={showBottomSheet}
        rawText={rawText}
        extractedData={extractedData || {}}
        onSave={handleSave}
        onClose={handleClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.gold,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text_color_1,
  },
  retryButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  retryButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text_color_1,
    marginBottom: 8,
  },
  processingSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  processingSteps: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  stepCompleted: {
    backgroundColor: colors.status_green,
  },
  stepActive: {
    backgroundColor: colors.gold,
  },
  stepText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 16,
    color: colors.text_color_1,
    fontWeight: '500',
  },
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text_color_1,
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  quickPreview: {
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  previewIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  previewText: {
    fontSize: 16,
    color: colors.text_color_1,
    fontWeight: '500',
  },
  reviewButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  reviewButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
  },
});

export default ScanResultScreen;