import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Timer,
  CheckCircle2,
  Trophy,
  BookOpen,
  Sparkles,
  Zap,
  Brain,
  Code,
  Users,
  HelpCircle,
  Award,
  Cpu,
  Play,
  ChevronDown
} from 'lucide-react';
import {
  HandDrawnFilters,
  SketchButton,
} from '../components/ui/HandDrawn';
import { GlobalStyles, ChartPatterns, PopCard, teamMembers } from '../components/ui/PaperPop';

/**
 * Vertical Landing Page Component.
 * Features:
 * - 100% Vertical Scrolling Layout (Hero -> Features -> Syllabus -> Team -> FAQ -> Footer)
 * - PaperPop Retro Hand-Drawn Design System
 * - Fully Responsive Grid & Card Stacking
 */
export default function LandingPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans text-[#1e1e1e] selection:bg-yellow-300 selection:text-black">
      <GlobalStyles />
      <ChartPatterns />
      <HandDrawnFilters />

      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-[#fdfbf7]/90 backdrop-blur-md border-b-[3px] border-black">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-300 border-[2.5px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000]">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <span className="text-2xl font-black tracking-tight">
            Quiz<span className="underline decoration-yellow-400 decoration-wavy">Master</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-black text-sm uppercase tracking-wider">
          <a href="#features" className="hover:text-amber-600 transition-colors">Features</a>
          <a href="#syllabus" className="hover:text-amber-600 transition-colors">Syllabus</a>
          <a href="#team" className="hover:text-amber-600 transition-colors">Team</a>
          <a href="#faq" className="hover:text-amber-600 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <SketchButton variant="primary" icon={ArrowRight} className="text-sm py-2 px-5">
              Log In
            </SketchButton>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-12 flex flex-col gap-20">
        {/* --- 1. HERO SECTION (VERTICAL STACK) --- */}
        <section className="flex flex-col items-center text-center pt-8 pb-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-200 border-[2.5px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000] font-sketch font-bold text-sm text-black mb-6"
          >
            <Sparkles size={16} className="text-amber-600" /> BEE Project • Semester 5 Evaluation
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 max-w-4xl">
            Master Electrical & Web Concepts with <span className="bg-yellow-300 px-3 py-1 border-[3px] border-black shape-wobble inline-block shadow-[3px_3px_0px_#000] my-1">Real-Time</span> Speed.
          </h1>

          <p className="font-sketch text-xl md:text-2xl text-black/80 max-w-2xl mb-8 leading-relaxed">
            An interactive assessment platform featuring timed quiz challenges, Groq Llama 3.3 AI syllabus generators, live rank analytics, and instant score breakdowns.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/login">
              <SketchButton variant="primary" icon={Play} className="text-lg py-4 px-8 bg-yellow-400 hover:bg-yellow-500">
                Launch Quiz Engine Now
              </SketchButton>
            </Link>
            <a href="#features">
              <SketchButton variant="outline" icon={ChevronDown} className="text-lg py-4 px-8">
                Explore Features
              </SketchButton>
            </a>
          </div>
        </section>

        {/* --- 2. CORE MODULES (FEATURES TOOLKIT) --- */}
        <section id="features" className="space-y-8 pt-6">
          <div className="text-center space-y-2">
            <span className="font-sketch text-base font-bold uppercase tracking-widest text-amber-700">CORE MODULES</span>
            <h2 className="text-3xl md:text-5xl font-black">
              Quiz Master Platform <span className="underline decoration-yellow-400 decoration-wavy">Toolkit</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PopCard color="bg-yellow-100" className="p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-yellow-300 border-[2.5px] border-black shape-wobble-sm flex items-center justify-center mb-6 shadow-[2px_2px_0px_#000]">
                  <Timer className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-2xl font-black mb-3">Timed Assessment Engine</h3>
                <p className="font-sketch text-lg text-black/80">
                  Smart countdown clock with auto-submission guard, question flag navigator, and instant score evaluation.
                </p>
              </div>
            </PopCard>

            <PopCard color="bg-purple-100" className="p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-purple-300 border-[2.5px] border-black shape-wobble-sm flex items-center justify-center mb-6 shadow-[2px_2px_0px_#000]">
                  <Cpu className="w-6 h-6 text-purple-900" />
                </div>
                <h3 className="text-2xl font-black mb-3">Groq Llama 3.3 AI Generator</h3>
                <p className="font-sketch text-lg text-black/80">
                  Paste any lecture notes, textbook excerpt, or syllabus text to generate non-repeating custom quizzes instantly!
                </p>
              </div>
            </PopCard>

            <PopCard color="bg-blue-100" className="p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-300 border-[2.5px] border-black shape-wobble-sm flex items-center justify-center mb-6 shadow-[2px_2px_0px_#000]">
                  <Trophy className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-2xl font-black mb-3">Live Real-Time Leaderboard</h3>
                <p className="font-sketch text-lg text-black/80">
                  Inter-tab storage listeners & live API polling to track top student scores and accuracy rankings in real time.
                </p>
              </div>
            </PopCard>
          </div>
        </section>

        {/* --- 3. CURRICULUM COVERAGE (SYLLABUS TOPICS) --- */}
        <section id="syllabus" className="space-y-8 pt-6">
          <div className="text-center space-y-2">
            <span className="font-sketch text-base font-bold uppercase tracking-widest text-amber-700">CURRICULUM COVERAGE</span>
            <h2 className="text-3xl md:text-5xl font-black">
              Covering Electrical & <span className="underline decoration-pink-400 decoration-wavy">Web Syllabus</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PopCard color="bg-amber-200" className="p-6">
              <div className="p-3 bg-white border-[2px] border-black shape-wobble-sm w-fit mb-4 shadow-[2px_2px_0px_#000]">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="text-xl font-black mb-2">BEE Electrical</h4>
              <p className="font-sketch text-base text-black/80">
                KCL, KVL, Ideal Transformers, AC Phasors, Impedance & Power Factors.
              </p>
            </PopCard>

            <PopCard color="bg-yellow-200" className="p-6">
              <div className="p-3 bg-white border-[2px] border-black shape-wobble-sm w-fit mb-4 shadow-[2px_2px_0px_#000]">
                <Code className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="text-xl font-black mb-2">JS 30-Module Core</h4>
              <p className="font-sketch text-base text-black/80">
                Variables, ES6, Higher-Order Methods (map, filter, reduce), Closures & Promises.
              </p>
            </PopCard>

            <PopCard color="bg-blue-200" className="p-6">
              <div className="p-3 bg-white border-[2px] border-black shape-wobble-sm w-fit mb-4 shadow-[2px_2px_0px_#000]">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-black mb-2">Computer Science</h4>
              <p className="font-sketch text-base text-black/80">
                Data Structures, Stacks (LIFO), Queues, Algorithms & Complexity.
              </p>
            </PopCard>

            <PopCard color="bg-pink-200" className="p-6">
              <div className="p-3 bg-white border-[2px] border-black shape-wobble-sm w-fit mb-4 shadow-[2px_2px_0px_#000]">
                <BookOpen className="w-6 h-6 text-pink-600" />
              </div>
              <h4 className="text-xl font-black mb-2">Web Technologies</h4>
              <p className="font-sketch text-base text-black/80">
                DOM Traversal, Event Handling, Local Storage & Fetch REST APIs.
              </p>
            </PopCard>
          </div>
        </section>

        {/* --- 4. PROJECT DEVELOPERS (TEAM) --- */}
        <section id="team" className="space-y-8 pt-6">
          <div className="text-center space-y-2">
            <span className="font-sketch text-base font-bold uppercase tracking-widest text-amber-700">PROJECT DEVELOPERS</span>
            <h2 className="text-3xl md:text-5xl font-black">
              BEE Project <span className="underline decoration-blue-400 decoration-wavy">Semester 5 Team</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <PopCard key={member.id} color="bg-indigo-100" className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-[3px] border-black rounded-full mb-4 shadow-[3px_3px_0px_#000] overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${member.avatar}`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-black text-lg mb-1">{member.name}</h4>
                <p className="font-sketch text-sm font-bold text-amber-700">{member.role}</p>
              </PopCard>
            ))}
          </div>
        </section>

        {/* --- 5. FAQ SECTION --- */}
        <section id="faq" className="space-y-8 pt-6 mb-12">
          <div className="text-center space-y-2">
            <span className="font-sketch text-base font-bold uppercase tracking-widest text-amber-700">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl md:text-5xl font-black">
              Got <span className="underline decoration-yellow-400 decoration-wavy">Questions?</span>
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: "What subjects and categories are supported?",
                a: "Quiz Master covers Basic Electrical Engineering (BEE), JavaScript 30-Module Curriculum, Computer Science Core, Web Technologies, and General Knowledge."
              },
              {
                q: "How does the Groq AI Note-to-Quiz Generator work?",
                a: "You paste any lecture notes or syllabus excerpt into the AI tab. Groq Cloud Llama 3.1 8B Instant parses the concepts and outputs 5-10 unique multiple choice questions with explanations!"
              },
              {
                q: "How are high scores and leaderboards synchronized?",
                a: "Scores are saved to browser localStorage and synchronized with the Express backend REST API using live storage event listeners and 2.5s polling."
              }
            ].map((item, idx) => (
              <PopCard key={idx} color="bg-white" className="p-6">
                <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" /> {item.q}
                </h3>
                <p className="font-sketch text-lg text-black/80 pl-7">{item.a}</p>
              </PopCard>
            ))}
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t-[3px] border-black bg-white py-8 px-6 text-center font-sketch text-base font-bold text-black/70">
        <p>Quiz Master Platform • BEE Semester 5 Evaluation Project • Built with React 18, Vite, TypeScript & Node.js</p>
      </footer>
    </div>
  );
}
