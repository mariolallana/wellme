import { api } from './config';
import { NutrientInferenceResponse } from './types';

export class NutrientInferenceService {
  static async inferNutrients(description: string): Promise<NutrientInferenceResponse> {
    try {
      const response = await api.post('/nutrient-inference', { description });
      return response.data;
    } catch (error) {
      console.error('Nutrient inference error:', error);
      throw error;
    }
  }
}