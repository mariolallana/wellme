import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const OptionsModal: React.FC<Props> = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleNutritionPreferences = () => {
    onClose();
    navigation.navigate('NutritionPreferences');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleNutritionPreferences}
          >
            <Ionicons name="nutrition-outline" size={24} color="#4CAF50" />
            <Text style={styles.optionText}>Nutrition Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => {
              // Add configuration screen navigation here
              onClose();
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#4CAF50" />
            <Text style={styles.optionText}>Configuration</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF5252" />
            <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FFF3F3',
  },
  logoutText: {
    color: '#FF5252',
  },
});

export default OptionsModal;