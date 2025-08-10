import { RankingItem } from '../types';

const fakeNames = [
  '귤신', '까기의 달인', '오렌지 보이', 'Tangerine Dream', '비타민C 중독',
  '과즙세공사', '감귤마스터', '시트러스닌자', 'PeelMaster', '황금손',
  '제주도 토박이', '한라봉 킬러', '인간 착즙기', '비타민 폭격기', '과일의 지배자',
  '귤까기협회장', 'TangerineSlayer', 'CitrusLord', '감귤농장아들', '프로과일러'
];

const generateFakeRankings = (count: number, minScore: number, maxScore: number, mode: 'speed' | 'speed-high-rank'): RankingItem[] => {
  const rankings: RankingItem[] = [];
  const usedNames = new Set<string>();

  while (rankings.length < count) {
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    if (usedNames.has(name)) continue;

    const score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
    rankings.push({
      id: `global-${mode}-${rankings.length}`,
      name,
      score,
      gameMode: mode,
    });
    usedNames.add(name);
  }

  return rankings.sort((a, b) => b.score - a.score);
};

// Simulate async fetch
export const getRankings = async (mode: 'speed' | 'speed-high-rank'): Promise<RankingItem[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (mode === 'speed-high-rank') {
        resolve(generateFakeRankings(15, 11, 45, 'speed-high-rank'));
      } else {
        resolve(generateFakeRankings(20, 5, 25, 'speed'));
      }
    }, 300); // Simulate network delay
  });
};
