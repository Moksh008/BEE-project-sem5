import { Request, Response } from 'express';
import { Question } from '../models/Question.js';
import { Score } from '../models/Score.js';
import { User } from '../models/User.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

interface SeedQuestionItem {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  explanation: string;
  source: 'curated' | 'ai' | 'opentdb';
}

const seedQuestions: SeedQuestionItem[] = [
  {
    category: 'bee',
    difficulty: 'medium',
    question: 'According to Kirchhoff\'s Current Law (KCL), the algebraic sum of currents entering a node is equal to:',
    correctAnswer: 'Zero',
    incorrectAnswers: ['Infinity', 'Sum of Voltages', 'Resistance times Current'],
    explanation: 'KCL states that charge is conserved, so total current entering a junction equals total current leaving (algebraic sum = 0).',
    source: 'curated',
  },
  {
    category: 'bee',
    difficulty: 'easy',
    question: 'What is the unit of Electrical Resistance?',
    correctAnswer: 'Ohm (Ω)',
    incorrectAnswers: ['Volt (V)', 'Ampere (A)', 'Watt (W)'],
    explanation: 'Resistance is measured in Ohms (Ω), named after Georg Simon Ohm.',
    source: 'curated',
  },
  {
    category: 'bee',
    difficulty: 'medium',
    question: 'In an ideal transformer, which property remains constant between primary and secondary windings?',
    correctAnswer: 'Power (Apparent Power kVA)',
    incorrectAnswers: ['Current', 'Voltage', 'Turn count'],
    explanation: 'An ideal transformer is 100% efficient, preserving real and apparent power (V1 * I1 = V2 * I2).',
    source: 'curated',
  },
  {
    category: 'bee',
    difficulty: 'hard',
    question: 'What is the phase angle difference between voltage and current in a purely capacitive AC circuit?',
    correctAnswer: 'Current leads Voltage by 90°',
    incorrectAnswers: ['Current lags Voltage by 90°', 'In phase (0°)', '180° out of phase'],
    explanation: 'In a purely capacitive circuit, current leads voltage by 90 degrees (ICE: In Capacitance, E lags I).',
    source: 'curated',
  },
  {
    category: 'cs',
    difficulty: 'easy',
    question: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
    correctAnswer: 'Stack',
    incorrectAnswers: ['Queue', 'Linked List', 'Binary Tree'],
    explanation: 'A Stack pushes and pops elements from the top, adhering to LIFO order.',
    source: 'curated',
  },
  {
    category: 'web',
    difficulty: 'medium',
    question: 'Which HTTP status code signifies "200 OK"?',
    correctAnswer: '200',
    incorrectAnswers: ['404', '500', '301'],
    explanation: '200 OK indicates the HTTP request succeeded.',
    source: 'curated',
  },
];

export async function getQuestions(req: Request, res: Response): Promise<void> {
  try {
    const category = ((req.query.category as string) || 'bee').toLowerCase();
    const difficulty = ((req.query.difficulty as string) || 'medium').toLowerCase();
    const count = parseInt((req.query.count as string) || '10', 10);

    let questions: any[] = [];

    try {
      questions = await Question.find({ category, difficulty } as any).limit(count).lean();
    } catch {
      questions = [];
    }

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

    res.json({ source: 'database', questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}

export async function submitQuiz(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { username, category, difficulty, score, totalQuestions, timeSpentSeconds } = req.body;

    const safeUsername = username || req.user?.name || 'Player Scholar';
    const safeScore = Number(score) || 0;
    const safeTotal = Number(totalQuestions) || 10;
    const percentage = Math.round((safeScore / safeTotal) * 100);

    let scoreDoc;
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
