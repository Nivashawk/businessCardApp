// utils/ocrUtilsFallback.js - Fallback implementation without OCR library
// This provides the same interface but uses manual text input

// Extract specific information from manually entered text
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
    address: '',
    rawText: text,
    extractedAt: new Date().toISOString(),
  };
};

// Fallback: Just return empty data structure for manual entry
export const processImageOCR = async (imagePath) => {
  // This is a fallback - no actual OCR processing
  console.log('OCR fallback: Manual entry required for image:', imagePath);
  
  return {
    name: '',
    businessName: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    rawText: '',
    extractedAt: new Date().toISOString(),
  };
};