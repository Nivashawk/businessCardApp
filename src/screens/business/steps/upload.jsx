import React, {
  useState,
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

const {width, height} = Dimensions.get('window');

const Upload = forwardRef((props, ref) => {
  const navigation = useNavigation();

  const [website, setWebsite] = useState('');
  const [promo, setPromo] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [promoError, setPromoError] = useState('');

  const [selectedFrontImage, setSelectedFrontImage] = useState(null);
  const [selectedBackImage, setSelectedBackImage] = useState(null);
  const [selectedLogoImage, setSelectedLogoImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null); // 'front' | 'back' | 'logo'

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const openBottomSheet = useCallback((type) => {
    setCurrentImageType(type);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleImageSelected = (type, image) => {
    if (!image) return;

    switch (type) {
      case 'front':
        setSelectedFrontImage(image);
        break;
      case 'back':
        setSelectedBackImage(image);
        break;
      case 'logo':
        setSelectedLogoImage(image);
        break;
    }

    bottomSheetModalRef.current?.dismiss();
  };

  const handleSheetChanges = useCallback((index) => {
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
      }
      return isValid;
    },
    getData: () => ({
      website,
      promo,
      frontImage: selectedFrontImage,
      backImage: selectedBackImage,
      logoImage: selectedLogoImage,
    }),
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
                    source={{ uri: selectedFrontImage.path }}
                    style={styles.image}
                  />
                )}

                <LargeButton
                  title="Upload Business Card Back"
                  onPress={() => openBottomSheet('back')}
                />
                {selectedBackImage && (
                  <Image
                    source={{ uri: selectedBackImage.path }}
                    style={styles.image}
                  />
                )}

                <LargeButton
                  title="Upload Business Logo"
                  onPress={() => openBottomSheet('logo')}
                />
                {selectedLogoImage && (
                  <Image
                    source={{ uri: selectedLogoImage.path }}
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

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
    
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
    gap:10,
    paddingBottom: height*0.1
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
