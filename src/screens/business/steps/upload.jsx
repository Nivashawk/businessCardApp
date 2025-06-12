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
} from 'react-native';
import InputBox from '../../../components/inputs/textInput';
import ImageCropper from '../../../components/imageCropper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../../theme/colors';
import LargeButton from '../../../components/buttons/largeButton';
import {useSelector, useDispatch} from 'react-redux';
import {updateBusinessUploadData} from '../../../redux/slices/business/businessBasic';
import RNFS from 'react-native-fs';

const {width, height} = Dimensions.get('window');

const Upload = forwardRef((props, ref) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessData);

  // State variables
  const [website, setWebsite] = useState('');
  const [promo, setPromo] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [promoError, setPromoError] = useState('');

  const [selectedFrontImage, setSelectedFrontImage] = useState(null);
  const [selectedBackImage, setSelectedBackImage] = useState(null);
  const [selectedLogoImage, setSelectedLogoImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null); // 'front' | 'back' | 'logo'

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  // Initialize data from Redux/props
  useEffect(() => {
    console.log('Upload component - businessData:', businessData);
    if (businessData) {
      setWebsite(businessData.website || '');
      setPromo(businessData.promo_video || '');
      setSelectedFrontImage(businessData.business_card_front || null);
      setSelectedBackImage(businessData.business_card_back || null);
      setSelectedLogoImage(businessData.logo || null);
    }
  }, [businessData]);

  // Also handle initialData from props (when navigating between steps)
  useEffect(() => {
    if (props.initialData) {
      console.log('Upload component - initialData:', props.initialData);
      setWebsite(props.initialData.website || '');
      setPromo(props.initialData.promo_video || '');
      
      // Handle image data (could be base64 string or object)
      if (props.initialData.business_card_front) {
        setSelectedFrontImage(
          typeof props.initialData.business_card_front === 'string' 
            ? { base64: props.initialData.business_card_front }
            : props.initialData.business_card_front
        );
      }
      
      if (props.initialData.business_card_back) {
        setSelectedBackImage(
          typeof props.initialData.business_card_back === 'string' 
            ? { base64: props.initialData.business_card_back }
            : props.initialData.business_card_back
        );
      }
      
      if (props.initialData.logo) {
        setSelectedLogoImage(
          typeof props.initialData.logo === 'string' 
            ? { base64: props.initialData.logo }
            : props.initialData.logo
        );
      }
    }
  }, [props.initialData]);

  const openBottomSheet = useCallback(type => {
    console.log('Opening bottom sheet for type:', type);
    setCurrentImageType(type);
    bottomSheetModalRef.current?.present();
  }, []);

  const closeBottomSheet = useCallback(() => {
    console.log('Closing bottom sheet');
    bottomSheetModalRef.current?.dismiss();
  }, []);

  // Fixed image selection handler
  const handleImageSelected = async (type, image) => {
    console.log('Image selection started for type:', type, 'Image:', image);
    
    if (!image?.path) {
      console.log('No image path provided');
      return;
    }

    try {
      // First dismiss the bottom sheet immediately
      bottomSheetModalRef.current?.dismiss();
      
      // Add a small delay before processing the image to prevent navigation conflicts
      setTimeout(async () => {
        try {
          console.log('Processing image file:', image.path);
          const base64Data = await RNFS.readFile(image.path, 'base64');
          const imageData = {
            ...image,
            base64: base64Data,
          };

          console.log('Image processed successfully, setting state for type:', type);

          switch (type) {
            case 'front':
              setSelectedFrontImage(imageData);
              break;
            case 'back':
              setSelectedBackImage(imageData);
              break;
            case 'logo':
              setSelectedLogoImage(imageData);
              break;
            default:
              console.warn('Unknown image type:', type);
          }
          
          console.log(`${type} image selected and processed successfully`);
        } catch (err) {
          console.error('Error reading image file:', err);
        }
      }, 300); // 300ms delay to allow bottom sheet to close properly
      
    } catch (err) {
      console.error('Error in handleImageSelected:', err);
    }
  };

  const handleSheetChanges = useCallback(index => {
    console.log('Bottom Sheet state changed to index:', index);
  }, []);

  // Imperative handle for parent component
  useImperativeHandle(ref, () => ({
    validate: () => {
      console.log('Validating Upload form');
      let isValid = true;
      
      // Add validation logic here if needed
      // For now, we'll just validate that required fields aren't empty
      // Uncomment and modify as needed:
      
      // if (!website.trim()) {
      //   setWebsiteError('Website is required');
      //   isValid = false;
      // } else {
      //   setWebsiteError('');
      // }

      if (isValid) {
        const formData = {
          website,
          promo,
          frontImage: selectedFrontImage,
          backImage: selectedBackImage,
          logoImage: selectedLogoImage,
        };
        console.log('Upload form validation passed, dispatching data:', formData);

        dispatch(
          updateBusinessUploadData({
            website,
            promo_video: promo,
            business_card_front: selectedFrontImage?.base64 || '',
            business_card_back: selectedBackImage?.base64 || '',
            logo: selectedLogoImage?.base64 || '',
          }),
        );
      }
      
      return isValid;
    },

    getData: () => {
      const data = {
        website,
        promo_video: promo,
        business_card_front: selectedFrontImage,
        business_card_back: selectedBackImage,
        logo: selectedLogoImage,
      };
      console.log('Getting Upload form data:', data);
      return data;
    },
  }));

  // Helper function to render image preview
  const renderImagePreview = (image, altText) => {
    if (!image) return null;
    
    const imageUri = image.base64 
      ? `data:image/jpeg;base64,${image.base64}`
      : image.uri || image;
      
    return (
      <Image
        source={{uri: imageUri}}
        style={styles.image}
        resizeMode="cover"
      />
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.inner}>
                <InputBox
                  label="Website"
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="Enter Website URL"
                  keyboardType="url"
                  error={websiteError}
                />
                
                <InputBox
                  label="Business Promo Video"
                  value={promo}
                  onChangeText={setPromo}
                  placeholder="Enter Business Promo Video URL"
                  keyboardType="url"
                  error={promoError}
                />

                {/* Business Card Front */}
                <View style={styles.imageSection}>
                  <LargeButton
                    title="Upload Business Card Front"
                    onPress={() => openBottomSheet('front')}
                  />
                  {renderImagePreview(selectedFrontImage, 'Business Card Front')}
                </View>

                {/* Business Card Back */}
                <View style={styles.imageSection}>
                  <LargeButton
                    title="Upload Business Card Back"
                    onPress={() => openBottomSheet('back')}
                  />
                  {renderImagePreview(selectedBackImage, 'Business Card Back')}
                </View>

                {/* Business Logo */}
                <View style={styles.imageSection}>
                  <LargeButton
                    title="Upload Business Logo"
                    onPress={() => openBottomSheet('logo')}
                  />
                  {renderImagePreview(selectedLogoImage, 'Business Logo')}
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>

          {/* Bottom Sheet Modal */}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            enableOverDrag={false}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
            backgroundStyle={{
              borderRadius: 16,
              backgroundColor: colors.secondary,
            }}>
            <BottomSheetView style={styles.contentContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Upload Image</Text>
                <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
              <ImageCropper
                navigation={navigation}
                type={currentImageType}
                onImageSelected={handleImageSelected}
                onClose={closeBottomSheet}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </KeyboardAvoidingView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
});

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  inner: {
    padding: 8,
    flexGrow: 1,
    gap: 10,
    paddingBottom: height * 0.1,
  },
  imageSection: {
    marginVertical: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text || '#000',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  contentContainer: {
    padding: 16,
    marginBottom: height * 0.01,
  },
  image: {
    marginTop: 15,
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});