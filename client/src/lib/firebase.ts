import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth, UserCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAlXPVq-Ufa5q1reCQL5dndoqjCveGHLOg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "beesem5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "beesem5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "beesem5.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
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
