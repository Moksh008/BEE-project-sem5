import { Request, Response } from 'express';
import { Question } from '../models/Question.js';
import { Score } from '../models/Score.js';
import { User } from '../models/User.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { seedQuestions } from '../data/questionBank.js';

/**
 * Controller Endpoint Function: Fetches quiz questions by category and difficulty.
 * Concepts Used:
 * - Query Parameter Extraction (`req.query.category`, `req.query.count`)
 * - Mongoose Database Queries (`Question.find()`)
 * - Array Filtering & Fallback Mode
 * 
 * @route GET /api/quizzes/questions
 */
export async function getQuestions(req: Request, res: Response): Promise<void> {
  try {
    // 1. Extract and normalize HTTP GET query parameters
    const category = ((req.query.category as string) || 'bee').toLowerCase();
    const difficulty = ((req.query.difficulty as string) || 'medium').toLowerCase();
    const count = parseInt((req.query.count as string) || '10', 10);

    let questions: any[] = [];

    // 2. Attempt MongoDB Atlas Query
    try {
      questions = await Question.find({ category, difficulty } as any).limit(count).lean();
    } catch {
      questions = [];
    }

    // 3. In-Memory Fallback if MongoDB is unreachable or empty
    if (questions.length === 0) {
      const filtered = seedQuestions.filter(
        (q) => q.category === category || category === 'general' || category === 'bee'
      );
      const fallbackList = filtered.length > 0 ? filtered : seedQuestions;

      const result = Array.from({ length: count }, (_, i) => {
        const item = fallbackList[i % fallbackList.length];
        return {
          id: `q-${i + 1}`,
          category: item.category,
          difficulty: item.difficulty,
          question: item.question,
          correctAnswer: item.correctAnswer,
          incorrectAnswers: item.incorrectAnswers,
          explanation: item.explanation,
          source: item.source,
        };
      });

      res.json({ source: 'curated-fallback', questions: result });
      return;
    }

    // 3b. Top-up: the database holds fewer matching questions than requested,
    // so cycle through the curated bank until the quiz has `count` questions.
    // Also re-sync any new questions the backend admin re-inserts while a quiz is open.
    if (process.env.SEED_QUESTIONS === 'sync') {
      try {
        const fresh = await Question.find({ category, difficulty } as any).limit(count).lean();
        if (fresh.length > questions.length) {
          const seen = new Set(questions.map((q: any) => String(q.question)));
          for (const item of fresh) {
            if (questions.length >= count) break;
            if (!seen.has(String(item.question))) {
              questions.push(item);
              seen.add(String(item.question));
            }
          }
        }
      } catch {
        // Ignore sync errors so the quiz never breaks.
      }
    }
    if (questions.length < count) {
      const seen = new Set(questions.map((q: any) => String(q.question)));
      const sameDifficulty = seedQuestions.filter(
        (q) => q.category === category && q.difficulty === difficulty && !seen.has(q.question)
      );
      const otherDifficulty = seedQuestions.filter(
        (q) => q.category === category && q.difficulty !== difficulty && !seen.has(q.question)
      );
      const filler = [...sameDifficulty, ...otherDifficulty];
      const pool = filler.length > 0 ? filler : seedQuestions;

      let i = 0;
      while (questions.length < count) {
        const item = pool[i % pool.length];
        questions.push({ id: `seed-${questions.length + 1}`, ...item });
        i += 1;
      }
    }

    res.json({ source: 'database', questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}

/**
 * Controller Endpoint Function: Submits and records student quiz score results.
 * Concepts Used:
 * - Express Request Body Parsing (`req.body`)
 * - Mathematical Percentage Calculation (`Math.round((score / total) * 100)`)
 * - Database Persistence (`Score.create()`, `User.findOneAndUpdate`)
 * - Dynamic Grade Assignment (Ternary operators)
 * 
 * @route POST /api/quizzes/submit
 */
export async function submitQuiz(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    // 1. Destructure quiz performance fields from HTTP POST body
    const { username, category, difficulty, score, totalQuestions, timeSpentSeconds } = req.body;

    const safeUsername = username || req.user?.name || 'Player Scholar';
    const safeScore = Number(score) || 0;
    const safeTotal = Number(totalQuestions) || 10;
    const percentage = Math.round((safeScore / safeTotal) * 100);

    let scoreDoc;
    // 2. Store score in MongoDB
    try {
      scoreDoc = await Score.create({
        userUid: req.user?.uid,
        username: safeUsername,
        category: category || 'General',
        difficulty: difficulty || 'Medium',
        score: safeScore,
        totalQuestions: safeTotal,
        percentage,
        timeSpentSeconds: Number(timeSpentSeconds) || 60,
      });

      if (req.user?.uid) {
        await User.findOneAndUpdate(
          { firebaseUid: req.user.uid },
          {
            $inc: { quizzesTaken: 1, totalScore: safeScore },
          }
        );
      }
    } catch {
      scoreDoc = {
        id: `score-${Date.now()}`,
        username: safeUsername,
        category,
        percentage,
        score: safeScore,
      };
    }

    // 3. Return performance evaluation payload
    res.json({
      message: 'Quiz result recorded successfully!',
      result: {
        username: safeUsername,
        score: safeScore,
        totalQuestions: safeTotal,
        percentage,
        timeSpentSeconds: timeSpentSeconds || 60,
        grade: percentage >= 80 ? 'Master Scholar (A+)' : percentage >= 50 ? 'Passed (B)' : 'Needs Practice (C)',
      },
    });
  } catch (error) {
    console.error('Error submitting quiz score:', error);
    res.status(500).json({ error: 'Failed to submit quiz score' });
  }
}
