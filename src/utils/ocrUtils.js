// utils/ocrUtils.js
import { scanOCR } from 'react-native-vision-camera-text-recognition';

// Extract specific information from OCR text
export const extractBusinessCardInfo = (text) => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const websiteRegex = /(https?:\/\/)?(www\.)?[\w-]+\.[\w.-]+/gi;
  
  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  const websites = text.match(websiteRegex)?.filter(url => 
    !emails.some(email => email.includes(url))
  ) || [];

  // Extract name and business name using improved heuristics
  const lines = text.split('\n').filter(line => line.trim());
  let name = '';
  let businessName = '';

  // Look for patterns that indicate name vs business
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    
    // Skip lines that are obviously not names/business
    if (line.match(emailRegex) || line.match(phoneRegex) || line.match(websiteRegex)) {
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
    rawText: text,
    extractedAt: new Date().toISOString(),
  };
};

// Process OCR from image path
export const processImageOCR = async (imagePath) => {
  try {
    const result = await scanOCR(imagePath);
    // The API might return different structure, let's handle multiple formats
    let fullText = '';
    
    if (typeof result === 'string') {
      fullText = result;
    } else if (result.text) {
      fullText = result.text;
    } else if (result.result && result.result.text) {
      fullText = result.result.text;
    } else if (Array.isArray(result)) {
      // Some APIs return array of text blocks
      fullText = result.map(block => block.text || block).join('\n');
    }
    
    if (!fullText || fullText.trim().length === 0) {
      throw new Error('No text found in image');
    }
    
    return extractBusinessCardInfo(fullText);
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to extract text from image');
  }
};