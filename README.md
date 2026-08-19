# Quiz Master Platform

This project now has a proper full-stack-ready structure:

- Frontend: React + Vite + React Router (landing, login, dashboard, quiz page)
- Backend: Node.js + Express scaffold for next phase

## Current User Flow

1. Landing page
2. Login page
3. Dashboard
4. Quiz page
5. Back to dashboard

## Folder Structure

```text
BEE_pro/
|-- backend/
|   |-- src/
|   |   `-- server.js
|   |-- .env.example
|   `-- package.json
|-- src/
|   |-- app/
|   |   `-- App.jsx
|   |-- components/
|   |   `-- ProtectedRoute.jsx
|   |-- context/
|   |   `-- AuthContext.jsx
|   |-- features/
|   |   `-- quiz/
|   |       `-- QuizPageContent.jsx
|   |-- pages/
|   |   |-- DashboardPage.jsx
|   |   |-- LandingPage.jsx
|   |   |-- LoginPage.jsx
|   |   `-- QuizPage.jsx
|   `-- main.jsx
|-- index.html
|-- package.json
|-- styles.css
`-- vite.config.js
```

## Frontend Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Health route:

```text
GET http://localhost:5000/api/health
```

## Notes

- Login is currently local/session-like (front-end only) using localStorage.
- Quiz logic is preserved from the previous phase and now lives in a dedicated feature module.
- Backend is scaffolded and ready for API integration in the next phase.
