import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, BookOpen, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  HandDrawnFilters,
  Highlight,
  SketchButton,
  DrawnArrow,
} from '../components/ui/HandDrawn';

export default function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [username, setUsername] = useState('Player');
  const [password, setPassword] = useState('password123');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      return;
    }

    login(username);
    navigate('/dashboard', { replace: true });
  }

  async function handleGoogleLogin() {
    setIsLoadingGoogle(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Google Auth Failed:', err);
      setErrorMessage(
        err?.message || 'Google sign-in failed. Please check popup permissions and try again.'
      );
    } finally {
      setIsLoadingGoogle(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#fdfbf7] font-sans text-[#2d2d2d] selection:bg-[#ffeb3b] p-4">
      {/* Hand-Drawn SVG Filter Engine */}
      <HandDrawnFilters />

      {/* Grid Paper Background Texture */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          filter: 'url(#rough-paper)',
        }}
      />

      {/* Top Navbar */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between px-8 py-6 backdrop-blur-sm">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Quiz<span className="text-blue-600">Master</span>
        </Link>
        <Link to="/" className="text-sm font-semibold hover:underline flex items-center gap-1">
          ← Back to Home
        </Link>
      </header>

      {/* Login Card Section */}
      <section className="relative z-10 w-full max-w-md pt-16 pb-12">
        <div className="relative mb-6 text-center">
          <span className="rounded-full border border-black bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,0.1)] inline-flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" /> Student Portal • BEE Sem 5
          </span>
        </div>

        {/* Hand-Drawn Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative border-4 border-black bg-white p-8 md:p-10 shadow-[12px_12px_0px_#ffeb3b] rounded-2xl"
          style={{ filter: "url(#rough-paper)" }}
        >
          {/* Decorative Pin */}
          <div className="absolute -top-4 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-black/20 bg-red-500 shadow-sm" />

          <div className="text-center mb-6">
            <h1 className="text-4xl font-black mb-2">
              Welcome <Highlight color="#a5f3fc">Back!</Highlight>
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Sign in to launch your quiz dashboard, track scores & compete.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google OAuth Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoadingGoogle}
            className="w-full flex items-center justify-center gap-3 border-3 border-black bg-white py-3.5 px-4 rounded-xl font-bold shadow-[3px_3px_0px_#000] hover:bg-amber-50 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all disabled:opacity-50"
            style={{ filter: "url(#rough-paper)" }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>{isLoadingGoogle ? 'Signing in with Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-gray-300" />
            </div>
            <span className="relative bg-white px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
              or use username
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-bold text-gray-800">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  maxLength={20}
                  placeholder="Enter your username"
                  className="w-full border-2 border-black rounded-xl pl-11 pr-4 py-3 bg-[#fffdf5] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ filter: "url(#rough-paper)" }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-gray-800">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full border-2 border-black rounded-xl pl-11 pr-4 py-3 bg-[#fffdf5] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ filter: "url(#rough-paper)" }}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <SketchButton
                type="submit"
                className="w-full bg-black text-white py-4 font-bold flex items-center justify-center gap-2 rounded-xl text-center"
              >
                Sign In to Dashboard <ArrowRight size={18} />
              </SketchButton>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
              <ShieldCheck size={16} className="text-green-600" />
              Secured with Firebase OAuth & MongoDB
            </div>
          </div>
        </motion.div>

        {/* Drawn Arrow Decoration */}
        <div className="hidden md:block absolute -right-28 top-1/3">
          <DrawnArrow />
        </div>
      </section>

      {/* Floating Background Doodles */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute left-[12%] bottom-[15%] opacity-20 hidden lg:block"
      >
        <BookOpen size={56} className="-rotate-12" />
      </motion.div>
    </main>
  );
}
