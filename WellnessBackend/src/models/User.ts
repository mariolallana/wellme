import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  profile: {
    age: number;
    gender: 'male' | 'female';
    weight: number;
    height: number;
    goal: 'lose' | 'maintain' | 'gain';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
    onboardingCompleted: boolean;
  };
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profile: {
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female'] },
    weight: { type: Number },
    height: { type: Number },
    goal: { type: String, enum: ['lose', 'maintain', 'gain'] },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active'] },
    onboardingCompleted: { type: Boolean, default: false }
  }
});

export default mongoose.model<IUser>('User', UserSchema);