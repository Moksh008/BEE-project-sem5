import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut, Play, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  GlobalStyles,
  ChartPatterns,
  Sidebar,
  OverviewView,
  AnalyticsView,
  TeamView,
  MessagesView,
  SettingsView,
  TimeToggle,
  SketchButton,
} from '../components/ui/PaperPop';

export default function DashboardPage(): React.ReactElement {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [timeRange, setTimeRange] = useState('Daily');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#fdfbf7]">
      <GlobalStyles />
      <ChartPatterns />

      {/* Hand-Drawn Wobbly Sidebar */}
      <Sidebar
        active={activeTab}
        setActive={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-5 bg-[#fdfbf7]/90 backdrop-blur-sm border-b-[3px] border-black">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 border-2 border-black rounded-lg bg-white shadow-[2px_2px_0px_#000]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <span className="font-sketch text-sm font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={14} /> Student Dashboard
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Welcome back, <span className="underline decoration-yellow-400 decoration-wavy">{user?.username || 'Scholar'}</span>!
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'Dashboard' && (
              <div className="hidden sm:block">
                <TimeToggle active={timeRange} onChange={setTimeRange} />
              </div>
            )}
            <Link to="/quiz">
              <SketchButton variant="accent" icon={Play} className="hidden md:flex text-sm py-2">
                Start Quiz
              </SketchButton>
            </Link>
            <SketchButton
              variant="outline"
              icon={LogOut}
              onClick={logout}
              className="text-sm py-2"
            >
              Logout
            </SketchButton>
          </div>
        </header>

        {/* Content View Switcher */}
        <main className="p-6 md:p-8 flex-1">
          {/* Quick Quiz Callout */}
          <div className="mb-8 p-6 bg-yellow-300 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4 shape-wobble">
            <div>
              <h2 className="text-2xl font-black">Ready for a Timed Quiz Challenge?</h2>
              <p className="font-sketch text-lg text-black/80">Choose your subject, question count, and timer speed to test your knowledge.</p>
            </div>
            <Link to="/quiz" className="shrink-0">
              <SketchButton variant="primary" icon={Play} className="text-lg py-3 px-8">
                Launch Quiz Module
              </SketchButton>
            </Link>
          </div>

          {activeTab === 'Dashboard' && <OverviewView timeRange={timeRange} />}
          {activeTab === 'Analytics' && <AnalyticsView timeRange={timeRange} />}
          {activeTab === 'Leaderboard' && <TeamView />}
          {activeTab === 'Team' && <TeamView />}
          {activeTab === 'Messages' && <MessagesView />}
          {activeTab === 'Settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
