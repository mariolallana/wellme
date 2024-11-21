import { HfInference } from '@huggingface/inference';

export interface NutrientInferenceResult {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  confidence: number;
  foodLabel?: string;
}

interface BlipResponse {
  generated_text: string;
}

const prompt = "What food items do you see in this image? Please describe in detail including: type, quantity, size, and whether it's raw or cooked.";
export class NutrientInferenceService {
  private hf: HfInference;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }
  
  private async analyzeImageWithPrompt(base64Data: string, prompt: string): Promise<string> {
    try {
      if (!process.env.HUGGINGFACE_API_KEY) {
        throw new Error('Hugging Face API key is not configured');
      }

      console.log('Attempting API request with model:', 'Salesforce/blip-vqa-base');
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

      // Get detailed food identification with more specific question
      const foodResponse = await this.hf.request({
        model: 'Salesforce/blip-vqa-base',
        inputs: {
          image: cleanBase64,
          question: prompt,
          task: "visual question answering"
        },
        parameters: {
          max_length: 150,
          temperature: 0.7,  // Increased for more descriptive answers
          num_beams: 5,
          do_sample: true,
          top_p: 0.95
        },
        task: 'visual-question-answering'
      });

      // Get state/condition
      const stateResponse = await this.hf.request({
        model: 'Salesforce/blip-vqa-base',
        inputs: {
          image: cleanBase64,
          question: "Is this food raw, cooked, or processed? Describe its preparation state.",
          task: "visual question answering"
        },
        parameters: {
          max_length: 150,
          temperature: 0.5,
          num_beams: 5,
          do_sample: true,
          top_p: 0.95
        },
        task: 'visual-question-answering'
      });

      // Get portion estimation with units
      const portionResponse = await this.hf.request({
        model: 'Salesforce/blip-vqa-base',
        inputs: {
          image: cleanBase64,
          question: "What is the approximate quantity? Answer with a number and unit (grams, pieces, ml).",
          task: "visual question answering"
        },
        parameters: {
          max_length: 150,
          temperature: 0.3,
          num_beams: 5,
          do_sample: true,
          top_p: 0.95
        },
        task: 'visual-question-answering'
      });

      console.log('Food response:', JSON.stringify(foodResponse));
      console.log('State response:', JSON.stringify(stateResponse));
      console.log('Portion response:', JSON.stringify(portionResponse));

      // Extract and clean responses
      const foodAnswer = Array.isArray(foodResponse) && foodResponse[0]?.answer ? foodResponse[0].answer : '';
      const stateAnswer = Array.isArray(stateResponse) && stateResponse[0]?.answer ? stateResponse[0].answer : '';
      let portionAnswer = Array.isArray(portionResponse) && portionResponse[0]?.answer ? portionResponse[0].answer : '';

      // Add default units if missing
      if (portionAnswer && !isNaN(Number(portionAnswer))) {
        // Add appropriate units based on food type
        if (foodAnswer.includes('drink') || foodAnswer.includes('juice') || foodAnswer.includes('soup')) {
          portionAnswer += ' ml';
        } else if (foodAnswer.includes('fruit') || foodAnswer.includes('apple') || foodAnswer.includes('orange')) {
          portionAnswer += ' units';
        } else {
          portionAnswer += ' grams';
        }
      }

      // Combine into a detailed description
      const detailedDescription = [
        foodAnswer,
        stateAnswer,
        portionAnswer && portionAnswer !== 'unknown' ? `approximately ${portionAnswer}` : ''
      ]
        .filter(answer => answer && answer !== 'raw' && answer !== 'cooked')
        .join(', ');

      return detailedDescription || 'Unable to identify food item clearly';
    } catch (error) {
      console.error('Error analyzing image. Details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        apiKey: process.env.HUGGINGFACE_API_KEY ? 'Present' : 'Missing',
        modelName: 'Salesforce/blip-vqa-base'
      });
      throw error;
    }
  }

  private async fallbackImageAnalysis(base64Data: string, prompt: string): Promise<string> {
    const response = await this.hf.request({
      model: 'dandelin/vilt-b32-finetuned-vqa',
      inputs: {
        image: base64Data,
        question: prompt
      },
      task: 'visual-question-answering'
    });

    if (response && typeof response === 'object' && 'answer' in response) {
      return response.answer as string;
    }

    throw new Error('Fallback model failed to process the image');
  }
  

  private async getNutritionalValues(foodDescription: string): Promise<number[]> {
    const nutritionPrompt = `[INST] For the food: "${foodDescription}", analyze its nutritional content per 100g serving.

Output ONLY four numbers in this exact format: X,Y,Z,W where:
X = calories (kcal)
Y = carbohydrates (g)
Z = proteins (g)
W = fats (g)

Important:
- Use average values if uncertain
- Must output exactly 4 numbers
- Use comma separation
- Numbers only, no text

Example output: 52,14,0.3,0.2
[/INST]`;

    const response = await this.hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: nutritionPrompt,
      parameters: {
        max_new_tokens: 100,    // Increased from 30
        min_new_tokens: 5,      // Ensure minimum response length
        temperature: 0.1,       // Keep low for consistent outputs
        top_p: 0.95,
        repetition_penalty: 1.2,
        do_sample: true,
        return_full_text: false // Only get the generated response
      }
    });

    console.log('Raw nutrition response:', response.generated_text);
    return this.extractNumbers(response.generated_text);
  }
  
  private extractNumbers(text: string): number[] {
    console.log('Extracting numbers from response:', text);
  
    // Use regex to find a line with four comma-separated numbers
    const numberMatch = text.match(/\d+(?:\.\d+)?(?:,\s*\d+(?:\.\d+)?){3}/);
  
    if (!numberMatch) {
      console.warn('No valid numeric line found in response.');
      return [0, 0, 0, 0];
    }
  
    // Split and parse the numbers
    const numbers = numberMatch[0].split(',').map(num => parseFloat(num.trim()));
    if (numbers.length === 4) {
      return numbers;
    }
  
    console.warn('Extracted numbers do not match expected count. Returning default values.');
    return [0, 0, 0, 0];
  }
  

  async inferNutrients(input: string, isImage: boolean = false): Promise<NutrientInferenceResult> {
    try {
      let foodDescription: string;
  
      // Handle input source: text or image
      if (isImage) {
        const base64Data = input.replace(/^data:image\/\w+;base64,/, '');
        foodDescription = await this.analyzeImageWithPrompt(base64Data,prompt); // Process the image
        console.log('Image analysis result:', foodDescription);
      } else {
        foodDescription = input;
      }
  
      // Call the nutritional value inference
      const nutritionalValues = await this.getNutritionalValues(foodDescription);
      console.log('Raw nutritional values from model:', nutritionalValues);
  
      const [calories, carbs, proteins, fats] = nutritionalValues;
  
      // Clamp values for safety
      const result: NutrientInferenceResult = {
        calories: this.clampValue(calories, 0, 1000),
        carbohydrates: this.clampValue(carbs, 0, 100),
        proteins: this.clampValue(proteins, 0, 100),
        fats: this.clampValue(fats, 0, 100),
        confidence: 0.8, // Fixed confidence for now
        foodLabel: foodDescription
      };
  
      console.log('Final processed result:', result);
      return result;
    } catch (error) {
      console.error('Error during nutrient inference:', error);
      throw new Error('Unable to infer nutrients from input.');
    }
  }
  
    /**
   * Clamps a numerical value within a specified range.
   * @param value - The value to clamp.
   * @param min - Minimum allowable value.
   * @param max - Maximum allowable value.
   * @returns The clamped value.
   */
    private clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}