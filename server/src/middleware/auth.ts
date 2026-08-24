import { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth, isFirebaseInitialized } from '../config/firebase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export async function verifyAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = {
      uid: 'guest-player-uid',
      name: (req.headers['x-user-name'] as string) || 'Guest Scholar',
      email: 'guest@bee-pro.edu',
    };
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  const auth = getFirebaseAuth();

  if (isFirebaseInitialized && auth) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Scholar',
      };
      return next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized: Invalid Firebase ID token.' });
      return;
    }
  } else {
    req.user = {
      uid: 'dev-user-uid',
      email: 'dev@bee-pro.edu',
      name: 'Dev Scholar',
    };
    return next();
  }
}
