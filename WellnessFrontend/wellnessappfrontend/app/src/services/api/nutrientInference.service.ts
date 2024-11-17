import { api } from './config';
import { NutrientInferenceResponse } from './apiTypes';

export class NutrientInferenceService {
  static async inferNutrients(input: string, isImage: boolean = false): Promise<NutrientInferenceResponse> {
    try {
      const payload = isImage ? { image: input } : { description: input };
      const response = await api.post('/nutrient-inference', payload);
      return response.data;
    } catch (error) {
      console.error('Nutrient inference error:', error);
      throw error;
    }
  }
}