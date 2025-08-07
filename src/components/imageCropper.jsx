import React, {useState} from 'react';
import {View, Button, Image, StyleSheet, Alert, Dimensions, StatusBar} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Upload from '../../assets/serviceCard/event.png';
import ServiceCard from './cards/serviceCard';

const {width, height} = Dimensions.get('window');

const ImageCropper = ({navigation, type, onImageSelected}) => {
  const browseFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
    })
      .then(img => {
        onImageSelected?.(type, img);
      })
      .catch(e => {
        if (e.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Image selection failed');
        }
      });
  };

  const captureFromCamera = () => {
    navigation.navigate('CustomCamera', {
      onCapture: async capturedImagePath => {
        try {
          // --- Workaround for Status Bar Overlap (Android) ---
          // Save current status bar state
          const currentBarStyle = StatusBar.isTranslucent() ? 'light-content' : 'dark-content';
          const currentBgColor = StatusBar.isTranslucent() ? 'transparent' : StatusBar.backgroundColor;

          // Temporarily set a specific status bar style to force redraw
          StatusBar.setBarStyle('dark-content', true);
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor('black', true);
          
          const cropped = await ImagePicker.openCropper({
            path: capturedImagePath,
            width: 300,
            height: 300,
            cropping: true,
            freeStyleCropEnabled: true,
            // These properties can sometimes help, but the StatusBar change is more reliable
            // cropperStatusBarColor: 'black', 
            // cropperToolbarColor: 'black', 
            // cropperToolbarWidgetColor: 'white', 
          });

          // Restore previous status bar settings
          StatusBar.setBarStyle(currentBarStyle, true);
          StatusBar.setTranslucent(currentBgColor === 'transparent');
          StatusBar.setBackgroundColor(currentBgColor, true);

          console.log("cropped_images",cropped);
          onImageSelected?.(type, cropped);

        } catch (error) {
          // Restore status bar in case of an error
          StatusBar.setBarStyle('dark-content', true);
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor('black', true);
          Alert.alert('Error', 'Cropping failed');
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <ServiceCard
        title={'Open Gallery'}
        image={Upload}
        onPress={browseFromGallery}
      />
      <ServiceCard
        title={'Open Camera'}
        image={Upload}
        onPress={captureFromCamera}
      />
    </View>
  );
};

export default ImageCropper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    marginBottom: height * 0.1,
    flexDirection: 'row',
    gap:10
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
  },
});