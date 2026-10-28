import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  Auth,
  UserCredential,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGooglePopup(): Promise<UserCredential> {
  return await signInWithPopup(auth, googleProvider);
}

/**
 * Email/Password Sign-In.
 * Concept: Async error recovery - first sign-in creates the account
 * (and sends a verification email), later sign-ins verify the credentials.
 */
export async function loginWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
  // First sign-in: register the account and mail the user a "account created" message.
  async function registerAccount(): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await sendEmailVerification(credential.user);
    } catch (verifyError) {
      console.warn('Verification email could not be sent:', verifyError);
    }
    return credential;
  }

  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    if (error?.code === 'auth/user-not-found') {
      return registerAccount();
    }

    if (error?.code === 'auth/invalid-credential') {
      // Could not tell whether the account exists: try to register it.
      // If it already exists, the password was simply wrong.
      try {
        return await registerAccount();
      } catch (createError: any) {
        if (createError?.code === 'auth/email-already-in-use') {
          throw error;
        }
        throw createError;
      }
    }

    throw error;
  }
}
