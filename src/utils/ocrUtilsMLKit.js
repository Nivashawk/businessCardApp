// utils/ocrUtilsMLKit.js - ML Kit Text Recognition implementation
import textRecognition from '@react-native-ml-kit/text-recognition';

// Extract specific information from OCR text
export const extractBusinessCardInfo = (text) => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const websiteRegex = /(https?:\/\/)?(www\.)?[\w-]+\.[\w.-]+/gi;
  
  // Enhanced address regex patterns
  const addressRegex = /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|place|pl|court|ct|circle|cir)[\w\s,]*\d{5}(-\d{4})?/gi;
  const zipCodeRegex = /\b\d{5}(-\d{4})?\b/g;
  const stateRegex = /\b[A-Z]{2}\b/g;
  
  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  const websites = text.match(websiteRegex)?.filter(url => 
    !emails.some(email => email.includes(url))
  ) || [];
  
  // Extract address information
  const addresses = text.match(addressRegex) || [];
  const zipCodes = text.match(zipCodeRegex) || [];
  const states = text.match(stateRegex) || [];
  
  // Try to construct address from components if full address not found
  let address = addresses[0] || '';
  if (!address && zipCodes.length > 0) {
    const lines = text.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.includes(zipCodes[0]) && !line.match(emailRegex) && !line.match(phoneRegex)) {
        address = line.trim();
        break;
      }
    }
  }

  // Extract name and business name using improved heuristics
  const lines = text.split('\n').filter(line => line.trim());
  let name = '';
  let businessName = '';

  // Look for patterns that indicate name vs business
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    
    // Skip lines that are obviously not names/business
    if (line.match(emailRegex) || line.match(phoneRegex) || line.match(websiteRegex) || line.match(addressRegex)) {
      continue;
    }
    
    // First non-contact line is likely the name
    if (!name && line.length > 1) {
      name = line;
      continue;
    }
    
    // Next line could be business name or title
    if (!businessName && line.length > 1 && line !== name) {
      businessName = line;
      break;
    }
  }

  return {
    name: name || '',
    businessName: businessName || '',
    phone: phones[0] || '',
    email: emails[0] || '',
    website: websites[0] || '',
    address: address || '',
    rawText: text,
    extractedAt: new Date().toISOString(),
  };
};

// Process OCR from image path using ML Kit
export const processImageOCR = async (imagePath) => {
  try {
    const result = await textRecognition.recognize(imagePath);
    
    if (!result || !result.text || result.text.trim().length === 0) {
      throw new Error('No text found in image');
    }
    
    return extractBusinessCardInfo(result.text);
  } catch (error) {
    console.error('ML Kit OCR processing error:', error);
    throw new Error('Failed to extract text from image using ML Kit');
  }
};