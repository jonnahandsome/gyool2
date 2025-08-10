export type GameView = 'menu' | 'creative' | 'speed' | 'shop' | 'gallery' | 'ranking' | 'settings' | 'upgrades' | 'speed-high-rank';

export type TangerineMode = 'speed' | 'creative-draw';

export interface UnlockCondition {
  mode: 'high-ranker';
  score: number;
}

export interface Skin {
  id: string;
  name: string;
  price: number;
  color: string;
  peelColor: string;
  unlock?: UnlockCondition;
  goldMultiplier?: number;
}

export interface GalleryItem {
  id: string;
  skin: Skin;
  name: string;
  createdAt: Date;
  peelShape?: string; // SVG path data for the peel, can contain multiple path commands
}

export interface RankingItem {
  id:string;
  name: string;
  score: number;
  gameMode: 'speed' | 'speed-high-rank';
}

export interface Background {
  id: string;
  name: string;
  price: number;
  style: string;
  unlock?: UnlockCondition;
  timeBonus?: number;
}
