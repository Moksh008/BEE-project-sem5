import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Timer,
  CheckCircle2,
  Trophy,
  Zap,
  BookOpen,
  Brain,
  Code,
  Users,
  HelpCircle,
  Play,
  LogIn
} from 'lucide-react';
import {
  GlobalStyles,
  ChartPatterns,
  PopCard,
  SketchButton,
  teamMembers
} from '../components/ui/PaperPop';

/**
 * Landing Page Component (Paper-Pop Retro Hand-Drawn Theme).
 * Concept: Mobile-First Vertical Stack Layout (`flex flex-col w-full overflow-x-hidden`)
 * Prevents horizontal layout overflow and guarantees responsive vertical section stacking.
 */
export default function LandingPage(): React.ReactElement {
  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] flex flex-col overflow-x-hidden font-sans text-black selection:bg-yellow-300 selection:text-black">
      <GlobalStyles />
      <ChartPatterns />

      {/* --- STICKY NAVBAR --- */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#fdfbf7]/90 backdrop-blur-sm border-b-[3px] border-black">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-300 border-[2.5px] border-black rounded-xl shape-wobble-sm shadow-[2px_2px_0px_#000]">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight">
            Quiz<span className="text-amber-600 underline decoration-yellow-400 decoration-wavy">Master</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-sketch font-bold text-base">
          <a href="#features" className="hover:text-amber-700 transition-colors">FEATURES</a>
          <a href="#topics" className="hover:text-amber-700 transition-colors">TOPICS</a>
          <a href="#team" className="hover:text-amber-700 transition-colors">TEAM</a>
          <a href="#faq" className="hover:text-amber-700 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <SketchButton variant="primary" icon={LogIn} className="text-sm py-2 px-5">
              Log In
            </SketchButton>
          </Link>
        </div>
      </header>

      {/* --- HERO SECTION (VERTICAL STACK) --- */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-200 border-[2.5px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000] font-sketch font-bold text-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-amber-700" /> BEE PROJECT • SEMESTER 5 EVALUATION
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6 max-w-4xl"
        >
          Master Electrical & Web Concepts with <span className="underline decoration-yellow-400 decoration-wavy">Real-Time Quiz Engine</span>
        </motion.h1>

        <p className="font-sketch text-lg sm:text-xl md:text-2xl text-zinc-700 max-w-2xl mb-8 leading-relaxed">
          Interactive evaluation platform designed for semester study. Practice BEE, Web Tech, and CS topics with dynamic timers, live score analytics, and Groq Llama 3.3 AI note conversion!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link to="/login">
            <SketchButton variant="primary" icon={Play} className="text-lg py-3.5 px-8">
              Start Quiz Engine
            </SketchButton>
          </Link>
          <a href="#features">
            <SketchButton variant="outline" icon={ArrowRight} className="text-lg py-3.5 px-8">
              Explore Features
            </SketchButton>
          </a>
        </div>

        {/* Hero Quick Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl">
          <PopCard color="bg-amber-100" className="p-4 text-center">
            <div className="text-2xl font-black">100%</div>
            <div className="font-sketch text-sm">Real-time Timers</div>
          </PopCard>
          <PopCard color="bg-purple-100" className="p-4 text-center">
            <div className="text-2xl font-black">Groq AI</div>
            <div className="font-sketch text-sm">Llama 3.3 70B</div>
          </PopCard>
          <PopCard color="bg-blue-100" className="p-4 text-center">
            <div className="text-2xl font-black">30+</div>
            <div className="font-sketch text-sm">JS & BEE Modules</div>
          </PopCard>
          <PopCard color="bg-green-100" className="p-4 text-center">
            <div className="text-2xl font-black">Live</div>
            <div className="font-sketch text-sm">Leaderboard Sync</div>
          </PopCard>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="w-full bg-white border-y-[3px] border-black py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <span className="font-sketch text-sm font-bold text-amber-700 uppercase tracking-widest">CORE MODULES</span>
            <h2 className="text-3xl md:text-4xl font-black">Quiz Master Platform Toolkit</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PopCard color="bg-yellow-100" className="p-8 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-yellow-300 border-[2.5px] border-black rounded-xl inline-block mb-4 shadow-[2px_2px_0px_#000]">
                  <Timer className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-black mb-2">Timed Assessment Engine</h3>
                <p className="font-sketch text-base text-zinc-700">
                  Smart countdown clock with auto-submission guard, question palette navigation, and question flagging.
                </p>
              </div>
            </PopCard>

            <PopCard color="bg-purple-100" className="p-8 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-purple-300 border-[2.5px] border-black rounded-xl inline-block mb-4 shadow-[2px_2px_0px_#000]">
                  <Sparkles className="w-8 h-8 text-purple-900" />
                </div>
                <h3 className="text-xl font-black mb-2">Groq Llama 3.3 AI Generator</h3>
                <p className="font-sketch text-base text-zinc-700">
                  Paste any lecture notes or syllabus text to generate custom, non-repeating multiple-choice quizzes instantly.
                </p>
              </div>
            </PopCard>

            <PopCard color="bg-blue-100" className="p-8 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-blue-300 border-[2.5px] border-black rounded-xl inline-block mb-4 shadow-[2px_2px_0px_#000]">
                  <Trophy className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-black mb-2">Live Real-Time Leaderboards</h3>
                <p className="font-sketch text-base text-zinc-700">
                  Inter-tab storage listeners & REST API polling synchronize top score rankings live across all student dashboards.
                </p>
              </div>
            </PopCard>
          </div>
        </div>
      </section>

      {/* --- TOPICS & CURRICULUM SECTION --- */}
      <section id="topics" className="w-full py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <span className="font-sketch text-sm font-bold text-amber-700 uppercase tracking-widest">CURRICULUM COVERAGE</span>
          <h2 className="text-3xl md:text-4xl font-black">Covering Electrical & Web Syllabus</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PopCard color="bg-amber-200" className="p-6">
            <Zap className="w-8 h-8 mb-3 text-black" />
            <h3 className="font-black text-xl mb-2">BEE Electrical</h3>
            <p className="font-sketch text-sm text-black/80">KCL, KVL, Ideal Transformers, AC Phasors & Impedance.</p>
          </PopCard>

          <PopCard color="bg-yellow-300" className="p-6">
            <Code className="w-8 h-8 mb-3 text-black" />
            <h3 className="font-black text-xl mb-2">JavaScript Core</h3>
            <p className="font-sketch text-sm text-black/80">Variables, ES6+, Higher-Order Methods (map, filter, reduce).</p>
          </PopCard>

          <PopCard color="bg-blue-200" className="p-6">
            <Brain className="w-8 h-8 mb-3 text-black" />
            <h3 className="font-black text-xl mb-2">Computer Science</h3>
            <p className="font-sketch text-sm text-black/80">Data Structures (Stack LIFO, Queues) & Algorithm Basics.</p>
          </PopCard>

          <PopCard color="bg-pink-200" className="p-6">
            <BookOpen className="w-8 h-8 mb-3 text-black" />
            <h3 className="font-black text-xl mb-2">Web Technology</h3>
            <p className="font-sketch text-sm text-black/80">DOM Traversal, Event Handling, LocalStorage & Fetch API.</p>
          </PopCard>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section id="team" className="w-full bg-indigo-50 border-y-[3px] border-black py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <span className="font-sketch text-sm font-bold text-amber-700 uppercase tracking-widest">PROJECT DEVELOPERS</span>
            <h2 className="text-3xl md:text-4xl font-black">BEE Project Semester 5 Team</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <PopCard key={member.id} color="bg-white" className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-yellow-200 border-[2.5px] border-black rounded-full mb-4 shadow-[3px_3px_0px_#000] overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${member.avatar}`}
                    alt={member.name}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <h3 className="font-black text-lg">{member.name}</h3>
                <p className="font-sketch text-sm font-bold text-amber-700">{member.role}</p>
              </PopCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="w-full py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <span className="font-sketch text-sm font-bold text-amber-700 uppercase tracking-widest">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-3xl md:text-4xl font-black">Quiz Master FAQ</h2>
        </div>

        <div className="space-y-4">
          <PopCard color="bg-white" className="p-6">
            <h3 className="font-black text-lg mb-2">What subjects and categories are supported?</h3>
            <p className="font-sketch text-base text-zinc-700">
              Quiz Master supports Basic Electrical Engineering (BEE), Computer Science Core, JavaScript & Web Technologies, and custom Groq AI Note generation!
            </p>
          </PopCard>

          <PopCard color="bg-white" className="p-6">
            <h3 className="font-black text-lg mb-2">How does the Groq AI Note Generator work?</h3>
            <p className="font-sketch text-base text-zinc-700">
              Paste your lecture notes or syllabus text in the AI Notes tab. Groq AI (`llama-3.1-8b-instant`) analyzes the key concepts and creates a custom multiple-choice quiz!
            </p>
          </PopCard>

          <PopCard color="bg-white" className="p-6">
            <h3 className="font-black text-lg mb-2">Are quiz scores saved automatically?</h3>
            <p className="font-sketch text-base text-zinc-700">
              Yes! Your scores, percentage accuracy, and completion timestamps are stored in `localStorage` and synchronized with the backend MongoDB database.
            </p>
          </PopCard>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t-[3px] border-black bg-[#fdfbf7] py-8 px-6 text-center">
        <p className="font-sketch text-base font-bold text-zinc-700">
          Quiz Master Platform • BEE Project Semester 5 • Built with React 18, Vite, TypeScript & Express
        </p>
      </footer>
    </div>
  );
}
