// utils/ocrUtilsWeb.js - Web-based OCR solution using Tesseract.js (client-side)
// This can be used as an alternative that doesn't require native modules

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

// Simple OCR simulation for demo purposes
// In a real implementation, you could use:
// 1. Tesseract.js for client-side OCR
// 2. Google Cloud Vision API
// 3. AWS Textract
// 4. Azure Computer Vision
export const processImageOCR = async (imagePath) => {
  try {
    // For demo purposes, let's simulate OCR with sample data
    // This would be replaced with actual OCR service call
    
    console.log('Processing image for OCR:', imagePath);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return sample extracted data for demonstration
    // In production, this would call actual OCR service
    const sampleData = {
      name: 'John Smith',
      businessName: 'Tech Solutions Inc.',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@techsolutions.com',
      website: 'www.techsolutions.com',
      rawText: 'John Smith\nTech Solutions Inc.\nSenior Developer\n+1 (555) 123-4567\njohn.smith@techsolutions.com\nwww.techsolutions.com',
      extractedAt: new Date().toISOString(),
    };
    
    return sampleData;
    
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to extract text from image');
  }
};

// Function to integrate with actual OCR services
export const processImageOCRWithService = async (imagePath, serviceType = 'google') => {
  try {
    switch (serviceType) {
      case 'google':
        return await processWithGoogleVision(imagePath);
      case 'tesseract':
        return await processWithTesseract(imagePath);
      default:
        return await processImageOCR(imagePath); // fallback to demo
    }
  } catch (error) {
    console.error('OCR service error:', error);
    throw error;
  }
};

// Placeholder for Google Vision API integration
const processWithGoogleVision = async (imagePath) => {
  // Implementation would require Google Cloud Vision API key
  // and proper API setup
  throw new Error('Google Vision API not configured');
};

// Placeholder for Tesseract.js integration
const processWithTesseract = async (imagePath) => {
  // Implementation would require tesseract.js package
  // npm install tesseract.js
  throw new Error('Tesseract.js not installed');
};