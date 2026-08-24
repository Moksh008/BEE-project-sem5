import { Router } from 'express';
import { getQuestions, submitQuiz } from '../controllers/quizController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/questions', getQuestions);
router.post('/submit', verifyAuth, submitQuiz);

export default router;
