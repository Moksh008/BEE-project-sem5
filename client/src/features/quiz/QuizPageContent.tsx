import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
}

export interface Question {
  text: string;
  correctAnswer: string;
  options: string[];
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  percentage: number;
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

function getFallbackQuestions(count: number): RawQuestion[] {
  const fallback: RawQuestion[] = [
    {
      question: 'Which planet is known as the Red Planet?',
      correct_answer: 'Mars',
      incorrect_answers: ['Venus', 'Jupiter', 'Mercury'],
    },
    {
      question: 'What is the capital of France?',
      correct_answer: 'Paris',
      incorrect_answers: ['Berlin', 'Rome', 'Madrid'],
    },
    {
      question: 'Which language runs in a web browser?',
      correct_answer: 'JavaScript',
      incorrect_answers: ['Python', 'C', 'Java'],
    },
    {
      question: 'Who painted the Mona Lisa?',
      correct_answer: 'Leonardo da Vinci',
      incorrect_answers: ['Vincent van Gogh', 'Pablo Picasso', 'Claude Monet'],
    },
    {
      question: 'How many days are in a leap year?',
      correct_answer: '366',
      incorrect_answers: ['365', '364', '367'],
    },
  ];

  return Array.from({ length: count }, (_, index) => ({
    ...fallback[index % fallback.length],
    question: `${fallback[index % fallback.length].question} (${index + 1})`,
  }));
}

async function fetchQuestions(category: string, difficulty: string, amount: number): Promise<RawQuestion[]> {
  const categoryId = categoryMap[category] ?? 9;
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = (await response.json()) as { results?: RawQuestion[] };
    if (!data.results || data.results.length === 0) {
      throw new Error('No questions found');
    }

    return data.results;
  } catch (error) {
    return getFallbackQuestions(amount);
  }
}

function normalizeQuestions(rawQuestions: RawQuestion[]): Question[] {
  return rawQuestions.map((question) => {
    const correctAnswer = decodeHtml(question.correct_answer);
    const options = shuffleOptions([
      ...question.incorrect_answers.map((answer) => decodeHtml(answer)),
      correctAnswer,
    ]);

    return {
      text: decodeHtml(question.question),
      correctAnswer,
      options,
    };
  });
}

