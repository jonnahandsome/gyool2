

import React from 'react';
import { GameView } from '../types';
import { 
    DOUBLE_PEEL_CHANCES, DOUBLE_PEEL_UPGRADE_COSTS, 
    LIFT_PEN_COUNTS, LIFT_PEN_UPGRADE_COSTS, 
    TRIPLE_PEEL_CHANCES, TRIPLE_PEEL_UPGRADE_COSTS,
    QUADRUPLE_PEEL_CHANCES, QUADRUPLE_PEEL_UPGRADE_COSTS,
    BURNING_TIME_USES, BURNING_TIME_UPGRADE_COSTS,
    AWAKENED_BURNING_TOUCHES, AWAKENED_BURNING_UPGRADE_COSTS,
    TRANSCENDENT_PEEL_CHANCE_BONUS, TRANSCENDENT_PEEL_UPGRADE_COSTS,
    GOD_TANGERINE_UPGRADE_COSTS, QUINTUPLE_PEEL_CHANCE_PER_LEVEL,
    TEMPLE_BACKGROUND_UPGRADE_COSTS, TEMPLE_TIME_BONUS_PER_LEVEL,
    INFINITE_UPGRADE_BASE_COST, INFINITE_UPGRADE_COST_MULTIPLIER,
    INFINITE_UPGRADE_MIN_SUCCESS_RATE, INFINITE_UPGRADE_BASE_SUCCESS_RATE,
    INFINITE_UPGRADE_SUCCESS_RATE_DECAY, INFINITE_UPGRADE_CHANCE_PER_LEVEL
} from '../constants';
import CoinIcon from './icons/CoinIcon';

interface UpgradesProps {
  setView: (view: GameView) => void;
  currency: number;
  doublePeelLevel: number;
  onUpgradeDoublePeel: () => void;
  triplePeelLevel: number;
  onUpgradeTriplePeel: () => void;
  quadruplePeelLevel: number;
  onUpgradeQuadruplePeel: () => void;
  burningTimeLevel: number;
  onUpgradeBurningTime: () => void;
  awakenedBurningLevel: number;
  onUpgradeAwakenedBurning: () => void;
  transcendentPeelLevel: number;
  onUpgradeTranscendentPeel: () => void;
  infiniteUpgradeLevel: number;
  onUpgradeInfinitePeel: () => void;
  liftPenLevel: number;
  onUpgradeLiftPen: () => void;
  godTangerineLevel: number;
  onUpgradeGodTangerine: () => void;
  templeBackgroundLevel: number;
  onUpgradeTempleBackground: () => void;
  ownedSkins: string[];
  ownedBackgrounds: string[];
}

