export interface LogEntry {
  id: string;
  date: string;
  team: string;
  category: string;
  detail: string;
  quantity: number;
  coinChange: number;
}

export interface TeamData {
  name: string;
  totalCoins: number;
  crowns: number;
  rank: number;
  title: string;
  titleColor: string;
}

export type TabType = 'dashboard' | 'log' | 'criteria' | 'ceremony' | 'guide';

export const TEAMS = Array.from({ length: 12 }, (_, i) => `Đội ${i + 1}`);

export const CATEGORIES = ['Chuyên cần', 'Kỷ luật', 'Học tập', 'Dâng lễ'];

export const DETAILS: Record<string, string[]> = {
  'Chuyên cần': ['Vắng có phép', 'Vắng không phép', 'Chuyên cần tốt'],
  'Kỷ luật': ['Vi phạm vệ sinh', 'Vi phạm nề nếp'],
  'Học tập': ['Hoàn thành xuất sắc', 'Hoàn thành tốt', 'Chưa hoàn thành'],
  'Dâng lễ': ['Đi lễ đủ', 'Đi lễ trên 50%', 'Không đi lễ'],
};

export function calculateCoinChange(detail: string, quantity: number): number {
  switch (detail) {
    case 'Vắng có phép':
      return -1 * quantity;
    case 'Vắng không phép':
      return -2 * quantity;
    case 'Chuyên cần tốt':
      return 20;
    case 'Vi phạm vệ sinh':
      return -10 * quantity;
    case 'Vi phạm nề nếp':
      return -10 * quantity;
    case 'Hoàn thành xuất sắc':
      return 20 * quantity;
    case 'Hoàn thành tốt':
      return 5 * quantity;
    case 'Chưa hoàn thành':
      return -5 * quantity;
    case 'Đi lễ đủ':
      return 3 * quantity;
    case 'Đi lễ trên 50%':
      return 1 * quantity;
    case 'Không đi lễ':
      return -3 * quantity;
    default:
      return 0;
  }
}

export function getRankTitle(rank: number): { title: string; color: string; bg: string; icon: string } {
  switch (rank) {
    case 1:
      return {
        title: '🟨 V Ư Ơ N G ✦ Q U Y Ề N (HẠNG I)',
        color: 'text-yellow-300',
        bg: 'from-yellow-900/80 to-yellow-700/60 border-yellow-400',
        icon: '👑',
      };
    case 2:
      return {
        title: '🟦 H Ả I † T I N H (HẠNG II)',
        color: 'text-blue-300',
        bg: 'from-blue-900/80 to-blue-700/60 border-blue-400',
        icon: '🥈',
      };
    case 3:
      return {
        title: '🟥 T Â N ✦ C A (HẠNG III)',
        color: 'text-red-300',
        bg: 'from-red-900/80 to-red-700/60 border-red-400',
        icon: '🥉',
      };
    default:
      return {
        title: '⬛ CHIẾN BINH SA MẠC',
        color: 'text-gray-400',
        bg: 'from-gray-800/60 to-gray-700/40 border-gray-600',
        icon: '⚔️',
      };
  }
}
