import { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth, isFirebaseInitialized } from '../config/firebase.js';

/**
 * Interface extending Express Request object with optional `user` authentication payload.
 * Concept: TypeScript Interface Extension.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

/**
 * Express Middleware Function: Verifies Firebase Bearer ID Token in Authorization header.
 * Concepts Used:
 * - Express Middleware (`req`, `res`, `next`)
 * - Authorization Header Token Extraction (`Bearer <token>`)
 * - Firebase ID Token Verification (`verifyIdToken`)
 * - Guest/Fallback Fallthrough (`next()`)
 */
export async function verifyAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  // 1. Fallback for unauthenticated/guest users
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = {
      uid: 'guest-player-uid',
      name: (req.headers['x-user-name'] as string) || 'Guest Scholar',
      email: 'guest@bee-pro.edu',
    };
    return next();
  }

  // 2. Extract JWT token string
  const token = authHeader.split('Bearer ')[1];
  const auth = getFirebaseAuth();

  // 3. Verify Firebase Token using Admin SDK
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
    // Development mode fallback
    req.user = {
      uid: 'dev-user-uid',
      email: 'dev@bee-pro.edu',
      name: 'Dev Scholar',
    };
    return next();
  }
}
