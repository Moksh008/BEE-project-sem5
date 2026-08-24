import { Router } from 'express';
import { generateQuizFromNotes } from '../controllers/aiController.js';

const router = Router();

router.post('/generate-quiz', generateQuizFromNotes);

export default router;
