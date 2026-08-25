import dotenv from 'dotenv';
// Load environment variables from .env file into process.env
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initFirebase } from './config/firebase.js';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

/**
 * Express Server Application Entry Point.
 * Concepts Used:
 * - Node.js ES Modules & Express.js Framework
 * - Middleware Architecture (`cors`, `express.json`)
 * - Modular REST API Route Registration
 * - Environment Variable Configuration (`process.env.PORT`)
 */
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Firebase Admin SDK Services
connectDB();
initFirebase();

// Middlewares: Enable Cross-Origin Resource Sharing (CORS) & JSON Body Parser
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Register Modular REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);

/**
 * Health Check API Endpoint.
 * Concept: GET HTTP endpoint returning JSON server status metadata.
 * @route GET /api/health
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'bee-pro-backend',
    timestamp: new Date().toISOString(),
    features: ['mongodb-atlas', 'firebase-auth', 'quiz-engine', 'leaderboard', 'groq-llama-ai-generator'],
  });
});

// Start Express HTTP Server listening on designated port
app.listen(PORT, () => {
  console.log(`🚀 QuizMaster Backend running on http://localhost:${PORT}`);
});
