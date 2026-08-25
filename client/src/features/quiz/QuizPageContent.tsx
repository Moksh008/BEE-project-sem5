import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Timer,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Play,
  BookOpen,
  HelpCircle,
  FileText,
  Brain,
  Award,
  Check,
  ChevronRight,
  Zap,
  BarChart2,
  Upload,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  GlobalStyles,
  ChartPatterns,
  PopCard,
  SketchButton
} from '../../components/ui/PaperPop';

const categoryOptions = [
  { id: 'bee', label: 'Basic Electrical Engineering (BEE)', icon: Zap, color: 'bg-amber-200' },
  { id: 'cs', label: 'Computer Science Core', icon: Brain, color: 'bg-blue-200' },
  { id: 'web', label: 'Web Technologies & Frontend', icon: BookOpen, color: 'bg-pink-200' },
  { id: 'general', label: 'General Knowledge & Science', icon: HelpCircle, color: 'bg-green-200' },
];

const categoryMap: Record<string, number> = {
  general: 9,
  science: 17,
  technology: 30,
  sports: 21,
  history: 23,
  geography: 22,
  entertainment: 11,
};

const leaderboardKey = 'quiz-master-leaderboard';

export interface RawQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  explanation?: string;
}

export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  options: string[];
  explanation?: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  percentage: number;
  category?: string;
  date?: string;
}

function decodeHtml(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function shuffleOptions(options: string[]): string[] {
  return [...options].sort(() => Math.random() - 0.5);
}

function getStoredLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(leaderboardKey);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch (error) {
    return [];
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]): void {
  localStorage.setItem(leaderboardKey, JSON.stringify(entries));
}

const seedBEEQuestions: Question[] = [
  {
    id: 'bee-1',
    text: "According to Kirchhoff's Current Law (KCL), the algebraic sum of currents entering a node is equal to:",
    correctAnswer: 'Zero',
    options: ['Zero', 'Infinity', 'Sum of Voltages', 'Resistance times Current'],
    explanation: 'KCL states that electrical charge is conserved at any junction, so the total current entering equals the total current leaving (algebraic sum = 0).'
  },
  {
    id: 'bee-2',
    text: 'What is the unit of Electrical Resistance?',
    correctAnswer: 'Ohm (Ω)',
    options: ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
    explanation: 'Resistance is measured in Ohms (Ω), named after Georg Simon Ohm.'
  },
  {
    id: 'bee-3',
    text: 'In an ideal transformer, which property remains constant between primary and secondary windings?',
    correctAnswer: 'Power (Apparent Power kVA)',
    options: ['Current', 'Voltage', 'Power (Apparent Power kVA)', 'Turn count'],
    explanation: 'An ideal transformer assumes 100% efficiency, preserving total apparent power (P1 = P2).'
  },
  {
    id: 'bee-4',
    text: 'What is the phase angle difference between voltage and current in a purely capacitive AC circuit?',
    correctAnswer: 'Current leads Voltage by 90°',
    options: ['Current leads Voltage by 90°', 'Current lags Voltage by 90°', 'In phase (0°)', '180° out of phase'],
    explanation: 'In a purely capacitive circuit, current leads voltage by 90 degrees (ICE mnemonic: In Capacitance, E lags I).'
  },
  {
    id: 'bee-5',
    text: 'The RMS value of a sinusoidal alternating current with peak value I_max is:',
    correctAnswer: 'I_max / √2 (approx 0.707 * I_max)',
    options: ['I_max / √2 (approx 0.707 * I_max)', 'I_max / 2', '2 * I_max', 'I_max * √2'],
    explanation: 'For pure sine waves, RMS effective value is Peak Voltage/Current divided by square root of 2.'
  }
];

