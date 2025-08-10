


import React from 'react';
import { GameView, Skin, Background } from '../types';
import CoinIcon from './icons/CoinIcon';
import ClockIcon from './icons/ClockIcon';

interface ShopProps {
  setView: (view: GameView) => void;
  skins: Skin[];
  ownedSkins: string[];
  currentSkinId: string;
  currency: number;
  onPurchase: (skinId: string) => void;
  onSelect: (skinId: string) => void;
  userHighScore: number;
  highRankerHighScore: number;
  backgrounds: Background[];
  ownedBackgrounds: string[];
  currentBackgroundId: string;
  onPurchaseBackground: (bgId: string) => void;
  onSelectBackground: (bgId: string) => void;
  doublePeelLevel: number;
  triplePeelLevel: number;
  liftPenLevel: number;
  transcendentPeelLevel: number;
}

const Shop: React.FC<ShopProps> = ({ 
    setView, skins, ownedSkins, currentSkinId, currency, onPurchase, onSelect, 
    userHighScore, highRankerHighScore,
    backgrounds, ownedBackgrounds, currentBackgroundId, onPurchaseBackground, onSelectBackground,
    doublePeelLevel, triplePeelLevel, liftPenLevel, transcendentPeelLevel
}) => {

    const renderItem = (item: Skin | Background, type: 'skin' | 'background') => {
        const isOwned = type === 'skin' ? ownedSkins.includes(item.id) : ownedBackgrounds.includes(item.id);
        const isSelected = type === 'skin' ? currentSkinId === item.id : currentBackgroundId === item.id;
        const canAfford = currency >= item.price;

        let isUnlocked = true;
        let unlockMessage: string | null = null;
        let purchaseDisabled = !canAfford || isOwned;

        // --- Unlock Logic ---
        if (item.unlock?.mode === 'high-ranker') {
            isUnlocked = highRankerHighScore >= item.unlock.score;
            if (!isUnlocked) {
                unlockMessage = `필요: 하이랭커 ${item.unlock.score}점 (현재: ${highRankerHighScore}점)`;
            }
        } else if (item.id === 'transparent') {
            const requirement = 10;
            isUnlocked = userHighScore >= requirement;
            if (!isUnlocked) {
                unlockMessage = `필요: 최고 ${requirement}점 (현재: ${userHighScore}점)`;
            }
        } else if (item.id === 'dragonfruit') {
            const doublePeelReq = 5;
            const triplePeelReq = 1;
            isUnlocked = doublePeelLevel >= doublePeelReq && triplePeelLevel >= triplePeelReq;
            if (!isUnlocked) {
                unlockMessage = `필요: 더블 필 Lv.${doublePeelReq} / 트리플 필 Lv.${triplePeelReq}`;
            }
        } else if (item.id === 'steampunk') {
            const requirement = 1;
            isUnlocked = transcendentPeelLevel >= requirement;
            if (!isUnlocked) {
                unlockMessage = `필요: 초월 귤까기 Lv.${requirement}`;
            }
        } else if (type === 'background' && item.id === 'magic-forest') {
            const requirement = 5;
            isUnlocked = liftPenLevel >= requirement;
            if (!isUnlocked) {
                unlockMessage = `필요: 선 긋기 횟수 Lv.${requirement}`;
            }
        }
        
        purchaseDisabled = purchaseDisabled || !isUnlocked;
        const skinItem = item as Skin;
        const bgItem = item as Background;

        return (
            <div key={item.id} className="bg-white/70 p-4 rounded-xl shadow-md flex items-center gap-4 border-2 border-white">
                {type === 'skin' ? (
                     <div className="w-12 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: skinItem.color, border: `4px solid ${skinItem.peelColor}`}}></div>
                ) : (
                     <div className={`w-12 h-12 rounded-lg flex-shrink-0 border-2 border-white/50 ${bgItem.style}`}></div>
                )}
              <div className="flex-grow">
                <h3 className="font-bold text-xl text-slate-800">{item.name}</h3>
                {type === 'skin' && skinItem.goldMultiplier && skinItem.goldMultiplier > 1 && (
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                        <CoinIcon />
                        <span>골드 획득 +{((skinItem.goldMultiplier - 1) * 100).toLocaleString()}%</span>
                    </div>
                )}
                {type === 'background' && bgItem.timeBonus && bgItem.timeBonus > 0 && (
                    <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
                       <ClockIcon />
                        <span>시간 보너스 +{bgItem.timeBonus}초</span>
                    </div>
                )}
                {!isOwned ? (
                    item.price > 0 ? (
                        <div className="flex items-center gap-1 text-yellow-600">
                            <CoinIcon />
                            <span>{item.price}</span>
                        </div>
                    ) : (
                        <p className={`text-xs mt-1 font-bold ${isUnlocked ? 'text-green-600' : 'text-red-500'}`}>
                            {isUnlocked ? '획득 가능!' : unlockMessage}
                        </p>
                    )
                ) : null }
                {isOwned && item.price === 0 && item.unlock && <p className="text-xs mt-1 font-bold text-green-600">업적 달성!</p>}
              </div>
              <div className="w-28 text-center">
                {isOwned ? (
                  <button
                    onClick={() => type === 'skin' ? onSelect(item.id) : onSelectBackground(item.id)}
                    disabled={isSelected}
                    className={`w-full font-bold py-2 px-3 rounded-lg shadow-sm transition-all text-sm ${
                      isSelected
                        ? 'bg-orange-500 text-white cursor-default'
                        : 'bg-green-400 hover:bg-green-500 text-white'
                    }`}
                  >
                    {isSelected ? (type === 'skin' ? '선택됨' : '적용중') : (type === 'skin' ? '선택' : '적용')}
                  </button>
                ) : (
                  <button
                    onClick={() => type === 'skin' ? onPurchase(item.id) : onPurchaseBackground(item.id)}
                    disabled={purchaseDisabled}
                    className={`w-full font-bold py-2 px-3 rounded-lg shadow-sm transition-all text-sm ${
                      !purchaseDisabled
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                  >
                    {item.price > 0 ? '구매하기' : '미달성'}
                  </button>
                )}
              </div>
            </div>
        )
    }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="w-full flex items-center justify-center mb-4">
        <h2 className="text-3xl font-bold text-orange-500">상점</h2>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 space-y-3">
        {/* SKINS SECTION */}
        <h3 className="font-bold text-xl text-amber-800 mt-2 mb-2">귤 스킨</h3>
        {skins.map(skin => renderItem(skin, 'skin'))}

        {/* BACKGROUNDS SECTION */}
        <h3 className="font-bold text-xl text-amber-800 mt-6 mb-2">배경</h3>
        {backgrounds.map(bg => renderItem(bg, 'background'))}
      </div>
      
      <div className="w-full pt-4 mt-auto">
        <button
          onClick={() => setView('menu')}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-2xl"
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default Shop;