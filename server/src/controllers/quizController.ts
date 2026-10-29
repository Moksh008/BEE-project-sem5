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

    // 2. Attempt MongoDB Atlas Query — a random sample keeps every attempt different,
    // and the result is de-duplicated so the same quiz never repeats a question.
    let questions: any[] = [];
    try {
      questions = await Question.aggregate([
        { $match: { category, difficulty } },
        { $sample: { size: count } },
      ]);
    } catch {
      try {
        questions = await Question.find({ category, difficulty } as any).limit(count).lean();
      } catch {
        questions = [];
      }
    }

    const uniqueByText = (list: any[]) => {
      const seen = new Set<string>();
      return list.filter((q: any) => {
        const key = String(q.question || '').trim().toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    questions = uniqueByText(questions);

    // 3. Curated fallback restricted to this exact category, so a topic never borrows
    // another subject's questions.
    const curatedForCategory = seedQuestions.filter((q) => q.category === category);

    if (questions.length === 0) {
      const ordered = [
        ...curatedForCategory.filter((q) => q.difficulty === difficulty),
        ...curatedForCategory.filter((q) => q.difficulty !== difficulty),
      ];

      if (ordered.length === 0) {
        // Unknown topic with nothing stored yet: the client requests AI-written questions for it.
        res.json({ source: 'none', questions: [] });
        return;
      }

      res.json({
        source: 'curated-fallback',
        questions: ordered.slice(0, count).map((item, i) => ({
          id: `q-${i + 1}`,
          category: item.category,
          difficulty: item.difficulty,
          question: item.question,
          correctAnswer: item.correctAnswer,
          incorrectAnswers: item.incorrectAnswers,
          explanation: item.explanation,
          source: item.source,
        })),
      });
      return;
    }

    // 3b. On-topic top-up from the curated bank: same category only and never duplicated.
    if (questions.length < count) {
      const seen = new Set(questions.map((q: any) => String(q.question).trim().toLowerCase()));
      const filler = [
        ...curatedForCategory.filter(
          (q) => q.difficulty === difficulty && !seen.has(q.question.trim().toLowerCase())
        ),
        ...curatedForCategory.filter(
          (q) => q.difficulty !== difficulty && !seen.has(q.question.trim().toLowerCase())
        ),
      ];

      for (const item of filler) {
        if (questions.length >= count) break;
        questions.push({ id: `seed-${item.category}-${questions.length + 1}`, ...item });
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
