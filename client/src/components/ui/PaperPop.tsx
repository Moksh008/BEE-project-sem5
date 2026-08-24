import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout, PieChart, Users, Settings, MessageSquare, X, PenTool, User,
  LucideIcon, Zap, Coffee, CheckCircle2, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

// --- Styles & Fonts ---
export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Patrick+Hand&display=swap');

      body {
        background-color: #fdfbf7;
        background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
        background-size: 24px 24px;
        color: #1e1e1e;
        font-family: 'Outfit', sans-serif;
      }

      .font-sketch {
        font-family: 'Patrick Hand', cursive;
      }

      /* The "Wobbly" Border Radius Class */
      .shape-wobble {
        border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
      }
      
      .shape-wobble-sm {
        border-radius: 50px 5px 40px 5px / 5px 40px 5px 50px;
      }

      /* Custom Scrollbar */
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #000; border-radius: 10px; border: 2px solid #fdfbf7; }
    `}</style>
  );
}

// --- Mock Data ---
export const timeRanges = ["Daily", "Monthly", "Yearly"];

export const dashboardData = {
  Daily: {
    revenue: [
      { name: "00h", val: 240 },
      { name: "04h", val: 139 },
      { name: "08h", val: 980 },
      { name: "12h", val: 390 },
      { name: "16h", val: 480 },
      { name: "20h", val: 380 },
      { name: "24h", val: 430 },
    ],
    stats: [
      { label: "Quiz Daily Activity", val: "4,200", color: "bg-[#a5b4fc]", icon: Zap },
      { label: "Daily Active Students", val: "1,203", color: "bg-[#fca5a5]", icon: Users },
      { label: "Questions Completed", val: "8,542", color: "bg-[#86efac]", icon: Coffee },
    ]
  },
  Monthly: {
    revenue: [
      { name: "W1", val: 2400 },
      { name: "W2", val: 1398 },
      { name: "W3", val: 9800 },
      { name: "W4", val: 3908 },
    ],
    stats: [
      { label: "Quiz Monthly Activity", val: "45,200", color: "bg-[#a5b4fc]", icon: Zap },
      { label: "Monthly Active Students", val: "12,203", color: "bg-[#fca5a5]", icon: Users },
      { label: "Questions Completed", val: "85,423", color: "bg-[#86efac]", icon: Coffee },
    ]
  },
  Yearly: {
    revenue: [
      { name: "Q1", val: 24000 },
      { name: "Q2", val: 13980 },
      { name: "Q3", val: 98000 },
      { name: "Q4", val: 39080 },
    ],
    stats: [
      { label: "Quiz Yearly Activity", val: "545,200", color: "bg-[#a5b4fc]", icon: Zap },
      { label: "Yearly Active Students", val: "142,203", color: "bg-[#fca5a5]", icon: Users },
      { label: "Questions Completed", val: "985,423", color: "bg-[#86efac]", icon: Coffee },
    ]
  }
};

export const uiTasks = [
  { id: 1, text: "BEE Quiz Prep - Unit 1", tag: "Study", color: "bg-blue-300" },
  { id: 2, text: "Web Dev Timed Practice", tag: "Quiz", color: "bg-pink-300" },
  { id: 3, text: "Review Incorrect Answers", tag: "Review", color: "bg-yellow-300" },
  { id: 4, text: "Check Global Leaderboard", tag: "Rank", color: "bg-green-300" },
];

export const teamMembers = [
  { id: 1, name: "Riya Yadav", role: "Top Scorer (98%)", avatar: "Felix" },
  { id: 2, name: "Alex Rivera", role: "Rank #2 Scholar", avatar: "Oliver" },
  { id: 3, name: "Jordan Smith", role: "BEE Specialist", avatar: "Max" },
  { id: 4, name: "Sam Wilson", role: "Code Master", avatar: "Lucy" },
];

// --- Components ---

export function PopCard({ children, className, color = "bg-white" }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, rotate: 0.5 }}
      className={cn(
        "relative border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all shape-wobble",
        color,
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function SketchButton({ children, onClick, variant = "primary", className, icon: Icon }: { children: React.ReactNode; onClick?: () => void; variant?: string; className?: string; icon?: LucideIcon }) {
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800",
    accent: "bg-[#fdba74] text-black hover:bg-[#fb923c]", // Orange
    outline: "bg-white text-black hover:bg-zinc-50",
    ghost: "bg-transparent border-transparent shadow-none hover:bg-black/5"
  };

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center justify-center gap-2 border-[3px] border-black px-5 py-2.5 font-bold shadow-[2px_2px_0px_0px_#000] transition-colors shape-wobble-sm",
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5 stroke-[2.5px]" />}
      {children}
    </motion.button>
  );
}

export function Scribble() {
  return (
    <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
    </svg>
  );
}

export function ChartPatterns() {
  return (
    <svg height="0" width="0">
      <defs>
        <pattern id="lines" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="4" />
        </pattern>
        <linearGradient id="colorSketch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#c084fc" stopOpacity={0.5} />
          <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TimeToggle({ active, onChange }: { active: string; onChange: (val: string) => void }) {
  return (
    <div className="flex gap-2">
      {timeRanges.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "px-4 py-1.5 font-bold border-[3px] border-black shadow-[2px_2px_0px_#000] shape-wobble-sm transition-all",
            active === t ? "bg-yellow-300 scale-105" : "bg-white hover:bg-zinc-50"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// --- Navigation ---
export function Sidebar({ active, setActive, isOpen, setIsOpen }: { active: string; setActive: (active: string) => void; isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const items = [
    { id: "Dashboard", icon: Layout },
    { id: "Analytics", icon: PieChart },
    { id: "Leaderboard", icon: Users },
    { id: "Messages", icon: MessageSquare },
    { id: "Settings", icon: Settings },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed lg:static top-0 left-0 z-50 h-screen w-72 bg-[#fdfbf7] border-r-[3px] border-black p-6 transition-transform lg:translate-x-0 flex flex-col gap-8",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-12 h-12 bg-purple-400 border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <span className="font-sketch text-3xl font-bold">QuizMaster</span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden ml-auto">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setIsOpen(false); }}
                className={cn(
                  "group relative flex items-center gap-4 px-4 py-3 font-bold text-lg transition-all shape-wobble-sm border-[3px] border-transparent hover:border-black/10",
                  isActive ? "bg-yellow-300 border-black shadow-[3px_3px_0px_#000]" : "text-zinc-500 hover:bg-white"
                )}
              >
                <item.icon className={cn("w-6 h-6 stroke-[2.5px]", isActive ? "text-black" : "text-zinc-400 group-hover:text-black")} />
                {item.id}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto">
          <PopCard color="bg-blue-100" className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full mb-3 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix" alt="User" />
            </div>
            <h4 className="font-bold text-lg">Hey, Quiz Scholar!</h4>
            <p className="font-sketch text-zinc-600 mb-4">You have 4 tasks pending.</p>
            <SketchButton variant="outline" className="w-full text-sm py-1" onClick={() => { }} icon={User}>View Profile</SketchButton>
          </PopCard>
        </div>
      </aside>
    </>
  );
}

// --- Views ---

export function OverviewView({ timeRange }: { timeRange: string }) {
  const data = dashboardData[timeRange as keyof typeof dashboardData];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.stats.map((stat, i) => (
          <PopCard key={i} color={stat.color} className="flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="font-sketch text-xl font-bold">{stat.label}</span>
              <div className="bg-black/10 p-2 rounded-lg border-2 border-black/10">
                <stat.icon className="w-6 h-6 text-black" />
              </div>
            </div>
            <h2 className="text-5xl font-black tracking-tight">{stat.val}</h2>
          </PopCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <PopCard className="lg:col-span-2 min-h-[400px] bg-white" color="bg-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-black">Student Activity Metrics</h3>
              <p className="font-sketch text-zinc-500 text-lg">Look at those scores go up!</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontFamily: 'Patrick Hand', fontSize: 18, fill: '#000' }}
                  axisLine={{ stroke: '#000', strokeWidth: 2 }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fontFamily: 'Patrick Hand', fontSize: 18, fill: '#000' }}
                  axisLine={{ stroke: '#000', strokeWidth: 2 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '15px',
                    border: '3px solid black',
                    boxShadow: '4px 4px 0px #000',
                    fontFamily: 'Outfit',
                    fontWeight: 'bold'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#000"
                  strokeWidth={4}
                  fill="url(#colorSketch)"
                  dot={{ r: 6, strokeWidth: 3, fill: '#fff', stroke: '#000' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PopCard>

        {/* Tasks */}
        <PopCard className="bg-[#fde047] flex flex-col" color="bg-[#fde047]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black">Study Notes & Tasks</h3>
            <div className="bg-black text-white px-2 py-1 font-bold rounded text-xs -rotate-6">
              TODO
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {uiTasks.map((t) => (
              <div
                key={t.id}
                className="group flex items-center gap-3 bg-white p-3 border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform cursor-pointer"
              >
                <div className={cn("w-6 h-6 border-2 border-black rounded-full flex items-center justify-center transition-colors group-hover:bg-black group-hover:text-white")}>
                  <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </div>
                <span className="font-sketch text-xl leading-none pt-1">{t.text}</span>
                <span className={cn("ml-auto text-[10px] font-bold border border-black px-1 rounded uppercase", t.color)}>
                  {t.tag}
                </span>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-black/50 rounded-xl font-bold text-black/50 hover:bg-white/50 hover:border-black hover:text-black transition-all mt-4">
              + Add New Task
            </button>
          </div>
        </PopCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PopCard className="bg-white" color="bg-white">
          <h3 className="text-xl font-black mb-4">Quiz Category Performance ({timeRange})</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenue.slice(0, 5)}>
                <XAxis dataKey="name" tick={{ fontFamily: 'Patrick Hand' }} />
                <Bar dataKey="val" stroke="#000" strokeWidth={2} radius={[6, 6, 0, 0]}>
                  {data.revenue.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#fca5a5" : "url(#lines)"} className="text-pink-300" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PopCard>

        <div className="relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 border-l border-r border-white/80 backdrop-blur-sm rotate-2 z-10 shadow-sm" />

          <PopCard color="bg-cyan-200" className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white border-[3px] border-black rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0px_#000]">
              <Zap className="w-10 h-10 text-yellow-400 fill-yellow-400 stroke-black stroke-2" />
            </div>
            <h3 className="text-2xl font-black">Upgrade to QuizMaster Pro</h3>
            <p className="font-sketch text-lg mb-6 max-w-xs">Unlock infinite practice quizzes, detailed answer explanations, and live ranking!</p>
            <SketchButton variant="primary" onClick={() => { }} icon={Zap} className="w-full">Unlock Pro Pass</SketchButton>
          </PopCard>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsView({ timeRange }: { timeRange: string }) {
  const data = dashboardData[timeRange as keyof typeof dashboardData];
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <PopCard className="min-h-[500px]" color="bg-white">
        <h3 className="text-2xl font-black mb-6">Quiz Performance Matrix</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.revenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontFamily: 'Patrick Hand', fontSize: 18 }} axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} />
              <YAxis axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fontFamily: 'Patrick Hand', fontSize: 18 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  border: '3px solid black',
                  boxShadow: '4px 4px 0px black',
                  fontFamily: 'Outfit',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="val" fill="#c084fc" stroke="black" strokeWidth={3} radius={[8, 8, 8, 8]} barSize={40}>
                {data.revenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#fca5a5" : "url(#lines)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PopCard>
    </div>
  );
}

export function TeamView() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <h3 className="text-3xl font-black mb-6 flex items-center gap-2"><Users className="w-8 h-8" /> Leaderboard Top Scholars</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((m) => (
          <PopCard key={m.id} color="bg-indigo-100" className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white border-[3px] border-black rounded-full mb-4 shadow-[4px_4px_0px_#000] overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${m.avatar}`} alt="Avatar" className="w-full h-full object-cover scale-110" />
            </div>
            <h4 className="font-bold text-xl">{m.name}</h4>
            <p className="font-sketch text-zinc-600 mb-6">{m.role}</p>
            <SketchButton variant="outline" onClick={() => { }} className="w-full">High Five!</SketchButton>
          </PopCard>
        ))}
      </div>

      <PopCard color="bg-[#fde047]" className="flex items-center justify-between p-8 border-dashed">
        <div>
          <h4 className="text-2xl font-black">Invite Study Partners</h4>
          <p className="font-sketch text-lg">Send an invite link to study together and challenge each other in live quizzes.</p>
        </div>
        <SketchButton icon={Plus} variant="primary" onClick={() => { }}>Generate Link</SketchButton>
      </PopCard>
    </div>
  );
}

