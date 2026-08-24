import mongoose, { Schema, Document } from 'mongoose';

export interface IScore extends Document {
  userUid?: string;
  username: string;
  category: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  createdAt: Date;
}

const ScoreSchema: Schema = new Schema(
  {
    userUid: { type: String, index: true },
    username: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    timeSpentSeconds: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Score = mongoose.model<IScore>('Score', ScoreSchema);
