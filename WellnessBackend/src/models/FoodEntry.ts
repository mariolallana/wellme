import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodEntry extends Document {
  userId: string;
  name: string;
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  time: Date;
  createdAt: Date;
}

const FoodEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
  proteins: { type: Number, required: true },
  fats: { type: Number, required: true },
  time: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFoodEntry>('FoodEntry', FoodEntrySchema);