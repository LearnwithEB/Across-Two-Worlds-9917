import { useState, useEffect, useRef } from 'react';
import {
  Users, ShieldCheck, Sparkles, Instagram, ArrowDown, Zap,
  BookOpen, Activity, FileText, Presentation, Terminal, Cpu,
  Quote, ChevronRight, MapPin, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';

// ─── ATOMS ─────────────────────────────────────────────────────────────────────

const HalftoneBg = ({ color = "#ef4444", opacity = 0.06 }: { color?: string; opacity?: number }) => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
    backgroundSize: '28px 28px', opacity,
  }} />
);

const BlueprintGrid = () => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: `linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
  }} />
);

const BridgeArch = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 90 Q100 10 190 90" />
    <line x1="10" y1="90" x2="190" y2="90" />
    <line x1="55" y1="55" x2="55" y2="90" strokeDasharray="4 3" />
    <line x1="100" y1="30" x2="100" y2="90" strokeDasharray="4 3" />
    <line x1="145" y1="55" x2="145" y2="90" strokeDasharray="4 3" />
    <line x1="10" y1="90" x2="10" y2="100" /><line x1="190" y1="90" x2="190" y2="100" />
  </svg>
);

const BridgeIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21c3 0 3-7 9-7s6 7 9 7" />
    <path d="M3 8c3 0 3 7 9 7s6-7 9-7" />
    <path d="M3 14h18" />
  </svg>
);

// ─── CURSOR GLOW ───────────────────────────────────────────────────────────────
const CursorGlow = ({ mode }: { mode: string }) => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  const color = mode === 'student' ? '220,38,38' : '217,119,6';
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{
      background: `radial-gradient(600px at ${pos.x}px ${pos.y}px, rgba(${color},0.07), transparent 80%)`,
      transition: 'background 0.08s ease',
    }} />
  );
};

// ─── COUNTER ───────────────────────────────────────────────────────────────────
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.ceil(target / 40);
    const iv = setInterval(() => { n += step; if (n >= target) { setCount(target); clearInterval(iv); } else setCount(n); }, 30);
    return () => clearInterval(iv);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── VIEW TOGGLE ───────────────────────────────────────────────────────────────
const ViewToggle = ({ mode, setMode }: { mode: string; setMode: (m: string) => void }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100vw-24px)] sm:w-auto max-w-sm sm:max-w-none">
    <div className="relative p-1 rounded-2xl bg-[#0a0a0a]/95 border border-white/10 backdrop-blur-2xl flex shadow-2xl shadow-black/60 w-full sm:w-auto">
      <motion.div
        className={`absolute top-1 h-[calc(100%-8px)] rounded-xl ${mode === 'student' ? 'bg-red-600' : 'bg-amber-600'}`}
        style={{ width: 'calc(50% - 4px)' }}
        animate={{ left: mode === 'student' ? '4px' : 'calc(50%)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
      <button onClick={() => setMode('student')} className={`relative z-10 px-5 sm:px-7 py-3 rounded-xl text-[10px] sm:text-[11px] font-black tracking-[0.15em] transition-colors flex items-center gap-2.5 flex-1 justify-center ${mode === 'student' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
        <Zap size={12} /> STUDENT
      </button>
      <button onClick={() => setMode('facilitator')} className={`relative z-10 px-5 sm:px-7 py-3 rounded-xl text-[10px] sm:text-[11px] font-black tracking-[0.15em] transition-colors flex items-center gap-2.5 flex-1 justify-center ${mode === 'facilitator' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
        <ShieldCheck size={12} /> FACILITATOR
      </button>
    </div>
  </div>
);

// ─── MARQUEE ───────────────────────────────────────────────────────────────────
const Marquee = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => (
  <div className="relative overflow-hidden w-full">
    <div className={`flex whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
      {[...items, ...items].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-5 px-5 text-xs font-black tracking-[0.22em] uppercase text-white/40">
          {item} <span className="text-red-500 text-base leading-none">✦</span>
        </span>
      ))}
    </div>
  </div>
);

// ─── SCRIPTURE BLOCK ───────────────────────────────────────────────────────────
const ScriptureBlock = ({ verse, reference, color = "amber" }: { verse: string; reference: string; color?: string }) => {
  const colorMap: Record<string, { bg: string; border: string; accent: string; quote: string }> = {
    red:     { bg: 'bg-red-950/40',     border: 'border-red-500/30',     accent: 'text-red-400',     quote: 'text-red-500/50' },
    purple:  { bg: 'bg-purple-950/40',  border: 'border-purple-500/30',  accent: 'text-purple-400',  quote: 'text-purple-500/50' },
    emerald: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/30', accent: 'text-emerald-400', quote: 'text-emerald-500/50' },
    blue:    { bg: 'bg-blue-950/40',    border: 'border-blue-500/30',    accent: 'text-blue-400',    quote: 'text-blue-500/50' },
    amber:   { bg: 'bg-amber-950/40',   border: 'border-amber-500/30',   accent: 'text-amber-400',   quote: 'text-amber-500/50' },
  };
  const t = colorMap[color] ?? colorMap.amber;
  return (
    <div className={`relative p-8 rounded-3xl border overflow-hidden ${t.bg} ${t.border}`}>
      <Quote size={32} className={`mb-5 ${t.quote}`} />
      <p className={`text-xl md:text-2xl font-black leading-snug mb-4 tracking-tight ${t.accent}`}>
        &ldquo;{verse}&rdquo;
      </p>
      <div className="text-xs font-black tracking-[0.35em] uppercase text-white/55">{reference}</div>
    </div>
  );
};

// ─── SCRIPTURE PANEL ───────────────────────────────────────────────────────────
type ScriptureEntry = { verse: string; reference: string; note?: string };
const ScripturePanel = ({ verses, color = "amber" }: { verses: ScriptureEntry[]; color?: string }) => {
  const colorMap: Record<string, { border: string; accent: string; notebg: string; notetext: string }> = {
    red:     { border: 'border-red-500/20',     accent: 'text-red-400',     notebg: 'bg-red-500/8',     notetext: 'text-red-300/90' },
    purple:  { border: 'border-purple-500/20',  accent: 'text-purple-400',  notebg: 'bg-purple-500/8',  notetext: 'text-purple-300/90' },
    emerald: { border: 'border-emerald-500/20', accent: 'text-emerald-400', notebg: 'bg-emerald-500/8', notetext: 'text-emerald-300/90' },
    blue:    { border: 'border-blue-500/20',    accent: 'text-blue-400',    notebg: 'bg-blue-500/8',    notetext: 'text-blue-300/90' },
    amber:   { border: 'border-amber-500/20',   accent: 'text-amber-400',   notebg: 'bg-amber-500/8',   notetext: 'text-amber-300/90' },
  };
  const t = colorMap[color] ?? colorMap.amber;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className={`rounded-3xl border divide-y divide-white/8 overflow-hidden ${t.border}`}>
      {verses.map((v, i) => (
        <div key={i} className="p-7 bg-black/30 hover:bg-black/50 transition-colors">
          <p className={`text-xl md:text-2xl font-black leading-snug mb-2 italic ${t.accent}`}>
            &ldquo;{v.verse}&rdquo;
          </p>
          <div className="text-[11px] font-black tracking-[0.3em] uppercase text-white/50 mb-2">{v.reference}</div>
          {v.note && <p className={`text-sm leading-relaxed mt-3 pl-4 border-l-2 border-white/30 ${t.notetext}`}>{v.note}</p>}
        </div>
      ))}
    </motion.div>
  );
};

// ─── SECTION HEADER ────────────────────────────────────────────────────────────
const SectionHeader = ({ label, title, sub, color = "red" }: { label: string; title: React.ReactNode; sub?: string; color?: string }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 sm:mb-16 md:mb-20">
    <div className={`inline-flex items-center gap-2 text-[11px] font-black tracking-[0.35em] uppercase mb-5 ${
      color === 'red' ? 'text-red-400' : color === 'purple' ? 'text-purple-400' :
      color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-amber-400'
    }`}>
      <div className={`h-px w-8 ${
        color === 'red' ? 'bg-red-500' : color === 'purple' ? 'bg-purple-500' :
        color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
      }`} />
      {label}
    </div>
    <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tight leading-[0.92] uppercase italic mb-5">{title}</h2>
    {sub && <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl font-medium">{sub}</p>}
  </motion.div>
);

// ─── VOICE CARD ────────────────────────────────────────────────────────────────
const VoiceCard = ({ quote, tag, featured = false, delay = 0 }: { quote: string; tag: string; featured?: boolean; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.55 }} viewport={{ once: true }}
    className={`relative p-7 rounded-3xl overflow-hidden ${featured
      ? 'bg-gradient-to-br from-red-950/80 to-purple-950/80 border border-red-500/30'
      : 'bg-white/[0.04] border border-white/10 hover:border-white/18 transition-all'
    }`}
  >
    {featured && <HalftoneBg color="#ef4444" opacity={0.06} />}
    <div className="relative z-10">
      <Quote size={28} className={`mb-5 ${featured ? 'text-red-500/70' : 'text-white/15'}`} />
      <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-5 italic">"{quote}"</p>
      <div className={`text-[12px] font-black tracking-[0.15em] uppercase ${featured ? 'text-red-400' : 'text-slate-400'}`}>{tag}</div>
    </div>
  </motion.div>
);

// ─── BE THE BRIDGE APP ─────────────────────────────────────────────────────────
const giftData: Record<string, {
  career: string; kingdomAngle: string; scripture: string;
  deResources: string; orgs: string[]; paperprompt: string;
}> = {
  Finance: {
    career: "Investment Analyst · Financial Planner · CPA · Entrepreneur · Stock Trader",
    kingdomAngle: "Stewardship is a Kingdom value. Proverbs 21:20 — the wise store up resources. Build wealth to serve, not to hoard. Your spreadsheet is a sermon on faithfulness.",
    scripture: "\"Wealth gained hastily will dwindle, but whoever gathers little by little will increase it.\" — Proverbs 13:11",
    deResources: "Junior Achievement of Delaware (JA.com) · Delaware Small Business Development Center · Wilmington SCORE Chapter",
    orgs: ["Junior Achievement DE", "DSBC", "Wilmington SCORE"],
    paperprompt: 'Paper trading guides + Build Wealth to Serve mission',
  },
  Architecture: {
    career: "Urban Designer · Civil Engineer · Real Estate Developer · Construction PM · Structural Engineer",
    kingdomAngle: "God was the first Architect. Genesis 1 — structure before habitation. Bridges crossing deep water need deep foundations. AutoCAD is your blueprint; Jesus is your load-bearing wall.",
    scripture: "\"By wisdom a house is built, and through understanding it is established.\" — Proverbs 24:3",
    deResources: "ACE Mentor Program (New Castle) · UD Architecture Dept · Urban Promise Wilmington",
    orgs: ["ACE Mentor Program", "UD Architecture", "Urban Promise"],
    paperprompt: 'AutoCAD resources + God was the first Architect - theological framing',
  },
  "Visual Arts": {
    career: "Graphic Designer · Illustrator · Photographer · Film Director · Brand Strategist",
    kingdomAngle: "Every image carries a worldview. Matthew 5:14 — you are the light of the world. A town on a hill cannot be hidden. Use your portfolio to depict hope, identity, and truth in a world of distortion.",
    scripture: "\"You are the light of the world. A town built on a hill cannot be hidden.\" — Matthew 5:14",
    deResources: "Delaware College of Art & Design · Grand Opera House Arts Pathways · Delaware Art Museum",
    orgs: ["DCAD", "Grand Opera House", "Delaware Art Museum"],
    paperprompt: 'Portfolio builder + You are the light of the world - integration',
  },
  Music: {
    career: "Producer · Songwriter · Audio Engineer · Music Therapist · A&R",
    kingdomAngle: "Music moves before words land. David used it to shift atmospheres and minister to kings. Your playlist is pastoral care. Your melody is a bridge across emotional walls.",
    scripture: "\"Sing to him a new song; play skillfully, and shout for joy.\" — Psalm 33:3",
    deResources: "Christina Cultural Arts Center · Cab Calloway School of the Arts · Delaware Symphony Orchestra",
    orgs: ["Christina Cultural Arts", "Cab Calloway School", "DE Symphony"],
    paperprompt: "Music theory + worship-to-career pathway resources",
  },
  Tech: {
    career: "Software Engineer · Cybersecurity Analyst · AI Developer · UX Designer · Systems Architect",
    kingdomAngle: "Technology is a bridge by nature — it connects people who couldn't connect before. EB built this app live in front of 40 students using Claude AI. Build with Kingdom intent and the tools become testimonies.",
    scripture: "\"Whatever you do, work at it with all your heart, as working for the Lord.\" — Colossians 3:23",
    deResources: "Zip Code Wilmington · University of Delaware CS Dept · Delaware Technical Community College",
    orgs: ["Zip Code Wilmington", "UD CS Dept", "Delaware Tech CC"],
    paperprompt: 'Full-stack dev path + technology as bridge ministry framework',
  },
  Sports: {
    career: "Athletic Trainer · Sports Agent · Coach · Sports Medicine · Sports Media · Recruiter",
    kingdomAngle: "Your discipline on the field is a testimony. 1 Corinthians 9:25 — every athlete exercises self-control in all things. Lead your team beyond the scoreboard. The locker room is your mission field.",
    scripture: "\"I can do all things through Christ who strengthens me.\" — Philippians 4:13",
    deResources: "YMCA Black Achievers Program · Delaware Interscholastic Athletic Association · UD Athletics",
    orgs: ["YMCA Black Achievers", "DIAA", "UD Athletics"],
    paperprompt: "Leadership pipeline + sports ministry resources",
  },
};

const BeTheBridgeApp = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const result = selected ? giftData[selected] : null;

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-[#030308]" id="be-the-bridge-app">
      <BlueprintGrid />
      <HalftoneBg color="#8b5cf6" opacity={0.025} />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">

        <SectionHeader
          label="Built Live in Session · Claude AI"
          title={<>BE THE<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500">BRIDGE</span></>}
          sub='40 students. One session. EB opened Claude AI and said: "Build a web app for these kids based on their gifts — and show them how to share the Gospel through each one." Students named it. This is it.'
          color="purple"
        />

        {/* App UI */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}
          className="rounded-[2.5rem] bg-[#080812] border border-white/12 overflow-hidden shadow-2xl shadow-black/80"
        >
          {/* App chrome */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-black/40">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-400/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <div className="flex-1 mx-4">
              <div className="bg-white/5 rounded-lg px-4 py-1.5 text-[10px] font-mono text-slate-500 text-center">
                be-the-bridge.app · <span className="text-purple-400">New Castle, DE</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase mb-4">// SELECT YOUR GIFT FIELD</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 mb-8">
              {Object.keys(giftData).map((gift) => (
                <button key={gift} onClick={() => setSelected(selected === gift ? null : gift)}
                  className={`py-3 px-3 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all border ${
                    selected === gift
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-[1.04]'
                      : 'bg-white/3 border-white/8 text-slate-500 hover:text-white hover:border-white/20'
                  }`}
                >
                  {gift}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="py-14 text-center border border-dashed border-white/8 rounded-2xl"
                >
                  <div className="text-3xl mb-3">🌉</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Choose your field above to see your pathway</div>
                </motion.div>
              ) : result && (
                <motion.div key={selected} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }} className="space-y-4"
                >
                  <div className="bg-black/60 rounded-xl p-4 border border-purple-500/15 font-mono">
                    <div className="text-xs text-purple-400 mb-1">&gt; mapping_gift({selected.toLowerCase()}) <span className="animate-pulse">_</span></div>
                    <div className="text-xs text-emerald-400">✓ Kingdom pathways loaded · New Castle, DE · March 8, 2026</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/20">
                      <div className="text-[11px] font-black text-blue-400 tracking-[0.25em] uppercase mb-3">Career Pathways</div>
                      <p className="text-slate-300 text-sm leading-relaxed">{result.career}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/20">
                      <div className="text-[11px] font-black text-amber-400 tracking-[0.25em] uppercase mb-3">Kingdom Angle</div>
                      <p className="text-slate-300 text-sm leading-relaxed sm:italic">{result.kingdomAngle}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-900/20 border border-purple-500/15">
                    <div className="text-[11px] font-black text-purple-400 tracking-[0.25em] uppercase mb-2 flex items-center gap-2">
                      <Quote size={10} /> Scripture Foundation
                    </div>
                    <p className="text-slate-300 text-sm italic leading-relaxed">{result.scripture}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/15">
                    <div className="text-[11px] font-black text-emerald-400 tracking-[0.25em] uppercase mb-3 flex items-center gap-2">
                      <MapPin size={10} /> Delaware Resources
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">{result.deResources}</p>
                    <div className="flex flex-wrap gap-2">
                      {result.orgs.map(org => (
                        <span key={org} className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-[10px] font-bold text-slate-400 uppercase">{org}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 p-4 rounded-xl bg-white/3 border border-white/6 text-[11px] font-mono text-slate-500">
                      // Version 1.0 note: <span className="text-slate-400">{result.paperprompt}</span>
                    </div>
                    <button onClick={() => setSelected(null)} className="px-4 rounded-xl bg-white/5 border border-white/8 text-slate-500 hover:text-white transition-colors">
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6">
          Named by students · Built with Claude AI · Victory Elevate · March 8, 2026
        </p>
      </div>
    </section>
  );
};

// ─── HERO SECTION ──────────────────────────────────────────────────────────────
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HalftoneBg color="#ef4444" opacity={0.04} />
      <BlueprintGrid />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-red-400">Victory Christian Fellowship</span>
            <span className="text-white/30">·</span>
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-slate-400">Elevate Youth</span>
          </div>

          <h1 className="font-display text-6xl sm:text-8xl md:text-[10rem] font-black text-white tracking-tight leading-[0.85] uppercase italic mb-6">
            ACROSS<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-red-500">TWO WORLDS</span>
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white/90 mb-8">
            You Are a Bridge.
          </p>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            The tension between Babylon and the Kingdom is real. But you weren't made to pick a side — you were made to <span className="text-white font-semibold">connect them</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#be-the-bridge-app"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-2xl bg-red-600 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-shadow"
            >
              Explore Your Gift
            </motion.a>
            <div className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">
              March 8, 2026 · New Castle, DE
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="text-white/30" size={24} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── TWO WORLDS SECTION ────────────────────────────────────────────────────────
const TwoWorldsSection = () => {
  const babylonTraits = ["Cancel Culture", "Gossip", "Backstabbing", "Isolation", "Fake friendships", "Going along to get along"];
  const kingdomTraits = ["Peace", "Love", "Truth", "Eternity", "Courage to speak up", "Showing up when it costs"];

  return (
    <section className="relative overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[50vh] sm:min-h-[70vh]">
        {/* Babylon */}
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#1c0404] to-[#0a0002] border-b sm:border-b-0 sm:border-r border-white/5 p-6 sm:p-10 lg:p-16 flex flex-col justify-between overflow-hidden"
        >
          <HalftoneBg color="#ef4444" opacity={0.09} />
          <div className="absolute bottom-0 left-0 w-96 h-80 rounded-full blur-[120px] bg-red-700/25 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/25 text-[11px] font-black text-red-400 tracking-[0.25em] uppercase mb-6">Shore A</div>
            <h3 className="font-display text-[14vw] sm:text-[10vw] lg:text-[7vw] font-black text-red-500 tracking-normal leading-[0.92] uppercase italic">BABYLON</h3>
            <p className="text-slate-400 text-base leading-relaxed mt-4 max-w-xs">
              The system of the world. The group chat making fun of the kid failing AP Calculus. The fake friends who smile in your face but talk behind your back.
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-1 xs:grid-cols-2 gap-2 mt-6 sm:mt-10">
            {babylonTraits.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }} viewport={{ once: true }}
                className="flex items-center gap-2 text-sm md:text-base text-slate-300">
                <span className="w-4 h-4 rounded-full bg-red-600/15 flex items-center justify-center text-red-500 text-[9px] font-black shrink-0">—</span>
                {t}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Kingdom */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}
          className="relative bg-gradient-to-bl from-[#041408] to-[#020602] p-6 sm:p-10 lg:p-16 flex flex-col justify-between overflow-hidden"
        >
          <HalftoneBg color="#10b981" opacity={0.06} />
          <div className="absolute bottom-0 right-0 w-96 h-80 rounded-full blur-[120px] bg-emerald-700/20 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/15 border border-emerald-500/25 text-[11px] font-black text-emerald-400 tracking-[0.25em] uppercase mb-6">Shore B</div>
            <h3 className="font-display text-[14vw] sm:text-[10vw] lg:text-[7vw] font-black text-emerald-400 tracking-normal leading-[0.92] uppercase italic">KINGDOM</h3>
            <p className="text-slate-400 text-base leading-relaxed mt-4 max-w-xs">
              The reality of God's design. Offering words of encouragement. Taking a leap of faith to FaceTime a friend who just lost their dog and praying for them.
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-1 xs:grid-cols-2 gap-2 mt-6 sm:mt-10">
            {kingdomTraits.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }} viewport={{ once: true }}
                className="flex items-center gap-2 text-sm md:text-base text-slate-300">
                <span className="w-4 h-4 rounded-full bg-emerald-600/15 flex items-center justify-center text-emerald-400 text-[9px] font-black shrink-0">✓</span>
                {t}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bridge strip */}
      <div className="relative bg-[#0d0015] border-y border-purple-900/30 py-6 px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
        <HalftoneBg color="#a855f7" opacity={0.05} />
        <div className="relative z-10 flex items-center gap-4">
          <BridgeIcon className="text-purple-400 shrink-0" size={26} />
          <span className="text-white font-black text-sm md:text-base uppercase tracking-widest">You Are The Bridge</span>
        </div>
        <div className="relative z-10 text-center md:text-right">
          <div className="text-[11px] font-black text-purple-400 tracking-[0.25em] uppercase">John 14:6</div>
          <div className="text-sm text-slate-400 italic mt-0.5">"I am the way and the truth and the life."</div>
        </div>
      </div>
    </section>
  );
};

// ─── FOUNDATION SECTION ────────────────────────────────────────────────────────
const FoundationSection = () => (
  <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-[#050505]">
    <BlueprintGrid />
    <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
      <SectionHeader
        label="The Foundation"
        title={<>ONLY ONE<br/><span className="text-amber-400">FOUNDATION</span></>}
        sub="Human effort collapses. Good intentions collapse. There is only one load-bearing wall — and His name is Jesus Christ."
        color="amber"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10">
            <div className="text-[11px] font-black text-amber-400 tracking-[0.3em] uppercase mb-4">The Two-Chair Object Lesson</div>
            <div className="flex gap-4 mb-6">
              {[
                { label: "Babylon", color: "red", emoji: "🪑" },
                { label: "Kingdom", color: "emerald", emoji: "🪑" },
                { label: "Paper", color: "slate", emoji: "📄" },
                { label: "Ruler", color: "amber", emoji: "📏" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="flex-1 text-center">
                  <div className={`w-8 h-8 mx-auto rounded-lg mb-2 flex items-center justify-center text-sm ${
                    s.color === 'red' ? 'bg-red-500/15 text-red-400' :
                    s.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                    s.color === 'amber' ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' :
                    'bg-white/5 text-slate-500'
                  }`}>{s.emoji}</div>
                  <div className="text-[10px] font-black uppercase tracking-wide text-slate-500">{s.label}</div>
                </motion.div>
              ))}
            </div>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              The paper (human effort) was placed between the two chairs. It collapsed. The ruler marked "Jesus" held firm. 1 Corinthians 3:11 — made physical.
            </p>
          </motion.div>

          <ScripturePanel color="amber" verses={[
            {
              verse: "For no one can lay any foundation other than the one already laid, which is Jesus Christ.",
              reference: "1 Corinthians 3:11",
              note: "This isn't advice — it's architecture. One foundation. Every other support structure is secondary."
            },
            {
              verse: "The rain came down, the streams rose, and the winds blew and beat against that house; yet it did not fall, because it had its foundation on the rock.",
              reference: "Matthew 7:25",
              note: "Babylon's algorithm can't hold the weight of grief, failure, or identity. The rock can."
            },
          ]} />
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="p-8 rounded-3xl bg-amber-950/20 border border-amber-500/20">
            <div className="text-[11px] font-black text-amber-400 tracking-[0.3em] uppercase mb-4">The Architecture Analogy</div>
            <p className="text-slate-300 text-base leading-relaxed">
              A student interested in architecture established the principle: bridges crossing deep water must have <span className="text-amber-400 font-bold">deep, strong foundations</span> to withstand weight — while retaining the flexibility to sway with wind and load.
            </p>
            <div className="mt-5 pt-5 border-t border-amber-500/10">
              <p className="text-sm text-amber-400/80 italic">The deeper the water, the deeper the foundation must go. The deeper your pain, the more sufficient Christ is.</p>
            </div>
          </motion.div>

          <VoiceCard quote="Anyone can be chosen to be a bridge. You just have to follow what God says to do." tag="Student, on the foundation" />
        </div>
      </div>
    </div>
  </section>
);

// ─── LEAP SECTION ──────────────────────────────────────────────────────────────
const LeapSection = () => (
  <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
    <div className="absolute inset-0 bg-[#08000f]" />
    <HalftoneBg color="#a855f7" opacity={0.04} />
    <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
      <SectionHeader
        label="The Leap of Faith"
        title={<>ANALYZING ISN'T<br/><span className="text-purple-400">ENOUGH</span></>}
        sub="Like Miles Morales in the Spider-Verse, you are navigating two dimensions. At some point, analyzing the blueprint isn't enough. You have to take a leap of faith."
        color="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "The Tension", body: "Can't stand between two worlds forever. You have to commit.", color: "red" },
              { label: "The Truth", body: "Faith is confidence in what we hope for. Heb 11:1.", color: "purple" },
              { label: "The Action", body: "Step out in the group chat. In the hallway. In the quiet moment.", color: "emerald" },
            ].map((p, i) => (
              <motion.div key={p.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className={`p-4 rounded-2xl border ${p.color === 'red' ? 'bg-red-950/30 border-red-500/20' : p.color === 'purple' ? 'bg-purple-950/30 border-purple-500/20' : 'bg-emerald-950/30 border-emerald-500/20'}`}>
                <div className={`text-[11px] font-black tracking-[0.2em] uppercase mb-2 ${p.color === 'red' ? 'text-red-400' : p.color === 'purple' ? 'text-purple-400' : 'text-emerald-400'}`}>{p.label}</div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>

          <ScripturePanel color="purple" verses={[
            {
              verse: "Now faith is confidence in what we hope for and assurance about what we do not see.",
              reference: "Hebrews 11:1",
              note: "Miles Morales didn't see the landing before he leaped. Neither did you."
            },
            {
              verse: "Trust in the Lord with all your heart and lean not on your own understanding.",
              reference: "Proverbs 3:5",
              note: "The analysis phase ends. The faith phase begins."
            },
          ]} />
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10">
            <div className="text-[11px] font-black text-purple-400 tracking-[0.3em] uppercase mb-5">The AP Calculus Scenario</div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20">
                <div className="text-[11px] font-black text-red-400 tracking-[0.2em] uppercase mb-2">🏙 Babylon Response</div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">Laugh in the group chat. Talk behind their back. Leave them to fail alone.</p>
              </div>
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/5" />
                <BridgeIcon className="text-purple-500/40 shrink-0" size={16} />
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <div className="text-[11px] font-black text-emerald-400 tracking-[0.2em] uppercase mb-2">👑 Kingdom Response</div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">Offer to tutor them. Send words of encouragement. Show up — because the bridge can hold it.</p>
              </div>
            </div>
          </motion.div>

          <VoiceCard
            quote="God, or the Holy Spirit, something was telling me to pray for him. I was skeptical. But I asked him, he said yeah. So I got on FaceTime with him and prayed for him — and he was better after."
            tag="A student's real leap of faith"
            featured
          />
        </div>
      </div>
    </div>
  </section>
);

// ─── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="relative py-16 sm:py-24 overflow-hidden bg-[#030303] border-t border-white/5">
    <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
      <BridgeArch className="w-32 h-16 mx-auto text-white/10 mb-8" />
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase italic mb-4">
        You Are a Bridge
      </h2>
      <p className="text-slate-400 text-lg mb-8 italic">
        "Built on the only foundation that holds — Jesus Christ."
      </p>
      <div className="text-[11px] font-black text-slate-500 tracking-[0.3em] uppercase">
        Victory Christian Fellowship · Elevate Youth · March 8, 2026
      </div>
      <div className="mt-12 pt-8 border-t border-white/5">
        <p className="text-xs text-slate-600">
          Built with Claude AI · New Castle, DE
        </p>
      </div>
    </div>
  </footer>
);

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState('student');

  return (
    <div className="relative min-h-screen bg-[#030303]">
      <CursorGlow mode={mode} />

      <HeroSection />

      <Marquee items={["You Are A Bridge", "Jesus Is The Foundation", "1 Corinthians 3:11", "Hebrews 11:1", "John 14:6", "Matthew 5:14", "New Castle DE"]} />

      <TwoWorldsSection />

      <FoundationSection />

      <LeapSection />

      <BeTheBridgeApp />

      <Footer />

      <ViewToggle mode={mode} setMode={setMode} />
    </div>
  );
}
