import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  profile: {
    age: number;
    gender: 'male' | 'female';
    weight: number;
    height: number;
    goal: 'lose' | 'maintain' | 'gain';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
    onboardingCompleted: boolean;
  };
  nutritionalGoals: {
    dailyCalories: number;
    macronutrientRatios: {
      protein: number;
      carbs: number;
      fats: number;
    };
  };
  dietaryPreferences: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    lowCholesterol: boolean;
    diabetesFriendly: boolean;
  };
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  profile: {
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female'] },
    weight: { type: Number },
    height: { type: Number },
    goal: { type: String, enum: ['lose', 'maintain', 'gain'] },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active'] },
    onboardingCompleted: { type: Boolean, default: false }
  },
  nutritionalGoals: {
    dailyCalories: { type: Number, default: 2000 },
    macronutrientRatios: {
      protein: { type: Number, default: 0.3 },
      carbs: { type: Number, default: 0.4 },
      fats: { type: Number, default: 0.3 }
    }
  },
  dietaryPreferences: {
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    lowCholesterol: { type: Boolean, default: false },
    diabetesFriendly: { type: Boolean, default: false }
  }
});

export default mongoose.model<IUser>('User', UserSchema);