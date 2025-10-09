// components/ManualOCRModal.jsx - Manual text input for OCR alternative
import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {colors} from '../theme/colors';
import {extractBusinessCardInfo} from '../utils/ocrUtilsMLKit';

const ManualOCRModal = ({visible, onClose, onExtract, imagePath}) => {
  const [manualText, setManualText] = useState('');

  const handleExtract = () => {
    if (!manualText.trim()) {
      Alert.alert('Missing Text', 'Please enter the text from the business card.');
      return;
    }

    try {
      const extractedData = extractBusinessCardInfo(manualText);
      onExtract(extractedData);
      setManualText('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to extract information from text.');
    }
  };

  const handleSkip = () => {
    setManualText('');
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
            <Text style={styles.title}>Extract Text from Business Card</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Manual Text Entry</Text>
              <Text style={styles.sectionSubtitle}>
                Type the text you see on the business card. Include all visible text - names, phone numbers, emails, websites, etc.
              </Text>
              
              <TextInput
                style={styles.textArea}
                placeholder="Enter all text from the business card here..."
                placeholderTextColor={colors.textSecondary}
                value={manualText}
                onChangeText={setManualText}
                multiline={true}
                numberOfLines={8}
                textAlignVertical="top"
              />
              
              <Text style={styles.helpText}>
                💡 Tip: Include each piece of information on a new line for better extraction accuracy
              </Text>
            </View>

            <View style={styles.exampleSection}>
              <Text style={styles.exampleTitle}>Example Format:</Text>
              <Text style={styles.exampleText}>
                John Smith{'\n'}
                Tech Solutions Inc.{'\n'}
                Senior Developer{'\n'}
                +1 (555) 123-4567{'\n'}
                john.smith@techsolutions.com{'\n'}
                www.techsolutions.com
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip Extraction</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.extractButton}
              onPress={handleExtract}>
              <Text style={styles.extractButtonText}>Extract Info</Text>
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text_color_1,
    flex: 1,
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
    lineHeight: 20,
  },
  textArea: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text_color_1,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    maxHeight: 200,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  exampleSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  extractButton: {
    flex: 1,
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
  extractButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManualOCRModal;