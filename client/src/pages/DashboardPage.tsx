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
    <div className="flex h-screen overflow-hidden bg-[#fdfbf7]">
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
        <header className="sticky top-0 z-30 bg-[#fdfbf7] border-b-[3px] border-black px-4 sm:px-6 md:px-8 py-3 md:py-4">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-2">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden shrink-0 self-center p-2 border-2 border-black rounded-lg bg-white shadow-[2px_2px_0px_#000]"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="min-w-0 flex-1">
              <span className="font-sketch text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={14} className="shrink-0" /> Student Dashboard
              </span>
              <h1 className="text-lg sm:text-2xl xl:text-3xl font-black tracking-tight leading-tight">
                Welcome back, <span className="whitespace-nowrap underline decoration-yellow-400 decoration-wavy">{user?.username || 'Scholar'}</span>!
              </h1>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
              {activeTab === 'Dashboard' && (
                <div className="hidden xl:block">
                  <TimeToggle active={timeRange} onChange={setTimeRange} />
                </div>
              )}
              <Link to="/quiz" className="hidden md:block">
                <SketchButton variant="accent" icon={Play} className="text-sm py-2">
                  Start Quiz
                </SketchButton>
              </Link>
              <SketchButton
                variant="outline"
                icon={LogOut}
                onClick={logout}
                className="text-sm py-2 px-3 sm:px-5"
              >
                <span className="hidden sm:inline">Logout</span>
              </SketchButton>
            </div>
          </div>

          {activeTab === 'Dashboard' && (
            <div className="mx-auto mt-3 w-full max-w-6xl xl:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <TimeToggle active={timeRange} onChange={setTimeRange} />
              </div>
            </div>
          )}
        </header>

        {/* Content View Switcher */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {/* Quick Quiz Callout */}
          <div className="mb-8 p-5 sm:p-6 bg-yellow-300 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4 shape-wobble">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black leading-tight">Ready for a Timed Quiz Challenge?</h2>
              <p className="mt-1 font-sketch text-base sm:text-lg text-black/80">Choose your subject, question count, and timer speed to test your knowledge.</p>
            </div>
            <Link to="/quiz" className="shrink-0 self-start md:self-auto">
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
