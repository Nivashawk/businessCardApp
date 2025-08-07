import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Platform,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import ImageCropper from '../../../components/imageCropper';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../../theme/colors';
import {useSelector, useDispatch} from 'react-redux';
import {updateBusinessUploadData} from '../../../redux/slices/business/businessBasic';
import RNFS from 'react-native-fs';
import TextAreaBox from '../../../components/inputs/textArea';

const {width, height} = Dimensions.get('window');

// Enhanced URL validation function
const isValidURL = string => {
  if (!string || typeof string !== 'string') return false;

  try {
    // First, check if it's a valid URL format
    const url = new URL(string);

    // Must be http or https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    // Must have a valid hostname
    if (!url.hostname || url.hostname.length === 0) {
      return false;
    }

    // Must contain at least one dot in hostname (basic domain validation)
    if (!url.hostname.includes('.')) {
      return false;
    }

    return true;
  } catch (error) {
    // If URL constructor fails, try adding protocol and test again
    try {
      if (!string.startsWith('http://') && !string.startsWith('https://')) {
        const urlWithProtocol = 'https://' + string;
        const url = new URL(urlWithProtocol);

        // Same validations as above
        if (
          !url.hostname ||
          url.hostname.length === 0 ||
          !url.hostname.includes('.')
        ) {
          return false;
        }

        return true;
      }
    } catch (secondError) {
      return false;
    }

    return false;
  }
};

// Helper function to normalize URL (add https:// if missing)
const normalizeURL = url => {
  if (!url || typeof url !== 'string') return '';

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '';

  // If already has protocol, return as is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // Add https:// prefix
  return 'https://' + trimmedUrl;
};

