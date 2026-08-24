import { Router } from 'express';
import { syncUser, getUserProfile } from '../controllers/authController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.post('/sync', verifyAuth, syncUser);
router.get('/me', verifyAuth, getUserProfile);

export default router;
