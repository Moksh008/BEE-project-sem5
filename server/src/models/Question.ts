import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  explanation?: string;
  source: 'curated' | 'ai' | 'opentdb';
  createdAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    category: { type: String, required: true, index: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    incorrectAnswers: [{ type: String, required: true }],
    explanation: { type: String },
    source: { type: String, enum: ['curated', 'ai', 'opentdb'], default: 'curated' },
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
