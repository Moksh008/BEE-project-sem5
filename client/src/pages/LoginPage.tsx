import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalStyles, ChartPatterns, PopCard, SketchButton } from '../components/ui/PaperPop';
import { HandDrawnFilters } from '../components/ui/HandDrawn';

/**
 * Stretched Login Page Component.
 * Features:
 * - Generous wide container (`max-w-2xl`) for spacious inputs
 * - Crisp paper-pop borders without SVG distortion squishing
 * - Firebase Google OAuth Popup Sign-In & Guest Username Sign-In
 */
export default function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /** Helper: Turns Firebase auth error codes into readable messages. */
  function readableAuthError(err: any): string {
    switch (err?.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Incorrect email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Use its password to sign in.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return err?.message || 'Sign-in failed. Please try again.';
    }
  }

  /**
   * Email + Password Form Handler.
   * Concept: Async form submission with credential verification.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoadingEmail) return;
    setErrorMessage('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoadingEmail(true);
    try {
      await loginWithEmail(trimmedEmail, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Email Auth Failed:', err);
      setErrorMessage(readableAuthError(err));
    } finally {
      setIsLoadingEmail(false);
    }
  }

  /**
   * Firebase Google OAuth Popup Sign-In Handler.
   */
  async function handleGoogleLogin() {
    setIsLoadingGoogle(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Google Auth Failed:', err);
      setErrorMessage(
        err?.code === 'auth/popup-closed-by-user'
          ? 'Google sign-in was cancelled. Please try again.'
          : err?.message || 'Google sign-in failed. Please check popup permissions and try again.'
      );
    } finally {
      setIsLoadingGoogle(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#fdfbf7] font-sans text-[#1e1e1e] selection:bg-yellow-300 selection:text-black">
      <GlobalStyles />
      <ChartPatterns />
      <HandDrawnFilters />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between px-6 md:px-12 py-5 bg-[#fdfbf7]/90 backdrop-blur-md border-b-[3px] border-black">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 bg-yellow-300 border-[2.5px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000]">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <span className="text-2xl font-black tracking-tight">
            Quiz<span className="underline decoration-yellow-400 decoration-wavy">Master</span>
          </span>
        </Link>
        <Link to="/" className="text-sm font-bold hover:underline flex items-center gap-1">
          ← Back to Home
        </Link>
      </header>

      {/* Wide Stretched Login Form Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12 flex flex-col justify-center items-center">
        <div className="w-full">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-200 border-[2.5px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000] font-sketch font-bold text-xs uppercase tracking-widest">
              <Sparkles size={14} className="text-amber-600" /> Student Portal • BEE Sem 5
            </span>
          </div>

          <PopCard color="bg-white" className="p-8 md:p-12 shadow-[8px_8px_0px_#000]">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
                Welcome <span className="underline decoration-yellow-400 decoration-wavy">Back!</span>
              </h1>
              <p className="font-sketch text-lg text-black/70">
                Sign in to launch your quiz dashboard, track scores & compete on the leaderboard.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-100 border-[2.5px] border-black shape-wobble-sm text-sm font-bold text-red-900 flex items-center gap-3 shadow-[2px_2px_0px_#000]">
                <AlertCircle size={18} className="shrink-0 text-red-700" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google OAuth Login Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border-[3px] border-black py-4 px-6 font-bold text-base shape-wobble-sm shadow-[4px_4px_0px_#000] hover:bg-yellow-50 transition-all disabled:opacity-50 mb-6"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoadingGoogle ? 'Signing in with Google...' : 'Continue with Google OAuth'}</span>
            </motion.button>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-[2px] border-dashed border-black/30" />
              </div>
              <span className="relative bg-white px-3 font-sketch font-bold text-sm text-black/60 uppercase tracking-widest">
                or sign in with handle
              </span>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block font-black text-sm uppercase tracking-wider mb-2">
                  Student Email
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full border-[3px] border-black px-4 py-3.5 pl-11 bg-white font-bold text-base shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block font-black text-sm uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full border-[3px] border-black px-4 py-3.5 pl-11 bg-white font-bold text-base shadow-[2px_2px_0px_#000] shape-wobble-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <SketchButton
                  type="submit"
                  variant="primary"
                  icon={ArrowRight}
                  className="w-full text-lg py-4 bg-yellow-400 hover:bg-yellow-500 text-black flex justify-center items-center"
                >
                  {isLoadingEmail ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
                </SketchButton>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t-[2px] border-dashed border-black/20 text-center">
              <div className="flex items-center justify-center gap-2 font-sketch font-bold text-sm text-black/70">
                <ShieldCheck size={18} className="text-green-600" />
                Secured with Firebase OAuth & MongoDB Atlas API
              </div>
            </div>
          </PopCard>
        </div>
      </main>

      <footer className="border-t-[3px] border-black bg-white py-4 px-6 text-center font-sketch text-sm font-bold text-black/60">
        Quiz Master Platform • BEE Semester 5 Evaluation Project
      </footer>
    </div>
  );
}