async function fetchQuestions(category: string, difficulty: string, amount: number): Promise<Question[]> {
  try {
    const res = await fetch(`/api/quizzes/questions?category=${category}&difficulty=${difficulty}&count=${amount}`);
    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        return data.questions.map((q: any, idx: number) => {
          const opts = q.options || shuffleOptions([q.correctAnswer, ...(q.incorrectAnswers || [])]);
          return {
            id: q.id || `q-${idx}`,
            text: decodeHtml(q.question),
            correctAnswer: decodeHtml(q.correctAnswer),
            options: opts.map((o: string) => decodeHtml(o)),
            explanation: q.explanation ? decodeHtml(q.explanation) : undefined
          };
        });
      }
    }
  } catch {
    // API unavailable, proceed to fallbacks
  }

  if (category === 'bee') {
    return Array.from({ length: amount }, (_, idx) => {
      const base = seedBEEQuestions[idx % seedBEEQuestions.length];
      return {
        ...base,
        id: `bee-gen-${idx}`,
        options: shuffleOptions(base.options)
      };
    });
  }

  // OpenTDB Fallback for General Knowledge/Science/Tech
  const categoryId = categoryMap[category] ?? 9;
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = (await response.json()) as { results?: RawQuestion[] };
      if (data.results && data.results.length > 0) {
        return data.results.map((q, idx) => {
          const correctAnswer = decodeHtml(q.correct_answer);
          const options = shuffleOptions([
            ...q.incorrect_answers.map((a) => decodeHtml(a)),
            correctAnswer
          ]);
          return {
            id: `opentdb-${idx}`,
            text: decodeHtml(q.question),
            correctAnswer,
            options
          };
        });
      }
    }
  } catch {
    // fallback to seed
  }

  return seedBEEQuestions.slice(0, amount);
}

