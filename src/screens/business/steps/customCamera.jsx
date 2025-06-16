import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, AppState, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
} from 'react-native-vision-camera';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {capture} from 'react-native-view-shot'; // optional for snapshot, otherwise use frame processor
import {TabBarStyle} from '../../../theme/tabBar';
import { colors } from '../../../theme/colors';
import BackArrow from '../../../../assets/backArrow.svg'

const CustomCamera = () => {
  const camera = useRef(null);
  const navigation = useNavigation();
  const {hasPermission, requestPermission} = useCameraPermission();
  const devices = useCameraDevices();
  const [cameraDevice, setCameraDevice] = useState(null);
  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState === 'active',
  );
  const {onCapture} = useRoute().params || {};

  useFocusEffect(
    useCallback(() => {
      // Hide tab bar
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });

      return () => {
        // Show tab bar again when navigating back
        navigation.getParent()?.setOptions({
          tabBarStyle: TabBarStyle,
        });
      };
    }, [navigation])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('App State Changed:', nextAppState);
      setIsAppActive(nextAppState === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const setup = async () => {
      console.log('Running setup effect...');
      const initialPermission = hasPermission;
      console.log('Initial permission state:', initialPermission);

      if (!initialPermission) {
        console.log('Requesting camera permission...');
        const permissionGranted = await requestPermission();
        console.log('Permission request result:', permissionGranted);
        if (!permissionGranted) {
          console.error('Permission denied!');
          // Keep hasPermission state updated (hook should do this, but log helps)
          return;
        }
        // Note: The component might re-render after permission change,
        // so this effect might run again with hasPermission = true.
      }

      // Only proceed to select device if permission is granted (check the hook's state)
      if (hasPermission) {
        console.log('Permission is granted. Looking for devices...');
        console.log('Available devices:', devices);
        console.log(
          'Exact devices structure:',
          JSON.stringify(devices, null, 2),
        );

        let selectedDevice = null;

        if (Array.isArray(devices)) {
          console.log('Devices is an Array. Searching by position...');
          // Find the back camera first
          selectedDevice = devices.find(d => d.position === 'back');
          if (!selectedDevice) {
            console.log(
              'No back camera found in array, searching for front...',
            );
            // Fallback to front camera if no back camera
            selectedDevice = devices.find(d => d.position === 'front');
          }
          if (!selectedDevice && devices.length > 0) {
            console.log('No back/front found, using first device in array...');
            // Fallback to the first device if positions aren't found/matched
            selectedDevice = devices[0];
          }
        } else if (typeof devices === 'object' && devices !== null) {
          console.log('Devices is an Object. Searching by property key...');
          // Original logic for object structure (fallback)
          if (devices.back != null) {
            selectedDevice = devices.back;
          } else if (devices.external != null) {
            selectedDevice = devices.external;
          } else if (devices.front != null) {
            selectedDevice = devices.front;
          }
        }

        // Now check if we found a device and set it
        if (selectedDevice) {
          console.log(
            `Found suitable device: ID ${selectedDevice.id}, Position: ${selectedDevice.position}`,
          );
          setCameraDevice(selectedDevice);
        } else {
          console.error(
            'No suitable camera device could be selected from the available list!',
          );
        }
      } else {
        console.log('Setup aborted: Permission not granted yet or denied.');
      }
    };

    // Only run setup if permission is known OR if no device is selected yet
    // Avoid running if devices list itself is not ready
    if (devices != null && cameraDevice == null) {
      setup();
    } else if (devices == null) {
      console.log('Devices list not available yet.');
    } else if (cameraDevice != null) {
      console.log('Camera device already selected.');
    }
  }, [devices, requestPermission, hasPermission, cameraDevice]);

  // --- Render Logic ---
  if (!isAppActive) {
    // Don't render camera if app is in background
    return (
      <View style={styles.container}>
        <Text style={styles.text}>App is not active</Text>
      </View>
    );
  }

  if (hasPermission === undefined || hasPermission === null) {
    // Still waiting for permission status
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Checking permissions...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission denied.</Text>
        <Text style={styles.text}>
          Please grant permission in app settings.
        </Text>
        {/* TODO You might want a button here to trigger requestPermission again or open settings */}
      </View>
    );
  }

  // If permission granted, but still finding device
  if (!cameraDevice) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading camera device...</Text>
        <Text style={styles.text}>Ensure camera permissions are enabled.</Text>
      </View>
    );
  }

  // If we have permission and a device
  console.log(
    `Rendering Camera component with device: ${cameraDevice.id}, isActive: ${isAppActive}`,
  );

  const takePicture = async () => {
    if (camera.current == null) return;

    const photo = await camera.current.takePhoto({
      flash: 'off',
    });

    const imagePath = 'file://' + photo.path;

    if (onCapture) {
      onCapture(imagePath); // Send back to crop
    }

    navigation.goBack();
  };

  if (!cameraDevice) return <View />;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={cameraDevice}
        isActive={true}
        photo={true}
      />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow width={30} height={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Camera</Text>
      </View>

      <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
        <Text style={styles.captureText}>📸</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  captureBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 40,
  },
  captureText: {
    fontSize: 24,
  },
    topBar: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      zIndex: 10,
    },
    title: {
      paddingLeft: 20,
      color: colors.background,
      fontSize: 20,
      fontWeight: '600',
    },
});
