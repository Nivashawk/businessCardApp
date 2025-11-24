// utils/ocrUtilsMLKit.js - ML Kit Text Recognition implementation
import textRecognition from '@react-native-ml-kit/text-recognition';

// Extract specific information from OCR text with enhanced business card parsing
export const extractBusinessCardInfo = (text) => {
  // Enhanced regex patterns
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
  const phoneRegex = /(\+91[-.\s]*\d{5}[-.\s]*\d{5})|(\+91[-.\s]*\d{4}[-.\s]*\d{3}[-.\s]*\d{3})|(91[-.\s]*\d{5}[-.\s]*\d{5})|(91[-.\s]*\d{4}[-.\s]*\d{3}[-.\s]*\d{3})|(\+\d{1,3}[-.\s]*)?(\(?\d{3,4}\)?[-.\s]*)?\d{3,4}[-.\s]*\d{3,4}|\+\d{1,3}[-.\s]*\d{4}[-.\s]*\d{3}[-.\s]*\d{3}|\+\d{10,14}|\d{10}/g;
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
  
  // Also detect malformed emails (missing dots before TLD)
  const malformedEmailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]*[A-Za-z]{2,}\b/gi;
  const malformedEmails = text.match(malformedEmailRegex)?.filter(email => 
    !emails.includes(email) && // Not already found as valid email
    email.includes('@') && 
    !email.match(/\.[A-Z|a-z]{2,}$/i) // Missing dot before TLD
  ) || [];
  
  // Combine valid and malformed emails
  const allEmails = [...emails, ...malformedEmails];
  
  const rawPhones = text.match(phoneRegex) || [];
  const websites = text.match(websiteRegex)?.filter(url => 
    !allEmails.some(email => email.includes(url)) && !url.match(/\.(jpg|jpeg|png|gif)$/i)
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
    
    let validPhoneCount = 0; // Track actual valid phones processed
    
    rawPhones.forEach(phone => {
      // Fix: Don't force +1 for Indian numbers
      let cleanPhone = phone.replace(/[^\d+]/g, '');
      
      // For Indian numbers starting with +91, keep as is
      if (cleanPhone.startsWith('+91')) {
        cleanPhone = cleanPhone.slice(0, 13); // +91 + 10 digits
      } else if (cleanPhone.startsWith('91') && cleanPhone.length > 10) {
        cleanPhone = '+' + cleanPhone.slice(0, 12); // Add + and limit
      } else if (cleanPhone.length >= 10 && !cleanPhone.startsWith('+')) {
        // For 10+ digit numbers without country code, could be US or Indian
        if (cleanPhone.length === 10) {
          // Assume US for 10-digit numbers
          cleanPhone = '+1' + cleanPhone;
        } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
          // US number with country code
          cleanPhone = '+' + cleanPhone;
        } else {
          // Keep as is for other patterns
          cleanPhone = '+' + cleanPhone.slice(0, 14);
        }
      } else if (cleanPhone.length === 6) {
        // Skip 6-digit PIN codes
        return;
      } else {
        cleanPhone = cleanPhone.slice(0, 15);
      }
      
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
      // First valid phone number is often primary/mobile, second is often office/telephone
      if (validPhoneCount === 0) {
        phoneTypes.mobile.push(cleanPhone);
      } else if (validPhoneCount === 1) {
        phoneTypes.telephone.push(cleanPhone);
      } else {
        phoneTypes.unknown.push(cleanPhone);
      }
      
      validPhoneCount++; // Increment for next valid phone
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
      city = match[1].trim().replace(/^\n/, ''); // Remove leading newline
      zipCode = match[2].replace(/\s/g, ''); // Remove any spaces from PIN
      
      // Find the line containing the city-PIN pattern
      const cityPinText = `${city} - ${zipCode}`;
      const addressLine = lines.find(line => line.includes(cityPinText) || line.includes(city));
      
      if (addressLine) {
        // Collect all address-related lines
        const lineIndex = lines.indexOf(addressLine);
        const addressLines = [];
        
        // Look backwards for address components
        for (let i = lineIndex - 1; i >= 0; i--) {
          const prevLine = lines[i];
          
          // Stop if we hit contact info
          if (prevLine.match(emailRegex) || 
              prevLine.match(phoneRegex) || 
              prevLine.match(websiteRegex)) {
            break;
          }
          
          // Check if line looks like address component
          const isAddressComponent = prevLine.includes(',') || 
                                   prevLine.match(/^no\.\s*\d+/i) ||
                                   prevLine.toLowerCase().includes('colony') ||
                                   prevLine.toLowerCase().includes('salai') ||
                                   prevLine.toLowerCase().includes('street') ||
                                   prevLine.toLowerCase().includes('road') ||
                                   prevLine.toLowerCase().includes('nagar') ||
                                   prevLine.toLowerCase().includes('layout') ||
                                   /^\d+/.test(prevLine.trim()) ||
                                   i === lineIndex - 1; // Always include immediate previous line if no other criteria
          
          if (isAddressComponent) {
            addressLines.unshift(prevLine);
          } else {
            break; // Stop if line doesn't look like address
          }
        }
        
        // Add the city-PIN line
        addressLines.push(addressLine);
        
        // Combine all address lines
        fullAddress = addressLines.join(', ');
        
        // Set street as everything except the last city line
        if (addressLines.length > 1) {
          street = addressLines.slice(0, -1).join(', ');
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
    
    // Method 5: Look for "City, State, Country" patterns (when no PIN codes)
    if (!fullAddress) {
      console.log('=== METHOD 5: Looking for City, State, Country patterns ===');
      // Look for lines with state/country patterns
      for (const line of lines) {
        if (line.match(emailRegex) || 
            line.match(phoneRegex) || 
            line.match(websiteRegex)) {
          continue;
        }
        
        const lowerLine = line.toLowerCase();
        console.log(`Checking line: "${line}" (lower: "${lowerLine}")`);
        
        // Check for "City, State, Country" pattern
        const hasStateAndCountry = (lowerLine.includes('maharashtra') || 
             lowerLine.includes('karnataka') || 
             lowerLine.includes('tamil nadu') ||
             lowerLine.includes('gujarat') ||
             lowerLine.includes('kerala') ||
             lowerLine.includes('west bengal')) && 
            lowerLine.includes('india');
        
        console.log(`  Has state and country: ${hasStateAndCountry}`);
        
        if (hasStateAndCountry) {
          
          // This line contains state and country
          const parts = line.split(',').map(part => part.trim());
          if (parts.length >= 3) {
            city = parts[0];
            state = parts[1];
            // Country is parts[2] (India)
          } else if (parts.length === 2) {
            state = parts[0];
            // Country is parts[1] (India)
          }
          
          // Collect address lines
          const lineIndex = lines.indexOf(line);
          const addressLines = [];
          
          console.log(`  Found state/country line at index ${lineIndex}: "${line}"`);
          console.log(`  Looking backwards for address components...`);
          
          // Look backwards for address components
          for (let i = lineIndex - 1; i >= 0; i--) {
            const prevLine = lines[i];
            
            console.log(`    Checking line ${i}: "${prevLine}"`);
            
            // Stop if we hit contact info
            if (prevLine.match(emailRegex) || 
                prevLine.match(phoneRegex) || 
                prevLine.match(websiteRegex)) {
              console.log(`      -> Stopping at contact info`);
              break;
            }
            
            // Check if line looks like address component
            const isAddressComponent = isAddressLine(prevLine);
            console.log(`      -> isAddressLine result: ${isAddressComponent}`);
            
            if (isAddressComponent) {
              console.log(`      -> Adding as address line`);
              addressLines.unshift(prevLine);
            } else {
              console.log(`      -> Not an address line, stopping`);
              break; // Stop if line doesn't look like address
            }
          }
          
          // Add the city-state-country line
          addressLines.push(line);
          
          console.log(`  Final address lines:`, addressLines);
          
          // Combine all address lines
          fullAddress = addressLines.join(', ');
          
          // Set street as everything except the last city-state-country line
          if (addressLines.length > 1) {
            street = addressLines.slice(0, -1).join(', ');
          }
          
          console.log(`  Final fullAddress: "${fullAddress}"`);
          console.log(`  Final street: "${street}"`);
          
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
  
  // Helper function to identify any address-related line (broader than isStreetAddress)
  const isAddressLine = (line) => {
    const lowerLine = line.toLowerCase();
    
    // Use the existing street address detection
    if (isStreetAddress(line)) return true;
    
    // Check for Indian PIN codes
    if (line.match(indianPinRegex)) return true;
    
    // Check for city-PIN patterns
    if (line.match(indianCityPinRegex)) return true;
    
    // Check for common Indian address terms
    const indianAddressTerms = [
      'colony', 'nagar', 'layout', 'society', 'complex', 'residency', 'enclave',
      'vihar', 'puram', 'kunj', 'chowk', 'cross', 'extension', 'sector', 'peth',
      'salai', 'marg', 'galli',
      // Additional building/location terms
      'point', 'tower', 'plaza', 'square', 'center', 'centre', 'mall', 'park',
      'heights', 'view', 'gardens', 'apartments', 'flats', 'building', 'bhawan',
      'block', 'wing', 'phase', 'floor', 'ground', 'basement'
    ];
    
    const hasIndianAddressTerms = indianAddressTerms.some(term => 
      lowerLine.includes(term)
    );
    
    // Check if line starts with "No." (common in Indian addresses)
    const startsWithNo = /^no\.\s*\d+/i.test(line.trim());
    
    // Check for flat/unit numbers (L11, A-23, 402, etc.)
    const startsWithFlatNumber = /^[A-Za-z]?\d+[A-Za-z]?[-,\s]/i.test(line.trim());
    
    // Check if line has city name patterns (broader city detection)
    const hasCityPattern = lowerLine.includes('chennai') || 
                          lowerLine.includes('ambattur') ||
                          lowerLine.includes('icf colony') ||
                          lowerLine.includes('nashik') ||
                          lowerLine.includes('maharashtra') ||
                          lowerLine.includes('mumbai') ||
                          lowerLine.includes('delhi') ||
                          lowerLine.includes('bangalore') ||
                          lowerLine.includes('hyderabad') ||
                          lowerLine.includes('pune') ||
                          lowerLine.includes('india');
    
    // Check for state patterns
    const hasStatePattern = lowerLine.includes('maharashtra') ||
                           lowerLine.includes('karnataka') ||
                           lowerLine.includes('tamil nadu') ||
                           lowerLine.includes('gujarat') ||
                           lowerLine.includes('rajasthan') ||
                           lowerLine.includes('kerala') ||
                           lowerLine.includes('west bengal');
    
    return hasIndianAddressTerms || startsWithNo || startsWithFlatNumber || 
           hasCityPattern || hasStatePattern;
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
  
  // Extract business name from email/website domains for comparison
  const extractBusinessFromDomain = () => {
    const domains = [];
    
    // From websites
    websites.forEach(website => {
      const domain = website
        .replace(/^(https?:\/\/)?(www\.)?/, '')  // Remove protocol and www
        .replace(/\.(com|org|net|in|co|ltd|biz|info).*$/, '') // Remove TLD
        .replace(/[0-9\-_]/g, '') // Remove numbers, hyphens, underscores
        .toLowerCase()
        .trim();
      if (domain.length > 2) domains.push(domain);
    });
    
    // From emails  
    allEmails.forEach(email => {
      const atIndex = email.indexOf('@');
      if (atIndex > -1) {
        const domain = email.substring(atIndex + 1)
          .replace(/\.(com|org|net|in|co|ltd|biz|info).*$/, '') // Remove TLD
          .replace(/[0-9\-_]/g, '') // Remove numbers, hyphens, underscores
          .toLowerCase()
          .trim();
        if (domain.length > 2) domains.push(domain);
      }
    });
    
    return domains;
  };
  
  const domainBusinessNames = extractBusinessFromDomain();
  
  // Enhanced business confidence that includes domain matching
  const getEnhancedBusinessConfidence = (line) => {
    let score = getBusinessConfidence(line);
    const lowerLine = line.toLowerCase();
    
    // Check if line matches or contains domain business names
    domainBusinessNames.forEach(domain => {
      if (lowerLine === domain) {
        score += 5; // Exact match with domain
      } else if (lowerLine.includes(domain) || domain.includes(lowerLine)) {
        score += 3; // Partial match with domain
      }
    });
    
    // Boost score for standalone business-looking words (no keywords but could be business)
    if (score === 0) {
      const words = line.split(/\s+/).filter(word => word.length > 0);
      if (words.length === 1 && words[0].length > 3) {
        // Single word that could be a business name
        const word = words[0].toLowerCase();
        // Not obviously a person's name pattern
        if (!word.match(/^[a-z]+$/) || word.length > 6) {
          score += 1; // Small boost for potential business names
        }
      }
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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip contact information and address lines
    if (line.match(emailRegex) || 
        line.match(malformedEmailRegex) ||
        line.match(phoneRegex) || 
        line.match(websiteRegex) || 
        line.match(addressRegex) ||
        line.match(zipCodeRegex) ||
        isAddressLine(line)) {
      continue;
    }
    
    processedLines.push({
      text: line,
      index: i,
      isBusinessLike: containsBusinessKeywords(line),
      businessConfidence: getEnhancedBusinessConfidence(line),
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
  // First, filter out name and job titles, then prefer lines with actual business keywords
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
      // Tertiary sort: prefer lines that appear later (company name often at end)
      if (Math.abs(a.index - b.index) > 2) {
        return b.index - a.index;
      }
      // Quaternary sort: length (longer is often better for business names)
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
  } else if (businessCandidates.length > 0) {
    // Fallback: use the best available candidate even if confidence is low
    businessName = businessCandidates[0].text;
  }
  
  // Extract job title
  const jobTitleLine = processedLines.find(line => line.isJobTitle);
  if (jobTitleLine) detectedJobTitle = jobTitleLine.text;

  // Comprehensive logging of raw extracted data
  const rawExtractedData = {
    emails: emails,
    malformedEmails: malformedEmails,
    allEmails: allEmails,
    domainBusinessNames: domainBusinessNames,
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
    email: allEmails[0] || '',
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
  
  // Apply intelligent post-processing
  const enhancedResult = applyIntelligentPostProcessing(finalResult, text);
  
  return enhancedResult;
};

// Intelligent post-processing to fix common OCR issues and improve extraction
const applyIntelligentPostProcessing = (result, rawText) => {
  console.log('=== APPLYING INTELLIGENT POST-PROCESSING ===');
  
  const enhanced = { ...result };
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // 1. Fix common OCR character misreads
  enhanced.address = fixOCRCharacterErrors(enhanced.address);
  enhanced.name = fixOCRCharacterErrors(enhanced.name);
  enhanced.businessName = fixOCRCharacterErrors(enhanced.businessName);
  
  // 2. Smart address reconstruction
  enhanced.address = smartAddressReconstruction(enhanced.address, lines);
  
  // 3. Improve field assignments using context
  const contextImproved = improveFieldsWithContext(enhanced, lines);
  Object.assign(enhanced, contextImproved);
  
  // 4. Address completeness validation and enhancement
  enhanced.address = validateAndEnhanceAddress(enhanced.address, lines);
  
  // 5. Phone number smart formatting
  enhanced.phone = smartPhoneFormatting(enhanced.phone);
  enhanced.telephone = smartPhoneFormatting(enhanced.telephone);
  
  // 6. Business name vs personal name disambiguation
  const nameDisambiguation = disambiguateNameAndBusiness(enhanced, lines);
  Object.assign(enhanced, nameDisambiguation);
  
  console.log('Enhanced result:', enhanced);
  console.log('=============================================');
  
  return enhanced;
};

// Fix common OCR character recognition errors
const fixOCRCharacterErrors = (text) => {
  if (!text) return text;
  
  return text
    // Common number/letter confusions
    .replace(/\b1l\b/gi, '11')           // 1l -> 11 (very common in addresses)
    .replace(/\bl1\b/gi, '11')           // l1 -> 11 
    .replace(/\b0O\b/g, '00')            // 0O -> 00
    .replace(/\bO0\b/g, '00')            // O0 -> 00
    .replace(/\b5S\b/g, '55')            // 5S -> 55
    .replace(/\bS5\b/g, '55')            // S5 -> 55
    
    // In building/address context
    .replace(/L1l/gi, 'L11')             // L1l -> L11
    .replace(/Ll1/gi, 'L11')             // Ll1 -> L11
    .replace(/L1O/gi, 'L10')             // L1O -> L10
    .replace(/LO1/gi, 'L01')             // LO1 -> L01
    
    // Common word fixes
    .replace(/\bPomt\b/gi, 'Point')      // Pomt -> Point
    .replace(/\bPoimt\b/gi, 'Point')     // Poimt -> Point
    .replace(/\bModem\b/gi, 'Modern')    // Modem -> Modern
    .replace(/\bMaharashfra\b/gi, 'Maharashtra')  // Common Maharashtra misread
    .replace(/\bTamil Nadll\b/gi, 'Tamil Nadu')   // Tamil Nadu misread
    .replace(/\blndia\b/gi, 'India')     // India misread
    .replace(/\bBangalore\b/gi, 'Bangalore')
    
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

// Smart address reconstruction using context clues
const smartAddressReconstruction = (currentAddress, lines) => {
  if (!currentAddress || currentAddress.length < 10) {
    // Try to rebuild address from lines
    const addressLines = [];
    
    for (const line of lines) {
      const cleanLine = line.trim();
      
      // Skip obvious non-address lines
      if (isNameLine(cleanLine) || isJobTitleLine(cleanLine) || 
          isContactLine(cleanLine)) {
        continue;
      }
      
      // Check if line could be part of address
      if (looksLikeAddressComponent(cleanLine)) {
        addressLines.push(cleanLine);
      }
    }
    
    if (addressLines.length > 0) {
      const reconstructed = addressLines.join(', ');
      console.log('Reconstructed address from:', addressLines);
      return fixOCRCharacterErrors(reconstructed);
    }
  }
  
  return currentAddress;
};

// Helper functions for address reconstruction
const isNameLine = (line) => {
  const words = line.split(/\s+/);
  return words.length >= 2 && words.length <= 4 && 
         words.every(word => /^[A-Z][a-z]*$/.test(word)) &&
         !line.toLowerCase().includes('manager') &&
         !line.toLowerCase().includes('director');
};

const isJobTitleLine = (line) => {
  const jobTitles = ['manager', 'director', 'ceo', 'cto', 'engineer', 'developer', 'designer', 'analyst', 'consultant', 'executive', 'coordinator', 'supervisor', 'specialist', 'officer', 'associate', 'head', 'lead', 'senior', 'junior'];
  return jobTitles.some(title => line.toLowerCase().includes(title));
};

const isContactLine = (line) => {
  return line.includes('@') || 
         /\+?\d{2,3}[-.\s]?\d{3,5}[-.\s]?\d{3,5}/.test(line) ||
         /https?:\/\//.test(line) ||
         /www\./.test(line);
};

const looksLikeAddressComponent = (line) => {
  const lowerLine = line.toLowerCase();
  
  // Starts with building/unit identifier
  if (/^[A-Z]?\d+[A-Z]?[-,\s]/.test(line)) return true;
  
  // Contains building types
  const buildingTerms = ['point', 'tower', 'plaza', 'building', 'block', 'wing', 'floor', 'apartment', 'flat', 'complex', 'society'];
  if (buildingTerms.some(term => lowerLine.includes(term))) return true;
  
  // Contains location indicators
  const locationTerms = ['colony', 'nagar', 'layout', 'street', 'road', 'marg', 'cross', 'extension'];
  if (locationTerms.some(term => lowerLine.includes(term))) return true;
  
  // Contains city/state/country
  const placeTerms = ['chennai', 'mumbai', 'delhi', 'bangalore', 'hyderabad', 'pune', 'nashik', 'maharashtra', 'karnataka', 'tamil nadu', 'gujarat', 'india'];
  if (placeTerms.some(term => lowerLine.includes(term))) return true;
  
  // Has PIN code
  if (/\d{3}\s*\d{3}/.test(line)) return true;
  
  return false;
};

// Improve field assignments using surrounding context
const improveFieldsWithContext = (result, lines) => {
  const improved = { ...result };
  
  // If business name is weak, try to find better candidate
  if (!improved.businessName || improved.businessName.length < 3) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip if it's already assigned to another field
      if (line === improved.name || line === improved.jobTitle) continue;
      
      // Look for business indicators
      if (hasStrongBusinessIndicators(line)) {
        improved.businessName = line;
        break;
      }
    }
  }
  
  // If name is unclear, improve detection
  if (!improved.name || improved.name.length < 3) {
    const nameCandidate = lines.find(line => 
      looksLikePersonName(line) && 
      line !== improved.businessName && 
      line !== improved.jobTitle
    );
    if (nameCandidate) {
      improved.name = nameCandidate;
    }
  }
  
  return improved;
};

const hasStrongBusinessIndicators = (line) => {
  const lowerLine = line.toLowerCase();
  const businessTerms = ['technologies', 'solutions', 'systems', 'services', 'consulting', 'software', 'digital', 'innovations', 'international', 'global', 'enterprises', 'ltd', 'limited', 'pvt', 'private'];
  return businessTerms.some(term => lowerLine.includes(term)) ||
         (line === line.toUpperCase() && line.length > 5) || // All caps business names
         line.split(/\s+/).length >= 2; // Multi-word potential business names
};

const looksLikePersonName = (line) => {
  const words = line.trim().split(/\s+/);
  if (words.length < 2 || words.length > 4) return false;
  
  // Check if all words are properly capitalized (person name pattern)
  const properlyCapitalized = words.every(word => 
    word.length > 0 && word[0] === word[0].toUpperCase() && 
    word.slice(1) === word.slice(1).toLowerCase()
  );
  
  // Avoid business-like patterns
  const hasBusinessTerms = ['technologies', 'solutions', 'systems', 'ltd', 'limited', 'pvt'].some(term => 
    line.toLowerCase().includes(term)
  );
  
  return properlyCapitalized && !hasBusinessTerms && !/\d/.test(line);
};

// Validate and enhance address completeness
const validateAndEnhanceAddress = (address, lines) => {
  if (!address || address.length < 5) return address;
  
  // Check if address seems incomplete (missing building number/name)
  const hasBuilding = /^[A-Z]?\d+[A-Z]?[-,\s]/.test(address) || 
                     /\b(point|tower|plaza|building|block|wing|floor|apartment|flat|complex|society)\b/i.test(address);
  
  if (!hasBuilding) {
    // Look for missing building component in other lines
    for (const line of lines) {
      if (/^[A-Z]?\d+[A-Z]?[-,\s]/.test(line.trim()) || 
          /\b(point|tower|plaza|building|block|wing)\b/i.test(line)) {
        // Prepend this building info to address
        const enhancedAddress = `${line.trim()}, ${address}`;
        console.log('Enhanced address with building info:', enhancedAddress);
        return enhancedAddress;
      }
    }
  }
  
  return address;
};

// Smart phone number formatting
const smartPhoneFormatting = (phone) => {
  if (!phone) return phone;
  
  // Clean and standardize format
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Indian number formatting
  if (cleaned.startsWith('+91') && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone; // Return original if can't format
};

// Disambiguate name and business name using advanced heuristics
const disambiguateNameAndBusiness = (result, lines) => {
  const improved = { ...result };
  
  // If name and business are the same, try to fix
  if (improved.name === improved.businessName && improved.name) {
    // Look for a better business name candidate
    const businessCandidate = lines.find(line => 
      line !== improved.name && 
      line !== improved.jobTitle &&
      (hasStrongBusinessIndicators(line) || line === line.toUpperCase())
    );
    
    if (businessCandidate) {
      improved.businessName = businessCandidate;
    } else {
      // Clear business name if no good candidate
      improved.businessName = '';
    }
  }
  
  // If business name looks like a person name, swap if needed
  if (improved.businessName && looksLikePersonName(improved.businessName) && 
      (!improved.name || !looksLikePersonName(improved.name))) {
    const temp = improved.name;
    improved.name = improved.businessName;
    improved.businessName = temp;
  }
  
  return improved;
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