import { motion } from 'framer-motion';
import { BookOpen, AlertTriangle, Award, Church, GraduationCap, CheckCircle2 } from 'lucide-react';

const criteriaData = [
  {
    category: 'Chuyên Cần (CC)',
    icon: <CheckCircle2 className="h-6 w-6" />,
    color: 'from-emerald-600 to-green-700',
    borderColor: 'border-emerald-500/30',
    items: [
      { action: 'Vắng có phép (P) hoặc Trễ', coin: '-1 Coin / thành viên', type: 'penalty', note: 'Khấu trừ tự động vào ví đội' },
      { action: 'Vắng không phép', coin: '-2 Coin / thành viên', type: 'penalty', note: 'Khấu trừ thẳng tay' },
      { action: 'Đi đủ 100% & đúng giờ', coin: '+20 Coin', type: 'reward', note: 'Thưởng vị thế cuối tuần' },
    ],
  },
  {
    category: 'Kỷ Luật & Vệ Sinh',
    icon: <AlertTriangle className="h-6 w-6" />,
    color: 'from-red-600 to-rose-700',
    borderColor: 'border-red-500/30',
    items: [
      { action: 'Vi phạm nề nếp, vệ sinh', coin: '-10 Coin / lần', type: 'penalty', note: 'Trừ trực tiếp qua Log' },
    ],
  },
  {
    category: 'Học Tập',
    icon: <GraduationCap className="h-6 w-6" />,
    color: 'from-purple-600 to-indigo-700',
    borderColor: 'border-purple-500/30',
    items: [
      { action: 'Hoàn thành bài khóa xuất sắc', coin: '+20 Coin', type: 'reward', note: 'Quỹ thưởng từ các Trưởng' },
      { action: 'Hoàn thành tốt', coin: '+5 Coin', type: 'reward', note: 'Khuyến khích nỗ lực' },
      { action: 'Chưa hoàn thành', coin: '-5 Coin', type: 'penalty', note: 'Nhắc nhở cải thiện' },
    ],
  },
  {
    category: 'Dâng Lễ',
    icon: <Church className="h-6 w-6" />,
    color: 'from-yellow-600 to-amber-700',
    borderColor: 'border-yellow-500/30',
    items: [
      { action: 'Đi lễ đủ (trên 50% sĩ số)', coin: '+3 Coin / buổi', type: 'reward', note: 'Hệ thống tự cộng dồn' },
      { action: 'Đi lễ trên 50%', coin: '+1 Coin / buổi', type: 'reward', note: 'Khuyến khích tham gia' },
      { action: 'Không đi lễ', coin: '-3 Coin', type: 'penalty', note: 'Phạt thiếu ý thức' },
    ],
  },
];

const conversionRules = [
  { range: '1 - 4 buổi', rate: '+1 Coin/buổi', emoji: '🌱' },
  { range: '5 - 8 buổi', rate: '+2 Coin/buổi', emoji: '🌿' },
  { range: '9 - 11 buổi', rate: '+3 Coin/buổi', emoji: '🌳' },
];

export default function Criteria() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#0a1628] via-[#1a1040] to-[#0a1628] p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <img src="/images/logo.png" alt="Logo" className="h-16 w-16 rounded-full border-2 border-purple-500/50" />
          <div className="text-center md:text-left">
            <h1 className="text-xl font-black tracking-wider text-purple-300 md:text-2xl">
              HỆ THỐNG TỶ GIÁ THƯỞNG / PHẠT CỐ ĐỊNH
            </h1>
            <p className="mt-1 text-sm tracking-widest text-purple-200/60">
              TIÊU CHÍ ĐỔI COIN — TRẠI TRUYỀN THỐNG XI — {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Ultimate Goal Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-900/40 via-amber-900/30 to-yellow-900/40 p-6 shadow-xl"
      >
        <div className="absolute -right-6 -top-6 text-8xl opacity-10">👑</div>
        <div className="relative flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 text-3xl shadow-lg shadow-yellow-500/30">
            👑
          </div>
          <div>
            <h2 className="text-xl font-black text-yellow-400">ĐÍCH ĐẾN TỐI HẬU: TRIỀU THIÊN ĐỨC MẸ</h2>
            <p className="mt-1 text-yellow-200/70">
              Tích lũy đạt <span className="font-black text-yellow-300">200 Coin</span> = <span className="font-black text-yellow-300">1 TRIỀU THIÊN 👑</span>
            </p>
            <p className="mt-1 text-sm text-yellow-200/50">
              Đội nhiều Triều Thiên nhất → <span className="font-bold text-yellow-300">NHẤT TOÀN TRẠI</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Criteria Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {criteriaData.map((cat, ci) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + ci * 0.1 }}
            className={`overflow-hidden rounded-2xl border ${cat.borderColor} bg-gradient-to-b from-[#0f1729] to-[#0a1020] shadow-xl`}
          >
            <div className={`flex items-center gap-3 bg-gradient-to-r ${cat.color} px-5 py-3`}>
              <span className="text-white">{cat.icon}</span>
              <h3 className="text-sm font-black tracking-wider text-white">{cat.category}</h3>
            </div>
            <div className="divide-y divide-gray-800/50">
              {cat.items.map((item, ii) => (
                <div key={ii} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{item.action}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{item.note}</p>
                  </div>
                  <span className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-black ${
                    item.type === 'reward'
                      ? 'bg-green-900/40 text-green-400'
                      : 'bg-red-900/40 text-red-400'
                  }`}>
                    {item.coin}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dâng Lễ Accumulation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#0f1729] to-[#0a1020] shadow-xl"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-700 to-orange-700 px-5 py-3">
          <Award className="h-5 w-5 text-white" />
          <h3 className="text-sm font-black tracking-wider text-white">TÍCH LŨY CHUỖI NGÀY DÂNG LỄ</h3>
        </div>
        <div className="grid gap-3 p-5 md:grid-cols-3">
          {conversionRules.map((rule, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
              <span className="text-3xl">{rule.emoji}</span>
              <div>
                <p className="text-sm font-bold text-white">{rule.range}</p>
                <p className="text-xs font-bold text-amber-400">{rule.rate}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-b from-[#0f1729] to-[#0a1020] shadow-xl"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-700 to-cyan-700 px-5 py-3">
          <BookOpen className="h-5 w-5 text-white" />
          <h3 className="text-sm font-black tracking-wider text-white">CÁCH VẬN HÀNH HỆ THỐNG</h3>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-3">
          {[
            { step: '1', title: 'Thư ký ghi nhận', desc: 'Nhập 1 dòng sự kiện vào Sổ Cái khi có phát sinh. Hệ thống tự tính coin.', icon: '📝' },
            { step: '2', title: 'Tự động đồng bộ', desc: 'Dashboard cập nhật real-time. Số dư, Triều Thiên, xếp hạng nhảy số tức thì.', icon: '⚡' },
            { step: '3', title: 'Trao giải tự động', desc: 'Hệ thống tự phong Vương Quyền, Hải Tinh, Tân Ca cho top 3 đội.', icon: '🏆' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-4 text-center">
              <div className="mb-2 text-4xl">{item.icon}</div>
              <div className="mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{item.step}</div>
              <h4 className="font-bold text-white">{item.title}</h4>
              <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