const UpgradeItem: React.FC<{
    title: string;
    description: string;
    level: number;
    maxLevel: number;
    currentEffect: string;
    cost?: number;
    canAfford: boolean;
    onUpgrade: () => void;
    effectColorClass?: string;
}> = ({ title, description, level, maxLevel, currentEffect, cost, canAfford, onUpgrade, effectColorClass = 'text-blue-600' }) => {
    const isMaxLevel = level >= maxLevel;
    return (
        <div className="bg-white/70 p-4 rounded-xl shadow-md border-2 border-white">
            <h3 className="font-bold text-xl text-amber-800 mb-2">{title}</h3>
            <p className="text-slate-600 mb-3 h-12">{description}</p>
            <div className="flex items-center gap-4">
                <div className="flex-grow">
                    <p className="text-slate-700 font-bold">현재: 레벨 {level} / <span className={effectColorClass}>{currentEffect}</span></p>
                    {!isMaxLevel && cost !== undefined && (
                        <div className="flex items-center gap-1 text-yellow-600 font-bold mt-1">
                            <CoinIcon />
                            <span>비용: {cost.toLocaleString()}</span>
                        </div>
                    )}
                </div>
                <div className="w-28 text-center">
                    {isMaxLevel ? (
                        <span className="font-bold text-green-600">최고 레벨</span>
                    ) : (
                        <button
                            onClick={onUpgrade}
                            disabled={!canAfford}
                            className={`w-full font-bold py-2 px-3 rounded-lg shadow-sm transition-all text-sm ${
                                canAfford
                                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                    : 'bg-gray-400 text-white cursor-not-allowed'
                            }`}
                        >
                            업그레이드
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const Upgrades: React.FC<UpgradesProps> = ({ 
    setView, currency,
    doublePeelLevel, onUpgradeDoublePeel,
    triplePeelLevel, onUpgradeTriplePeel,
    quadruplePeelLevel, onUpgradeQuadruplePeel,
    burningTimeLevel, onUpgradeBurningTime,
    awakenedBurningLevel, onUpgradeAwakenedBurning,
    transcendentPeelLevel, onUpgradeTranscendentPeel,
    infiniteUpgradeLevel, onUpgradeInfinitePeel,
    liftPenLevel, onUpgradeLiftPen,
    godTangerineLevel, onUpgradeGodTangerine,
    templeBackgroundLevel, onUpgradeTempleBackground,
    ownedSkins, ownedBackgrounds
}) => {
  
  const renderInfiniteUpgrade = () => {
    const cost = Math.floor(INFINITE_UPGRADE_BASE_COST * Math.pow(INFINITE_UPGRADE_COST_MULTIPLIER, infiniteUpgradeLevel));
    const successRate = Math.max(
        INFINITE_UPGRADE_MIN_SUCCESS_RATE,
        INFINITE_UPGRADE_BASE_SUCCESS_RATE - (infiniteUpgradeLevel * INFINITE_UPGRADE_SUCCESS_RATE_DECAY)
    );
    const canAfford = currency >= cost;

    return (
      <div className="bg-gradient-to-tr from-purple-800 via-indigo-900 to-black text-white p-4 rounded-xl shadow-md border-2 border-purple-400">
        <h3 className="font-bold text-xl text-cyan-300 mb-2">초월의 경지 (무한 강화)</h3>
        <p className="text-slate-300 mb-3 h-12">실패 확률이 존재합니다. 성공 시, 한 번에 귤 하나를 통째로 깔 확률이 영구적으로 증가합니다.</p>
        <div className="flex items-center gap-4">
            <div className="flex-grow">
                <p className="text-slate-200 font-bold">
                    현재 효과: <span className="text-cyan-400">한번에 까기 확률 +{(infiniteUpgradeLevel * INFINITE_UPGRADE_CHANCE_PER_LEVEL * 100).toFixed(3)}%</span>
                </p>
                <div className="flex items-center gap-1 text-yellow-400 font-bold mt-1">
                    <CoinIcon />
                    <span>비용: {cost.toLocaleString()}</span>
                </div>
                 <p className="text-sm text-red-400 font-bold">성공 확률: {(successRate * 100).toFixed(1)}%</p>
            </div>
            <div className="w-28 text-center">
                 <button
                    onClick={onUpgradeInfinitePeel}
                    disabled={!canAfford}
                    className={`w-full font-bold py-2 px-3 rounded-lg shadow-sm transition-all text-sm ${
                      canAfford
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    도전
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="w-full flex items-center justify-center mb-4">
        <h2 className="text-3xl font-bold text-orange-500">업그레이드</h2>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 space-y-4 p-2">
        {ownedSkins.includes('god-tangerine') && (
             <UpgradeItem
                title="[스킨] 신의 귤 강화"
                description="최대 레벨 달성 시 7% 확률로 5개의 껍질을 동시에 까는 '퀸튜플 필' 능력이 해금됩니다."
                level={godTangerineLevel}
                maxLevel={GOD_TANGERINE_UPGRADE_COSTS.length}
                currentEffect={`퀸튜플 필 ${(QUINTUPLE_PEEL_CHANCE_PER_LEVEL[godTangerineLevel] * 100).toFixed(1)}%`}
                cost={GOD_TANGERINE_UPGRADE_COSTS[godTangerineLevel]}
                canAfford={currency >= (GOD_TANGERINE_UPGRADE_COSTS[godTangerineLevel] ?? Infinity)}
                onUpgrade={onUpgradeGodTangerine}
                effectColorClass="text-yellow-400"
            />
        )}
        {ownedBackgrounds.includes('temple') && (
            <UpgradeItem
                title="[배경] 신전 강화"
                description="최대 레벨 달성 시 '빨리 까기' 모드의 시간 보너스가 11초까지 증가합니다."
                level={templeBackgroundLevel}
                maxLevel={TEMPLE_BACKGROUND_UPGRADE_COSTS.length}
                currentEffect={`시간 보너스 +${(6 + (TEMPLE_TIME_BONUS_PER_LEVEL[templeBackgroundLevel] ?? 0)).toFixed(1)}초`}
                cost={TEMPLE_BACKGROUND_UPGRADE_COSTS[templeBackgroundLevel]}
                canAfford={currency >= (TEMPLE_BACKGROUND_UPGRADE_COSTS[templeBackgroundLevel] ?? Infinity)}
                onUpgrade={onUpgradeTempleBackground}
                effectColorClass="text-blue-500"
            />
        )}
        <UpgradeItem
            title="더블 필 확률"
            description="'빨리 까기'에서 한 번에 2개의 껍질을 깔 확률을 높입니다."
            level={doublePeelLevel}
            maxLevel={DOUBLE_PEEL_UPGRADE_COSTS.length}
            currentEffect={`${(DOUBLE_PEEL_CHANCES[doublePeelLevel] * 100).toFixed(0)}%`}
            cost={DOUBLE_PEEL_UPGRADE_COSTS[doublePeelLevel]}
            canAfford={currency >= DOUBLE_PEEL_UPGRADE_COSTS[doublePeelLevel]}
            onUpgrade={onUpgradeDoublePeel}
        />
        
        {doublePeelLevel > 0 && (
            <UpgradeItem
                title="트리플 필 확률"
                description="'빨리 까기'에서 한 번에 3개의 껍질을 깔 확률을 높입니다."
                level={triplePeelLevel}
                maxLevel={TRIPLE_PEEL_UPGRADE_COSTS.length}
                currentEffect={`${(TRIPLE_PEEL_CHANCES[triplePeelLevel] * 100).toFixed(0)}%`}
                cost={TRIPLE_PEEL_UPGRADE_COSTS[triplePeelLevel]}
                canAfford={currency >= TRIPLE_PEEL_UPGRADE_COSTS[triplePeelLevel]}
                onUpgrade={onUpgradeTriplePeel}
                effectColorClass="text-purple-600"
            />
        )}
        
        {triplePeelLevel > 0 && (
             <UpgradeItem
                title="쿼드러플 필 확률"
                description="'빨리 까기'에서 한 번에 4개의 껍질을 깔 확률을 높입니다."
                level={quadruplePeelLevel}
                maxLevel={QUADRUPLE_PEEL_UPGRADE_COSTS.length}
                currentEffect={`${(QUADRUPLE_PEEL_CHANCES[quadruplePeelLevel] * 100).toFixed(0)}%`}
                cost={QUADRUPLE_PEEL_UPGRADE_COSTS[quadruplePeelLevel]}
                canAfford={currency >= QUADRUPLE_PEEL_UPGRADE_COSTS[quadruplePeelLevel]}
                onUpgrade={onUpgradeQuadruplePeel}
                effectColorClass="text-red-600"
            />
        )}

        {quadruplePeelLevel > 0 && (
             <UpgradeItem
                title="버닝 타임"
                description="귤 3개를 깔 때마다 버닝 타임이 발동됩니다. 거대한 귤을 두 번 터치해서 빠르게 깔 수 있습니다."
                level={burningTimeLevel}
                maxLevel={BURNING_TIME_UPGRADE_COSTS.length}
                currentEffect={`게임당 ${BURNING_TIME_USES[burningTimeLevel]}회`}
                cost={BURNING_TIME_UPGRADE_COSTS[burningTimeLevel]}
                canAfford={currency >= BURNING_TIME_UPGRADE_COSTS[burningTimeLevel]}
                onUpgrade={onUpgradeBurningTime}
                effectColorClass="text-orange-600"
            />
        )}
        
        {burningTimeLevel > 0 && (
           <UpgradeItem
              title="각성 버닝 모드"
              description="버닝 타임 3회 발동 후 활성화됩니다. 터치 한 번으로 귤 하나를 통째로 깔 수 있습니다."
              level={awakenedBurningLevel}
              maxLevel={AWAKENED_BURNING_UPGRADE_COSTS.length}
              currentEffect={`터치 ${AWAKENED_BURNING_TOUCHES[awakenedBurningLevel]}회`}
              cost={AWAKENED_BURNING_UPGRADE_COSTS[awakenedBurningLevel]}
              canAfford={currency >= AWAKENED_BURNING_UPGRADE_COSTS[awakenedBurningLevel]}
              onUpgrade={onUpgradeAwakenedBurning}
              effectColorClass="text-yellow-500"
          />
        )}

        {awakenedBurningLevel > 0 && (
             <UpgradeItem
                title="초월 귤까기"
                description="더블, 트리플, 쿼드러플 필 확률을 영구적으로 증가시킵니다."
                level={transcendentPeelLevel}
                maxLevel={TRANSCENDENT_PEEL_UPGRADE_COSTS.length}
                currentEffect={`모든 확률 +${(TRANSCENDENT_PEEL_CHANCE_BONUS[transcendentPeelLevel] * 100).toFixed(0)}%`}
                cost={TRANSCENDENT_PEEL_UPGRADE_COSTS[transcendentPeelLevel]}
                canAfford={currency >= TRANSCENDENT_PEEL_UPGRADE_COSTS[transcendentPeelLevel]}
                onUpgrade={onUpgradeTranscendentPeel}
                effectColorClass="text-cyan-500"
            />
        )}
        
        {transcendentPeelLevel > 0 && renderInfiniteUpgrade()}


        <UpgradeItem
            title="선 긋기 횟수"
            description="'개성있게 까기'에서 껍질을 그릴 수 있는 횟수를 늘립니다."
            level={liftPenLevel}
            maxLevel={LIFT_PEN_UPGRADE_COSTS.length}
            currentEffect={`${LIFT_PEN_COUNTS[liftPenLevel]}회`}
            cost={LIFT_PEN_UPGRADE_COSTS[liftPenLevel]}
            canAfford={currency >= LIFT_PEN_UPGRADE_COSTS[liftPenLevel]}
            onUpgrade={onUpgradeLiftPen}
        />
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

export default Upgrades;