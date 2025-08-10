

import { Skin, Background } from './types';

export const INITIAL_CURRENCY = 100;
export const SPEED_MODE_DURATION_S = 30;
export const HIGH_RANK_MODE_DURATION_S = 45;
export const HIGH_RANK_MODE_UNLOCK_SCORE = 11;
export const TANGERINE_SEGMENTS = 8; // For speed mode
export const REWARD_PER_TANGERINE = 100; // For speed mode
export const REWARD_CREATIVE_SUBMIT = 50;

export const SKINS: Skin[] = [
  { id: 'default', name: '기본 귤', price: 0, color: '#FDBA74', peelColor: '#FB923C' },
  { id: 'hallabong', name: '한라봉', price: 200, color: '#F97316', peelColor: '#EA580C' },
  { id: 'lime', name: '라임', price: 500, color: '#BEF264', peelColor: '#A3E635' },
  { id: 'gold', name: '황금 귤', price: 1000, color: '#FBBF24', peelColor: '#F59E0B' },
  { id: 'galaxy', name: '갤럭시 귤', price: 2500, color: '#6366F1', peelColor: '#4F46E5' },
  { id: 'legendary', name: '전설의 귤', price: 30000, color: '#4B0082', peelColor: '#FFD700', goldMultiplier: 101 },
  { id: 'ice', name: '얼음 귤', price: 60000, color: '#A5F3FC', peelColor: '#67E8F9' },
  { id: 'lava', name: '용암 귤', price: 60000, color: '#F87171', peelColor: '#DC2626' },
  { id: 'dragonfruit', name: '용과 귤', price: 75000, color: '#EC4899', peelColor: '#A3E635' },
  { id: 'transparent', name: '투명 귤', price: 150000, color: 'rgba(230, 230, 255, 0.1)', peelColor: 'rgba(200, 200, 255, 0.4)' },
  { id: 'steampunk', name: '스팀펑크 귤', price: 250000, color: '#A16207', peelColor: '#CA8A04' },
  { id: 'diamond', name: '다이아몬드 귤', price: 500000, color: '#A7F3D0', peelColor: '#67E8F9', goldMultiplier: 501 },
  { id: 'moon', name: '달 귤', price: 0, unlock: { mode: 'high-ranker', score: 15 }, color: '#F5F3FF', peelColor: '#E0E7FF', goldMultiplier: 201 },
  { id: 'shield', name: '방패 귤', price: 0, unlock: { mode: 'high-ranker', score: 20 }, color: '#A8A29E', peelColor: '#78716C', goldMultiplier: 301 },
  { id: 'god-tangerine', name: '신의 귤', price: 1000000, unlock: { mode: 'high-ranker', score: 30 }, color: '#FDE68A', peelColor: '#FFFBEB', goldMultiplier: 100001 },
];

export const BACKGROUNDS: Background[] = [
  { id: 'default', name: '기본 배경', price: 0, style: 'bg-orange-50', timeBonus: 0 },
  { id: 'day', name: '맑은 하늘', price: 500, style: 'bg-gradient-to-b from-sky-300 to-sky-500', timeBonus: 1 },
  { id: 'sunset', name: '해질녘 노을', price: 1000, style: 'bg-gradient-to-br from-orange-300 via-red-400 to-purple-500' },
  { id: 'forest', name: '고요한 숲', price: 1500, style: 'bg-gradient-to-t from-emerald-600 to-green-400' },
  { id: 'night', name: '밤 하늘', price: 2000, style: 'bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900' },
  { id: 'beach', name: '해변의 하루', price: 3000, style: 'bg-gradient-to-r from-cyan-200 to-blue-300', timeBonus: 2 },
  { id: 'cyberpunk', name: '사이버펑크 도시', price: 5000, style: 'bg-gradient-to-br from-purple-800 via-fuchsia-700 to-cyan-500', timeBonus: 3 },
  { id: 'magic-forest', name: '마법의 숲', price: 10000, style: 'bg-gradient-to-tr from-teal-700 via-green-800 to-emerald-900', timeBonus: 4 },
  { id: 'nebula', name: '성운', price: 15000, style: 'bg-gradient-to-bl from-indigo-900 via-purple-900 to-pink-900', timeBonus: 5 },
  { id: 'underwater', name: '수중 세계', price: 80000, style: 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600' },
  { id: 'spacestation', name: '우주 정거장', price: 100000, style: 'bg-gradient-to-bl from-slate-900 via-black to-blue-900' },
  { id: 'castle', name: '성 배경', price: 0, unlock: { mode: 'high-ranker', score: 15 }, style: 'bg-gradient-to-b from-slate-600 via-slate-800 to-black' },
  { id: 'shining-moon', name: '빛나는 달 배경', price: 0, unlock: { mode: 'high-ranker', score: 20 }, style: 'bg-gradient-to-b from-indigo-900 to-black' },
  { id: 'temple', name: '신전', price: 2000000, unlock: { mode: 'high-ranker', score: 30 }, style: 'bg-gradient-to-br from-yellow-100 via-amber-300 to-yellow-100', timeBonus: 6 },
];

// Level 0 to 10. Index corresponds to level.
export const DOUBLE_PEEL_CHANCES = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50]; 
// Cost to upgrade to level 1, 2, ... 10. Index corresponds to current level.
export const DOUBLE_PEEL_UPGRADE_COSTS = [100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 50000]; 

