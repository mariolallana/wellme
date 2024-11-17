import { HfInference } from '@huggingface/inference';

export interface NutrientInferenceResult {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  confidence: number;
  foodLabel?: string;
}

export class NutrientInferenceService {
  private hf: HfInference;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async inferNutrients(input: string, isImage: boolean = false): Promise<NutrientInferenceResult> {
    try {
      let foodLabel = '';

      if (isImage) {
        const base64Data = input.replace(/^data:image\/\w+;base64,/, '');
        // Using the new ViT model for better image classification
        const classifierResponse = await this.hf.imageClassification({
          model: 'google/vit-base-patch16-224',
          data: Buffer.from(base64Data, 'base64')
        });
        
        // Get the top prediction with highest confidence
        const topPrediction = classifierResponse[0];
        foodLabel = topPrediction?.label || 'Unknown food';
        console.log('Image classification result:', {
          label: foodLabel,
          confidence: topPrediction?.score
        });
      } else {
        foodLabel = input;
      }

      // Enhanced prompt for better nutritional information
      const prompt = `<|system|>You are a precise nutrition database expert. You must respond with only numbers, no text. Your values should be realistic for standard serving sizes (100g). Never skip any value. If unsure, estimate based on similar foods. Always maintain consistent units: calories in kcal, others in grams.

      <|user|>Here are two examples of correct responses:
      Food: Apple
      Response: 52,14,0.3,0.2

      Food: Chicken breast
      Response: 165,0,31,3.6

      Now, provide numbers for calories,carbs(g),proteins(g),fats(g) for this food:
      ${foodLabel}
      Must follow format exactly: number,number,number,number

      <|assistant|>`;

      const response = await this.hf.textGeneration({
        model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.1, // Lower temperature for more focused responses
          top_p: 0.9
        }
      });

      const generatedText = response.generated_text;
      console.log('Generated nutrition text:', generatedText);

      // Enhanced number parsing
      const numbers = this.extractNutrients(generatedText);

      return {
        calories: this.clampValue(numbers.calories, 0, 1000),
        carbohydrates: this.clampValue(numbers.carbs, 0, 100),
        proteins: this.clampValue(numbers.proteins, 0, 100),
        fats: this.clampValue(numbers.fats, 0, 100),
        confidence: numbers.confidence,
        foodLabel: foodLabel
      };
    } catch (error) {
      console.error('Inference error:', error);
      throw error;
    }
  }

  private extractNutrients(text: string): { 
    calories: number; 
    carbs: number; 
    proteins: number; 
    fats: number;
    confidence: number;
  } {
    // Extract numbers separated by commas
    const values = text.match(/\d+(?:\.\d+)?(?:,\d+(?:\.\d+)?){3}/)?.[0]?.split(',').map(Number) || [];
    
    return {
      calories: values[0] || 0,
      carbs: values[1] || 0,
      proteins: values[2] || 0,
      fats: values[3] || 0,
      confidence: 0.8
    };
  }

  private clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}