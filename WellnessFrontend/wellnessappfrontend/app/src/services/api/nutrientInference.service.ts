import { api } from './config';
import { ApiResponse, NutrientInferenceResponse } from './types';

export class NutrientInferenceService {
  static async inferNutrients(foodDescription: string): Promise<ApiResponse<NutrientInferenceResponse>> {
    try {
      const response = await api.post('/nutrient-inference', {
        description: foodDescription
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error inferring nutrients:', error);
      return {
        success: false,
        error: 'Failed to infer nutrients'
      };
    }
  }
}