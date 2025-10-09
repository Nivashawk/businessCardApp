// utils/ocrUtilsMLKit.js - ML Kit Text Recognition implementation
import textRecognition from '@react-native-ml-kit/text-recognition';

// Extract specific information from OCR text with enhanced business card parsing
export const extractBusinessCardInfo = (text) => {
  // Enhanced regex patterns
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}|\+\d{10,14}|\d{10}/g;
  const websiteRegex = /(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/gi;
  
  // Enhanced phone number patterns for mobile vs telephone detection
  const mobileKeywords = ['mobile', 'cell', 'cellular', 'mob', 'm:', 'c:'];
  const telephoneKeywords = ['tel', 'phone', 'telephone', 'office', 'work', 't:', 'p:', 'ph:', 'tel:', 'phone:'];
  const faxKeywords = ['fax', 'f:', 'fax:'];
  
  // Business name keywords - companies often have these terms
  const businessKeywords = [
    'ltd', 'limited', 'inc', 'incorporated', 'corp', 'corporation', 'llc', 'co', 'company',
    'pvt', 'private', 'public', 'group', 'holdings', 'enterprises', 'solutions', 'solution',
    'technologies', 'technology', 'tech', 'infotech', 'infotech', 'systems', 'services', 
    'consulting', 'consultancy', 'software', 'digital', 'innovations', 'innovation', 
    'labs', 'lab', 'studio', 'studios', 'international', 'global', 'associates', 'partners', 
    'partnership', 'ventures', 'industries', 'industry', 'manufacturing', 'productions', 
    'development', 'developments', 'communications', 'communication', 'networks', 'network',
    'infosys', 'techno', 'cyber', 'data', 'cloud', 'web', 'mobile', 'apps', 'app'
  ];
  
  // Job titles that help identify personal names vs business names
  const jobTitles = [
    'ceo', 'cto', 'cfo', 'director', 'manager', 'lead', 'senior', 'junior', 'head',
    'president', 'vice president', 'founder', 'co-founder', 'owner', 'partner',
    'executive', 'coordinator', 'supervisor', 'specialist', 'analyst', 'consultant',
    'engineer', 'developer', 'designer', 'architect', 'officer', 'associate'
  ];
  
  // Enhanced address patterns and components (US + Indian)
  const streetSuffixes = [
    'street', 'st', 'avenue', 'ave', 'road', 'rd', 'drive', 'dr', 'lane', 'ln', 
    'boulevard', 'blvd', 'way', 'place', 'pl', 'court', 'ct', 'circle', 'cir',
    'plaza', 'square', 'sq', 'terrace', 'ter', 'parkway', 'pkwy', 'trail', 'tr',
    'alley', 'ally', 'crescent', 'cres', 'highway', 'hwy', 'expressway', 'expy',
    // Indian street suffixes
    'galli', 'marg', 'nagar', 'colony', 'chowk', 'cross', 'extension', 'layout',
    'society', 'complex', 'residency', 'enclave', 'vihar', 'puram', 'kunj'
  ];
  
  const buildingTypes = [
    'suite', 'ste', 'unit', 'apt', 'apartment', 'floor', 'fl', 'room', 'rm',
    'building', 'bldg', 'tower', 'twr', 'office', 'ofc', 'level', 'lvl',
    // Indian building types
    'plot', 'house', 'flat', 'block', 'wing', 'phase', 'sector', 'peth'
  ];
  
  const directions = ['north', 'n', 'south', 's', 'east', 'e', 'west', 'w', 'ne', 'nw', 'se', 'sw'];
  
  // Address regex patterns
  const streetSuffixPattern = streetSuffixes.join('|');
  const buildingTypePattern = buildingTypes.join('|');
  const directionPattern = directions.join('|');
  
  const addressRegex = new RegExp(
    `\\d+\\s+[\\w\\s]*(?:${streetSuffixPattern})(?:[\\w\\s,]*\\d{5}(-\\d{4})?)?`,
    'gi'
  );
  
  const zipCodeRegex = /\b\d{5}(-\d{4})?\b|\b\d{3}\s*\d{3}\b/g; // US and Indian PIN codes
  const stateRegex = /\b[A-Z]{2}\b/g;
  const cityStateZipRegex = /([A-Za-z\s]+),\s*([A-Z]{2})\s+(\d{5}(-\d{4})?)/g;
  
  // Indian address patterns
  const indianPinRegex = /\b\d{3}\s*\d{3}\b/g; // 6-digit PIN codes with optional space
  const indianCityPinRegex = /([A-Za-z\s]+)\s*-\s*(\d{3}\s*\d{3})/g; // City - PIN format
  const poBoxRegex = /p\.?o\.?\s*box\s+\d+/gi;
  
  // Extract contact information
  const emails = text.match(emailRegex) || [];
  const rawPhones = text.match(phoneRegex) || [];
  const websites = text.match(websiteRegex)?.filter(url => 
    !emails.some(email => email.includes(url)) && !url.match(/\.(jpg|jpeg|png|gif)$/i)
  ) || [];
  
  // Enhanced phone number classification and cleaning
  const classifyPhoneNumbers = () => {
    const lines = text.split('\n');
    const phoneTypes = {
      mobile: [],
      telephone: [],
      fax: [],
      unknown: []
    };
    
    rawPhones.forEach(phone => {
      const cleanPhone = phone.replace(/[^\d+]/g, '').replace(/^(\+?1)?/, '+1').slice(0, 15);
      if (cleanPhone.length < 10) return;
      
      // Find the line containing this phone number
      const phoneLine = lines.find(line => line.includes(phone));
      if (!phoneLine) {
        phoneTypes.unknown.push(cleanPhone);
        return;
      }
      
      const lowerLine = phoneLine.toLowerCase();
      
      // Check for fax first (most specific)
      if (faxKeywords.some(keyword => lowerLine.includes(keyword))) {
        phoneTypes.fax.push(cleanPhone);
        return;
      }
      
      // Check for mobile keywords
      if (mobileKeywords.some(keyword => lowerLine.includes(keyword))) {
        phoneTypes.mobile.push(cleanPhone);
        return;
      }
      
      // Check for telephone keywords
      if (telephoneKeywords.some(keyword => lowerLine.includes(keyword))) {
        phoneTypes.telephone.push(cleanPhone);
        return;
      }
      
      // Default classification logic
      // First phone number is often primary/mobile, second is often office/telephone
      const phoneIndex = rawPhones.indexOf(phone);
      if (phoneIndex === 0) {
        phoneTypes.mobile.push(cleanPhone);
      } else if (phoneIndex === 1) {
        phoneTypes.telephone.push(cleanPhone);
      } else {
        phoneTypes.unknown.push(cleanPhone);
      }
    });
    
    return phoneTypes;
  };
  
  const phoneTypes = classifyPhoneNumbers();
  const allCleanPhones = [
    ...phoneTypes.mobile,
    ...phoneTypes.telephone,
    ...phoneTypes.fax,
    ...phoneTypes.unknown
  ];
  
  // Enhanced address extraction function
  const extractAddressComponents = () => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Find all potential address components
    const zipCodes = text.match(zipCodeRegex) || [];
    const indianPins = text.match(indianPinRegex) || [];
    const indianCityPinMatches = [...text.matchAll(indianCityPinRegex)];
    const poBoxes = text.match(poBoxRegex) || [];
    const cityStateZipMatches = [...text.matchAll(cityStateZipRegex)];
    
    let street = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let fullAddress = '';
    
    // Method 0: Indian City - PIN pattern (prioritize this for Indian addresses)
    if (indianCityPinMatches.length > 0) {
      const match = indianCityPinMatches[0];
      city = match[1].trim();
      zipCode = match[2].replace(/\s/g, ''); // Remove any spaces from PIN
      
      // Find the full line containing this pattern
      const addressLine = lines.find(line => line.includes(match[0]));
      if (addressLine) {
        // Extract everything before the city as potential street address
        const cityPinPart = match[0];
        const beforeCityPin = addressLine.substring(0, addressLine.indexOf(cityPinPart)).trim();
        
        if (beforeCityPin && beforeCityPin.length > 0) {
          street = beforeCityPin.replace(/,$/, '').trim();
          fullAddress = addressLine;
        } else {
          // Look for street address in previous lines
          const lineIndex = lines.indexOf(addressLine);
          if (lineIndex > 0) {
            const prevLine = lines[lineIndex - 1];
            if (isStreetAddress(prevLine) || prevLine.match(/^\d+/)) {
              street = prevLine;
              fullAddress = `${street}, ${addressLine}`;
            } else {
              fullAddress = addressLine;
            }
          } else {
            fullAddress = addressLine;
          }
        }
      }
    }
    
    // Method 1: Look for complete city, state, zip pattern (US format)
    else if (cityStateZipMatches.length > 0) {
      const match = cityStateZipMatches[0];
      city = match[1].trim();
      state = match[2];
      zipCode = match[3];
      
      // Find the line containing this pattern
      const addressLine = lines.find(line => line.includes(match[0]));
      if (addressLine) {
        // Check if there's a street address in the previous line
        const lineIndex = lines.indexOf(addressLine);
        if (lineIndex > 0) {
          const prevLine = lines[lineIndex - 1];
          if (isStreetAddress(prevLine)) {
            street = prevLine;
            fullAddress = `${street}, ${addressLine}`;
          } else {
            fullAddress = addressLine;
          }
        } else {
          fullAddress = addressLine;
        }
      }
    }
    
    // Method 1.5: Look for Indian PIN codes separately
    else if (!fullAddress && indianPins.length > 0) {
      const targetPin = indianPins[0];
      
      for (const line of lines) {
        if (line.includes(targetPin) && 
            !line.match(emailRegex) && 
            !line.match(phoneRegex) && 
            !line.match(websiteRegex)) {
          
          zipCode = targetPin.replace(/\s/g, ''); // Remove spaces
          
          // For Indian addresses, try to extract city from before the PIN
          const pinIndex = line.indexOf(targetPin);
          const beforePin = line.substring(0, pinIndex).trim();
          
          // Look for city pattern (usually the word right before the PIN/dash)
          const cityMatch = beforePin.match(/([A-Za-z\s]+)\s*-?\s*$/);
          if (cityMatch) {
            city = cityMatch[1].trim().replace(/,$/, '');
            const beforeCity = beforePin.substring(0, beforePin.length - cityMatch[0].length).trim();
            if (beforeCity) {
              street = beforeCity.replace(/,$/, '').trim();
            }
          } else {
            // If no clear city pattern, assume everything before PIN is address
            street = beforePin.replace(/,$/, '').trim();
          }
          
          fullAddress = line;
          break;
        }
      }
    }
    
    // Method 2: Look for zip codes and work backwards
    else if (!fullAddress && zipCodes.length > 0) {
      const targetZip = zipCodes[0];
      
      for (const line of lines) {
        if (line.includes(targetZip) && 
            !line.match(emailRegex) && 
            !line.match(phoneRegex) && 
            !line.match(websiteRegex)) {
          
          // Extract city and state from this line
          const zipIndex = line.indexOf(targetZip);
          const beforeZip = line.substring(0, zipIndex).trim();
          
          // Look for state pattern (2 letters before zip)
          const stateMatch = beforeZip.match(/([A-Z]{2})\s*$/);
          if (stateMatch) {
            state = stateMatch[1];
            const beforeState = beforeZip.substring(0, beforeZip.length - stateMatch[0].length).trim();
            city = beforeState.replace(/,$/, '').trim();
          } else {
            // Try to extract city (assume everything before zip is city)
            city = beforeZip.replace(/,$/, '').trim();
          }
          
          zipCode = targetZip;
          
          // Look for street address in previous lines
          const lineIndex = lines.indexOf(line);
          if (lineIndex > 0) {
            const prevLine = lines[lineIndex - 1];
            if (isStreetAddress(prevLine)) {
              street = prevLine;
              fullAddress = `${street}, ${line}`;
            } else {
              fullAddress = line;
            }
          } else {
            fullAddress = line;
          }
          break;
        }
      }
    }
    
    // Method 3: Look for PO Box addresses
    if (!fullAddress && poBoxes.length > 0) {
      const poBox = poBoxes[0];
      const poBoxLine = lines.find(line => line.toLowerCase().includes(poBox.toLowerCase()));
      if (poBoxLine) {
        street = poBox;
        
        // Look for city, state, zip in subsequent lines
        const lineIndex = lines.indexOf(poBoxLine);
        if (lineIndex < lines.length - 1) {
          const nextLine = lines[lineIndex + 1];
          const cityStateZip = nextLine.match(cityStateZipRegex);
          if (cityStateZip) {
            city = cityStateZip[1];
            state = cityStateZip[2]; 
            zipCode = cityStateZip[3];
            fullAddress = `${poBoxLine}, ${nextLine}`;
          }
        }
      }
    }
    
    // Method 4: Look for street addresses without zip codes
    if (!fullAddress) {
      for (const line of lines) {
        if (isStreetAddress(line) && 
            !line.match(emailRegex) && 
            !line.match(phoneRegex) && 
            !line.match(websiteRegex)) {
          
          street = line;
          
          // Look for city info in next lines
          const lineIndex = lines.indexOf(line);
          for (let i = lineIndex + 1; i < Math.min(lineIndex + 3, lines.length); i++) {
            const nextLine = lines[i];
            if (!nextLine.match(emailRegex) && 
                !nextLine.match(phoneRegex) && 
                !nextLine.match(websiteRegex)) {
              
              // Check if this line has city/state pattern
              const stateMatches = nextLine.match(stateRegex) || [];
              if (stateMatches.length > 0) {
                state = stateMatches[0];
                const parts = nextLine.split(state);
                if (parts.length > 0) {
                  city = parts[0].replace(/,$/, '').trim();
                }
                fullAddress = `${street}, ${nextLine}`;
                break;
              }
            }
          }
          
          if (!fullAddress) {
            fullAddress = street;
          }
          break;
        }
      }
    }
    
    return {
      street: street || '',
      city: city || '',
      state: state || '', 
      zipCode: zipCode || '',
      fullAddress: fullAddress || ''
    };
  };
  
  // Helper function to identify street addresses
  const isStreetAddress = (line) => {
    const lowerLine = line.toLowerCase();
    
    // Check for street number at beginning (more flexible for Indian addresses)
    const startsWithNumber = /^\d+/.test(line.trim());
    
    // Check for street suffixes
    const hasStreetSuffix = streetSuffixes.some(suffix => 
      lowerLine.includes(` ${suffix}`) || 
      lowerLine.includes(` ${suffix}.`) ||
      lowerLine.includes(` ${suffix},`) ||
      lowerLine.endsWith(` ${suffix}`) ||
      lowerLine.endsWith(` ${suffix}.`) ||
      lowerLine.endsWith(` ${suffix},`)
    );
    
    // Check for building types
    const hasBuildingType = buildingTypes.some(type => 
      lowerLine.includes(` ${type}`) || 
      lowerLine.includes(` ${type}.`) ||
      lowerLine.includes(` ${type},`) ||
      lowerLine.endsWith(` ${type}`) ||
      lowerLine.endsWith(` ${type}.`) ||
      lowerLine.endsWith(` ${type},`)
    );
    
    // Check for PO Box
    const isPoBox = /p\.?o\.?\s*box/i.test(line);
    
    // Indian address patterns - more flexible
    const hasIndianPattern = startsWithNumber && (
      hasStreetSuffix || 
      hasBuildingType || 
      lowerLine.includes(',') // Indian addresses often use commas
    );
    
    // Check if line contains multiple address components (common in Indian addresses)
    const hasMultipleComponents = (line.match(/,/g) || []).length >= 2;
    
    return isPoBox || hasIndianPattern || hasMultipleComponents;
  };
  
  // Extract address components
  const addressComponents = extractAddressComponents();

  // Smart name and business name extraction
  const lines = text.split('\n').filter(line => line.trim().length > 1);
  let name = '';
  let businessName = '';
  let detectedJobTitle = '';
  
  // Function to check if line contains business keywords
  const containsBusinessKeywords = (line) => {
    const lowerLine = line.toLowerCase();
    return businessKeywords.some(keyword => 
      lowerLine.includes(keyword) || 
      lowerLine.includes(keyword + '.') || 
      lowerLine.includes(keyword + ',')
    );
  };
  
  // Function to calculate business confidence score
  const getBusinessConfidence = (line) => {
    const lowerLine = line.toLowerCase();
    let score = 0;
    
    // Strong tech indicators
    if (lowerLine.includes('infotech') || lowerLine.includes('technology') || 
        lowerLine.includes('software') || lowerLine.includes('tech')) {
      score += 3;
    }
    
    // Other business keywords
    businessKeywords.forEach(keyword => {
      if (lowerLine.includes(keyword)) {
        score += 1;
      }
    });
    
    // All caps (often business names)
    if (line === line.toUpperCase() && line.length > 3) {
      score += 2;
    }
    
    // Contains multiple words (business names often compound)
    const words = line.split(/\s+/).filter(word => word.length > 0);
    if (words.length >= 2) {
      score += 1;
    }
    
    return score;
  };
  
  // Function to check if line is a job title
  const isJobTitle = (line) => {
    const lowerLine = line.toLowerCase();
    return jobTitles.some(title => lowerLine.includes(title));
  };
  
  // Function to check if line looks like a person's name
  const looksLikePersonName = (line) => {
    const words = line.trim().split(/\s+/);
    if (words.length < 2 || words.length > 4) return false;
    
    // Check if all words start with capital letter (name pattern)
    const allCapitalized = words.every(word => 
      word.length > 0 && word[0] === word[0].toUpperCase()
    );
    
    // Avoid lines with numbers, special chars, or too many business keywords
    const hasNumbers = /\d/.test(line);
    const hasSpecialChars = /[^\w\s.-]/.test(line);
    const tooManyBusinessWords = businessKeywords.filter(keyword => 
      line.toLowerCase().includes(keyword)
    ).length > 1;
    
    return allCapitalized && !hasNumbers && !hasSpecialChars && !tooManyBusinessWords;
  };
  
  // Process lines to extract name and business name
  const processedLines = [];
  
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i].trim();
    
    // Skip contact information lines
    if (line.match(emailRegex) || 
        line.match(phoneRegex) || 
        line.match(websiteRegex) || 
        line.match(addressRegex) ||
        line.match(zipCodeRegex)) {
      continue;
    }
    
    processedLines.push({
      text: line,
      index: i,
      isBusinessLike: containsBusinessKeywords(line),
      businessConfidence: getBusinessConfidence(line),
      isJobTitle: isJobTitle(line),
      looksLikeName: looksLikePersonName(line),
      length: line.length
    });
  }
  
  // Extract name (prioritize lines that look like person names)
  const nameCandidate = processedLines.find(line => 
    line.looksLikeName && !line.isBusinessLike && !line.isJobTitle
  );
  
  if (nameCandidate) {
    name = nameCandidate.text;
  } else {
    // Fallback: use first non-business line
    const fallbackName = processedLines.find(line => 
      !line.isBusinessLike && !line.isJobTitle && line.length > 2
    );
    if (fallbackName) name = fallbackName.text;
  }
  
  // Extract business name (prioritize by confidence score, then business keywords)
  const businessCandidates = processedLines
    .filter(line => line.text !== name && !line.isJobTitle) // Exclude name and job titles
    .sort((a, b) => {
      // Primary sort: business confidence score (higher is better)
      if (b.businessConfidence !== a.businessConfidence) {
        return b.businessConfidence - a.businessConfidence;
      }
      // Secondary sort: prefer lines with business keywords
      if (b.isBusinessLike !== a.isBusinessLike) {
        return b.isBusinessLike ? 1 : -1;
      }
      // Tertiary sort: length (longer is often better for business names)
      return b.length - a.length;
    });
    
  const businessCandidate = businessCandidates[0];
  
  if (businessCandidate && (businessCandidate.businessConfidence > 0 || businessCandidate.isBusinessLike)) {
    businessName = businessCandidate.text;
    
    // Check if the next line might be part of the business name (for multi-line business names)
    const candidateIndex = businessCandidate.index;
    if (candidateIndex < lines.length - 1) {
      const nextLine = lines[candidateIndex + 1];
      const nextLineProcessed = processedLines.find(p => p.text === nextLine);
      
      // If next line also has business indicators and is short, it might be part of the company name
      if (nextLineProcessed && 
          nextLineProcessed.businessConfidence > 0 && 
          nextLine.length < 20 && 
          !nextLineProcessed.isJobTitle &&
          !nextLineProcessed.looksLikeName) {
        businessName = `${businessName} ${nextLine}`;
      }
    }
  }
  
  // Extract job title
  const jobTitleLine = processedLines.find(line => line.isJobTitle);
  if (jobTitleLine) detectedJobTitle = jobTitleLine.text;

  // Comprehensive logging of raw extracted data
  const rawExtractedData = {
    emails: emails,
    rawPhones: rawPhones,
    phoneTypes: phoneTypes,
    websites: websites,
    addressComponents: addressComponents,
    processedLines: processedLines.map(line => ({
      text: line.text,
      isBusinessLike: line.isBusinessLike,
      businessConfidence: line.businessConfidence,
      isJobTitle: line.isJobTitle,
      looksLikeName: line.looksLikeName
    })),
    detectedName: name,
    detectedBusinessName: businessName,
    detectedJobTitle: detectedJobTitle,
    extractedText: text
  };
  
  console.log('=== OCR RAW EXTRACTION DATA ===');
  console.log('Raw Text:', text);
  console.log('Split Lines:', text.split('\n').map(line => line.trim()).filter(line => line.length > 0));
  console.log('Emails Found:', emails);
  console.log('Raw Phone Numbers:', rawPhones);
  console.log('Classified Phone Types:', phoneTypes);
  console.log('Websites Found:', websites);
  console.log('ZIP/PIN Codes Found:', text.match(zipCodeRegex));
  console.log('Indian PIN Codes Found:', text.match(indianPinRegex));
  console.log('Indian City-PIN Matches:', [...text.matchAll(indianCityPinRegex)]);
  console.log('Address Components:', addressComponents);
  console.log('Processed Lines:', processedLines);
  console.log('Name Detection:', { name, nameCandidate: nameCandidate?.text });
  console.log('Business Name Detection:', { 
    businessName, 
    businessCandidate: businessCandidate?.text,
    businessConfidence: businessCandidate?.businessConfidence,
    allBusinessCandidates: businessCandidates?.slice(0, 3).map(c => ({
      text: c.text,
      confidence: c.businessConfidence,
      isBusinessLike: c.isBusinessLike
    }))
  });
  console.log('Job Title Detection:', detectedJobTitle);
  console.log('================================');

  const finalResult = {
    name: name || '',
    businessName: businessName || '',
    jobTitle: detectedJobTitle || '',
    phone: phoneTypes.mobile[0] || allCleanPhones[0] || '',
    telephone: phoneTypes.telephone[0] || '',
    fax: phoneTypes.fax[0] || '',
    email: emails[0] || '',
    website: websites[0] || '',
    address: addressComponents.fullAddress || '',
    street: addressComponents.street || '',
    city: addressComponents.city || '',
    state: addressComponents.state || '',
    zipCode: addressComponents.zipCode || '',
    rawText: text,
    extractedAt: new Date().toISOString(),
    rawExtractedData: rawExtractedData, // Include raw data for debugging
    confidence: {
      name: name ? (nameCandidate ? 0.9 : 0.6) : 0,
      businessName: businessName ? (businessCandidate ? 0.9 : 0.6) : 0,
      phone: phoneTypes.mobile.length > 0 ? 0.95 : (allCleanPhones.length > 0 ? 0.8 : 0),
      telephone: phoneTypes.telephone.length > 0 ? 0.95 : 0,
      fax: phoneTypes.fax.length > 0 ? 0.95 : 0,
      email: emails.length > 0 ? 0.95 : 0,
      website: websites.length > 0 ? 0.85 : 0,
      address: addressComponents.fullAddress ? 0.9 : 0,
      street: addressComponents.street ? 0.85 : 0,
      city: addressComponents.city ? 0.9 : 0,
      state: addressComponents.state ? 0.95 : 0,
      zipCode: addressComponents.zipCode ? 0.95 : 0
    }
  };
  
  console.log('=== FINAL OCR RESULT ===');
  console.log(finalResult);
  console.log('========================');
  
  return finalResult;
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