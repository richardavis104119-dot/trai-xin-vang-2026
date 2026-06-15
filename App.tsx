import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabType } from './types';
import { useLogStore } from './store';
import Dashboard from './components/Dashboard';
import LogLedger from './components/LogLedger';
import Criteria from './components/Criteria';
import Ceremony from './components/Ceremony';
import Guide from './components/Guide';
import {
  LayoutDashboard, BookOpen, FileText, Trophy, RotateCcw,
  Trash2, HelpCircle, Download, Upload, FileSpreadsheet, X, Check, AlertTriangle
} from 'lucide-react';

const tabs: { id: TabType; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'log', label: 'Sổ Cái', shortLabel: 'Sổ Cái', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'criteria', label: 'Tiêu Chí', shortLabel: 'Tiêu Chí', icon: <FileText className="h-4 w-4" /> },
  { id: 'ceremony', label: 'Trao Giải', shortLabel: 'Trao Giải', icon: <Trophy className="h-4 w-4" /> },
  { id: 'guide', label: 'Hướng Dẫn', shortLabel: 'HD', icon: <HelpCircle className="h-4 w-4" /> },
];

interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { entries, addEntry, deleteEntry, resetData, clearAll, getTeamData, exportCSV, exportDashboardCSV, importCSV } = useLogStore();
  const teams = getTeamData();
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const count = await importCSV(file);
      showToast(`✅ Nhập thành công ${count} bản ghi từ CSV!`, 'success');
    } catch (err) {
      showToast(`❌ Lỗi nhập CSV: ${err instanceof Error ? err.message : 'Không xác định'}`, 'error');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060e1f] via-[#0a1628] to-[#060e1f] text-white">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed left-1/2 top-16 z-[100] flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl backdrop-blur-xl"
            style={{
              borderColor: toast.type === 'success' ? 'rgba(34,197,94,0.5)' : toast.type === 'error' ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.5)',
              backgroundColor: toast.type === 'success' ? 'rgba(5,46,22,0.95)' : toast.type === 'error' ? 'rgba(69,10,10,0.95)' : 'rgba(23,37,84,0.95)',
            }}
          >
            {toast.type === 'success' ? <Check className="h-5 w-5 text-green-400" /> :
             toast.type === 'error' ? <AlertTriangle className="h-5 w-5 text-red-400" /> :
             <HelpCircle className="h-5 w-5 text-blue-400" />}
            <span className={`text-sm font-bold ${
              toast.type === 'success' ? 'text-green-300' :
              toast.type === 'error' ? 'text-red-300' : 'text-blue-300'
            }`}>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-yellow-500/10 bg-[#060e1f]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-2 md:px-3">
          <div className="flex items-center gap-1 py-2 md:gap-2">
            {/* Logo */}
            <img src="/images/logo.png" alt="Logo" className="h-8 w-8 rounded-full border border-yellow-500/30 md:h-9 md:w-9" />
            <span className="mr-1 hidden text-xs font-black tracking-wider text-yellow-400 lg:block lg:text-sm">
              XIN VÂNG
            </span>

            {/* Tabs */}
            <div className="flex flex-1 gap-0.5 md:gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-bold transition-all md:gap-1.5 md:px-3 md:text-xs lg:text-sm ${
                    activeTab === tab.id
                      ? 'text-yellow-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg border border-yellow-500/20 bg-yellow-500/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-lg border border-gray-700 px-2.5 py-2 text-xs font-bold text-gray-400 transition-colors hover:border-gray-500 hover:text-white md:px-3"
              >
                ⚙️
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-700 bg-[#0c1525] shadow-2xl shadow-black/50">
                    {/* Header */}
                    <div className="border-b border-gray-700/50 bg-gradient-to-r from-yellow-900/20 to-transparent px-4 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">Quản lý dữ liệu</p>
                    </div>

                    {/* Export buttons */}
                    <button
                      onClick={() => { exportCSV(); showToast('📥 Đã xuất Sổ Cái ra file CSV!', 'success'); setShowMenu(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-gray-800/80"
                    >
                      <Download className="h-4 w-4 text-green-400" />
                      <div>
                        <span className="font-bold">📥 Xuất Sổ Cái → CSV</span>
                        <p className="text-[10px] text-gray-500">Tải file dữ liệu nhập liệu</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { exportDashboardCSV(teams); showToast('📊 Đã xuất Bảng Xếp Hạng ra CSV!', 'success'); setShowMenu(false); }}
                      className="flex w-full items-center gap-3 border-t border-gray-800/50 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-gray-800/80"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-blue-400" />
                      <div>
                        <span className="font-bold">📊 Xuất Xếp Hạng → CSV</span>
                        <p className="text-[10px] text-gray-500">Bảng xếp hạng 12 đội</p>
                      </div>
                    </button>

                    {/* Import */}
                    <button
                      onClick={() => { fileInputRef.current?.click(); }}
                      className="flex w-full items-center gap-3 border-t border-gray-800/50 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-gray-800/80"
                    >
                      <Upload className="h-4 w-4 text-yellow-400" />
                      <div>
                        <span className="font-bold">📤 Nhập từ CSV</span>
                        <p className="text-[10px] text-gray-500">Import dữ liệu từ Google Sheets</p>
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-700/50 bg-gradient-to-r from-gray-800/20 to-transparent px-4 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Hệ thống</p>
                    </div>

                    <button
                      onClick={() => { resetData(); showToast('🔄 Đã khôi phục dữ liệu mẫu!', 'info'); setShowMenu(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-gray-800/80"
                    >
                      <RotateCcw className="h-4 w-4 text-cyan-400" />
                      <div>
                        <span className="font-bold">🔄 Khôi phục dữ liệu mẫu</span>
                        <p className="text-[10px] text-gray-500">Reset về dữ liệu demo</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('⚠️ Xóa TOÀN BỘ dữ liệu? Hành động này không thể hoàn tác!')) {
                          clearAll();
                          showToast('🗑️ Đã xóa toàn bộ dữ liệu!', 'error');
                          setShowMenu(false);
                        }
                      }}
                      className="flex w-full items-center gap-3 border-t border-gray-800/50 px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      <div>
                        <span className="font-bold">🗑️ Xóa toàn bộ dữ liệu</span>
                        <p className="text-[10px] text-red-500/60">Không thể hoàn tác</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 py-6 md:px-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && <Dashboard teams={teams} />}
          {activeTab === 'log' && (
            <LogLedger entries={entries} onAdd={addEntry} onDelete={deleteEntry} />
          )}
          {activeTab === 'criteria' && <Criteria />}
          {activeTab === 'ceremony' && <Ceremony teams={teams} />}
          {activeTab === 'guide' && <Guide />}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-6 text-center">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-xs text-gray-600">
            HỆ THỐNG QUẢN LÝ TÀI CHÍNH TOÀN TRẠI © TRẠI TRUYỀN THỐNG XI — XIN VÂNG — {new Date().getFullYear()}
          </p>
          <p className="mt-1 text-[10px] text-gray-700">
            Có {entries.length} bản ghi · Tổng {teams.reduce((s, t) => s + t.totalCoins, 0)} coin · {teams.reduce((s, t) => s + t.crowns, 0)} Triều Thiên
          </p>
        </div>
      </footer>
    </div>
  );
}
