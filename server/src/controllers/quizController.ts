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
    category: 'bee',
    difficulty: 'medium',
    question: 'The RMS value of a sinusoidal alternating current with peak value I_max is:',
    correctAnswer: 'I_max / √2 (approximately 0.707 × I_max)',
    incorrectAnswers: ['I_max / 2', '2 × I_max', 'I_max × √2'],
    explanation: 'For a sinusoidal current, the RMS value is the peak value divided by √2.',
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
    category: 'cs',
    difficulty: 'medium',
    question: 'What is the time complexity of binary search on a sorted array?',
    correctAnswer: 'O(log n)',
    incorrectAnswers: ['O(1)', 'O(n)', 'O(n²)'],
    explanation: 'Binary search halves the remaining search range after each comparison.',
    source: 'curated',
  },
  {
    category: 'cs',
    difficulty: 'medium',
    question: 'Which tree traversal visits the left subtree, the node, then the right subtree?',
    correctAnswer: 'In-order traversal',
    incorrectAnswers: ['Pre-order traversal', 'Post-order traversal', 'Level-order traversal'],
    explanation: 'In-order traversal visits left, root, then right; in a binary search tree it visits values in sorted order.',
    source: 'curated',
  },
  {
    category: 'cs',
    difficulty: 'medium',
    question: 'Which SQL command is used to retrieve rows from a table?',
    correctAnswer: 'SELECT',
    incorrectAnswers: ['UPDATE', 'INSERT', 'DROP'],
    explanation: 'SELECT reads data from one or more database tables.',
    source: 'curated',
  },
  {
    category: 'cs',
    difficulty: 'medium',
    question: 'What is the main role of an operating system kernel?',
    correctAnswer: 'Manage hardware resources and provide core services',
    incorrectAnswers: ['Compile every application', 'Design web pages', 'Store only user passwords'],
    explanation: 'The kernel manages system resources such as memory, processes, and hardware devices.',
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
  {
    category: 'web',
    difficulty: 'medium',
    question: 'Which HTML element is intended for a page’s main navigation links?',
    correctAnswer: '<nav>',
    incorrectAnswers: ['<aside>', '<footer>', '<figure>'],
    explanation: 'The nav element represents a section containing navigation links.',
    source: 'curated',
  },
  {
    category: 'web',
    difficulty: 'medium',
    question: 'In Flexbox, which property aligns items along the main axis?',
    correctAnswer: 'justify-content',
    incorrectAnswers: ['align-items', 'flex-wrap', 'align-content'],
    explanation: 'justify-content distributes items along the flex container’s main axis.',
    source: 'curated',
  },
  {
    category: 'web',
    difficulty: 'medium',
    question: 'Which JavaScript operator compares both value and type without coercion?',
    correctAnswer: '===',
    incorrectAnswers: ['==', '=', '!=='],
    explanation: 'The strict equality operator (===) checks both value and type.',
    source: 'curated',
  },
  {
    category: 'web',
    difficulty: 'medium',
    question: 'Which HTTP request header indicates the media type of the request body?',
    correctAnswer: 'Content-Type',
    incorrectAnswers: ['Accept-Language', 'Cache-Control', 'User-Agent'],
    explanation: 'Content-Type tells the server how to interpret the request body.',
    source: 'curated',
  },
  {
    category: 'general',
    difficulty: 'medium',
    question: 'Which planet is commonly known as the Red Planet?',
    correctAnswer: 'Mars',
    incorrectAnswers: ['Venus', 'Jupiter', 'Mercury'],
    explanation: 'Iron minerals in the Martian soil give Mars its reddish appearance.',
    source: 'curated',
  },
  {
    category: 'general',
    difficulty: 'medium',
    question: 'What is the chemical formula for water?',
    correctAnswer: 'H₂O',
    incorrectAnswers: ['CO₂', 'O₂', 'NaCl'],
    explanation: 'A water molecule contains two hydrogen atoms and one oxygen atom.',
    source: 'curated',
  },
  {
    category: 'general',
    difficulty: 'medium',
    question: 'What is the largest ocean on Earth?',
    correctAnswer: 'Pacific Ocean',
    incorrectAnswers: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
    explanation: 'The Pacific Ocean is the largest and deepest of Earth’s ocean basins.',
    source: 'curated',
  },
  {
    category: 'general',
    difficulty: 'medium',
    question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
    correctAnswer: 'Carbon dioxide',
    incorrectAnswers: ['Oxygen', 'Nitrogen', 'Hydrogen'],
    explanation: 'Plants use carbon dioxide, water, and light to produce sugars during photosynthesis.',
    source: 'curated',
  },
  {
    category: 'general',
    difficulty: 'medium',
    question: 'What is the SI unit of force?',
    correctAnswer: 'Newton',
    incorrectAnswers: ['Joule', 'Pascal', 'Watt'],
    explanation: 'One newton is the force required to accelerate one kilogram at one metre per second squared.',
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
      const filtered = seedQuestions.filter((q) => q.category === category);
      const matchingDifficulty = filtered.filter((q) => q.difficulty === difficulty);
      const fallbackList =
        matchingDifficulty.length >= Math.min(count, filtered.length)
          ? matchingDifficulty
          : filtered.length > 0
            ? filtered
            : seedQuestions;

      const result = fallbackList.slice(0, Math.max(0, count)).map((item, i) => ({
        id: `q-${i + 1}`,
        category: item.category,
        difficulty: item.difficulty,
        question: item.question,
        correctAnswer: item.correctAnswer,
        incorrectAnswers: item.incorrectAnswers,
        explanation: item.explanation,
        source: item.source,
      }));

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
