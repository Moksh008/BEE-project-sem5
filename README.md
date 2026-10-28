# Quiz Master Platform (BEE Project - Sem 5)

An interactive, full-stack ready Quiz Platform built for students to take subject-specific quizzes, track performance, and compete on leaderboards. Developed with **React 18 (TypeScript)**, **Vite**, **Tailwind CSS** (using a hand-drawn PaperPop design system), and **Node.js / Express (TypeScript)**.

---

## 🚀 Features

- 🎨 **Hand-Drawn PaperPop UI** — custom CSS border designs + SVG filters (rough paper, pencil texture) across the whole app.
- 🔐 **Authentication** — Guest login, Google OAuth (Firebase), and Email + Password sign-in. Session persisted in `localStorage`; `ProtectedRoute` guards `/dashboard`, `/quiz`, and `/profile`.
- 📊 **Dashboard** — live stats (quizzes completed, average accuracy, best score), activity chart, recent quiz sessions.
- 🎯 **Quiz Engine** — dynamic subject/difficulty selection, count picker, countdown timer with auto-submit, question flagging, immediate score calculation.
- 🤖 **AI Note-to-Quiz Generator** — paste lecture notes, get a non-repeating multiple-choice quiz via Groq Llama (falls back to a curated question bank + OpenTDB if Groq is unavailable).
- 📈 **Live Leaderboard & Sync** — scores are written to MongoDB Atlas behind the scenes; the dashboard polls/reads them in real time. Scores, users and the question bank all live in the **`beepro`** database.
- 💾 **Profile Page** — view your account (name, email, sign-in method, UID), live stats, and log out.

---

## 🛠️ Tech Stack

### Frontend (`client`)
- TypeScript + React 18 + Vite 5
- React Router v6
- Tailwind CSS v4 + PostCSS
- Framer Motion, Lucide Icons

### Backend (`server`)
- TypeScript + Node.js (v18+ recommended)
- Express.js v4
- MongoDB Atlas + Mongoose
- Firebase (Auth + Google OAuth)
- Groq (Llama 3.1 8B Instant) — optional, falls back to curated bank
- Dev tooling: `tsx` watch mode

---

## 📁 Project Structure

```text
BEE-project-sem5/
├── client/                   # React + TypeScript Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   └── App.tsx       # App root, routes, and AuthContext provider
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # PaperPop / HandDrawn design-system components
│   │   ├── context/          # AuthContext
│   │   ├── features/quiz/    # QuizPageContent (quiz engine)
│   │   ├── pages/            # Dashboard, Landing, Login, Quiz, Profile
│   ├── server/               # Express + TypeScript Backend
│   │   ├── src/
│   │   │   ├── server.ts     # Entry point (seeds the question bank into MongoDB)
│   │   │   ├── config/       # db.ts (MongoDB), seed.ts (question bank), firebase.ts
│   │   │   ├── controllers/  # authController, quizController, leaderboardController, aiController
│   │   │   ├── middleware/   # verifyAuth
│   │   │   ├── models/       # Question, Score, User
│   │   │   ├── data/         # seed question bank (questionBank.ts)
│   ├── README.md
```

---

## 🔑 Environment Variables

### Frontend (`client/.env.local`)
None required to run the app — the quiz engine works offline. If you want to enable **Google OAuth**, fill `client/.env.local`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/beepro
GROQ_API_KEY=gsk_...
```

- `MONGO_URI` is the only strictly required variable. It **must include the database name** (the app uses `beepro`). If omitted, the backend runs in "curated fallback" mode and nothing is written to Atlas.
- `GROQ_API_KEY` is required for the AI generator; without it the app still generates quizzes with its built-in question bank.

---

## 🏃 Quick Start

### 1. Clone & install (root)

```bash
git clone https://github.com/Moksh008/BEE-project-sem5.git
cd BEE-project-sem5
```

### 2. Frontend (`client`)

```bash
cd client
npm install
cp .env.local.example .env.local    # add Firebase keys if you want Google OAuth
npm run dev
```

Vite dev server at **`http://localhost:5173`**

### 3. Backend (`server`)

