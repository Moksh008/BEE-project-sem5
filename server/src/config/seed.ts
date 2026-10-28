import mongoose from 'mongoose';
import { Question } from '../models/Question.js';
import { seedQuestions } from '../data/questionBank.js';

/** Question fields accepted by the persistence helpers. */
interface QuestionInput {
  question: string;
  correctAnswer: string;
  incorrectAnswers?: string[];
  explanation?: string;
}

/** Shapes the difficulty value so it always satisfies the schema enum. */
function safeDifficulty(difficulty?: string): 'easy' | 'medium' | 'hard' {
  const value = String(difficulty || '').toLowerCase();
  return value === 'easy' || value === 'hard' ? value : 'medium';
}

/**
 * Startup Seeder: upserts the curated question bank into MongoDB.
 * Concept: Idempotent upsert (`$setOnInsert`) so restarting the server
 * never creates duplicate question documents.
 *
 * @route called once from server.ts after a successful DB connection
 */
export async function seedQuestionBank(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️  Question bank not seeded: MongoDB is not connected.');
    return;
  }

  try {
    let inserted = 0;

    for (const item of seedQuestions) {
      const result = await Question.updateOne(
        { question: item.question },
        { $setOnInsert: { ...item, difficulty: safeDifficulty(item.difficulty) } },
        { upsert: true }
      );
      if (result.upsertedCount) inserted += 1;
    }

    const total = await Question.countDocuments();
    console.log(`📚 Question bank seeded: ${inserted} new document(s), ${total} total in MongoDB.`);
  } catch (error) {
    console.warn('⚠️  Question bank seeding failed:', (error as Error).message);
  }
}

/**
 * Persists generated quiz questions (AI / fallback generator) into MongoDB.
 * Concept: Bulk upsert keyed on the question text (fire-and-forget safe).
 *
 * @returns Promise resolving when the write completes (never rejects).
 */
export async function saveGeneratedQuestions(
  questions: QuestionInput[],
  category: string,
  difficulty: string,
  source: 'ai' | 'curated' | 'opentdb' = 'ai'
): Promise<void> {
  if (mongoose.connection.readyState !== 1 || !Array.isArray(questions) || questions.length === 0) {
    return;
  }

  try {
    const docs = questions
      .filter((q) => q && typeof q.question === 'string' && q.question.trim().length > 0)
      .map((q) => ({
        category: String(category || 'general').toLowerCase().slice(0, 60),
        difficulty: safeDifficulty(difficulty),
        question: q.question.trim(),
        correctAnswer: q.correctAnswer,
        incorrectAnswers: Array.isArray(q.incorrectAnswers) ? q.incorrectAnswers : [],
        explanation: q.explanation,
        source,
      }));

    if (docs.length === 0) return;

    await Question.bulkWrite(
      docs.map((doc) => ({
        updateOne: {
          filter: { question: doc.question },
          update: { $setOnInsert: doc },
          upsert: true,
        },
      }))
    );
    console.log(`💾 Saved ${docs.length} generated question(s) to MongoDB.`);
  } catch (error) {
    console.warn('⚠️  Could not save generated questions:', (error as Error).message);
  }
}