/**
 * Curated Question Bank (single source of truth).
 * Used by:
 * - quizController (in-memory fallback when MongoDB is empty / unreachable)
 * - config/seed.ts   (upsert into the MongoDB `questions` collection on server start)
 */
export interface SeedQuestionItem {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  explanation: string;
  source: 'curated' | 'ai' | 'opentdb';
}

/** Curated question dataset for BEE (Basic Electrical Engineering) and CS domain fallback */
export const seedQuestions: SeedQuestionItem[] = [
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