```bash
cd server
npm install
cp .env.example .env              # set MONGO_URI (+ GROQ_API_KEY for AI)
npm run dev
```

Express dev server at **`http://localhost:5000`** — watches `src/` for changes.

### 4. Root quick commands

```bash
npm run dev:client      # start the frontend dev server
npm run dev:server      # start the backend dev server
npm run build:client    # Vite production build
npm run build:server    # TypeScript compile (tsc)
```

> **Note:** the first time the backend starts it connects to MongoDB Atlas, and as soon as the connection is ready it upserts the curated question bank into `beepro.questions`. This is what makes questions "stick" after restarts.

---

## 📡 API Endpoints

### Health

- `GET /api/health` → `{ status: "ok", service, timestamp, features[] }`

### Auth

- `POST /api/auth/sync` — Firebase Google login sync with the user registry (guest fallback)
- `GET /api/auth/me` — current profile (`firebaseUid`, `displayName`, `quizzesTaken`, `totalScore`, `averagePercentage`)

### Quiz Engine

- `GET /api/quizzes/questions?category=bee&difficulty=medium&count=10`
  - Reads from `beepro.questions`; if the DB has fewer than `count`, it tops up from the curated bank cyclically.
  - Docs have: `_id`, `category`, `difficulty`, `question`, `correctAnswer`, `incorrectAnswers`, `explanation`, `source`, `__v`.
- `POST /api/quizzes/submit` — records a score (`username`, `category`, `difficulty`, `score`, `totalQuestions`, `timeSpentSeconds`).
  - Requires a Firebase auth header (`Authorization: Bearer <idToken>`); guests are accepted with a fallback profile.

### AI Note-to-Quiz

- `POST /api/ai/generate-quiz`
  - Body: `{ notesText, topic, count, difficulty }`
  - Calls Groq if a valid `GROQ_API_KEY` is configured (tries several models); otherwise uses the curated multi-concept generator.
  - Response: `{ source, topic, difficulty, count, questions[] }`

### Leaderboard

- `GET /api/leaderboard` → `{ leaderboard: [{ username, category, score, totalQuestions, percentage, createdAt }...] }`

### Question Bank Seed

- Seeded automatically at startup (`server.ts` → `connectDB().then(ok => { if (ok) seedQuestionBank(); })`). Upserted by `question` text, so restarts never duplicate.

---

## 📱 User Navigation Flow

```mermaid
graph TD
    A[/ Landing Page /] -->|Click Login| B[/login]
    B -->|Authenticate| C[/dashboard]
    C -->|Start Quiz| D[/quiz]
    D -->|Complete / Time Out| E[/ Quiz Summary & Leaderboard]
    E -->|Back| C
```

Profiles: click the **View Profile** button (avatar) in the side bar → `/profile`.

---

## 📌 Available Scripts

### Root (`BEE-project-sem5`)

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `npm run dev:client` | Vite dev server (port 5173)   |
| `npm run dev:server` | tsx watch backend (port 5000) |
| `npm run build:client` | Vite production build         |
| `npm run build:server` | tsc compile for production    |

### Frontend (`client`)

| Command  | Description                       |
| -------- | --------------------------------- |
| `npm run dev` | Vite with HMR                   |
| `npm run build` | Production bundle (output `dist/`) |
| `npm run preview` | Preview the production build     |

### Backend (`server`)

| Command  | Description                       |
| -------- | --------------------------------- |
| `npm run dev` | tsx watch (`src/server.ts`)     |
| `npm run build` | tsc compile (`dist/server.js`)  |
| `npm start` | Run the compiled build           |

---

## 🗃️ MongoDB (Atlas)

All persistent data lives in the **`beepro`** database on your Atlas cluster:

- `questions` — question bank (seeded from the curated bank on startup; AI-generated questions appended with `source: "ai"`).
- `scores` — one document per quiz attempt: `{ username, category, difficulty, score, totalQuestions, percentage, timeSpentSeconds, userUid, createdAt }`.
- `users` — registered user registry (created during Firebase sync).

That is why you see stale/empty collections under the `test` database — the app never writes there. Switch Compass to `beepro`.

---

## 📄 License

Academic coursework — **BEE Project - Semester 5**.
