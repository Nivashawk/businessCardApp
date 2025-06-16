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

const UpdateUpload = forwardRef((props, ref) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.businessData);

  useEffect(() => {
    console.log('businessData', businessData);
    if (businessData) {
      setWebsite(businessData.website || '');
      setPromo(businessData.promo_video || '');
      setSelectedFrontImage(businessData.business_card_front || '');
      setSelectedBackImage(businessData.business_card_back || '');
      setSelectedLogoImage(businessData.logo || '');
    }
  }, [businessData]);

  const [website, setWebsite] = useState('');
  const [promo, setPromo] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [promoError, setPromoError] = useState('');

  const [selectedFrontImage, setSelectedFrontImage] = useState('');
  const [selectedBackImage, setSelectedBackImage] = useState('');
  const [selectedLogoImage, setSelectedLogoImage] = useState('');
  const [currentImageType, setCurrentImageType] = useState(null); // 'front' | 'back' | 'logo'

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const openBottomSheet = useCallback(type => {
    setCurrentImageType(type);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleImageSelected = async (type, image) => {
    console.log('handleImageSelected called with:', { type, image });
    
    if (!image) {
      console.log('No image provided');
      return;
    }
    
    if (!image.path) {
      console.log('Image path missing. Image object:', image);
      return;
    }

    try {
      console.log('Reading file from path:', image.path);
      const base64Data = await RNFS.readFile(image.path, 'base64');
      console.log("base64 string length:", base64Data.length);
      
      // Store only the base64 string directly
      switch (type) {
        case 'front':
          setSelectedFrontImage(base64Data);
          console.log('Front image set');
          break;
        case 'back':
          setSelectedBackImage(base64Data);
          console.log('Back image set');
          break;
        case 'logo':
          setSelectedLogoImage(base64Data);
          console.log('Logo image set');
          break;
      }

      bottomSheetModalRef.current?.dismiss();
    } catch (err) {
      console.error('Error reading image file:', err);
    }
  };

  const handleSheetChanges = useCallback(index => {
    console.log('Bottom Sheet state changed:', index);
  }, []);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;
      if (isValid) {
        const formData = {
          website,
          promo,
          frontImage: selectedFrontImage,
          backImage: selectedBackImage,
          logoImage: selectedLogoImage,
        };
        console.log('Form upload:', formData);

        // Send the base64 strings directly
        dispatch(
          updateBusinessUploadData({
            website,
            promo_video: promo,
            business_card_front: selectedFrontImage?.base64,
            business_card_back: selectedBackImage?.base64,
            logo: selectedLogoImage?.base64,
          }),
        );
      }
      return isValid;
    },
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled">
              <View style={styles.inner}>
                <InputBox
                  label="Website"
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="Enter Website URL"
                  required
                  error={websiteError}
                />
                <InputBox
                  label="Business Promo Video"
                  value={promo}
                  onChangeText={setPromo}
                  placeholder="Enter Business Promo Video URL"
                  required
                  error={promoError}
                />

                <LargeButton
                  title="Upload Business Card Front"
                  onPress={() => openBottomSheet('front')}
                />
                {selectedFrontImage && (
                  <Image
                    source={{uri: `data:image/jpeg;base64,${selectedFrontImage}`}}
                    style={styles.image}
                  />
                )}

                <LargeButton
                  title="Upload Business Card Back"
                  onPress={() => openBottomSheet('back')}
                />
                {selectedBackImage && (
                  <Image
                    source={{uri: `data:image/jpeg;base64,${selectedBackImage}`}}
                    style={styles.image}
                  />
                )}

                <LargeButton
                  title="Upload Business Logo"
                  onPress={() => openBottomSheet('logo')}
                />
                {selectedLogoImage && (
                  <Image
                    source={{uri: `data:image/jpeg;base64,${selectedLogoImage}`}}
                    style={styles.image}
                  />
                )}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundStyle={{
              borderRadius: 16,
              backgroundColor: colors.secondary,
            }}>
            <BottomSheetView style={styles.contentContainer}>
              <Text style={styles.modalTitle}>Upload Image</Text>
              <ImageCropper
                navigation={navigation}
                type={currentImageType}
                onImageSelected={handleImageSelected}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </KeyboardAvoidingView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
});

export default UpdateUpload;

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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  contentContainer: {
    padding: 16,
    marginBottom: height * 0.01,
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
  },
});