// Level 0 to 5.
export const TRIPLE_PEEL_CHANCES = [0, 0.02, 0.04, 0.06, 0.08, 0.1];
// Cost to upgrade to level 1, 2, ... 5.
export const TRIPLE_PEEL_UPGRADE_COSTS = [5000, 10000, 25000, 50000, 100000];

// Level 0 to 5.
export const QUADRUPLE_PEEL_CHANCES = [0, 0.01, 0.02, 0.03, 0.04, 0.05];
// Cost to upgrade to level 1, 2, ... 5.
export const QUADRUPLE_PEEL_UPGRADE_COSTS = [150000, 300000, 600000, 1200000, 2500000];

// Level 0 to 6. Number of uses per game.
export const BURNING_TIME_USES = [0, 1, 2, 3, 4, 5, 6];
// Cost to upgrade to level 1, 2, ... 6.
export const BURNING_TIME_UPGRADE_COSTS = [500000, 1000000, 3000000, 6000000, 12000000, 25000000];

// Level 0 to 4. Number of touches per game.
export const AWAKENED_BURNING_TOUCHES = [0, 2, 3, 4, 5];
// Cost to upgrade to level 1, 2, 3, 4.
export const AWAKENED_BURNING_UPGRADE_COSTS = [1000000, 2500000, 5000000, 10000000];

// Level 0 to 10. Chance bonus applied to Double, Triple, and Quadruple peels.
export const TRANSCENDENT_PEEL_CHANCE_BONUS = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10];
// Cost to upgrade to level 1, 2, ... 10
export const TRANSCENDENT_PEEL_UPGRADE_COSTS = [20000000, 50000000, 100000000, 250000000, 500000000, 1000000000, 2500000000, 5000000000, 10000000000, 25000000000];

export const GOD_TANGERINE_UPGRADE_COSTS = [5000000, 10000000, 25000000, 50000000, 100000000, 250000000, 500000000, 1000000000, 2500000000, 50000000000];
export const QUINTUPLE_PEEL_CHANCE_PER_LEVEL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.07]; // 7% at level 10

export const TEMPLE_BACKGROUND_UPGRADE_COSTS = [10000000, 25000000, 50000000, 100000000, 250000000, 500000000, 1000000000, 2500000000, 5000000000, 100000000000];
export const TEMPLE_TIME_BONUS_PER_LEVEL = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]; // +5s total at level 10

// Infinite Upgrade: Transcendent Realm
export const INFINITE_UPGRADE_CHANCE_PER_LEVEL = 0.00125; // +0.125% per level
export const INFINITE_UPGRADE_BASE_COST = 50000000000; // 50 Billion
export const INFINITE_UPGRADE_COST_MULTIPLIER = 1.15;
export const INFINITE_UPGRADE_BASE_SUCCESS_RATE = 0.9; // 90%
export const INFINITE_UPGRADE_SUCCESS_RATE_DECAY = 0.015; // 1.5% decay per level
export const INFINITE_UPGRADE_MIN_SUCCESS_RATE = 0.05; // 5% minimum

export const COUPONS: { [key: string]: { type: 'currency' | 'skin', value: number | string } } = {
    'TANGERINEKING': { type: 'currency', value: 1000 },
    'FREESKIN': { type: 'skin', value: 'galaxy' },
    'SUPERPEEL': { type: 'currency', value: 2500 },
    'ORANGEGOLDFREE': { type: 'currency', value: 3000 },
    '귤까기히든쿠폰코인': { type: 'currency', value: 1000000 },
    '난귤이좋아코인': { type: 'currency', value: 600000 },
    '난귤이업청좋아코인': { type: 'currency', value: 10000000 },
    '쿠폰코드가최고지롱': { type: 'currency', value: 100000000 },
    '초월을위한쿠폰': { type: 'currency', value: 1000000000000 },
    '10B코인': { type: 'currency', value: 1000000000000000000 },
};

// Index corresponds to level. Level 0 allows 1 line.
export const LIFT_PEN_COUNTS = [1, 2, 3, 4, 5, 7, 10];
// Cost to upgrade to level 1, 2, ...
export const LIFT_PEN_UPGRADE_COSTS = [500, 1000, 2500, 5000, 10000, 20000];