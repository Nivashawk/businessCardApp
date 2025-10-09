import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {processImageOCR} from '../utils/ocrUtilsMLKit';

export const useDocumentScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const processScanResult = useCallback(async (scanData) => {
    try {
      const {image, extractedData, scanType} = scanData;
      
      // Store the result
      const result = {
        imageUri: image,
        ocrData: extractedData,
        scanType,
        timestamp: scanData.timestamp,
        hasOCRData: !!extractedData && (
          extractedData.name || 
          extractedData.businessName || 
          extractedData.phone || 
          extractedData.email || 
          extractedData.website || 
          extractedData.address
        ),
      };

      setScanResult(result);
      return result;
    } catch (error) {
      console.error('Error processing scan result:', error);
      throw error;
    }
  }, []);

  const clearScanResult = useCallback(() => {
    setScanResult(null);
  }, []);

  const extractBusinessCardData = useCallback((ocrData) => {
    if (!ocrData) return {};

    return {
      name: ocrData.name || '',
      businessName: ocrData.businessName || '',
      phone: ocrData.phone || '',
      email: ocrData.email || '',
      website: ocrData.website || '',
      address: ocrData.address || '',
    };
  }, []);

  const validateScanResult = useCallback((scanData) => {
    if (!scanData || !scanData.image) {
      throw new Error('Invalid scan result: No image data');
    }

    if (scanData.scanType === 'businessCard' && !scanData.extractedData) {
      console.warn('Business card scan completed but no OCR data extracted');
    }

    return true;
  }, []);

  const showScanResultSummary = useCallback((scanData) => {
    const extractedFields = extractBusinessCardData(scanData.extractedData);
    const fieldCount = Object.values(extractedFields).filter(value => value.trim()).length;

    if (fieldCount > 0) {
      Alert.alert(
        'Scan Successful! 🎉',
        `Extracted ${fieldCount} field${fieldCount === 1 ? '' : 's'} from your business card. You can edit these details before saving.`,
        [{ text: 'Continue', style: 'default' }]
      );
    } else {
      Alert.alert(
        'Scan Complete',
        'Image captured successfully! You can manually enter the business card details.',
        [{ text: 'Continue', style: 'default' }]
      );
    }
  }, [extractBusinessCardData]);

  return {
    isScanning,
    setIsScanning,
    scanResult,
    processScanResult,
    clearScanResult,
    extractBusinessCardData,
    validateScanResult,
    showScanResultSummary,
  };
};