export function MessagesView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h3 className="text-3xl font-black mb-6 flex items-center gap-2"><MessageSquare className="w-8 h-8" /> Discussion Forum</h3>
      {[1, 2, 3].map(i => (
        <PopCard key={i} color="bg-white" className="flex gap-4">
          <div className="w-16 h-16 bg-pink-200 border-[3px] border-black rounded-full shrink-0 shadow-[2px_2px_0px_#000] overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=Chat${i}`} alt="Avatar" className="w-full h-full" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-xl">BEE Study Group #{i}</h4>
              <span className="font-sketch text-zinc-500">{i}h ago</span>
            </div>
            <p className="font-sketch text-lg p-4 bg-zinc-100 border-[3px] border-black shape-wobble-sm shadow-[2px_2px_0px_#000] relative">
              "Hey, the new timed quiz challenge is so fun! I scored 95% on the Web Technologies quiz. Who wants to challenge next?"
              <span className="absolute w-4 h-4 bg-zinc-100 border-l-[3px] border-b-[3px] border-black -left-2 top-4 rotate-45 z-[-1]" />
            </p>
          </div>
        </PopCard>
      ))}
    </div>
  );
}

export function SettingsView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h3 className="text-3xl font-black mb-6 flex items-center gap-2"><Settings className="w-8 h-8" /> Quiz Preference Settings</h3>
      <PopCard color="bg-white" className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black/10 pb-4 border-dashed">
          <div>
            <h4 className="font-bold text-xl">Enable Quiz Countdown Sound Warnings</h4>
            <p className="font-sketch text-lg text-zinc-600">Play subtle audio alert when timer drops under 10 seconds.</p>
          </div>
          <input type="checkbox" className="w-6 h-6 accent-green-400" defaultChecked />
        </div>
        <div className="flex items-center justify-between border-b-2 border-black/10 pb-4 border-dashed">
          <div>
            <h4 className="font-bold text-xl">Show Hand-Drawn Paper Animation Theme</h4>
            <p className="font-sketch text-lg text-zinc-600">Forces PaperPop & HandDrawn styles across all pages.</p>
          </div>
          <input type="checkbox" className="w-6 h-6 accent-blue-400" defaultChecked />
        </div>
        <SketchButton variant="accent" onClick={() => { }} className="mt-4">Save Quiz Preferences</SketchButton>
      </PopCard>
    </div>
  );
}
