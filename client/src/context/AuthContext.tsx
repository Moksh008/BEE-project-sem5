import React, { createContext, useContext, useMemo, useState } from 'react';
import { loginWithGooglePopup } from '../lib/firebase';

/**
 * Interface defining the structure of a logged-in User object.
 * Concept: TypeScript Interface for Object Type Safety.
 */
export interface User {
  username: string;
  email?: string;
  avatar?: string;
  uid?: string;
  idToken?: string;
}

/**
 * Interface defining the properties provided by the Auth Context.
 */
export interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

/** Constant key name used to persist auth data in browser localStorage */
const authStorageKey = 'quiz-master-auth';

/** React Context instance for broadcasting authentication state across the app */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Helper Function: Reads user authentication data stored in browser localStorage.
 * Concept: LocalStorage Retrieval & JSON Deserialization (JSON.parse).
 * @returns Parsed User object or null if not found/error.
 */
function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(authStorageKey);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (error) {
    return null;
  }
}

/**
 * React Context Provider Component: Wraps the app to share user state and login/logout methods.
 * Concept: Higher-Order Provider Pattern & React Context API.
 */
export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  // State: Holds currently active user, initialized lazily from localStorage
  const [user, setUser] = useState<User | null>(readStoredUser);

  /**
   * Function: Perform Guest Login.
   * Concept: Object creation, String Trimming, LocalStorage Persistence & React State Update.
   * @param username - Player handle entered by the student.
   */
  function login(username: string) {
    const normalizedName = username.trim() || 'Player';
    const nextUser: User = { username: normalizedName };
    localStorage.setItem(authStorageKey, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  /**
   * Asynchronous Function: Perform Google OAuth Login using Firebase SDK Popup.
   * Concept: Promises, Async/Await, Third-party Auth Integration, REST Sync Fetch.
   */
  async function loginWithGoogle() {
    try {
      // 1. Launch Firebase Google Sign-In Popup (Promise)
      const result = await loginWithGooglePopup();
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // 2. Format user credentials object
      const nextUser: User = {
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google Scholar',
        email: firebaseUser.email || undefined,
        avatar: firebaseUser.photoURL || undefined,
        uid: firebaseUser.uid,
        idToken,
      };

      // 3. Persist to localStorage and update component state
      localStorage.setItem(authStorageKey, JSON.stringify(nextUser));
      setUser(nextUser);

      // 4. Sync profile with Express backend API
      try {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });
      } catch (err) {
        console.warn('Backend sync failed during Google login:', err);
      }
    } catch (error) {
      console.error('Google OAuth Login error:', error);
      throw error;
    }
  }

  /**
   * Function: Perform Logout.
   * Concept: LocalStorage Clearing & State Reset.
   */
  function logout() {
    localStorage.removeItem(authStorageKey);
    setUser(null);
  }

  // Memoize context value object to optimize rendering performance
  const value = useMemo(
    () => ({ user, login, loginWithGoogle, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom React Hook: Exposes the authentication context to any functional component.
 * Concept: Custom React Hooks (`useAuth`).
 * @returns AuthContextType containing user state and authentication methods.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
