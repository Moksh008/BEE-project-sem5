import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let firebaseApp: App | null = null;
let firebaseAuth: Auth | null = null;
let isFirebaseInitialized = false;

export function initFirebase(): { app: App | null; auth: Auth | null } {
  if (getApps().length > 0) {
    isFirebaseInitialized = true;
    firebaseApp = getApps()[0];
    firebaseAuth = getAuth(firebaseApp);
    return { app: firebaseApp, auth: firebaseAuth };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  const isValidPrivateKey = privateKey && privateKey.includes('-----BEGIN PRIVATE KEY-----');

  if (projectId && clientEmail && isValidPrivateKey) {
    try {
      firebaseApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      firebaseAuth = getAuth(firebaseApp);
      isFirebaseInitialized = true;
      console.log('✅ Firebase Admin SDK Initialized.');
    } catch (error) {
      console.error('❌ Firebase Initialization Error:', error);
    }
  } else {
    console.warn('⚠️  Firebase Admin credentials missing or invalid in process.env. Auth fallback mode enabled.');
  }

  return { app: firebaseApp, auth: firebaseAuth };
}

export function getFirebaseAuth(): Auth | null {
  if (!firebaseAuth && getApps().length > 0) {
    firebaseAuth = getAuth(getApps()[0]);
  }
  return firebaseAuth;
}

export { isFirebaseInitialized };
