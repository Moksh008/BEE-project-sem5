import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';

export async function syncUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { uid, email, name } = req.user || {};
    if (!uid) {
      res.status(400).json({ error: 'User UID missing.' });
      return;
    }

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email || `${uid}@bee-pro.edu`,
        displayName: name || 'Scholar Player',
      });
    }

    res.json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user profile' });
  }
}

export async function getUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { uid } = req.user || {};
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      res.json({
        firebaseUid: uid || 'guest',
        displayName: req.user?.name || 'Guest Scholar',
        quizzesTaken: 0,
        totalScore: 0,
        averagePercentage: 0,
      });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}