// Helper component for image upload sections
const ImageUploadSection = ({title, image, onPress, onRemove, isLoading}) => {
  // Simplified and more robust image URI determination
  const imageSourceUri = useMemo(() => {
    if (!image) {
      console.log(`ImageUploadSection (${title}): No image object.`);
      return null;
    }

    // Check if image is a string (direct URI or base64)
    if (typeof image === 'string') {
      if (image.startsWith('data:image/') || image.startsWith('file://')) {
        console.log(
          `ImageUploadSection (${title}): Using string URI: ${image.substring(
            0,
            50,
          )}...`,
        );
        return image;
      }
    }

    // Check if image is an object with uri property
    if (image.uri && typeof image.uri === 'string') {
      if (
        image.uri.startsWith('file://') ||
        image.uri.startsWith('data:image/')
      ) {
        console.log(
          `ImageUploadSection (${title}): Using object URI: ${image.uri.substring(
            0,
            50,
          )}...`,
        );
        return image.uri;
      }
    }

    // Check if image has base64 property
    if (image.base64 && typeof image.base64 === 'string') {
      const uri = image.base64.startsWith('data:image/')
        ? image.base64
        : `data:image/jpeg;base64,${image.base64}`;
      console.log(
        `ImageUploadSection (${title}): Using base64 URI: ${uri.substring(
          0,
          50,
        )}...`,
      );
      return uri;
    }

    // Check if image has path property (common with image pickers/croppers)
    if (image.path && typeof image.path === 'string') {
      console.log(
        `ImageUploadSection (${title}): Using path: ${image.path.substring(
          0,
          50,
        )}...`,
      );
      return image.path;
    }

    console.log(
      `ImageUploadSection (${title}): Could not determine image URI. Image object:`,
      image,
    );
    return null;
  }, [image, title]);

  return (
    <View style={styles.imageSection}>
      <Text style={styles.imageSectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onPress} style={styles.imageUploadArea}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.gold} />
        ) : imageSourceUri ? (
          <>
            <Image
              source={{uri: imageSourceUri}}
              style={styles.imagePreview}
              resizeMode="cover"
              onError={({nativeEvent: {error}}) => {
                console.error(`ERROR loading ${title} image:`, error);
                console.error(`Failed URI: ${imageSourceUri}`);
                Alert.alert(
                  'Image Load Error',
                  `Failed to load ${title} image. URI: ${imageSourceUri?.substring(
                    0,
                    100,
                  )}`,
                );
              }}
              onLoad={() => {
                console.log(`SUCCESS: ${title} image loaded successfully`);
              }}
            />
            <TouchableOpacity
              onPress={onRemove}
              style={styles.removeImageButton}>
              <Text style={styles.removeImageButtonText}>Remove</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Tap to Upload</Text>
            <Text style={styles.placeholderSubText}>(Max 2MB)</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const Upload = forwardRef((props, ref) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessData);

  // State variables
  const [website, setWebsite] = useState('');
  const [promo, setPromo] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [promoError, setPromoError] = useState('');
  const [initialized, setInitialized] = useState(false);

  const [selectedFrontImage, setSelectedFrontImage] = useState(null);
  const [selectedBackImage, setSelectedBackImage] = useState(null);
  const [selectedLogoImage, setSelectedLogoImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [isImageProcessing, setIsImageProcessing] = useState(false);

  // Modal state instead of BottomSheet
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Helper function to reconstruct image object from base64
  const reconstructImageFromBase64 = useCallback((base64String, imageType) => {
    if (!base64String || typeof base64String !== 'string') return null;

    let actualBase64 = base64String;
    let mimeType = 'image/jpeg'; // Default

    // Handle data URI format
    if (base64String.startsWith('data:image/')) {
      const parts = base64String.split(',');
      if (parts.length > 1) {
        const headerPart = parts[0];
        actualBase64 = parts[1];
        // Extract mime type from header
        const mimeMatch = headerPart.match(/data:(image\/[^;]+)/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
      }
    }

    // Validate base64
    if (!/^[a-zA-Z0-9+/=]*$/.test(actualBase64)) {
      console.warn(
        `reconstructImageFromBase64: Invalid base64 string for ${imageType}`,
      );
      return null;
    }

    const reconstructedImage = {
      base64: actualBase64,
      uri: `data:${mimeType};base64,${actualBase64}`,
      type: mimeType,
      fileName: `${imageType}_image.jpg`,
      width: 1000,
      height: 1000,
    };

    console.log(
      `Reconstructed ${imageType} image - URI length: ${reconstructedImage.uri.length}`,
    );
    return reconstructedImage;
  }, []);

  // SINGLE useEffect for initialization - runs only once
  useEffect(() => {
    if (!initialized) {
      const dataSource = props.initialData || businessData;
      console.log(
        'Upload component: Initializing with data source:',
        dataSource,
      );

      if (dataSource) {
        setWebsite(dataSource.website || '');
        setPromo(dataSource.promo_video || '');

        // Handle images with better error handling
        if (dataSource.business_card_front) {
          try {
            const frontImage = reconstructImageFromBase64(
              dataSource.business_card_front,
              'front',
            );
            if (frontImage) {
              setSelectedFrontImage(frontImage);
              console.log('Initialized Front Image successfully');
            }
          } catch (error) {
            console.error('Error initializing front image:', error);
          }
        }

        if (dataSource.business_card_back) {
          try {
            const backImage = reconstructImageFromBase64(
              dataSource.business_card_back,
              'back',
            );
            if (backImage) {
              setSelectedBackImage(backImage);
              console.log('Initialized Back Image successfully');
            }
          } catch (error) {
            console.error('Error initializing back image:', error);
          }
        }

        if (dataSource.logo) {
          try {
            const logoImage = reconstructImageFromBase64(
              dataSource.logo,
              'logo',
            );
            if (logoImage) {
              setSelectedLogoImage(logoImage);
              console.log('Initialized Logo Image successfully');
            }
          } catch (error) {
            console.error('Error initializing logo image:', error);
          }
        }
      }
      setInitialized(true);
    }
  }, [
    props.initialData,
    businessData,
    initialized,
    reconstructImageFromBase64,
  ]);

  // Fixed openModal function
  const openModal = useCallback(type => {
    console.log(`Opening modal for: ${type}`);
    setCurrentImageType(type);
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    console.log('Closing modal');
    setIsModalVisible(false);
    setCurrentImageType(null);
  }, []);

  const handleImageSelected = useCallback(
    async (imageOrType, imageData) => {
      // Handle different callback patterns from ImageCropper
      let type, image;

      if (typeof imageOrType === 'string' && imageData) {
        // ImageCropper called with (type, imageData)
        type = imageOrType;
        image = imageData;
      } else if (typeof imageOrType === 'object' && !imageData) {
        // ImageCropper called with just (imageData) - use currentImageType
        type = currentImageType;
        image = imageOrType;
      } else {
        console.error('Unexpected handleImageSelected parameters:', {
          imageOrType,
          imageData,
        });
        setIsImageProcessing(false);
        return;
      }

      console.log(`handleImageSelected called for type: ${type}`);
      console.log('Raw image object from cropper:', image);

      // Close modal first
      closeModal();

      if (!image || typeof image === 'string') {
        console.log('No valid image provided or image is a string:', image);
        setIsImageProcessing(false);
        return;
      }

      setIsImageProcessing(true);

      try {
        let processedImage = null;
        let base64Data = null;

        // Handle react-native-image-crop-picker response
        if (image.path) {
          // Image cropper returned a file path (most common case)
          console.log(`Processing image from path: ${image.path}`);
          console.log(
            'Full image object from cropper:',
            JSON.stringify(image, null, 2),
          );

          try {
            // For react-native-image-crop-picker, the path is usually the correct file path
            const filePath = image.path;

            // Check if path starts with file:// protocol
            const normalizedPath = filePath.startsWith('file://')
              ? filePath
              : `file://${filePath}`;

            console.log(`Reading file from normalized path: ${normalizedPath}`);
            base64Data = await RNFS.readFile(normalizedPath, 'base64');

            processedImage = {
              ...image,
              base64: base64Data,
              uri: `data:image/jpeg;base64,${base64Data}`,
              normalizedPath: normalizedPath, // Keep for debugging
            };

            console.log(
              `Successfully converted to base64. Length: ${base64Data.length}`,
            );
          } catch (fileError) {
            console.error('Error reading file with RNFS:', fileError);
            console.log('Attempting to use path directly as URI...');

            // Fallback: try to use the path directly
            const directUri = image.path.startsWith('file://')
              ? image.path
              : `file://${image.path}`;
            processedImage = {
              ...image,
              uri: directUri,
            };

            console.log(`Using direct URI fallback: ${directUri}`);
          }
        } else if (image.uri) {
          // Image has URI (could be file:// or data:)
          console.log(
            `Processing image from URI: ${image.uri.substring(0, 50)}...`,
          );

          if (image.uri.startsWith('data:image/')) {
            // It's already a data URI
            const parts = image.uri.split(',');
            if (parts.length > 1) {
              base64Data = parts[1];
            }
            processedImage = {
              ...image,
              base64: base64Data,
            };
          } else if (image.uri.startsWith('file://')) {
            // It's a file URI, try to read it
            try {
              base64Data = await RNFS.readFile(image.uri, 'base64');
              processedImage = {
                ...image,
                base64: base64Data,
                uri: `data:image/jpeg;base64,${base64Data}`,
              };
            } catch (fileError) {
              console.error('Error reading file URI:', fileError);
              // Use original URI
              processedImage = image;
            }
          } else {
            // Use as-is
            processedImage = image;
          }
        } else if (image.base64) {
          // Image has base64 data
          console.log('Processing image from base64 data');
          processedImage = {
            ...image,
            uri: image.base64.startsWith('data:image/')
              ? image.base64
              : `data:image/jpeg;base64,${image.base64}`,
          };
          base64Data = image.base64.startsWith('data:image/')
            ? image.base64.split(',')[1]
            : image.base64;
        } else {
          console.error(
            'Unsupported image format. Expected properties not found.',
          );
          console.log('Available image properties:', Object.keys(image));
          console.log('Full image object:', JSON.stringify(image, null, 2));
          Alert.alert(
            'Error',
            `Unsupported image format. Available properties: ${Object.keys(
              image,
            ).join(', ')}`,
          );
          return;
        }

        if (!processedImage) {
          throw new Error('Failed to process image');
        }

        console.log(`Processed image for ${type}:`, {
          hasUri: !!processedImage.uri,
          uriType: processedImage.uri?.substring(0, 20),
          hasBase64: !!processedImage.base64,
          base64Length: processedImage.base64?.length,
        });

        // Update state based on type
        const updateData = {};
        switch (type) {
          case 'front':
            setSelectedFrontImage(processedImage);
            updateData.business_card_front =
              base64Data || processedImage.base64;
            break;
          case 'back':
            setSelectedBackImage(processedImage);
            updateData.business_card_back = base64Data || processedImage.base64;
            break;
          case 'logo':
            setSelectedLogoImage(processedImage);
            updateData.logo = base64Data || processedImage.base64;
            break;
          default:
            console.warn(`Unknown image type: ${type}`);
            break;
        }

        // Dispatch to Redux
        if (Object.keys(updateData).length > 0) {
          dispatch(updateBusinessUploadData(updateData));
          console.log(`Dispatched update for ${type}`);
        }

        console.log(`Image ${type} processed successfully`);
      } catch (error) {
        console.error(`Error processing image for ${type}:`, error);
        Alert.alert(
          'Image Processing Error',
          `Failed to process image: ${error.message}`,
        );
      } finally {
        setIsImageProcessing(false);
      }
    },
    [dispatch, closeModal, currentImageType],
  );

  const handleRemoveImage = useCallback(
    type => {
      console.log(`Removing image for type: ${type}`);
      const updateData = {};
      switch (type) {
        case 'front':
          setSelectedFrontImage(null);
          updateData.business_card_front = null;
          break;
        case 'back':
          setSelectedBackImage(null);
          updateData.business_card_back = null;
          break;
        case 'logo':
          setSelectedLogoImage(null);
          updateData.logo = null;
          break;
        default:
          break;
      }
      dispatch(updateBusinessUploadData(updateData));
    },
    [dispatch],
  );

  // Remove the handleSheetChanges function as we don't need it for Modal

  // Clear errors when typing
  const handleWebsiteChange = useCallback(
    text => {
      setWebsite(text);
      if (websiteError) setWebsiteError('');
    },
    [websiteError],
  );

  const handlePromoChange = useCallback(
    text => {
      setPromo(text);
      if (promoError) setPromoError('');
    },
    [promoError],
  );

  useImperativeHandle(
    ref,
    () => ({
      validate: () => {
        let isValid = true;

        // Website validation
        // if (!website.trim()) {
        //   setWebsiteError('Website is required.');
        //   isValid = false;
        // } else {
        //   const normalizedWebsite = normalizeURL(website.trim());
        //   if (!isValidURL(normalizedWebsite)) {
        //     setWebsiteError('Please enter a valid website URL (e.g., example.com or https://example.com)');
        //     isValid = false;
        //   }
        // }

        // Promo video validation (optional field)
        // if (promo.trim()) {
        //   const normalizedPromo = normalizeURL(promo.trim());
        //   if (!isValidURL(normalizedPromo)) {
        //     setPromoError('Please enter a valid URL for promo video (e.g., youtube.com/watch?v=...)');
        //     isValid = false;
        //   }
        // }

        if (isValid) {
          const formData = {
            website: website.trim() ? normalizeURL(website.trim()) : '',
            promo_video: promo.trim() ? normalizeURL(promo.trim()) : '',
            business_card_front: selectedFrontImage?.base64 || null,
            business_card_back: selectedBackImage?.base64 || null,
            logo: selectedLogoImage?.base64 || null,
          };
          dispatch(updateBusinessUploadData(formData));
          console.log('Form validation successful, data:', {
            website: formData.website,
            promo_video: formData.promo_video,
            hasImages: {
              front: !!formData.business_card_front,
              back: !!formData.business_card_back,
              logo: !!formData.logo,
            },
          });
        }
        return isValid;
      },

      getData: () => ({
        website: website.trim() ? normalizeURL(website.trim()) : '',
        promo_video: promo.trim() ? normalizeURL(promo.trim()) : '',
        business_card_front: selectedFrontImage,
        business_card_back: selectedBackImage,
        logo: selectedLogoImage,
      }),
    }),
    [
      website,
      promo,
      selectedFrontImage,
      selectedBackImage,
      selectedLogoImage,
      dispatch,
    ],
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.inner}>
              {/* Website Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Website</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    websiteError ? styles.textInputError : null,
                  ]}
                  value={website}
                  onChangeText={handleWebsiteChange}
                  placeholder="e.g., example.com or https://example.com"
                  placeholderTextColor={colors.text_color_2}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {websiteError ? (
                  <Text style={styles.errorText}>{websiteError}</Text>
                ) : null}
              </View>

              {/* Promo Video Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Business Promo Video</Text>
                <TextAreaBox
                  style={[
                    styles.textInput,
                    promoError ? styles.textInputError : null,
                  ]}
                  value={promo}
                  onChangeText={handlePromoChange}
                  placeholder="e.g., youtube.com/watch?v=... (Optional)"
                  placeholderTextColor={colors.text_color_2}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {promoError ? (
                  <Text style={styles.errorText}>{promoError}</Text>
                ) : null}
              </View>

              {/* Business Card Front */}
              <ImageUploadSection
                title="Business Card Front"
                image={selectedFrontImage}
                onPress={() => openModal('front')}
                onRemove={() => handleRemoveImage('front')}
                isLoading={isImageProcessing && currentImageType === 'front'}
              />

              {/* Business Card Back */}
              <ImageUploadSection
                title="Business Card Back"
                image={selectedBackImage}
                onPress={() => openModal('back')}
                onRemove={() => handleRemoveImage('back')}
                isLoading={isImageProcessing && currentImageType === 'back'}
              />

              {/* Business Logo */}
              <ImageUploadSection
                title="Business Logo"
                image={selectedLogoImage}
                onPress={() => openModal('logo')}
                onRemove={() => handleRemoveImage('logo')}
                isLoading={isImageProcessing && currentImageType === 'logo'}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Centered Modal Popup instead of full-screen */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalPopup}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Image</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageCropperContainer}>
              <ImageCropper
                navigation={navigation}
                type={currentImageType}
                onImageSelected={handleImageSelected}
                onClose={closeModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  inner: {
    padding: 16,
    flexGrow: 1,
    gap: 20, // Increased gap between all elements
    paddingBottom: height * 0.1,
    backgroundColor: colors.background,
  },
  // Modal Overlay and Popup Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalPopup: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text_color_1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.text_color_2,
    fontWeight: '300',
    lineHeight: 20,
  },
  imageCropperContainer: {
    height: 400, // Fixed height instead of flex
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.secondary,
  },
  // Input Styles
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gold,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.gold,
    backgroundColor: colors.secondary,
    minHeight: 48,
  },
  textInputError: {
    borderColor: colors.status_red,
  },
  errorText: {
    color: colors.status_red,
    fontSize: 14,
    marginTop: 5,
  },
  // Image Section Styles
  imageSection: {
    marginVertical: 12, // Increased gap between sections
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gold,
    marginBottom: 10,
  },
  imageUploadArea: {
    width: '100%',
    height: 160, // Static height instead of responsive
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    gap:2,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text_color_2,
    fontWeight: '500',
  },
  placeholderSubText: {
    fontSize: 12,
    color: colors.text_color_2,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.status_red + 'CC',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeImageButtonText: {
    color: colors.text_color_1,
    fontSize: 12,
    fontWeight: 'bold',
  },
});