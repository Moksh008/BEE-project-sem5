import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initFirebase } from './config/firebase.js';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Firebase Services
connectDB();
initFirebase();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);

// Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'bee-pro-backend',
    timestamp: new Date().toISOString(),
    features: ['mongodb-atlas', 'firebase-auth', 'quiz-engine', 'leaderboard', 'gemini-ai-generator'],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 QuizMaster Backend running on http://localhost:${PORT}`);
});
