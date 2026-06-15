import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getRankTitle, TeamData } from '../types';
import { Trophy, Crown, Coins, TrendingUp, Shield, Flame } from 'lucide-react';

interface DashboardProps {
  teams: TeamData[];
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<ReturnType<typeof requestAnimationFrame>>(undefined);

  useEffect(() => {
    const start = Date.now();
    const from = display;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / 800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value]);

  return <>{display}</>;
}

export default function Dashboard({ teams }: DashboardProps) {
  const sorted = [...teams].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);
  const totalCoins = teams.reduce((s, t) => s + t.totalCoins, 0);
  const totalCrowns = teams.reduce((s, t) => s + t.crowns, 0);
  const highestCoin = sorted[0]?.totalCoins || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-[#0a1628] via-[#162040] to-[#0a1628] p-5 shadow-2xl shadow-yellow-900/20 md:p-6"
      >
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-yellow-500/5 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
        
        <div className="relative flex flex-col items-center gap-4 md:flex-row">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-full border border-yellow-500/20"
            />
            <img
              src="/images/logo.png"
              alt="Logo Trại Truyền Thống XI"
              className="h-20 w-20 rounded-full border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20 md:h-24 md:w-24"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl font-black tracking-wider text-yellow-400 md:text-2xl lg:text-3xl" style={{ fontVariant: 'small-caps' }}>
              HỆ THỐNG QUẢN LÝ TÀI CHÍNH TOÀN TRẠI
            </h1>
            <p className="mt-1 text-xs tracking-[0.2em] text-yellow-200/60 md:text-sm">
              TRẠI TRUYỀN THỐNG XI — NĂM {new Date().getFullYear()} — XIN VÂNG
            </p>
          </div>
          <div className="ml-auto hidden gap-8 lg:flex">
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400"><AnimatedNumber value={totalCoins} /></div>
              <div className="text-[10px] tracking-wider text-yellow-200/50">TỔNG COIN HỆ THỐNG</div>
            </div>
            <div className="h-10 w-px bg-yellow-500/20" />
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400"><AnimatedNumber value={totalCrowns} /></div>
              <div className="text-[10px] tracking-wider text-yellow-200/50">TRIỀU THIÊN ĐẠT ĐƯỢC</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { icon: <Coins className="h-5 w-5" />, label: 'Tổng Coin', value: totalCoins, color: 'from-yellow-600 to-amber-700', shadow: 'shadow-yellow-900/20' },
          { icon: <Crown className="h-5 w-5" />, label: 'Triều Thiên', value: totalCrowns, color: 'from-purple-600 to-indigo-700', shadow: 'shadow-purple-900/20' },
          { icon: <Trophy className="h-5 w-5" />, label: 'Đội Tham Gia', value: 12, color: 'from-blue-600 to-cyan-700', shadow: 'shadow-blue-900/20' },
          { icon: <TrendingUp className="h-5 w-5" />, label: 'Coin Cao Nhất', value: highestCoin, color: 'from-emerald-600 to-green-700', shadow: 'shadow-emerald-900/20' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.color} p-4 shadow-lg ${stat.shadow}`}
          >
            <div className="absolute -right-3 -top-3 text-5xl opacity-10">
              {['🪙', '👑', '⚔️', '📈'][i]}
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 text-white/80">
                {stat.icon}
                <span className="text-[10px] font-bold uppercase tracking-wider md:text-xs">{stat.label}</span>
              </div>
              <div className="mt-2 text-2xl font-black text-white md:text-3xl">
                <AnimatedNumber value={stat.value} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {top3.map((team, i) => {
          const rankInfo = getRankTitle(team.rank);
          const progress = (team.totalCoins % 200) / 200 * 100;

          return (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-xl ${rankInfo.bg} ${
                team.rank === 1 ? 'md:order-2 md:-mt-4 md:scale-[1.03]' : team.rank === 2 ? 'md:order-1' : 'md:order-3'
              }`}
            >
              {/* Background decorations */}
              {team.rank === 1 && (
                <>
                  <div className="absolute -right-4 -top-4 text-7xl opacity-15">👑</div>
                  <motion.div
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent"
                  />
                </>
              )}
              
              <div className="relative z-10">
                <div className="mb-3 text-center">
                  <motion.div
                    animate={team.rank === 1 ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl md:text-5xl"
                  >
                    {rankInfo.icon}
                  </motion.div>
                </div>
                <h3 className={`text-center text-lg font-black tracking-wide ${rankInfo.color}`}>
                  {team.name}
                </h3>
                <div className="mt-3 text-center">
                  <div className="text-3xl font-black text-white md:text-4xl">
                    <AnimatedNumber value={team.totalCoins} />
                  </div>
                  <div className="text-[10px] tracking-wider text-white/50">COIN VỊ THẾ</div>
                </div>
                
                {/* Progress to next crown */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span>Tiến trình Triều Thiên</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-300"
                    />
                  </div>
                </div>

                {/* Crowns */}
                <div className="mt-3 flex items-center justify-center gap-1">
                  {team.crowns > 0 ? (
                    <>
                      {Array.from({ length: Math.min(team.crowns, 5) }, (_, k) => (
                        <motion.span
                          key={k}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 + k * 0.15 }}
                          className="text-lg"
                        >
                          👑
                        </motion.span>
                      ))}
                      {team.crowns > 5 && (
                        <span className="text-sm font-bold text-yellow-400">+{team.crowns - 5}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-white/30">Chưa đạt Triều Thiên</span>
                  )}
                </div>

                {/* Title badge */}
                <div className={`mt-3 rounded-lg bg-black/30 px-3 py-2 text-center text-[10px] font-black tracking-wider ${rankInfo.color} md:text-xs`}>
                  {rankInfo.title}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Ranking Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-b from-[#0f1729] to-[#0a1020] shadow-2xl"
      >
        <div className="border-b border-yellow-500/20 bg-gradient-to-r from-yellow-900/30 to-transparent px-4 py-3 md:px-6 md:py-4">
          <h2 className="flex items-center gap-2 text-sm font-black tracking-wider text-yellow-400 md:text-lg">
            <Shield className="h-5 w-5" />
            BẢNG XẾP HẠNG TOÀN TRẠI
            <span className="ml-auto flex items-center gap-1 text-xs font-normal text-gray-500">
              <Flame className="h-3 w-3 text-orange-500" />
              Live
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50 text-[10px] uppercase tracking-wider text-gray-500 md:text-xs">
                <th className="px-3 py-3 text-center md:px-4">#</th>
                <th className="px-3 py-3 text-left md:px-4">Tên Đội</th>
                <th className="px-3 py-3 text-center md:px-4">Tổng Coin</th>
                <th className="px-3 py-3 text-center md:px-4">Triều Thiên 👑</th>
                <th className="hidden px-4 py-3 text-center lg:table-cell">Tiến Trình</th>
                <th className="hidden px-4 py-3 text-left md:table-cell">Danh Hiệu</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((team, i) => {
                const rankInfo = getRankTitle(team.rank);
                const progress = Math.min((team.totalCoins % 200) / 200 * 100, 100);
                return (
                  <motion.tr
                    key={team.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className={`border-b border-gray-800/50 transition-colors hover:bg-white/5 ${
                      team.rank <= 3 ? 'bg-gradient-to-r from-yellow-900/10 to-transparent' : ''
                    }`}
                  >
                    <td className="px-3 py-3 text-center md:px-4">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black md:h-8 md:w-8 ${
                        team.rank === 1 ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/30' :
                        team.rank === 2 ? 'bg-blue-500 text-white' :
                        team.rank === 3 ? 'bg-red-500 text-white' :
                        'bg-gray-700/80 text-gray-300'
                      }`}>
                        {team.rank}
                      </span>
                    </td>
                    <td className="px-3 py-3 md:px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{team.name}</span>
                        {team.rank === 1 && <span className="text-xs">🔥</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center md:px-4">
                      <span className={`text-base font-black md:text-lg ${
                        team.rank === 1 ? 'text-yellow-400' :
                        team.rank === 2 ? 'text-blue-400' :
                        team.rank === 3 ? 'text-red-400' :
                        'text-white'
                      }`}>
                        <AnimatedNumber value={team.totalCoins} />
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center md:px-4">
                      {team.crowns > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-base">👑</span>
                          <span className="font-bold text-yellow-400">×{team.crowns}</span>
                        </div>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ delay: 1 + i * 0.05, duration: 0.8 }}
                            className={`h-full rounded-full ${
                              team.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                              team.rank === 2 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                              team.rank === 3 ? 'bg-gradient-to-r from-red-500 to-orange-400' :
                              'bg-gradient-to-r from-gray-500 to-gray-400'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500">{Math.round(progress)}%</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className={`text-[10px] font-bold tracking-wider lg:text-xs ${rankInfo.color}`}>
                        {rankInfo.title}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="border-t border-gray-800/50 px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-500 md:text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Vương Quyền (Hạng I)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Hải Tinh (Hạng II)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Tân Ca (Hạng III)</span>
            <span className="flex items-center gap-1">👑 = 200 Coin</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
