import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, LogOut, ShieldCheck, Sparkles, Trophy, Award, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  GlobalStyles,
  ChartPatterns,
  Sidebar,
  PopCard,
  SketchButton,
  useRealtimeStats,
} from '../components/ui/PaperPop';

/**
 * Student Profile Page.
 * Reached from the sidebar "View Profile" button (route: /profile).
 * Shows the signed-in account details plus the live quiz statistics.
 */
export default function ProfilePage(): React.ReactElement {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const realtime = useRealtimeStats();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const initial = (user?.username || 'S').trim().charAt(0).toUpperCase();
  const avatarUrl =
    user?.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(user?.username || 'Scholar')}`;

  const stats = [
    { label: 'Quizzes Completed', val: String(realtime.completedCount), color: 'bg-[#a5b4fc]', icon: Trophy },
    { label: 'Average Accuracy', val: realtime.avgScore > 0 ? `${realtime.avgScore}%` : '—', color: 'bg-[#fca5a5]', icon: Activity },
    { label: 'Best Score', val: realtime.bestScore > 0 ? `${realtime.bestScore}%` : '—', color: 'bg-[#86efac]', icon: Award },
  ];

  return (
    <div className="min-h-screen flex bg-[#fdfbf7]">
      <GlobalStyles />
      <ChartPatterns />

      {/* Hand-Drawn Wobbly Sidebar */}
      <Sidebar
        active="Profile"
        setActive={() => navigate('/dashboard')}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-5 bg-[#fdfbf7]/90 backdrop-blur-sm border-b-[3px] border-black">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="lg:hidden p-2 border-2 border-black rounded-lg bg-white shadow-[2px_2px_0px_#000]"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <span className="font-sketch text-sm font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={14} /> Student Profile
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                My <span className="underline decoration-yellow-400 decoration-wavy">Account</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SketchButton
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate('/dashboard')}
              className="text-sm py-2"
            >
              Back to Dashboard
            </SketchButton>
            <SketchButton variant="outline" icon={LogOut} onClick={logout} className="text-sm py-2">
              Logout
            </SketchButton>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Identity Card */}
            <PopCard color="bg-blue-100" className="flex flex-col md:flex-row items-center gap-8 py-8">
              <div className="relative w-32 h-32 shrink-0 bg-white border-[3px] border-black rounded-full overflow-hidden shadow-[4px_4px_0px_0px_#000] flex items-center justify-center">
                <span className="absolute text-5xl font-black" aria-hidden="true">{initial}</span>
                <img
                  src={avatarUrl}
                  alt={user?.username || 'Student avatar'}
                  className="relative w-full h-full object-cover"
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tight mb-1">
                  {user?.username || 'Scholar'}
                </h2>
                <p className="font-sketch text-lg text-black/70 flex items-center justify-center md:justify-start gap-2">
                  <Mail size={18} /> {user?.email || 'No email on file'}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-yellow-200 border-[2px] border-black shape-wobble-sm font-sketch font-bold text-sm uppercase tracking-widest">
                    {user?.provider === 'google' ? 'Google OAuth' : 'Email & Password'}
                  </span>
                  <span className="px-3 py-1 bg-white border-[2px] border-black shape-wobble-sm font-sketch font-bold text-sm">
                    UID: {user?.uid || 'guest'}
                  </span>
                </div>
              </div>
            </PopCard>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <PopCard key={i} color={stat.color} className="flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                    <span className="font-sketch text-xl font-bold">{stat.label}</span>
                    <div className="bg-black/10 p-2 rounded-lg border-2 border-black/10">
                      <stat.icon className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-5xl font-black tracking-tight">{stat.val}</h2>
                    <span className="font-sketch text-sm font-bold text-black/70 flex items-center gap-1">
                      <Activity size={14} className="animate-pulse text-green-600" /> Live Sync
                    </span>
                  </div>
                </PopCard>
              ))}
            </div>

            {/* Account Safety Note */}
            <PopCard color="bg-white" className="flex items-center gap-4">
              <div className="p-3 bg-green-200 border-[2.5px] border-black shape-wobble-sm shrink-0 shadow-[2px_2px_0px_#000]">
                <ShieldCheck size={22} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-black text-lg mb-1">Secured Account</h3>
                <p className="font-sketch text-lg text-black/70">
                  {user?.provider === 'google'
                    ? 'Signed in through Google OAuth. Your session is verified by Firebase.'
                    : 'Signed in with your email and password. A verification message was sent to your inbox on first sign-up.'}
                </p>
              </div>
            </PopCard>
          </div>
        </main>
      </div>
    </div>
  );
}