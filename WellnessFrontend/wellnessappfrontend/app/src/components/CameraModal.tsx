import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal, ActivityIndicator, Alert } from 'react-native';
import { NutrientInferenceService } from '../services/api/nutrientInference.service';
import { FoodEntry } from '../services/api/apiTypes';
import { useAuth } from '../context/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (foodData: Partial<FoodEntry>) => void;
}

export default function CameraModal({ visible, onClose, onCapture }: CameraModalProps) {
  const { getToken } = useAuth();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const token = await getToken();
        if (!token) throw new Error('No token available');

        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        
        if (photo && photo.base64) {
          const response = await NutrientInferenceService.inferNutrients(photo.base64, true, token);
          
          if (response.success && response.data) {
            onCapture({
              ...response.data,
              time: new Date().toISOString(),
            });
            onClose();
          } else {
            throw new Error(response.error || 'Failed to process image');
          }
        }
      } catch (error) {
        console.error('Error processing food image:', error);
        Alert.alert(
          'Error',
          'Failed to process food image. Please try again or add food manually.',
          [{ text: 'OK', onPress: onClose }]
        );
      } finally {
        setIsProcessing(false);
      }
    }
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.snapButton]} 
                onPress={takePhoto}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.text}>Snap</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  camera: {
    width: '90%',
    aspectRatio: 3/4,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    padding: 15,
    paddingHorizontal: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});