# OCR Setup Guide

## Current Status
The app is currently using a **fallback mode** (manual entry) for the OCR functionality. To enable automatic text extraction from business cards, you need to install and configure one of the OCR libraries below.

## OCR Library Options

### Option 1: ML Kit Text Recognition (Recommended)
**Pros:** Most stable, maintained by Google, works well on Android and iOS
**Package:** `@react-native-ml-kit/text-recognition`

```bash
npm install @react-native-ml-kit/text-recognition
```

Then update the imports in:
- `src/screens/contactComponent/ManualContactModal.jsx`
- `src/screens/business/steps/customCamera.jsx`

Change from:
```javascript
import {processImageOCR} from '../../../utils/ocrUtilsFallback';
```

To:
```javascript
import {processImageOCR} from '../../../utils/ocrUtilsMLKit';
```

### Option 2: Vision Camera Text Recognition
**Package:** `react-native-vision-camera-text-recognition`

```bash
npm install react-native-vision-camera-text-recognition
```

Then update the imports to:
```javascript
import {processImageOCR} from '../../../utils/ocrUtils';
```

### Option 3: Alternative OCR Libraries
- `react-native-text-recognition`
- `react-native-ocr-read-text`

## Current Implementation
Without OCR libraries, the app still works perfectly:

1. ✅ **Manual Contact Creation** - Users can add all fields manually
2. ✅ **Image Storage** - Business card images are saved
3. ✅ **Contact Management** - Full CRUD operations
4. ✅ **Data Structure** - Ready for OCR data when available

## To Enable OCR:

1. **Install chosen OCR library**
2. **Update import statements** in the two files mentioned above
3. **Test with a business card image**

## Fallback Behavior
Currently, when users select "Take Photo with OCR":
- Image is captured and stored
- OCR fields remain empty (manual entry required)
- All other functionality works normally

This ensures the app works reliably while you choose and configure the OCR solution that works best for your environment.