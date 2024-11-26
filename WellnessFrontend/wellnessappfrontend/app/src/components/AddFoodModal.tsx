import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FoodEntry } from '../services/api/apiTypes';
import { NutrientInferenceService } from '../services/api/nutrientInference.service';
import { useAuth } from '../context/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (foodData: Partial<FoodEntry>) => void;
}

const AddFoodModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const { getToken } = useAuth();
  const [foodName, setFoodName] = useState('');
  const [foodData, setFoodData] = useState<Partial<FoodEntry>>({
    name: '',
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
    time: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  const inferNutrients = async (name: string) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) throw new Error('No token available');

      const response = await NutrientInferenceService.inferNutrients(name, false, token);
      if (response.success && response.data) {
        setFoodData({
          ...response.data,
          name,
          time: new Date().toISOString(),
        });
        setIsManualMode(false);
      } else {
        throw new Error(response.error || 'Failed to infer nutrients');
      }
    } catch (error) {
      console.error('Error inferring nutrients:', error);
      setIsManualMode(true);
      setFoodData({
        ...foodData,
        name,
      });
      Alert.alert('Error', 'Could not infer nutrients. Please enter them manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = async () => {
    if (foodName.trim()) {
      await inferNutrients(foodName.trim());
    }
  };

  const handleSubmit = () => {
    if (!foodData.name || !foodData.calories) {
      alert('Please fill in at least the name and calories');
      return;
    }
    onSubmit(foodData);
    resetForm();
  };

  const resetForm = () => {
    setFoodName('');
    setFoodData({
      name: '',
      calories: 0,
      proteins: 0,
      carbohydrates: 0,
      fats: 0,
      time: new Date().toISOString(),
    });
    setIsManualMode(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Food</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Food Name</Text>
              <View style={additionalStyles.searchContainer}>
                <TextInput
                  style={additionalStyles.searchInput}
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholder="Enter food name"
                  onSubmitEditing={handleNameSubmit}
                />
                <TouchableOpacity
                  style={additionalStyles.searchButton}
                  onPress={handleNameSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={additionalStyles.searchButtonText}>Search</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {(isManualMode || foodData.calories > 0) && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Calories</Text>
                  <TextInput
                    style={styles.input}
                    value={foodData.calories?.toString()}
                    onChangeText={(text) => 
                      setFoodData({ ...foodData, calories: parseInt(text) || 0 })
                    }
                    keyboardType="numeric"
                    placeholder="Enter calories"
                    editable={isManualMode}
                  />
                </View>

                <View style={styles.macroContainer}>
                  <View style={styles.macroInput}>
                    <Text style={styles.label}>Protein (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={foodData.proteins?.toString()}
                      onChangeText={(text) =>
                        setFoodData({ ...foodData, proteins: parseInt(text) || 0 })
                      }
                      keyboardType="numeric"
                      placeholder="0"
                      editable={isManualMode}
                    />
                  </View>

                  <View style={styles.macroInput}>
                    <Text style={styles.label}>Carbs (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={foodData.carbohydrates?.toString()}
                      onChangeText={(text) =>
                        setFoodData({ ...foodData, carbohydrates: parseInt(text) || 0 })
                      }
                      keyboardType="numeric"
                      placeholder="0"
                      editable={isManualMode}
                    />
                  </View>

                  <View style={styles.macroInput}>
                    <Text style={styles.label}>Fat (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={foodData.fats?.toString()}
                      onChangeText={(text) =>
                        setFoodData({ ...foodData, fats: parseInt(text) || 0 })
                      }
                      keyboardType="numeric"
                      placeholder="0"
                      editable={isManualMode}
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  resetForm();
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              {(isManualMode || foodData.calories > 0) && (
                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={[styles.buttonText, styles.submitButtonText]}>
                    Add Food
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButtonText: {
    color: '#fff',
  },
});

const additionalStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddFoodModal;