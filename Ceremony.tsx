import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamData, getRankTitle } from '../types';
import { Trophy, Sparkles, Crown, Star, Volume2, VolumeX } from 'lucide-react';

interface CeremonyProps {
  teams: TeamData[];
}

type CeremonyPhase = 'idle' | 'drumroll' | 'reveal3' | 'reveal2' | 'reveal1' | 'finale';

/* === SOUND EFFECTS (Web Audio API) === */
function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const playTone = useCallback((freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  }, [getCtx]);

  const drumroll = useCallback(() => {
    const ctx = getCtx();
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 100 + Math.random() * 60;
        gain.gain.setValueAtTime(0.05 + (i / 30) * 0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }, i * 80);
    }
  }, [getCtx]);

  const revealSound = useCallback((rank: number) => {
    const notes = rank === 1 ? [523, 659, 784, 1047] : rank === 2 ? [440, 554, 659] : [330, 440, 554];
    notes.forEach((f, i) => setTimeout(() => playTone(f, 0.6, 'sine', 0.12), i * 200));
  }, [playTone]);

  const fanfare = useCallback(() => {
    const melody = [523, 659, 784, 1047, 784, 1047, 1319];
    melody.forEach((f, i) => setTimeout(() => playTone(f, 0.4, 'triangle', 0.1), i * 150));
  }, [playTone]);

  return { drumroll, revealSound, fanfare };
}

