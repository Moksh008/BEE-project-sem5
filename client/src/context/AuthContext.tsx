import React, { createContext, useContext, useMemo, useState } from 'react';
import { loginWithGooglePopup } from '../lib/firebase';

export interface User {
  username: string;
  email?: string;
  avatar?: string;
  uid?: string;
  idToken?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const authStorageKey = 'quiz-master-auth';

const AuthContext = createContext<AuthContextType | null>(null);

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(authStorageKey);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(readStoredUser);

  function login(username: string) {
    const normalizedName = username.trim() || 'Player';
    const nextUser: User = { username: normalizedName };
    localStorage.setItem(authStorageKey, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function loginWithGoogle() {
    try {
      const result = await loginWithGooglePopup();
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const nextUser: User = {
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google Scholar',
        email: firebaseUser.email || undefined,
        avatar: firebaseUser.photoURL || undefined,
        uid: firebaseUser.uid,
        idToken,
      };

      localStorage.setItem(authStorageKey, JSON.stringify(nextUser));
      setUser(nextUser);

      // Optionally sync user with backend API
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

  function logout() {
    localStorage.removeItem(authStorageKey);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, login, loginWithGoogle, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
