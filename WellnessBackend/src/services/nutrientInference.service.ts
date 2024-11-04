import { HfInference } from '@huggingface/inference';

export interface NutrientInferenceResult {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  confidence: number;
}

export class NutrientInferenceService {
  private hf: HfInference;
  private readonly PROMPT_TEMPLATE = `<|system|>You are a precise nutrition database expert. You must respond with only numbers, no text. Your values should be realistic for standard serving sizes (100g). Never skip any value. If unsure, estimate based on similar foods. Always maintain consistent units: calories in kcal, others in grams.

<|user|>Here are two examples of correct responses:
Food: Apple
Response: 52,14,0.3,0.2

Food: Chicken breast
Response: 165,0,31,3.6

Now, provide numbers for calories,carbs(g),proteins(g),fats(g) for this food:
{foodDescription}
Must follow format exactly: number,number,number,number

<|assistant|>`;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async inferNutrients(foodDescription: string): Promise<NutrientInferenceResult> {
    try {
      const prompt = this.PROMPT_TEMPLATE.replace('{foodDescription}', foodDescription);
      
      const response = await this.hf.textGeneration({
        model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
        inputs: prompt,
        parameters: {
          max_new_tokens: 32,
          temperature: 0.1,
          top_p: 0.95,
          return_full_text: false
        }
      });

      // Parse numbers from response
      const numbers = response.generated_text
        .replace(/[^0-9,.-]/g, '')
        .split(',')
        .map(num => parseFloat(num) || 0)
        .filter(num => !isNaN(num));

      // Ensure we have all four values
      while (numbers.length < 4) numbers.push(0);

      // Ensure values are within reasonable ranges
      const result = {
        calories: this.clampValue(numbers[0], 0, 1000),
        carbohydrates: this.clampValue(numbers[1], 0, 100),
        proteins: this.clampValue(numbers[2], 0, 100),
        fats: this.clampValue(numbers[3], 0, 100),
        confidence: 0.8
      };

      // If values seem unreasonable, try fallback
      if (result.calories < 1) {
        const fallback = this.getFallbackNutrients(foodDescription);
        if (fallback) {
          return { ...fallback, confidence: 0.6 };
        }
      }

      return result;

    } catch (error) {
      console.error('Inference error:', error);
      const fallback = this.getFallbackNutrients(foodDescription);
      if (fallback) {
        return { ...fallback, confidence: 0.6 };
      }
      throw error;
    }
  }

  private clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private getFallbackNutrients(description: string): NutrientInferenceResult | null {
    const fallbackDb: { [key: string]: number[] } = {
      'banana': [105, 27, 1.3, 0.4],
      'apple': [95, 25, 0.5, 0.3],
      'egg': [70, 0.6, 6, 5],
      'toast': [75, 13, 3, 1],
      'chicken breast': [165, 0, 31, 3.6],
      'rice': [130, 28, 2.7, 0.3],
      'bread': [79, 14, 3, 1],
      'milk': [103, 12, 8, 2.4],
      'yogurt': [59, 3.6, 10, 0.4],
      'potato': [161, 37, 4.3, 0.2],
      'pasta': [158, 31, 6, 1.3]
    };

    const desc = description.toLowerCase();
    for (const [key, values] of Object.entries(fallbackDb)) {
      if (desc.includes(key)) {
        return {
          calories: values[0],
          carbohydrates: values[1],
          proteins: values[2],
          fats: values[3],
          confidence: 0.6
        };
      }
    }
    return null;
  }
}