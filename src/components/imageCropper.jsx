import React, {useState} from 'react';
import {View, Button, Image, StyleSheet, Alert, Dimensions} from 'react-native';
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
          const cropped = await ImagePicker.openCropper({
            path: capturedImagePath,
            width: 300,
            height: 300,
            cropping: true,
          });
          onImageSelected?.(type, cropped);
        } catch (error) {
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
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