export default function QuizPageContent(): React.ReactElement {
  const { user } = useAuth();

  const [playerName, setPlayerName] = useState(user?.username || 'Player');
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState('easy');
  const [questionCount, setQuestionCount] = useState<number | string>(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getStoredLeaderboard());
  }, []);

  useEffect(() => {
    if (!isQuizActive) {
      return undefined;
    }

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

    return { total, score, percentage };
  }, [questions, selectedAnswers, isQuizActive, hasStarted]);

  function renderLeaderboardList() {
    const entries = leaderboard.slice(0, 5);

    if (!entries.length) {
      return <li>No scores saved yet.</li>;
    }

    return entries.map((entry, index) => (
      <li key={`${entry.name}-${entry.score}-${index}`}>
        {index + 1}. {entry.name} - {entry.score}/{entry.total} ({entry.percentage}%)
      </li>
    ));
  }

  function selectOption(option: string) {
    setSelectedAnswers((previous) => ({
      ...previous,
      [currentIndex]: option,
    }));
  }

  async function startQuiz(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const safeAmount = Math.min(Math.max(Number(questionCount) || 10, 5), 20);
    const safeName = playerName.trim() || 'Player';

    const fetchedQuestions = await fetchQuestions(category, difficulty, safeAmount);

    setQuestions(normalizeQuestions(fetchedQuestions));
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTimeLeft(Math.max(60, safeAmount * 20));
    setIsQuizActive(true);
    setHasStarted(true);
    setPlayerName(safeName);
  }

  function finishQuiz() {
    if (!isQuizActive) {
      return;
    }

    const total = questions.length;
    const score = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / total) * 100);

    const updatedEntries = [...leaderboard, {
      name: playerName,
      score,
      total,
      percentage,
    }]
      .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
      .slice(0, 10);

    saveLeaderboard(updatedEntries);
    setLeaderboard(updatedEntries);
    setIsQuizActive(false);
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Quiz Master Platform</p>
        <h1>Interactive Online Quiz System</h1>
        <p className="hero-copy">
          Test your knowledge across categories, choose a difficulty level, and track your score as you play.
        </p>
        <div className="page-actions">
          <Link to="/dashboard" className="secondary-btn link-btn">Back to Dashboard</Link>
        </div>
      </header>

      <main className="layout">
        <section className="card setup-card" aria-labelledby="quiz-setup-title">
          <div className="section-heading">
            <h2 id="quiz-setup-title">Quiz Setup</h2>
            <p>Select your quiz preferences before starting.</p>
          </div>

          <form className="setup-form" onSubmit={startQuiz}>
            <label>
              Player Name
              <input
                id="player-name"
                name="playerName"
                type="text"
                maxLength={20}
                placeholder="Enter your name"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                required
              />
            </label>

            <label>
              Category
              <select
                id="category-select"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="general">General Knowledge</option>
                <option value="science">Science</option>
                <option value="technology">Technology</option>
                <option value="sports">Sports</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </label>

            <label>
              Difficulty
              <select
                id="difficulty-select"
                name="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label>
              Number of Questions
              <input
                id="question-count"
                name="questionCount"
                type="number"
                min="5"
                max="20"
                value={questionCount}
                onChange={(event) => setQuestionCount(event.target.value)}
                required
              />
            </label>

            <button type="submit" className="primary-btn">Start Quiz</button>
          </form>
        </section>

        <section className="card quiz-card" aria-labelledby="quiz-area-title">
          <div className="section-heading row">
            <div>
              <h2 id="quiz-area-title">Quiz Area</h2>
              <p>Answer each question before the countdown ends.</p>
            </div>
            <div className="timer-pill" aria-live="polite">Timer: {formatTime(timeLeft)}</div>
          </div>

          {!isQuizActive && !hasStarted && (
            <div className="quiz-placeholder">
              <h3>Your quiz will load here</h3>
              <p>Choose your settings and press Start Quiz to begin.</p>
            </div>
          )}

          {isQuizActive && currentQuestion && (
            <div className="question-panel">
              <p className="question-progress">Question {currentIndex + 1} of {questions.length}</p>
              <h3>{currentQuestion.text}</h3>
              <div className="options-list">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswers[currentIndex] === option;
                  return (
                    <button
                      key={option}
                      className={`option-btn ${isSelected ? 'selected' : ''}`.trim()}
                      type="button"
                      onClick={() => selectOption(option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <div className="quiz-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setCurrentIndex((previous) => Math.max(0, previous - 1))}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setCurrentIndex((previous) => Math.min(questions.length - 1, previous + 1))}
                >
                  {currentIndex === questions.length - 1 ? 'Last Question' : 'Next'}
                </button>
                <button type="button" className="primary-btn" onClick={finishQuiz}>Submit Quiz</button>
              </div>
            </div>
          )}

          {!isQuizActive && hasStarted && (
            <div className="quiz-placeholder">
              <h3>Quiz completed</h3>
              <p>Check your results below and start a new round anytime.</p>
            </div>
          )}
        </section>

        <section className="card results-card" aria-labelledby="results-title">
          <div className="section-heading">
            <h2 id="results-title">Results</h2>
            <p>Score summary and review will appear after the quiz.</p>
          </div>

          {!hasStarted && (
            <div className="results-placeholder">
              <p>No results yet. Complete a quiz to see your performance.</p>
            </div>
          )}

          {isQuizActive && (
            <div className="results-placeholder">
              <p>Quiz in progress. Results will appear after submission.</p>
            </div>
          )}

          {!isQuizActive && hasStarted && scoreData && (
            <>
              <div className="score-summary">
                <h3>{playerName} scored {scoreData.score}/{scoreData.total}</h3>
                <span className="score-badge">{scoreData.percentage}%</span>
              </div>
              <ul className="review-list">
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index] || 'No answer';
                  const isCorrect = userAnswer === question.correctAnswer;
                  return (
                    <li key={`${question.text}-${index}`} className="review-item">
                      <strong>{index + 1}. {question.text}</strong>
                      Your answer: {userAnswer}
                      <span className={`status ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      <div>Correct answer: {question.correctAnswer}</div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>

        <section className="card leaderboard-card" aria-labelledby="leaderboard-title">
          <div className="section-heading">
            <h2 id="leaderboard-title">Leaderboard</h2>
            <p>High scores are stored locally on this device.</p>
          </div>
          <ol className="leaderboard-list">{renderLeaderboardList()}</ol>
        </section>
      </main>
    </div>
  );
}
