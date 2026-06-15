import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry, TEAMS, CATEGORIES, DETAILS, calculateCoinChange } from '../types';
import { Plus, Trash2, BookOpen, Search, Filter } from 'lucide-react';

interface LogLedgerProps {
  entries: LogEntry[];
  onAdd: (entry: Omit<LogEntry, 'id' | 'coinChange'>) => void;
  onDelete: (id: string) => void;
}

export default function LogLedger({ entries, onAdd, onDelete }: LogLedgerProps) {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [team, setTeam] = useState('');
  const [category, setCategory] = useState('');
  const [detail, setDetail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !category || !detail) return;
    onAdd({ date, team, category, detail, quantity });
    setTeam('');
    setCategory('');
    setDetail('');
    setQuantity(1);
    setShowForm(false);
  };

  const availableDetails = category ? (DETAILS[category] || []) : [];
  const previewCoin = detail ? calculateCoinChange(detail, quantity) : 0;

  const filteredEntries = entries.filter((e) => {
    const matchSearch = searchTerm
      ? e.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.detail.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchTeam = filterTeam ? e.team === filterTeam : true;
    return matchSearch && matchTeam;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-[#0a1628] via-[#162040] to-[#0a1628] p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-16 w-16 rounded-full border-2 border-blue-500/50"
          />
          <div className="text-center md:text-left">
            <h1 className="text-xl font-black tracking-wider text-blue-300 md:text-2xl">
              SỔ CÁI BẢNG ĐIỂM DÒNG CHẢY TIỀN TRẠI
            </h1>
            <p className="mt-1 text-sm tracking-widest text-blue-200/60">
              XIN VÂNG — NIÊN KHÓA {new Date().getFullYear()}
            </p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:scale-105 hover:shadow-green-500/30 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              NHẬP SỰ KIỆN MỚI
            </button>
          </div>
        </div>
      </motion.div>

      {/* Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-[#0a1a10] to-[#0f1f15] p-6 shadow-xl"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-green-400">
                <BookOpen className="h-5 w-5" />
                NHẬP DÒNG SỰ KIỆN MỚI
              </h3>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">Ngày</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">Tên Đội</label>
                  <select
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Chọn đội...</option>
                    {TEAMS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">Hạng Mục</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setDetail('');
                    }}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Chọn hạng mục...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">Nội Dung</label>
                  <select
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    disabled={!category}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                  >
                    <option value="">Chọn nội dung...</option>
                    {availableDetails.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">Số Lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">Coin Tự Động</label>
                  <div className={`flex h-[42px] items-center rounded-lg border px-3 text-lg font-black ${
                    previewCoin > 0 ? 'border-green-600 bg-green-900/30 text-green-400' :
                    previewCoin < 0 ? 'border-red-600 bg-red-900/30 text-red-400' :
                    'border-gray-700 bg-gray-800/30 text-gray-500'
                  }`}>
                    {previewCoin > 0 ? '+' : ''}{previewCoin} 🪙
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={!team || !category || !detail}
                  className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2.5 font-bold text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  ✅ GHI NHẬN SỰ KIỆN
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-600 px-6 py-2.5 font-bold text-gray-400 transition-all hover:bg-gray-800"
                >
                  ❌ Hủy
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="rounded-xl border border-gray-700 bg-gray-800/50 py-2.5 pl-10 pr-8 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Tất cả đội</option>
            {TEAMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-b from-[#0f1729] to-[#0a1020] shadow-2xl"
      >
        <div className="border-b border-blue-500/20 bg-gradient-to-r from-blue-900/30 to-transparent px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-blue-300">
            <BookOpen className="h-5 w-5" />
            DÒNG CHẢY SỰ KIỆN ({filteredEntries.length} bản ghi)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3 text-left">Ngày</th>
                <th className="px-4 py-3 text-left">Tên Đội</th>
                <th className="px-4 py-3 text-left">Hạng Mục</th>
                <th className="px-4 py-3 text-left">Nội Dung Chi Tiết</th>
                <th className="px-4 py-3 text-center">SL</th>
                <th className="px-4 py-3 text-center">Biến Động Ví</th>
                <th className="px-4 py-3 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredEntries.map((entry, i) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-800/50 transition-colors hover:bg-white/5"
                  >
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {new Date(entry.date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-blue-900/40 px-2 py-1 text-sm font-bold text-blue-300">
                        {entry.team}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                        entry.category === 'Chuyên cần' ? 'bg-emerald-900/40 text-emerald-300' :
                        entry.category === 'Kỷ luật' ? 'bg-red-900/40 text-red-300' :
                        entry.category === 'Học tập' ? 'bg-purple-900/40 text-purple-300' :
                        'bg-yellow-900/40 text-yellow-300'
                      }`}>
                        {entry.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{entry.detail}</td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-white">{entry.quantity}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-black ${
                        entry.coinChange > 0 ? 'bg-green-900/40 text-green-400' :
                        entry.coinChange < 0 ? 'bg-red-900/40 text-red-400' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {entry.coinChange > 0 ? '+' : ''}{entry.coinChange} 🪙
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-900/30 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredEntries.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-30" />
            <p className="text-lg font-bold">Chưa có sự kiện nào</p>
            <p className="text-sm">Nhấn "NHẬP SỰ KIỆN MỚI" để bắt đầu ghi nhận</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