export default function QuizPageContent(): React.ReactElement {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizMode, setQuizMode] = useState<'standard' | 'ai'>('standard');
  const [playerName, setPlayerName] = useState(user?.username || 'Scholar');
  const [category, setCategory] = useState('bee');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState<number | string>(5);

  // AI Generator state
  const [notesText, setNotesText] = useState('');
  const [aiTopic, setAiTopic] = useState('Basic Electrical Engineering');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getStoredLeaderboard());
  }, []);

  useEffect(() => {
    if (!isQuizActive) return undefined;

    const timerId = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isQuizActive]);

  useEffect(() => {
    if (isQuizActive && timeLeft <= 0) {
      finishQuiz();
    }
  }, [timeLeft, isQuizActive]);

  const currentQuestion = questions[currentIndex];

  const scoreData = useMemo(() => {
    if (!questions.length || isQuizActive || !hasStarted) {
      return null;
    }

    const total = questions.length;
    const score = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / total) * 100);
    const timeSpent = initialTime - timeLeft;

    let grade = 'Scholar (B)';
    if (percentage >= 90) grade = 'Master Scholar (A+)';
    else if (percentage >= 75) grade = 'Proficient (A)';
    else if (percentage >= 50) grade = 'Passing (C)';
    else grade = 'Needs Review (D)';

    return { total, score, percentage, grade, timeSpent };
  }, [questions, selectedAnswers, isQuizActive, hasStarted, initialTime, timeLeft]);

  function selectOption(option: string) {
    if (!isQuizActive) return;
    setSelectedAnswers((previous) => ({
      ...previous,
      [currentIndex]: option,
    }));
  }

  function toggleFlagQuestion(index: number) {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  }

  async function handleStartQuiz(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const safeAmount = Math.min(Math.max(Number(questionCount) || 5, 3), 20);
    const safeName = playerName.trim() || 'Scholar';

    const fetched = await fetchQuestions(category, difficulty, safeAmount);
    const allocatedTime = Math.max(60, safeAmount * 25);

    setQuestions(fetched);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(allocatedTime);
    setInitialTime(allocatedTime);
    setIsQuizActive(true);
    setHasStarted(true);
    setPlayerName(safeName);
    setIsLoading(false);
  }

  async function handleGenerateAiQuiz(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!notesText.trim()) return;

    setIsLoading(true);
    const safeAmount = Math.min(Math.max(Number(questionCount) || 5, 3), 10);
    const safeName = playerName.trim() || 'Scholar';

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notesText,
          topic: aiTopic || 'Academic Notes',
          count: safeAmount,
          difficulty
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          const formatted: Question[] = data.questions.map((q: any, idx: number) => {
            const opts = shuffleOptions([q.correctAnswer, ...(q.incorrectAnswers || [])]);
            return {
              id: `ai-${idx}`,
              text: decodeHtml(q.question),
              correctAnswer: decodeHtml(q.correctAnswer),
              options: opts.map((o: string) => decodeHtml(o)),
              explanation: q.explanation ? decodeHtml(q.explanation) : `Derived from AI study notes`
            };
          });

          const allocatedTime = Math.max(60, formatted.length * 30);
          setQuestions(formatted);
          setCurrentIndex(0);
          setSelectedAnswers({});
          setFlaggedQuestions({});
          setTimeLeft(allocatedTime);
          setInitialTime(allocatedTime);
          setIsQuizActive(true);
          setHasStarted(true);
          setPlayerName(safeName);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error generating AI quiz:', error);
    }

    // Fallback to standard BEE questions if API offline
    const fallback = seedBEEQuestions.slice(0, safeAmount);
    setQuestions(fallback);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(120);
    setInitialTime(120);
    setIsQuizActive(true);
    setHasStarted(true);
    setPlayerName(safeName);
    setIsLoading(false);
  }

  function finishQuiz() {
    if (!isQuizActive) return;

    const total = questions.length;
    const score = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / total) * 100);

    const newEntry: LeaderboardEntry = {
      name: playerName,
      score,
      total,
      percentage,
      category: quizMode === 'ai' ? `AI: ${aiTopic}` : (categoryOptions.find((c) => c.id === category)?.label || category),
      date: new Date().toLocaleDateString()
    };

    const updatedEntries = [...leaderboard, newEntry]
      .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
      .slice(0, 10);

    saveLeaderboard(updatedEntries);
    setLeaderboard(updatedEntries);
    setIsQuizActive(false);

    // Sync score with backend if available
    try {
      fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.idToken ? `Bearer ${user.idToken}` : ''
        },
        body: JSON.stringify({
          username: playerName,
          category: quizMode === 'ai' ? `AI: ${aiTopic}` : category,
          difficulty,
          score,
          totalQuestions: total,
          timeSpentSeconds: initialTime - timeLeft
        })
      }).catch(() => {});
    } catch {
      // safe fallback
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-yellow-300 selection:text-black">
      <GlobalStyles />
      <ChartPatterns />

      {/* Header Bar matching Dashboard theme */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#fdfbf7]/90 backdrop-blur-sm border-b-[3px] border-black">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <SketchButton variant="outline" icon={ArrowLeft} className="py-2 text-sm">
              Dashboard
            </SketchButton>
          </Link>
          <div>
            <span className="font-sketch text-xs md:text-sm font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={14} /> Interactive Assessment Engine
            </span>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              Quiz Master <span className="underline decoration-yellow-400 decoration-wavy">Challenge Arena</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 border-[2px] border-black px-3 py-1 bg-yellow-200 shape-wobble-sm font-sketch font-bold text-sm">
            <Award size={16} /> Player: {playerName}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        {/* State 1: Quiz Setup Form */}
        {!isQuizActive && !hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Setup Card */}
            <div className="lg:col-span-2">
              <PopCard color="bg-yellow-100" className="p-8">
                {/* Mode Selector Tabs */}
                <div className="flex gap-3 mb-6 pb-4 border-b-[2px] border-black">
                  <button
                    type="button"
                    onClick={() => setQuizMode('standard')}
                    className={`flex items-center gap-2 px-4 py-2 border-[2.5px] border-black font-black text-sm shape-wobble-sm shadow-[2px_2px_0px_#000] transition-all ${
                      quizMode === 'standard' ? 'bg-amber-400 scale-105' : 'bg-white hover:bg-yellow-50'
                    }`}
                  >
                    <Zap size={16} /> Standard Quiz Modes
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizMode('ai')}
                    className={`flex items-center gap-2 px-4 py-2 border-[2.5px] border-black font-black text-sm shape-wobble-sm shadow-[2px_2px_0px_#000] transition-all ${
                      quizMode === 'ai' ? 'bg-purple-300 scale-105 ring-2 ring-purple-600' : 'bg-white hover:bg-purple-50'
                    }`}
                  >
                    <Sparkles size={16} className="text-purple-700" /> AI Notes-to-Quiz (Groq Llama 3.3)
                  </button>
                </div>

                {quizMode === 'standard' ? (
                  <form onSubmit={handleStartQuiz} className="space-y-6">
                    <div>
                      <label className="block font-black text-sm uppercase tracking-wider mb-2">
                        Player Identity
                      </label>
                      <input
                        type="text"
                        maxLength={20}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-[3px] border-black font-bold shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter your scholar handle"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-black text-sm uppercase tracking-wider mb-3">
                        Select Subject Domain
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categoryOptions.map((cat) => {
                          const IconComp = cat.icon;
                          const isSelected = category === cat.id;
                          return (
                            <div
                              key={cat.id}
                              onClick={() => setCategory(cat.id)}
                              className={`cursor-pointer p-4 border-[3px] border-black font-bold shape-wobble-sm transition-all flex items-center gap-3 shadow-[2px_2px_0px_#000] ${
                                isSelected ? 'bg-amber-300 ring-2 ring-black scale-[1.02]' : 'bg-white hover:bg-zinc-50'
                              }`}
                            >
                              <div className={`p-2 border-[2px] border-black rounded-lg ${cat.color}`}>
                                <IconComp className="w-5 h-5 text-black" />
                              </div>
                              <span className="text-sm font-black">{cat.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-black text-sm uppercase tracking-wider mb-2">
                          Difficulty Level
                        </label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-[3px] border-black font-bold shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none"
                        >
                          <option value="easy">Easy (Fundamentals)</option>
                          <option value="medium">Medium (Standard)</option>
                          <option value="hard">Hard (Advanced Challenge)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-black text-sm uppercase tracking-wider mb-2">
                          Question Count (3–20)
                        </label>
                        <input
                          type="number"
                          min="3"
                          max="20"
                          value={questionCount}
                          onChange={(e) => setQuestionCount(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-[3px] border-black font-bold shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t-[2px] border-black">
                      <span className="font-sketch text-base font-bold text-black/70">
                        Estimated Duration: ~{Math.max(1, Math.round((Number(questionCount) * 25) / 60))} Mins
                      </span>
                      <SketchButton
                        variant="primary"
                        icon={Play}
                        className="text-lg py-3 px-8"
                      >
                        {isLoading ? 'Loading Questions...' : 'Start Quiz Now'}
                      </SketchButton>
                    </div>
                  </form>
                ) : (
                  /* AI Note-to-Quiz Form */
                  <form onSubmit={handleGenerateAiQuiz} className="space-y-6">
                    <div className="p-4 bg-purple-200 border-[2px] border-black shape-wobble-sm flex items-center gap-3">
                      <Cpu className="w-8 h-8 text-purple-900" />
                      <div>
                        <h3 className="font-black text-base">Groq Cloud Llama 3.3 70B AI Generator</h3>
                        <p className="font-sketch text-sm text-purple-950">
                          Paste your lecture notes, syllabus, or course textbook text below. Groq AI (Llama 3.3) will convert it into an interactive quiz instantly!
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block font-black text-sm uppercase tracking-wider mb-2">
                        Course Topic / Module Title
                      </label>
                      <input
                        type="text"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-[3px] border-black font-bold shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none"
                        placeholder="e.g. BEE Unit 2 - Transformers & AC Circuits"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-black text-sm uppercase tracking-wider mb-2">
                        Paste Syllabus / Lecture Notes
                      </label>
                      <textarea
                        rows={6}
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        className="w-full p-4 bg-white border-[3px] border-black font-medium shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none text-sm"
                        placeholder="Paste paragraph notes here... e.g. Kirchhoff's Voltage Law (KVL) states that the sum of all electrical potential differences around a closed loop is zero..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-black text-sm uppercase tracking-wider mb-2">
                          Difficulty Tier
                        </label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-[3px] border-black font-bold shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none"
                        >
                          <option value="easy">Easy (Conceptual)</option>
                          <option value="medium">Medium (Standard Exam)</option>
                          <option value="hard">Hard (Numerical / Deep)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-black text-sm uppercase tracking-wider mb-2">
                          Question Count (3–10)
                        </label>
                        <input
                          type="number"
                          min="3"
                          max="10"
                          value={questionCount}
                          onChange={(e) => setQuestionCount(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-[3px] border-black font-bold shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t-[2px] border-black">
                      <span className="font-sketch text-base font-bold text-purple-900">
                        ✨ Powered by Groq Llama 3.3 70B AI
                      </span>
                      <SketchButton
                        variant="accent"
                        icon={Sparkles}
                        className="text-lg py-3 px-8 bg-purple-400 hover:bg-purple-500 text-black"
                      >
                        {isLoading ? 'Generating AI Quiz...' : 'Generate AI Quiz Now'}
                      </SketchButton>
                    </div>
                  </form>
                )}
              </PopCard>
            </div>

            {/* Sidebar Leaderboard & Tips */}
            <div className="space-y-6">
              <PopCard color="bg-blue-100" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-black" />
                  <h3 className="text-xl font-black">Top Scholars</h3>
                </div>
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <p className="font-sketch text-sm text-zinc-600">No recorded scores yet. Take a quiz to top the leaderboard!</p>
                  ) : (
                    leaderboard.slice(0, 5).map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border-[2px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm w-6 h-6 rounded-full bg-yellow-300 border-[1.5px] border-black flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-sm leading-tight">{entry.name}</div>
                            <div className="text-[10px] text-zinc-500 font-sketch">{entry.category || 'General'}</div>
                          </div>
                        </div>
                        <div className="font-black text-sm text-amber-700">
                          {entry.score}/{entry.total} ({entry.percentage}%)
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopCard>

              <PopCard color="bg-pink-100" className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-black" />
                  <h4 className="font-black text-base">Pro Tip for BEE Students</h4>
                </div>
                <p className="font-sketch text-base text-black/80">
                  Double check circuit polarities in KCL & KVL questions. Use the AI tab to paste your BEE syllabus and create instant practice tests!
                </p>
              </PopCard>
            </div>
          </motion.div>
        )}

        {/* State 2: Active Quiz Runner */}
        {isQuizActive && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            {/* Top Stats Banner: Progress & Timer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] shape-wobble-sm">
              <div className="flex items-center gap-3">
                <span className="font-black text-lg px-3 py-1 bg-yellow-300 border-[2px] border-black shape-wobble-sm">
                  Q {currentIndex + 1} / {questions.length}
                </span>
                <span className="font-sketch font-bold text-base text-zinc-600">
                  Subject: <span className="uppercase text-black">{quizMode === 'ai' ? aiTopic : category}</span>
                </span>
              </div>

              {/* Countdown Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 border-[2px] border-black font-black text-lg shape-wobble-sm shadow-[2px_2px_0px_#000] ${
                timeLeft < 30 ? 'bg-red-400 text-white animate-pulse' : 'bg-amber-300 text-black'
              }`}>
                <Timer className="w-5 h-5 stroke-[2.5]" />
                <span>Time Left: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question Card & Answer Options */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <PopCard color="bg-white" className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <span className="font-sketch font-bold text-amber-700 text-sm tracking-wider uppercase flex items-center gap-1">
                      <HelpCircle size={16} /> Multiple Choice Question {quizMode === 'ai' && '• AI Generated'}
                    </span>
                    <button
                      onClick={() => toggleFlagQuestion(currentIndex)}
                      className={`px-3 py-1 text-xs font-bold border-[2px] border-black shape-wobble-sm transition-colors ${
                        flaggedQuestions[currentIndex] ? 'bg-yellow-400 text-black' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {flaggedQuestions[currentIndex] ? '★ Flagged for Review' : '☆ Flag Question'}
                    </button>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black mb-8 leading-snug">
                    {currentQuestion.text}
                  </h2>

                  {/* Options List */}
                  <div className="space-y-4 mb-8">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswers[currentIndex] === option;
                      const optionLabels = ['A', 'B', 'C', 'D'];
                      return (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => selectOption(option)}
                          className={`w-full p-4 border-[3px] border-black text-left font-bold shape-wobble-sm transition-all flex items-center justify-between shadow-[3px_3px_0px_0px_#000] ${
                            isSelected ? 'bg-amber-300 ring-2 ring-black scale-[1.01]' : 'bg-white hover:bg-yellow-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 border-[2px] border-black rounded-lg flex items-center justify-center font-black text-sm ${
                              isSelected ? 'bg-black text-white' : 'bg-yellow-200 text-black'
                            }`}>
                              {optionLabels[idx] || idx + 1}
                            </span>
                            <span className="text-base md:text-lg">{option}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-6 h-6 text-black stroke-[3]" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t-[2px] border-black">
                    <SketchButton
                      variant="outline"
                      icon={ArrowLeft}
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      className={`text-sm py-2 ${currentIndex === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      Previous
                    </SketchButton>

                    <div className="flex items-center gap-3">
                      {currentIndex < questions.length - 1 ? (
                        <SketchButton
                          variant="accent"
                          icon={ArrowRight}
                          onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                          className="text-sm py-2"
                        >
                          Next Question
                        </SketchButton>
                      ) : (
                        <SketchButton
                          variant="primary"
                          icon={CheckCircle2}
                          onClick={finishQuiz}
                          className="text-sm py-2 bg-green-500 text-black hover:bg-green-600"
                        >
                          Submit Quiz
                        </SketchButton>
                      )}
                    </div>
                  </div>
                </PopCard>
              </div>

              {/* Question Palette Sidebar */}
              <div className="lg:col-span-1">
                <PopCard color="bg-zinc-100" className="p-5 sticky top-24">
                  <h3 className="font-black text-base mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5" /> Question Palette
                  </h3>
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {questions.map((_, idx) => {
                      const isCurrent = idx === currentIndex;
                      const isAnswered = selectedAnswers[idx] !== undefined;
                      const isFlagged = flaggedQuestions[idx];

                      let btnStyle = 'bg-white text-black';
                      if (isCurrent) btnStyle = 'bg-black text-white ring-2 ring-amber-400';
                      else if (isAnswered) btnStyle = 'bg-green-300 text-black';
                      else if (isFlagged) btnStyle = 'bg-yellow-300 text-black';

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-10 border-[2px] border-black font-black text-sm shape-wobble-sm shadow-[1px_1px_0px_#000] flex items-center justify-center relative ${btnStyle}`}
                        >
                          {idx + 1}
                          {isFlagged && (
                            <span className="absolute -top-1 -right-1 text-[10px] text-red-600 font-bold">★</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2 text-xs font-sketch font-bold border-t-[1.5px] border-black pt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-300 border border-black rounded-sm" /> Answered
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-white border border-black rounded-sm" /> Unanswered
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-300 border border-black rounded-sm" /> Flagged
                    </div>
                  </div>
                </PopCard>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 3: Quiz Score Summary & Review */}
        {!isQuizActive && hasStarted && scoreData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Score Banner */}
            <PopCard color="bg-amber-300" className="p-8 text-center shape-wobble">
              <div className="inline-flex items-center justify-center p-4 bg-white border-[3px] border-black rounded-full shadow-[4px_4px_0px_#000] mb-4">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">Quiz Completed!</h2>
              <p className="font-sketch text-xl text-black/80 mb-6">
                Congratulations <span className="font-bold underline">{playerName}</span>, here is your breakdown.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                <div className="p-4 bg-white border-[3px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000]">
                  <div className="font-sketch text-sm font-bold text-zinc-500">SCORE</div>
                  <div className="text-3xl font-black text-black">{scoreData.score} / {scoreData.total}</div>
                </div>
                <div className="p-4 bg-white border-[3px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000]">
                  <div className="font-sketch text-sm font-bold text-zinc-500">ACCURACY</div>
                  <div className="text-3xl font-black text-amber-600">{scoreData.percentage}%</div>
                </div>
                <div className="p-4 bg-white border-[3px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000]">
                  <div className="font-sketch text-sm font-bold text-zinc-500">PERFORMANCE GRADE</div>
                  <div className="text-xl font-black text-green-700">{scoreData.grade}</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <SketchButton
                  variant="primary"
                  icon={RotateCcw}
                  onClick={() => {
                    setHasStarted(false);
                    setIsQuizActive(false);
                  }}
                  className="text-lg py-3 px-6"
                >
                  Try Another Quiz
                </SketchButton>
                <Link to="/dashboard">
                  <SketchButton variant="outline" icon={ArrowLeft} className="text-lg py-3 px-6">
                    Return to Dashboard
                  </SketchButton>
                </Link>
              </div>
            </PopCard>

            {/* Answer Breakdown & Academic Review */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black flex items-center gap-2">
                <BookOpen className="w-6 h-6" /> Answer Key & Explanations
              </h3>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <PopCard
                      key={idx}
                      color={isCorrect ? 'bg-green-50' : 'bg-red-50'}
                      className="p-6"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base px-2.5 py-0.5 bg-white border-[2px] border-black shape-wobble-sm">
                            Q{idx + 1}
                          </span>
                          <h4 className="font-black text-lg leading-snug">{q.text}</h4>
                        </div>
                        {isCorrect ? (
                          <span className="shrink-0 flex items-center gap-1 font-black text-sm px-3 py-1 bg-green-300 border-[2px] border-black shape-wobble-sm">
                            <CheckCircle2 size={16} /> Correct
                          </span>
                        ) : (
                          <span className="shrink-0 flex items-center gap-1 font-black text-sm px-3 py-1 bg-red-300 text-black border-[2px] border-black shape-wobble-sm">
                            <XCircle size={16} /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 font-bold text-sm">
                        <div className="p-3 bg-white border-[2px] border-black rounded-lg">
                          <span className="text-zinc-500 font-sketch block text-xs">YOUR ANSWER</span>
                          <span className={isCorrect ? 'text-green-700' : 'text-red-600'}>
                            {userAnswer || 'No answer selected'}
                          </span>
                        </div>
                        <div className="p-3 bg-white border-[2px] border-black rounded-lg">
                          <span className="text-zinc-500 font-sketch block text-xs">CORRECT ANSWER</span>
                          <span className="text-green-700">{q.correctAnswer}</span>
                        </div>
                      </div>

                      {q.explanation && (
                        <div className="p-3 bg-yellow-100 border-[2px] border-black shape-wobble-sm text-sm font-sketch font-bold text-black/80">
                          <span className="font-black text-black">Explanation: </span>{q.explanation}
                        </div>
                      )}
                    </PopCard>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
