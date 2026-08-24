import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Timer, CheckCircle2, Trophy, BookOpen, Sparkles } from 'lucide-react';
import {
  HandDrawnFilters,
  Highlight,
  SketchButton,
  SketchCard,
  DrawnArrow,
} from '../components/ui/HandDrawn';

export default function LandingPage(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();

  // Parallax for background doodles
  const yDoodle = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <main ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[#fdfbf7] font-sans text-[#2d2d2d] selection:bg-[#ffeb3b]">
      <HandDrawnFilters />

      {/* Background Texture (Grid Paper) */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          filter: 'url(#rough-paper)',
        }}
      />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-8 py-6 backdrop-blur-sm">
        <div className="text-2xl font-bold tracking-tight">
          Quiz<span className="text-blue-600">Master</span>
        </div>
        <div className="hidden gap-8 md:flex font-medium">
          {['Quizzes', 'Features', 'Leaderboard', 'Pricing'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="relative group">
              {item}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black transition-all group-hover:w-full rounded-full" />
            </a>
          ))}
        </div>
        <Link to="/login">
          <SketchButton className="text-sm">Get Started</SketchButton>
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        <div className="relative mb-6 inline-block">
          <span className="rounded-full border border-black bg-white px-4 py-2 text-sm font-medium uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            BEE Project • Semester 5
          </span>
        </div>

        <div className="relative max-w-4xl">
          <h1 className="mb-6 text-4xl font-black leading-[1.2] tracking-tight md:text-6xl">
            Master Every Quiz with <br />
            <Highlight color="#a5f3fc">Real-Time</Highlight> Speed.
          </h1>
          <DrawnArrow />
        </div>

        <p className="max-w-xl text-xl text-gray-600 font-medium leading-relaxed">
          An interactive full-stack quiz platform designed for subject mastery, customizable countdown timers, instant score feedback, and live rank analytics.
        </p>

        <div className="mt-10 flex gap-6">
          <Link to="/login">
            <SketchButton>
              Start Quiz Engine <ArrowRight size={18} />
            </SketchButton>
          </Link>
        </div>

        {/* Floating Doodles */}
        <motion.div style={{ y: yDoodle }} className="absolute left-[10%] top-[20%] opacity-20 hidden lg:block">
          <BookOpen size={64} className="-rotate-12" />
        </motion.div>
        <motion.div style={{ y: yDoodle }} className="absolute right-[10%] bottom-[20%] opacity-20 hidden lg:block">
          <Trophy size={64} className="rotate-12" />
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="relative z-10 px-6 py-24" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold">Quiz Master <Highlight>Toolkit</Highlight></h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <SketchCard delay={0.1} title="Timed Quiz Engine" icon={<Timer size={24} />} />
            <SketchCard delay={0.2} title="Instant Score Review" icon={<CheckCircle2 size={24} />} />
            <SketchCard delay={0.3} title="Live Leaderboards" icon={<Trophy size={24} />} />
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL (Sticky Note Style) --- */}
      <section className="relative z-10 flex items-center justify-center py-32 bg-[#fffdf5] border-y border-black/5" id="quizzes">
        <div className="relative w-full max-w-2xl px-6">
          {/* Sticky Note */}
          <motion.div
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="relative rotate-1 bg-[#ffeb3b] p-12 shadow-[4px_4px_10px_rgba(0,0,0,0.1)]"
            style={{ filter: "url(#rough-paper)" }}
          >
            {/* Pin */}
            <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-black/20 bg-red-500 shadow-sm" />

            <p className="font-serif text-2xl italic leading-relaxed text-black/80">
              "Quiz Master completely changed how we prepare for semester exams. The timed challenges and instant feedback make studying interactive and fun!"
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-black/10 flex items-center justify-center font-bold" style={{ filter: "url(#rough-paper)" }}>
                RY
              </div>
              <div>
                <div className="font-bold">Riya Yadav</div>
                <div className="text-sm opacity-60">BEE Semester 5 Student, Top Scorer</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CHECKLIST --- */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="space-y-6">
          {[
            "Multiple Academic Categories (BEE, CS Core, Web Technologies)",
            "Real-Time Countdown Timer with Auto-Submission Guard",
            "Detailed Answer Breakdown & Correct Answer Explanations",
            "Local Session Persistence & Leaderboard High Scores",
          ].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 border-b border-black/10 pb-4"
            >
              <CheckCircle2 className="text-green-600" />
              <span className="text-xl font-medium">{item}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- NEW SECTION: TRUSTED BY MARQUEE --- */}
      <section className="relative z-10 overflow-hidden border-y-2 border-black bg-[#ffeb3b] py-12" style={{ filter: "url(#rough-paper)" }}>
        <div className="flex whitespace-nowrap">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex gap-24 px-12 text-3xl font-black uppercase tracking-widest text-black"
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-8">
                <span>ELECTRICAL</span>
                <span className="opacity-30">×</span>
                <span>COMPUTER SCIENCE</span>
                <span className="opacity-30">×</span>
                <span>WEB DEV</span>
                <span className="opacity-30">×</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION: HAND-DRAWN GALLERY --- */}
      <section className="relative z-10 px-6 py-32" id="leaderboard">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <h2 className="text-5xl font-black md:text-6xl">Quiz Engine <Highlight color="#fbcfe8">Showcase.</Highlight></h2>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {[
              { title: "Timed Quiz Interface", desc: "Real-time countdown timer, question navigator palette, and flagging options.", img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80" },
              { title: "Performance Breakdown", desc: "Automated scoring, percentage evaluation, and correct answer explanations.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ rotate: i % 2 === 0 ? 2 : -2 }}
                className="group relative"
              >
                <div className="relative overflow-hidden border-4 border-black bg-white p-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all group-hover:shadow-[16px_16px_0px_rgba(0,0,0,1)]" style={{ filter: "url(#rough-paper)", borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                  <div className="relative mb-4 aspect-video overflow-hidden border-2 border-dashed border-black">
                    <img src={item.img} alt={item.title} className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold italic">{item.title}</h3>
                  <p className="mt-2 text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: PRICING --- */}
      <section className="relative z-10 bg-[#fffdf5] px-6 py-32 border-t border-dashed border-black/20" id="pricing">
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">Simple <Highlight color="#bbf7d0">Pricing.</Highlight></h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Basic Plan */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative border-2 border-black bg-white p-12 text-center"
              style={{ filter: "url(#rough-paper)" }}
            >
              <h3 className="text-2xl font-bold">Student Scholar</h3>
              <div className="my-6 text-6xl font-black">$0</div>
              <ul className="mb-8 space-y-4 font-medium text-gray-600">
                <li>5-20 Questions per Quiz</li>
                <li>Instant Score Calculation</li>
                <li>Local Leaderboard Storage</li>
                <li>Standard Academic Categories</li>
              </ul>
              <Link to="/login">
                <SketchButton className="w-full">Start Playing Free</SketchButton>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative border-4 border-black bg-black text-white p-12 text-center shadow-[12px_12px_0px_#ffeb3b]"
              style={{ filter: "url(#rough-paper)" }}
            >
              <div className="absolute -top-6 right-8 rotate-12 rounded-full border-2 border-black bg-white px-4 py-1 text-sm font-bold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold">Master Pro</h3>
              <div className="my-6 text-6xl font-black">$9</div>
              <ul className="mb-8 space-y-4 font-medium text-gray-400">
                <li>Unlimited Quizzes</li>
                <li>Detailed Answer Explanations</li>
                <li>Custom Subject Question Banks</li>
                <li>Priority Support & Analytics</li>
              </ul>
              <Link to="/login">
                <button type="button" className="w-full border-2 border-white bg-white px-8 py-4 font-bold text-black transition-all hover:bg-transparent hover:text-white" style={{ filter: "url(#rough-paper)" }}>
                  Unlock Master Pro
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: FAQ --- */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-16 text-center text-4xl font-bold">Quiz Master <Highlight color="#fed7aa">FAQ.</Highlight></h2>

          <div className="space-y-6">
            {[
              { q: "What subjects and categories are covered?", a: "Quiz Master supports General Knowledge, Science, Technology, Basic Electrical Engineering (BEE), History, Geography, and Web Technologies." },
              { q: "How does the real-time timer work?", a: "Each quiz allocates a smart countdown based on question quantity and difficulty. Answers auto-submit when the clock reaches zero." },
              { q: "Is my score saved automatically?", a: "Yes! Scores are calculated instantly and stored on your local leaderboard session so you can track your progress across retries." },
            ].map((faq, i) => (
              <details key={i} className="group overflow-hidden rounded-xl border-2 border-black bg-white transition-all open:bg-yellow-50" style={{ filter: "url(#rough-paper)" }}>
                <summary className="cursor-pointer p-6 text-xl font-bold outline-none flex justify-between items-center list-none">
                  {faq.q}
                  <span className="transition-transform group-open:rotate-45 text-3xl font-light">+</span>
                </summary>
                <div className="border-t-2 border-dashed border-black/20 p-6 text-lg font-medium text-gray-700">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t-2 border-dashed border-black/20 py-12 text-center">
        <p className="font-medium opacity-70">Quiz Master Platform • BEE Project Semester 5 • Built with React, Vite & Node.js</p>
      </footer>
    </main>
  );
}
