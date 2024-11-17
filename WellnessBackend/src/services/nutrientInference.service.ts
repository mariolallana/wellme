// In WellnessBackend/src/services/nutrientInference.service.ts
import { HfInference } from '@huggingface/inference';

export interface NutrientInferenceResult {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  confidence: number;
  foodLabel?: string; // Added for image analysis
}

export class NutrientInferenceService {
  private hf: HfInference;
  private tinyLlama: any; // Define TinyLlama model

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async inferNutrients(input: string, isImage: boolean = false): Promise<NutrientInferenceResult> {
    try {
      let foodLabel = '';

      if (isImage) {
        const base64Data = input.replace(/^data:image\/\w+;base64,/, '')
        // First classify the food image
        const classifierResponse = await this.hf.imageClassification({
          model: 'nateraw/food',
          data: Buffer.from(base64Data, 'base64')
        });
        
        foodLabel = classifierResponse[0]?.label || 'Unknown food';
      } else {
        foodLabel = input; // Use the description directly if not an image
      }

      // Use TinyLlama to generate nutrient information
      const prompt = `What are the nutritional values of ${foodLabel}?`;
      const response = await this.hf.textGeneration({
        model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
        inputs: prompt,
      });

      const generatedText = response.generated_text;

      // Parse numbers from response
      const numbers = generatedText
        .replace(/[^0-9,.-]/g, '')
        .split(',')
        .map((num: string) => parseFloat(num) || 0)
        .filter((num: number) => !isNaN(num));

      while (numbers.length < 4) numbers.push(0);

      return {
        calories: this.clampValue(numbers[0], 0, 1000),
        carbohydrates: this.clampValue(numbers[1], 0, 100),
        proteins: this.clampValue(numbers[2], 0, 100),
        fats: this.clampValue(numbers[3], 0, 100),
        confidence: 0.8,
        foodLabel: foodLabel
      };
    } catch (error) {
      console.error('Inference error:', error);
      throw error;
    }
  }

  private clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}