import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName: string;
  avatar?: string;
  quizzesTaken: number;
  totalScore: number;
  averagePercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    avatar: { type: String, default: 'Felix' },
    quizzesTaken: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    averagePercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
