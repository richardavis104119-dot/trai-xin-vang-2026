import { useState, useCallback } from 'react';
import { LogEntry, TeamData, TEAMS, calculateCoinChange } from './types';

const STORAGE_KEY = 'trai_truyen_thong_xi_2026';

function loadLog(): LogEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return getSampleData();
}

function saveLog(entries: LogEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getSampleData(): LogEntry[] {
  return [
    // === TUẦN 1: TIỀN TRẠI T6 (15/06 - 21/06) ===
    // Ngày 15/06 — Khai mạc
    { id: 's01', date: '2026-06-15', team: 'Đội 1', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's02', date: '2026-06-15', team: 'Đội 2', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's03', date: '2026-06-15', team: 'Đội 3', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's04', date: '2026-06-15', team: 'Đội 4', category: 'Chuyên cần', detail: 'Vắng có phép', quantity: 2, coinChange: -2 },
    { id: 's05', date: '2026-06-15', team: 'Đội 5', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's06', date: '2026-06-15', team: 'Đội 6', category: 'Chuyên cần', detail: 'Vắng không phép', quantity: 1, coinChange: -2 },
    { id: 's07', date: '2026-06-15', team: 'Đội 7', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's08', date: '2026-06-15', team: 'Đội 8', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's09', date: '2026-06-15', team: 'Đội 9', category: 'Chuyên cần', detail: 'Vắng có phép', quantity: 3, coinChange: -3 },
    { id: 's10', date: '2026-06-15', team: 'Đội 10', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's11', date: '2026-06-15', team: 'Đội 11', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's12', date: '2026-06-15', team: 'Đội 12', category: 'Chuyên cần', detail: 'Vắng có phép', quantity: 1, coinChange: -1 },
    // Dâng lễ 15/06
    { id: 's13', date: '2026-06-15', team: 'Đội 1', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's14', date: '2026-06-15', team: 'Đội 3', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's15', date: '2026-06-15', team: 'Đội 5', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's16', date: '2026-06-15', team: 'Đội 7', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's17', date: '2026-06-15', team: 'Đội 10', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },

    // Ngày 17/06
    { id: 's18', date: '2026-06-17', team: 'Đội 1', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's19', date: '2026-06-17', team: 'Đội 2', category: 'Kỷ luật', detail: 'Vi phạm vệ sinh', quantity: 1, coinChange: -10 },
    { id: 's20', date: '2026-06-17', team: 'Đội 3', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's21', date: '2026-06-17', team: 'Đội 5', category: 'Học tập', detail: 'Hoàn thành tốt', quantity: 1, coinChange: 5 },
    { id: 's22', date: '2026-06-17', team: 'Đội 6', category: 'Kỷ luật', detail: 'Vi phạm nề nếp', quantity: 1, coinChange: -10 },
    { id: 's23', date: '2026-06-17', team: 'Đội 7', category: 'Học tập', detail: 'Hoàn thành tốt', quantity: 1, coinChange: 5 },
    { id: 's24', date: '2026-06-17', team: 'Đội 8', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's25', date: '2026-06-17', team: 'Đội 10', category: 'Học tập', detail: 'Hoàn thành tốt', quantity: 1, coinChange: 5 },
    { id: 's26', date: '2026-06-17', team: 'Đội 11', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's27', date: '2026-06-17', team: 'Đội 4', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },

    // Ngày 19/06
    { id: 's28', date: '2026-06-19', team: 'Đội 1', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's29', date: '2026-06-19', team: 'Đội 3', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's30', date: '2026-06-19', team: 'Đội 8', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's31', date: '2026-06-19', team: 'Đội 10', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's32', date: '2026-06-19', team: 'Đội 11', category: 'Chuyên cần', detail: 'Vắng có phép', quantity: 1, coinChange: -1 },
    { id: 's33', date: '2026-06-19', team: 'Đội 12', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's34', date: '2026-06-19', team: 'Đội 4', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's35', date: '2026-06-19', team: 'Đội 9', category: 'Kỷ luật', detail: 'Vi phạm vệ sinh', quantity: 1, coinChange: -10 },
    // Dâng lễ 19/06
    { id: 's36', date: '2026-06-19', team: 'Đội 1', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's37', date: '2026-06-19', team: 'Đội 3', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's38', date: '2026-06-19', team: 'Đội 8', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's39', date: '2026-06-19', team: 'Đội 10', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },

    // Ngày 21/06
    { id: 's40', date: '2026-06-21', team: 'Đội 2', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's41', date: '2026-06-21', team: 'Đội 5', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's42', date: '2026-06-21', team: 'Đội 7', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's43', date: '2026-06-21', team: 'Đội 11', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's44', date: '2026-06-21', team: 'Đội 6', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's45', date: '2026-06-21', team: 'Đội 1', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's46', date: '2026-06-21', team: 'Đội 12', category: 'Học tập', detail: 'Hoàn thành tốt', quantity: 1, coinChange: 5 },
    { id: 's47', date: '2026-06-21', team: 'Đội 9', category: 'Học tập', detail: 'Hoàn thành tốt', quantity: 1, coinChange: 5 },

    // === TUẦN 2: TIỀN TRẠI T7 (01/07 - 06/07) ===
    // Ngày 01/07
    { id: 's48', date: '2026-07-01', team: 'Đội 1', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's49', date: '2026-07-01', team: 'Đội 3', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's50', date: '2026-07-01', team: 'Đội 8', category: 'Chuyên cần', detail: 'Vắng có phép', quantity: 1, coinChange: -1 },
    { id: 's51', date: '2026-07-01', team: 'Đội 10', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's52', date: '2026-07-01', team: 'Đội 4', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's53', date: '2026-07-01', team: 'Đội 2', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's54', date: '2026-07-01', team: 'Đội 5', category: 'Kỷ luật', detail: 'Vi phạm vệ sinh', quantity: 1, coinChange: -10 },
    { id: 's55', date: '2026-07-01', team: 'Đội 11', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's56', date: '2026-07-01', team: 'Đội 1', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's57', date: '2026-07-01', team: 'Đội 3', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },

    // Ngày 03/07
    { id: 's58', date: '2026-07-03', team: 'Đội 1', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's59', date: '2026-07-03', team: 'Đội 3', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's60', date: '2026-07-03', team: 'Đội 10', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's61', date: '2026-07-03', team: 'Đội 7', category: 'Kỷ luật', detail: 'Vi phạm vệ sinh', quantity: 1, coinChange: -10 },
    { id: 's62', date: '2026-07-03', team: 'Đội 12', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's63', date: '2026-07-03', team: 'Đội 6', category: 'Học tập', detail: 'Hoàn thành tốt', quantity: 1, coinChange: 5 },
    { id: 's64', date: '2026-07-03', team: 'Đội 9', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's65', date: '2026-07-03', team: 'Đội 4', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's66', date: '2026-07-03', team: 'Đội 2', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },

    // Ngày 05/07
    { id: 's67', date: '2026-07-05', team: 'Đội 1', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's68', date: '2026-07-05', team: 'Đội 3', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's69', date: '2026-07-05', team: 'Đội 10', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's70', date: '2026-07-05', team: 'Đội 8', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's71', date: '2026-07-05', team: 'Đội 11', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's72', date: '2026-07-05', team: 'Đội 4', category: 'Học tập', detail: 'Hoàn thành xuất sắc', quantity: 1, coinChange: 20 },
    { id: 's73', date: '2026-07-05', team: 'Đội 2', category: 'Học tập', detail: 'Hoàn thành tốt', quantity: 1, coinChange: 5 },
    { id: 's74', date: '2026-07-05', team: 'Đội 6', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's75', date: '2026-07-05', team: 'Đội 12', category: 'Kỷ luật', detail: 'Vi phạm nề nếp', quantity: 1, coinChange: -10 },
    { id: 's76', date: '2026-07-05', team: 'Đội 9', category: 'Dâng lễ', detail: 'Đi lễ đủ', quantity: 1, coinChange: 3 },
    { id: 's77', date: '2026-07-05', team: 'Đội 5', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
    { id: 's78', date: '2026-07-05', team: 'Đội 7', category: 'Chuyên cần', detail: 'Chuyên cần tốt', quantity: 1, coinChange: 20 },
  ];
}

export function useLogStore() {
  const [entries, setEntries] = useState<LogEntry[]>(loadLog);

  const addEntry = useCallback((entry: Omit<LogEntry, 'id' | 'coinChange'>) => {
    const coinChange = calculateCoinChange(entry.detail, entry.quantity);
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      coinChange,
    };
    setEntries((prev) => {
      const updated = [newEntry, ...prev];
      saveLog(updated);
      return updated;
    });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveLog(updated);
      return updated;
    });
  }, []);

  const resetData = useCallback(() => {
    const sample = getSampleData();
    setEntries(sample);
    saveLog(sample);
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    saveLog([]);
  }, []);

  const exportCSV = useCallback(() => {
    const BOM = '\uFEFF';
    const header = 'Ngày,Tên Đội,Hạng Mục,Nội Dung Chi Tiết,Số Lượng,Biến Động Coin';
    const rows = entries.map((e) => {
      const d = new Date(e.date);
      const dateStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
      return `${dateStr},${e.team},${e.category},${e.detail},${e.quantity},${e.coinChange}`;
    });
    const csv = BOM + header + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Log_Tien_Trai_XinVang_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  const exportDashboardCSV = useCallback((teams: TeamData[]) => {
    const BOM = '\uFEFF';
    const sorted = [...teams].sort((a,b) => a.rank - b.rank);
    const header = 'Hạng,Tên Đội,Tổng Coin Vị Thế,Triều Thiên Đức Mẹ,Danh Hiệu';
    const rows = sorted.map((t) => {
      const title = t.rank === 1 ? 'VƯƠNG QUYỀN (HẠNG I)' :
                    t.rank === 2 ? 'HẢI TINH (HẠNG II)' :
                    t.rank === 3 ? 'TÂN CA (HẠNG III)' : 'CHIẾN BINH SA MẠC';
      return `${t.rank},${t.name},${t.totalCoins},${t.crowns},${title}`;
    });
    const csv = BOM + header + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BangXepHang_XinVang_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importCSV = useCallback((file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.replace(/^\uFEFF/, '').split('\n').filter(l => l.trim());
          const dataLines = lines.slice(1);
          const newEntries: LogEntry[] = dataLines.map((line, i) => {
            const parts = line.split(',').map(s => s.trim());
            if (parts.length < 5) throw new Error(`Dòng ${i+2}: thiếu cột dữ liệu`);
            const [dateStr, team, category, detail, qtyStr] = parts;
            let dateVal: string;
            if (dateStr.includes('/')) {
              const [d, m, y] = dateStr.split('/');
              dateVal = `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
            } else {
              dateVal = dateStr;
            }
            const quantity = parseInt(qtyStr) || 1;
            const coinChange = calculateCoinChange(detail, quantity);
            return {
              id: Date.now().toString() + Math.random().toString(36).slice(2) + i,
              date: dateVal,
              team,
              category,
              detail,
              quantity,
              coinChange,
            };
          });
          setEntries((prev) => {
            const updated = [...newEntries, ...prev];
            saveLog(updated);
            return updated;
          });
          resolve(newEntries.length);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Không đọc được file'));
      reader.readAsText(file, 'UTF-8');
    });
  }, []);

  const getTeamData = useCallback((): TeamData[] => {
    const BASE_COINS = 100;
    const coinMap: Record<string, number> = {};
    TEAMS.forEach((t) => (coinMap[t] = BASE_COINS));
    entries.forEach((e) => {
      if (coinMap[e.team] !== undefined) {
        coinMap[e.team] += e.coinChange;
      }
    });
    const teamsArr = TEAMS.map((name) => ({
      name,
      totalCoins: coinMap[name],
      crowns: Math.floor(Math.max(coinMap[name], 0) / 200),
      rank: 0,
      title: '',
      titleColor: '',
    }));
    const sorted = [...teamsArr].sort((a, b) => b.totalCoins - a.totalCoins);
    sorted.forEach((team, index) => { team.rank = index + 1; });
    const rankMap: Record<string, number> = {};
    sorted.forEach((t) => (rankMap[t.name] = t.rank));
    teamsArr.forEach((t) => (t.rank = rankMap[t.name]));
    return teamsArr;
  }, [entries]);

  return { entries, addEntry, deleteEntry, resetData, clearAll, getTeamData, exportCSV, exportDashboardCSV, importCSV };
}