/* === PARTICLES === */
function GoldenRain() {
  const particles = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 6 + 3,
    dur: Math.random() * 4 + 3,
    delay: Math.random() * 4,
    emoji: ['✨', '⭐', '🌟', '💫', '👑', '🏆', '🪙', '💎', '🔱'][i % 9],
  })), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: '105vh' }}
          animate={{ opacity: [0, 1, 1, 0], y: ['105vh', '-5vh'] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, repeatDelay: Math.random() * 1.5 }}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: `${p.size * 3}px` }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#FFD700', '#FF6347', '#00CED1', '#FF69B4', '#7CFC00', '#DDA0DD', '#FFA500', '#4169E1', '#FF4500', '#00FF7F'][i % 10],
    w: Math.random() * 10 + 4,
    h: Math.random() * 6 + 3,
    dur: Math.random() * 3 + 2.5,
    delay: Math.random() * 3,
    rot: Math.random() * 1080 - 540,
    drift: (Math.random() - 0.5) * 30,
  })), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: '-5vh', x: `${p.x}vw`, rotate: 0 }}
          animate={{ opacity: [1, 1, 0.8, 0], y: '105vh', rotate: p.rot, x: `${p.x + p.drift}vw` }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, repeatDelay: 0.5 }}
          className="absolute rounded-sm"
          style={{ width: `${p.w}px`, height: `${p.h}px`, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

/* === COUNT UP === */
function CountUp({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<ReturnType<typeof requestAnimationFrame>>(undefined);
  useEffect(() => {
    const start = Date.now();
    const run = () => {
      const p = Math.min((Date.now() - start) / (duration * 1000), 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) ref.current = requestAnimationFrame(run);
    };
    ref.current = requestAnimationFrame(run);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);
  return <>{count}</>;
}

/* === MAIN CEREMONY === */
export default function Ceremony({ teams }: CeremonyProps) {
  const [phase, setPhase] = useState<CeremonyPhase>('idle');
  const [soundOn, setSoundOn] = useState(true);
  const sorted = [...teams].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { drumroll, revealSound, fanfare } = useSounds();

  const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);

  const start = useCallback(() => {
    clear();
    setPhase('drumroll');
    if (soundOn) drumroll();
    timers.current = [
      setTimeout(() => { setPhase('reveal3'); if (soundOn) revealSound(3); }, 3500),
      setTimeout(() => { setPhase('reveal2'); if (soundOn) revealSound(2); }, 8000),
      setTimeout(() => { setPhase('reveal1'); if (soundOn) revealSound(1); }, 12500),
      setTimeout(() => { setPhase('finale'); if (soundOn) fanfare(); }, 17500),
    ];
  }, [clear, soundOn, drumroll, revealSound, fanfare]);

  useEffect(() => clear, [clear]);

  const skip = () => {
    clear();
    const order: CeremonyPhase[] = ['drumroll', 'reveal3', 'reveal2', 'reveal1', 'finale'];
    const idx = order.indexOf(phase);
    if (idx >= 0 && idx < order.length - 1) {
      const next = order[idx + 1];
      setPhase(next);
      if (soundOn) {
        if (next === 'reveal3') revealSound(3);
        else if (next === 'reveal2') revealSound(2);
        else if (next === 'reveal1') revealSound(1);
        else if (next === 'finale') fanfare();
      }
    }
  };

  /* ------- IDLE ------- */
  if (phase === 'idle') {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg text-center">
          {/* Orbiting logo */}
          <div className="relative mx-auto mb-10 h-44 w-44">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-0">
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div key={deg} className="absolute text-lg" style={{
                  top: `${50 + 46 * Math.sin((deg * Math.PI) / 180)}%`,
                  left: `${50 + 46 * Math.cos((deg * Math.PI) / 180)}%`,
                  transform: 'translate(-50%,-50%)',
                }}>
                  {['⭐', '✨', '🌟', '💫', '🪙', '✦'][i]}
                </div>
              ))}
            </motion.div>
            <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-6">
              <img src="/images/logo.png" alt="Logo" className="h-full w-full rounded-full border-4 border-yellow-500/60 shadow-2xl shadow-yellow-500/40" />
            </motion.div>
          </div>

          <h1 className="mb-2 text-3xl font-black tracking-[0.2em] text-yellow-400 md:text-4xl">LỄ TRAO GIẢI</h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="mx-auto mb-3 h-px w-48 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          <p className="mb-1 text-base tracking-widest text-yellow-200/60">TRẠI TRUYỀN THỐNG XI — XIN VÂNG</p>
          <p className="mb-8 text-sm text-gray-600">{new Date().getFullYear()}</p>

          {/* Sound toggle */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <button onClick={() => setSoundOn(!soundOn)} className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${soundOn ? 'border-green-500/40 bg-green-900/20 text-green-400' : 'border-gray-600 bg-gray-800/40 text-gray-500'}`}>
              {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              {soundOn ? 'ÂM THANH: BẬT' : 'ÂM THANH: TẮT'}
            </button>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,168,67,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={start}
            className="group relative mx-auto flex overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 px-10 py-5 text-lg font-black tracking-wider text-black shadow-2xl shadow-yellow-500/30 md:text-xl"
          >
            <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative flex items-center gap-3">
              <Trophy className="h-6 w-6" /> BẮT ĐẦU LỄ TRAO GIẢI <Sparkles className="h-6 w-6" />
            </span>
          </motion.button>

          {/* Locked teasers */}
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {['🥇 NHÀ VÔ ĐỊCH', '🥈 HẠNG NHÌ', '🥉 HẠNG BA'].map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.15 }}
                className="rounded-xl border border-gray-800/80 bg-gray-900/40 p-5 backdrop-blur-sm">
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} className="text-3xl">🔒</motion.div>
                <div className="mt-2 text-sm font-bold text-gray-500">{l}</div>
                <div className="text-[10px] text-gray-700">Chờ công bố...</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ------- ACTIVE CEREMONY ------- */
  return (
    <div className="relative min-h-[75vh] overflow-hidden" onClick={phase !== 'finale' ? skip : undefined}>
      {(phase === 'reveal1' || phase === 'finale') && <GoldenRain />}
      {phase === 'finale' && <Confetti />}

      {phase !== 'finale' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute right-3 top-3 z-50 rounded-lg bg-black/60 px-3 py-1.5 text-[10px] text-gray-400 backdrop-blur-sm">
          Nhấn để bỏ qua →
        </motion.div>
      )}

      <AnimatePresence mode="wait">

        {/* DRUMROLL */}
        {phase === 'drumroll' && (
          <motion.div key="dr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex min-h-[75vh] flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }}>
              <img src="/images/logo.png" alt="Logo" className="mx-auto h-24 w-24 rounded-full border-4 border-yellow-500/50 shadow-2xl shadow-yellow-500/30 md:h-28 md:w-28" />
            </motion.div>
            <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-6 text-3xl font-black tracking-[0.2em] text-yellow-400 md:text-5xl">LỄ TRAO GIẢI</motion.h1>
            <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
              className="mt-3 text-base tracking-widest text-yellow-200/60 md:text-lg">TRẠI TRUYỀN THỐNG XI — XIN VÂNG</motion.p>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5, duration: 1 }}
              className="mt-6 h-px w-64 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
              className="mt-8 flex items-center gap-2">
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div key={i} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: d }}
                  className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              ))}
              <span className="ml-3 text-sm text-yellow-200/50">Đang chuẩn bị công bố...</span>
            </motion.div>
          </motion.div>
        )}

        {/* REVEAL RANK */}
        {(['reveal3', 'reveal2', 'reveal1'] as const).map((p) => {
          if (phase !== p) return null;
          const idx = p === 'reveal3' ? 2 : p === 'reveal2' ? 1 : 0;
          const team = top3[idx];
          if (!team) return null;

          const config = {
            reveal3: { label: 'GIẢI BA — HẠNG III', tag: '🟥 T Â N ✦ C A', tagFull: 'HẠNG III', labelColor: 'text-red-400', cardBorder: 'border-red-500/50', cardBg: 'from-red-950/80 to-red-900/50', glow: 'from-red-500/20 to-orange-500/20', nameColor: 'text-red-300', tagBg: 'text-red-300', medal: '🥉' },
            reveal2: { label: 'GIẢI NHÌ — HẠNG II', tag: '🟦 H Ả I † T I N H', tagFull: 'HẠNG II', labelColor: 'text-blue-400', cardBorder: 'border-blue-500/50', cardBg: 'from-blue-950/80 to-blue-900/50', glow: 'from-blue-500/20 to-cyan-500/20', nameColor: 'text-blue-300', tagBg: 'text-blue-300', medal: '🥈' },
            reveal1: { label: '🏆 NHÀ VÔ ĐỊCH 🏆', tag: '🟨 V Ư Ơ N G ✦ Q U Y Ề N', tagFull: 'NHÀ VÔ ĐỊCH', labelColor: 'text-yellow-400', cardBorder: 'border-yellow-500/70', cardBg: 'from-yellow-950/80 to-amber-900/50', glow: 'from-yellow-500/30 to-amber-500/30', nameColor: 'text-yellow-300', tagBg: 'text-yellow-300', medal: '👑' },
          }[p];

          return (
            <motion.div key={p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
                {p === 'reveal1' && (
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-1 flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" /><p className="text-xs tracking-[0.3em] text-yellow-300">VÔ ĐỊCH TOÀN TRẠI</p><Star className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                )}
                {p !== 'reveal1' && <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-1 text-xs tracking-[0.3em] text-gray-400">CHÚC MỪNG</motion.p>}
                <motion.h2 initial={{ y: -10, opacity: 0, scale: p === 'reveal1' ? 0.5 : 1 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                  className={`text-2xl font-black tracking-widest md:text-3xl ${config.labelColor}`}>{config.label}</motion.h2>
              </motion.div>

              <motion.div initial={{ scale: 0, rotate: p === 'reveal1' ? -15 : p === 'reveal2' ? -5 : 5 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 130, damping: 14, delay: 0.5 }} className="relative">
                <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute -inset-6 rounded-3xl bg-gradient-to-br ${config.glow} blur-2xl md:-inset-8`} />
                <div className={`relative overflow-hidden rounded-3xl border-2 ${config.cardBorder} bg-gradient-to-br ${config.cardBg} p-8 shadow-2xl md:p-12 ${p === 'reveal1' ? 'shadow-yellow-500/20' : ''}`}>
                  <div className="absolute -right-6 -top-6 text-[8rem] opacity-10">{config.medal}</div>
                  <motion.div initial={{ scale: 0 }} animate={p === 'reveal1' ? { scale: 1, y: [0, -10, 0], rotate: [0, 3, -3, 0] } : { scale: 1 }}
                    transition={p === 'reveal1' ? { scale: { delay: 0.7, type: 'spring' }, y: { delay: 1.5, duration: 3, repeat: Infinity }, rotate: { delay: 1.5, duration: 3, repeat: Infinity } } : { delay: 0.7, type: 'spring' }}
                    className={`relative ${p === 'reveal1' ? 'text-8xl md:text-9xl' : 'text-7xl md:text-8xl'}`}>{config.medal}</motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                    className={`mt-4 text-3xl font-black md:text-4xl ${config.nameColor}`}>{team.name}</motion.h2>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
                    <motion.div animate={p === 'reveal1' ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}
                      className={`mt-3 font-black text-white ${p === 'reveal1' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'}`}>
                      <CountUp target={team.totalCoins} duration={1.5} />
                    </motion.div>
                    <div className={`mt-1 text-xs tracking-wider ${config.nameColor} opacity-60`}>COIN VỊ THẾ</div>
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2 }}
                      className="mt-4 rounded-xl bg-black/40 px-6 py-3">
                      <span className={`text-sm font-black tracking-[0.12em] ${config.tagBg}`}>{config.tag}</span>
                    </motion.div>
                    {team.crowns > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="mt-3 text-lg">
                        {Array.from({ length: team.crowns }, (_, k) => (
                          <motion.span key={k} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 2.7 + k * 0.25, type: 'spring' }} className="inline-block">👑</motion.span>
                        ))}
                        <span className="ml-2 text-sm font-bold text-yellow-400">×{team.crowns} Triều Thiên</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* FINALE */}
        {phase === 'finale' && (
          <motion.div key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-40 flex min-h-[75vh] flex-col items-center justify-center px-4">
            <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-2 text-center">
              <img src="/images/logo.png" alt="" className="mx-auto mb-3 h-14 w-14 rounded-full border-2 border-yellow-500/50 md:h-16 md:w-16" />
              <h1 className="text-2xl font-black tracking-[0.15em] text-yellow-400 md:text-3xl lg:text-4xl">🏆 BẢNG PHONG THẦN TRAO GIẢI 🏆</h1>
              <p className="mt-1 text-xs tracking-widest text-yellow-200/50 md:text-sm">TRẠI TRUYỀN THỐNG XI — XIN VÂNG — {new Date().getFullYear()}</p>
            </motion.div>

            {/* Podium */}
            <div className="mt-6 flex items-end justify-center gap-2 md:mt-8 md:gap-5">
              {/* 2nd */}
              {top3[1] && (
                <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 100 }} className="flex flex-col items-center">
                  <div className="mb-1 text-4xl md:text-5xl">🥈</div>
                  <div className="text-sm font-black text-blue-300 md:text-base">{top3[1].name}</div>
                  <div className="text-lg font-black text-white md:text-xl">{top3[1].totalCoins}</div>
                  {top3[1].crowns > 0 && <div className="text-[10px] text-yellow-400">👑×{top3[1].crowns}</div>}
                  <div className="mt-2 flex h-24 w-20 flex-col items-center justify-center rounded-t-2xl border-2 border-blue-500/50 bg-gradient-to-b from-blue-600 to-blue-900 shadow-lg md:h-32 md:w-28 lg:w-32">
                    <span className="text-xs font-black tracking-wider text-blue-200">HẠNG II</span>
                    <span className="mt-0.5 text-[8px] tracking-wider text-blue-300/60 md:text-[10px]">HẢI TINH</span>
                  </div>
                </motion.div>
              )}
              {/* 1st */}
              {top3[0] && (
                <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, type: 'spring', stiffness: 100 }} className="flex flex-col items-center">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="mb-1 text-5xl md:text-6xl">👑</motion.div>
                  <div className="text-base font-black text-yellow-300 md:text-lg">{top3[0].name}</div>
                  <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-xl font-black text-white md:text-2xl">{top3[0].totalCoins}</motion.div>
                  {top3[0].crowns > 0 && <div className="text-xs text-yellow-400">👑×{top3[0].crowns} Triều Thiên</div>}
                  <div className="mt-2 flex h-32 w-24 flex-col items-center justify-center rounded-t-2xl border-2 border-yellow-500/70 bg-gradient-to-b from-yellow-600 to-amber-900 shadow-xl shadow-yellow-500/20 md:h-40 md:w-32 lg:w-36">
                    <Crown className="mb-1 h-5 w-5 text-yellow-300 md:h-6 md:w-6" />
                    <span className="text-sm font-black tracking-wider text-yellow-200">HẠNG I</span>
                    <span className="mt-0.5 text-[8px] tracking-wider text-yellow-300/60 md:text-[10px]">VƯƠNG QUYỀN</span>
                  </div>
                </motion.div>
              )}
              {/* 3rd */}
              {top3[2] && (
                <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 100 }} className="flex flex-col items-center">
                  <div className="mb-1 text-4xl md:text-5xl">🥉</div>
                  <div className="text-sm font-black text-red-300 md:text-base">{top3[2].name}</div>
                  <div className="text-lg font-black text-white md:text-xl">{top3[2].totalCoins}</div>
                  {top3[2].crowns > 0 && <div className="text-[10px] text-yellow-400">👑×{top3[2].crowns}</div>}
                  <div className="mt-2 flex h-16 w-20 flex-col items-center justify-center rounded-t-2xl border-2 border-red-500/50 bg-gradient-to-b from-red-600 to-red-900 shadow-lg md:h-24 md:w-28 lg:w-32">
                    <span className="text-xs font-black tracking-wider text-red-200">HẠNG III</span>
                    <span className="mt-0.5 text-[8px] tracking-wider text-red-300/60 md:text-[10px]">TÂN CA</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Full ranking */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="mt-8 w-full max-w-2xl md:mt-10">
              <div className="overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/90 backdrop-blur-sm">
                <div className="border-b border-yellow-500/20 bg-gradient-to-r from-yellow-900/20 to-transparent px-4 py-2.5">
                  <h3 className="text-center text-xs font-black tracking-wider text-yellow-400 md:text-sm">📊 BẢNG XẾP HẠNG — 12 ĐỘI TOÀN TRẠI</h3>
                </div>
                <div className="divide-y divide-gray-800/50">
                  {sorted.map((team, i) => {
                    const ri = getRankTitle(team.rank);
                    return (
                      <motion.div key={team.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2 + i * 0.07 }}
                        className={`flex items-center gap-2 px-3 py-2 md:gap-3 md:px-4 md:py-2.5 ${team.rank <= 3 ? 'bg-gradient-to-r from-yellow-900/10 to-transparent' : ''}`}>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black md:h-7 md:w-7 md:text-xs ${
                          team.rank === 1 ? 'bg-yellow-500 text-black' : team.rank === 2 ? 'bg-blue-500 text-white' : team.rank === 3 ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
                        }`}>{team.rank}</span>
                        <span className="min-w-[50px] flex-1 text-sm font-bold text-white">{team.name}</span>
                        <span className={`text-sm font-black md:text-base ${team.rank === 1 ? 'text-yellow-400' : team.rank === 2 ? 'text-blue-400' : team.rank === 3 ? 'text-red-400' : 'text-gray-300'}`}>{team.totalCoins} 🪙</span>
                        {team.crowns > 0 && <span className="hidden text-xs text-yellow-400 md:inline">👑×{team.crowns}</span>}
                        <span className={`hidden text-xs font-bold lg:inline ${ri.color}`}>{ri.icon}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
              onClick={() => { clear(); setPhase('idle'); }}
              className="relative z-50 mt-8 flex items-center gap-2 rounded-xl border border-yellow-600/50 bg-yellow-900/30 px-6 py-3 font-bold text-yellow-400 backdrop-blur-sm transition-all hover:bg-yellow-900/50">
              🔄 Xem lại lễ trao giải
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
