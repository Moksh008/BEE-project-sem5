const categoryMap = {
  general: 9,
  science: 17,
  technology: 30,
  sports: 21,
  history: 23,
  geography: 22,
  entertainment: 11,
};

const leaderboardKey = 'quiz-master-leaderboard';

const quizForm = document.getElementById('quiz-setup-form');
const questionPanel = document.getElementById('question-panel');
const quizPlaceholder = document.getElementById('quiz-placeholder');
const resultsContainer = document.getElementById('results-container');
const leaderboardList = document.getElementById('leaderboard-list');
const timerPill = document.getElementById('timer-pill');
const questionProgress = document.getElementById('question-progress');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const prevQuestionBtn = document.getElementById('prev-question-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const submitQuizBtn = document.getElementById('submit-quiz-btn');

const state = {
  questions: [],
  currentIndex: 0,
  selectedAnswers: {},
  timeLeft: 0,
  timerId: null,
  isQuizActive: false,
  playerName: 'Player',
};

function decodeHtml(html) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function getStoredLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(leaderboardKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(leaderboardKey, JSON.stringify(entries));
}

function renderLeaderboard() {
  const entries = getStoredLeaderboard().slice(0, 5);

  if (!entries.length) {
    leaderboardList.innerHTML = '<li>No scores saved yet.</li>';
    return;
  }

  leaderboardList.innerHTML = entries
    .map(
      (entry, index) =>
        `<li>${index + 1}. ${entry.name} — ${entry.score}/${entry.total} (${entry.percentage}%)</li>`
    )
    .join('');
}

function updateTimer() {
  timerPill.textContent = `Timer: ${formatTime(state.timeLeft)}`;

  if (state.timeLeft <= 0) {
    clearInterval(state.timerId);
    finishQuiz();
  }
}

function startTimer() {
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimer();
  }, 1000);
}

function getFallbackQuestions(count) {
  const fallback = [
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

async function fetchQuestions(category, difficulty, amount) {
  const categoryId = categoryMap[category] ?? 9;
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error('No questions found');
    }

    return data.results;
  } catch (error) {
    return getFallbackQuestions(amount);
  }
}

function renderQuestion() {
  const currentQuestion = state.questions[state.currentIndex];
  if (!currentQuestion) {
    return;
  }

  const decodedQuestion = decodeHtml(currentQuestion.question);
  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
    .map((answer) => decodeHtml(answer))
    .sort(() => Math.random() - 0.5);

  questionProgress.textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
  questionText.textContent = decodedQuestion;

  const selectedValue = state.selectedAnswers[state.currentIndex];
  optionsList.innerHTML = options
    .map((option) => {
      const isSelected = selectedValue === option;
      const classes = isSelected ? 'option-btn selected' : 'option-btn';
      return `<button class="${classes}" type="button" data-option="${option}">${option}</button>`;
    })
    .join('');

  optionsList.querySelectorAll('.option-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedOption = button.dataset.option;
      state.selectedAnswers[state.currentIndex] = selectedOption;
      renderQuestion();
    });
  });

  prevQuestionBtn.disabled = state.currentIndex === 0;
  nextQuestionBtn.textContent = state.currentIndex === state.questions.length - 1 ? 'Last Question' : 'Next';
}

function showResults() {
  const totalQuestions = state.questions.length;
  const correctAnswers = state.questions.reduce((count, question, index) => {
    return count + (decodeHtml(question.correct_answer) === state.selectedAnswers[index] ? 1 : 0);
  }, 0);

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const resultsHtml = `
    <div class="score-summary">
      <h3>${state.playerName} scored ${correctAnswers}/${totalQuestions}</h3>
      <span class="score-badge">${percentage}%</span>
    </div>
    <ul class="review-list">
      ${state.questions
        .map((question, index) => {
          const userAnswer = state.selectedAnswers[index] || 'No answer';
          const correctAnswer = decodeHtml(question.correct_answer);
          const isCorrect = userAnswer === correctAnswer;
          return `
            <li class="review-item">
              <strong>${index + 1}. ${decodeHtml(question.question)}</strong>
              Your answer: ${userAnswer}
              <span class="status ${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? 'Correct' : 'Incorrect'}</span>
              <div>Correct answer: ${correctAnswer}</div>
            </li>
          `;
        })
        .join('')}
    </ul>
  `;

  resultsContainer.innerHTML = resultsHtml;

  const leaderboardEntries = getStoredLeaderboard();
  leaderboardEntries.push({
    name: state.playerName,
    score: correctAnswers,
    total: totalQuestions,
    percentage,
  });
  leaderboardEntries.sort((a, b) => b.percentage - a.percentage || b.score - a.score);
  saveLeaderboard(leaderboardEntries.slice(0, 10));
  renderLeaderboard();
}

function finishQuiz() {
  if (!state.isQuizActive) {
    return;
  }

  state.isQuizActive = false;
  clearInterval(state.timerId);
  questionPanel.hidden = true;
  quizPlaceholder.hidden = true;
  showResults();
}

async function startQuiz(event) {
  event.preventDefault();

  const playerInput = document.getElementById('player-name');
  const categorySelect = document.getElementById('category-select');
  const difficultySelect = document.getElementById('difficulty-select');
  const questionCountInput = document.getElementById('question-count');

  const playerName = playerInput.value.trim() || 'Player';
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;
  const amount = Math.min(Math.max(Number(questionCountInput.value) || 10, 5), 20);

  state.playerName = playerName;
  state.currentIndex = 0;
  state.selectedAnswers = {};
  state.isQuizActive = true;
  state.questions = await fetchQuestions(category, difficulty, amount);
  state.timeLeft = Math.max(60, amount * 20);

  quizPlaceholder.hidden = true;
  questionPanel.hidden = false;
  resultsContainer.innerHTML = '<p>Quiz in progress. Results will appear after submission.</p>';
  renderQuestion();
  updateTimer();
  startTimer();
}

prevQuestionBtn.addEventListener('click', () => {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderQuestion();
  }
});

nextQuestionBtn.addEventListener('click', () => {
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex += 1;
    renderQuestion();
  }
});

submitQuizBtn.addEventListener('click', () => {
  finishQuiz();
});

quizForm.addEventListener('submit', startQuiz);
renderLeaderboard();
