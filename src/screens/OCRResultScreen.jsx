import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import BusinessCardDisplay from '../components/BusinessCardDisplay';
import { extractBusinessCardInfo } from '../utils/ocrUtilsMLKit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MANUAL_CONTACTS_KEY = '@manual_contacts';

const OCRResultScreen = ({ route, navigation }) => {
  const { rawText, imageUri } = route.params;
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    processOCR();
  }, []);

  const processOCR = async () => {
    try {
      setIsProcessing(true);
      
      // Add a small delay to show the processing state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Process the OCR text
      const result = extractBusinessCardInfo(rawText);
      setExtractedData(result);
      
    } catch (error) {
      console.error('Error processing OCR:', error);
      Alert.alert('Error', 'Failed to process business card text');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = () => {
    // Navigate to edit screen with current data
    navigation.navigate('EditContact', { 
      extractedData, 
      rawText,
      imageUri,
      onSave: (updatedData) => {
        setExtractedData(updatedData);
      }
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Generate unique ID
      const contactId = Date.now().toString();
      
      // Create contact object
      const contact = {
        id: contactId,
        businessTitle: extractedData.businessName || extractedData.name || 'Unnamed Contact',
        name: extractedData.name || '',
        businessName: extractedData.businessName || '',
        jobTitle: extractedData.jobTitle || '',
        phone: extractedData.phone || '',
        telephone: extractedData.telephone || '',
        fax: extractedData.fax || '',
        email: extractedData.email || '',
        website: extractedData.website || '',
        address: extractedData.address || '',
        rawText: rawText,
        extractedData: extractedData,
        frontImage: imageUri,
        createdAt: new Date().toISOString(),
        source: 'ocr_scan'
      };
      
      // Save to AsyncStorage
      const jsonValue = await AsyncStorage.getItem(MANUAL_CONTACTS_KEY);
      const contacts = jsonValue != null ? JSON.parse(jsonValue) : [];
      contacts.unshift(contact); // Add to beginning of array
      await AsyncStorage.setItem(MANUAL_CONTACTS_KEY, JSON.stringify(contacts));
      
      Alert.alert(
        'Success!', 
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
    } finally {
      setIsSaving(false);
    }
  };

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
        <View style={{ height: insets.top, backgroundColor: colors.background }} />
        
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingTitle}>Processing Business Card</Text>
          <Text style={styles.loadingSubtitle}>
            Extracting contact information with AI...
          </Text>
          
          {/* Processing steps indicator */}
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepIndicator, styles.stepCompleted]}>
                <Text style={styles.stepNumber}>✓</Text>
              </View>
              <Text style={styles.stepText}>Text Recognition</Text>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepIndicator, styles.stepActive]}>
                <ActivityIndicator size="small" color="white" />
              </View>
              <Text style={styles.stepText}>Information Extraction</Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepIndicator}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <Text style={styles.stepText}>Smart Enhancement</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

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
        
        <Text style={styles.headerTitle}>Business Card</Text>
        
        <TouchableOpacity 
          onPress={processOCR}
          style={styles.refreshButton}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Business Card Display */}
      {extractedData && (
        <BusinessCardDisplay
          extractedData={extractedData}
          rawText={rawText}
          onEdit={handleEdit}
          onSave={handleSave}
          onShare={() => {
            // Share functionality is handled inside the component
          }}
        />
      )}

      {/* Save Button Overlay (if needed) */}
      {isSaving && (
        <View style={styles.savingOverlay}>
          <View style={styles.savingModal}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={styles.savingText}>Saving Contact...</Text>
          </View>
        </View>
      )}
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
    backgroundColor: colors.background,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text_color_1,
    marginTop: 20,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  stepsContainer: {
    width: '100%',
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  stepCompleted: {
    backgroundColor: colors.status_green,
    borderColor: colors.status_green,
  },
  stepActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  stepText: {
    fontSize: 16,
    color: colors.text_color_1,
    fontWeight: '500',
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
  refreshButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  refreshButtonText: {
    fontSize: 18,
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingModal: {
    backgroundColor: colors.secondary,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  savingText: {
    fontSize: 16,
    color: colors.text_color_1,
    marginTop: 16,
    fontWeight: '500',
  },
});

export default OCRResultScreen;