

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GameView, Skin, GalleryItem, RankingItem, Background } from './types';
import { getRankings } from './services/rankingService';
import { SKINS, INITIAL_CURRENCY, DOUBLE_PEEL_CHANCES, DOUBLE_PEEL_UPGRADE_COSTS, COUPONS, LIFT_PEN_COUNTS, LIFT_PEN_UPGRADE_COSTS, BACKGROUNDS, SPEED_MODE_DURATION_S, HIGH_RANK_MODE_DURATION_S, TRIPLE_PEEL_CHANCES, TRIPLE_PEEL_UPGRADE_COSTS, QUADRUPLE_PEEL_CHANCES, QUADRUPLE_PEEL_UPGRADE_COSTS, BURNING_TIME_UPGRADE_COSTS, BURNING_TIME_USES, AWAKENED_BURNING_TOUCHES, AWAKENED_BURNING_UPGRADE_COSTS, TRANSCENDENT_PEEL_CHANCE_BONUS, TRANSCENDENT_PEEL_UPGRADE_COSTS, GOD_TANGERINE_UPGRADE_COSTS, TEMPLE_BACKGROUND_UPGRADE_COSTS, QUINTUPLE_PEEL_CHANCE_PER_LEVEL, TEMPLE_TIME_BONUS_PER_LEVEL, INFINITE_UPGRADE_BASE_COST, INFINITE_UPGRADE_COST_MULTIPLIER, INFINITE_UPGRADE_MIN_SUCCESS_RATE, INFINITE_UPGRADE_BASE_SUCCESS_RATE, INFINITE_UPGRADE_SUCCESS_RATE_DECAY, INFINITE_UPGRADE_CHANCE_PER_LEVEL } from './constants';
import MainMenu from './components/MainMenu';
import CreativePeeling from './components/CreativePeeling';
import SpeedPeeling from './components/SpeedPeeling';
import Shop from './components/Shop';
import Gallery from './components/Gallery';
import Ranking from './components/Ranking';
import Settings from './components/Settings';
import CoinIcon from './components/icons/CoinIcon';
import Upgrades from './components/Upgrades';

// Helper to load state from localStorage safely
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;

    const parsed = JSON.parse(saved);
    if (key === 'tangerine-gallery' && Array.isArray(parsed)) {
      return parsed.map((item: any) => ({ ...item, createdAt: new Date(item.createdAt) })) as T;
    }
    return parsed;
  } catch (error) {
    console.error(`Failed to load '${key}' from storage:`, error);
    return defaultValue;
  }
};

export default function App() {
  const [view, setView] = useState<GameView>('menu');
  
  const [currency, setCurrency] = useState<number>(() => loadFromStorage('tangerine-currency', INITIAL_CURRENCY));
  const [skins] = useState<Skin[]>(SKINS);
  const [ownedSkins, setOwnedSkins] = useState<string[]>(() => loadFromStorage('tangerine-ownedSkins', ['default']));
  const [currentSkinId, setCurrentSkinId] = useState<string>(() => loadFromStorage('tangerine-currentSkinId', 'default'));
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => loadFromStorage('tangerine-gallery', []));
  
  // --- RANKING STATE REWORK ---
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [highRankerRankings, setHighRankerRankings] = useState<RankingItem[]>([]);
  const [userRankings, setUserRankings] = useState<RankingItem[]>(() => loadFromStorage('tangerine-userRankings', []));

  const [nickname, setNickname] = useState<string>(() => loadFromStorage('tangerine-nickname', '귤까기 장인'));
  const [doublePeelLevel, setDoublePeelLevel] = useState<number>(() => loadFromStorage('tangerine-doublePeelLevel', 0));
  const [triplePeelLevel, setTriplePeelLevel] = useState<number>(() => loadFromStorage('tangerine-triplePeelLevel', 0));
  const [quadruplePeelLevel, setQuadruplePeelLevel] = useState<number>(() => loadFromStorage('tangerine-quadruplePeelLevel', 0));
  const [burningTimeLevel, setBurningTimeLevel] = useState<number>(() => loadFromStorage('tangerine-burningTimeLevel', 0));
  const [awakenedBurningLevel, setAwakenedBurningLevel] = useState<number>(() => loadFromStorage('tangerine-awakenedBurningLevel', 0));
  const [transcendentPeelLevel, setTranscendentPeelLevel] = useState<number>(() => loadFromStorage('tangerine-transcendentPeelLevel', 0));
  const [liftPenLevel, setLiftPenLevel] = useState<number>(() => loadFromStorage('tangerine-liftPenLevel', 0));
  const [usedCoupons, setUsedCoupons] = useState<string[]>(() => loadFromStorage('tangerine-usedCoupons', []));
  const [backgrounds] = useState<Background[]>(BACKGROUNDS);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(() => loadFromStorage('tangerine-ownedBgs', ['default']));
  const [currentBackgroundId, setCurrentBackgroundId] = useState<string>(() => loadFromStorage('tangerine-currentBgId', 'default'));
  const [highRankerHighScore, setHighRankerHighScore] = useState<number>(() => loadFromStorage('tangerine-highRankerHighScore', 0));
  const [godTangerineLevel, setGodTangerineLevel] = useState<number>(() => loadFromStorage('tangerine-godTangerineLevel', 0));
  const [templeBackgroundLevel, setTempleBackgroundLevel] = useState<number>(() => loadFromStorage('tangerine-templeBackgroundLevel', 0));
  const [infiniteUpgradeLevel, setInfiniteUpgradeLevel] = useState<number>(() => loadFromStorage('tangerine-infiniteUpgradeLevel', 0));

  // Effect to save all relevant state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tangerine-currency', JSON.stringify(currency));
      localStorage.setItem('tangerine-ownedSkins', JSON.stringify(ownedSkins));
      localStorage.setItem('tangerine-currentSkinId', JSON.stringify(currentSkinId));
      localStorage.setItem('tangerine-gallery', JSON.stringify(galleryItems));
      localStorage.setItem('tangerine-userRankings', JSON.stringify(userRankings));
      localStorage.setItem('tangerine-nickname', JSON.stringify(nickname));
      localStorage.setItem('tangerine-doublePeelLevel', JSON.stringify(doublePeelLevel));
      localStorage.setItem('tangerine-triplePeelLevel', JSON.stringify(triplePeelLevel));
      localStorage.setItem('tangerine-quadruplePeelLevel', JSON.stringify(quadruplePeelLevel));
      localStorage.setItem('tangerine-burningTimeLevel', JSON.stringify(burningTimeLevel));
      localStorage.setItem('tangerine-awakenedBurningLevel', JSON.stringify(awakenedBurningLevel));
      localStorage.setItem('tangerine-transcendentPeelLevel', JSON.stringify(transcendentPeelLevel));
      localStorage.setItem('tangerine-liftPenLevel', JSON.stringify(liftPenLevel));
      localStorage.setItem('tangerine-usedCoupons', JSON.stringify(usedCoupons));
      localStorage.setItem('tangerine-ownedBgs', JSON.stringify(ownedBackgrounds));
      localStorage.setItem('tangerine-currentBgId', JSON.stringify(currentBackgroundId));
      localStorage.setItem('tangerine-highRankerHighScore', JSON.stringify(highRankerHighScore));
      localStorage.setItem('tangerine-godTangerineLevel', JSON.stringify(godTangerineLevel));
      localStorage.setItem('tangerine-templeBackgroundLevel', JSON.stringify(templeBackgroundLevel));
      localStorage.setItem('tangerine-infiniteUpgradeLevel', JSON.stringify(infiniteUpgradeLevel));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  }, [currency, ownedSkins, currentSkinId, galleryItems, userRankings, nickname, doublePeelLevel, triplePeelLevel, quadruplePeelLevel, burningTimeLevel, awakenedBurningLevel, transcendentPeelLevel, liftPenLevel, usedCoupons, ownedBackgrounds, currentBackgroundId, highRankerHighScore, godTangerineLevel, templeBackgroundLevel, infiniteUpgradeLevel]);

  // Effect to load and merge rankings
  useEffect(() => {
    const fetchAndMergeRankings = async () => {
      const [globalNormal, globalHighRanker] = await Promise.all([
        getRankings('speed'),
        getRankings('speed-high-rank'),
      ]);

      const userNormalRankings = userRankings.filter(r => r.gameMode === 'speed');
      const userHighRankerRankings = userRankings.filter(r => r.gameMode === 'speed-high-rank');

      const mergedNormal = [...globalNormal, ...userNormalRankings]
        .sort((a, b) => b.score - a.score)
        .slice(0, 50); 
      
      const mergedHighRanker = [...globalHighRanker, ...userHighRankerRankings]
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

      setRankings(mergedNormal);
      setHighRankerRankings(mergedHighRanker);
    };

    fetchAndMergeRankings();
  }, [userRankings]);

  // Effect to automatically unlock items based on high-ranker high score
  useEffect(() => {
    if (highRankerHighScore <= 0) return;

    const newlyUnlockedSkins: string[] = [];
    skins.forEach(skin => {
        if (skin.unlock?.mode === 'high-ranker' && highRankerHighScore >= skin.unlock.score && !ownedSkins.includes(skin.id)) {
            newlyUnlockedSkins.push(skin.id);
        }
    });

    const newlyUnlockedBgs: string[] = [];
    backgrounds.forEach(bg => {
        if (bg.unlock?.mode === 'high-ranker' && highRankerHighScore >= bg.unlock.score && !ownedBackgrounds.includes(bg.id)) {
            newlyUnlockedBgs.push(bg.id);
        }
    });

    if (newlyUnlockedSkins.length > 0) {
        setOwnedSkins(prev => [...prev, ...newlyUnlockedSkins]);
    }
    if (newlyUnlockedBgs.length > 0) {
        setOwnedBackgrounds(prev => [...prev, ...newlyUnlockedBgs]);
    }
  }, [highRankerHighScore, skins, backgrounds, ownedSkins, ownedBackgrounds]);


  const handlePurchase = useCallback((skinId: string) => {
    const skin = skins.find(s => s.id === skinId);
    if (skin && currency >= skin.price && !ownedSkins.includes(skinId)) {
      setCurrency(prev => prev - skin.price);
      setOwnedSkins(prev => [...prev, skinId]);
    }
  }, [currency, ownedSkins, skins]);

  const handleSelectSkin = useCallback((skinId: string) => {
    if (ownedSkins.includes(skinId)) {
      setCurrentSkinId(skinId);
    }
  }, [ownedSkins]);
  
  const handlePurchaseBackground = useCallback((bgId: string) => {
      const bg = backgrounds.find(b => b.id === bgId);
      if (bg && currency >= bg.price && !ownedBackgrounds.includes(bgId)) {
          setCurrency(prev => prev - bg.price);
          setOwnedBackgrounds(prev => [...prev, bgId]);
      }
  }, [currency, ownedBackgrounds, backgrounds]);

  const handleSelectBackground = useCallback((bgId: string) => {
      if (ownedBackgrounds.includes(bgId)) {
          setCurrentBackgroundId(bgId);
      }
  }, [ownedBackgrounds]);

  const addCurrency = useCallback((amount: number) => {
    setCurrency(prev => prev + amount);
  }, []);

  const addToGallery = useCallback((item: GalleryItem) => {
    setGalleryItems(prev => [item, ...prev]);
    setView('gallery');
  }, []);

  const addRanking = useCallback((name: string, score: number, gameMode: 'speed' | 'speed-high-rank') => {
    const newEntry: RankingItem = { id: new Date().toISOString(), name, score, gameMode };
    
    if (gameMode === 'speed-high-rank' && score > highRankerHighScore) {
      setHighRankerHighScore(score);
    }

    setUserRankings(prev => [...prev, newEntry]);
    
    setView('ranking');
  }, [highRankerHighScore]);

  const handleSetNickname = useCallback((name: string) => {
    setNickname(name);
  }, []);

  const handleUpgradeDoublePeel = useCallback(() => {
    const currentCost = DOUBLE_PEEL_UPGRADE_COSTS[doublePeelLevel];
    if (doublePeelLevel < DOUBLE_PEEL_UPGRADE_COSTS.length && currency >= currentCost) {
      setCurrency(prev => prev - currentCost);
      setDoublePeelLevel(prev => prev + 1);
    }
  }, [currency, doublePeelLevel]);
  
  const handleUpgradeTriplePeel = useCallback(() => {
      const currentCost = TRIPLE_PEEL_UPGRADE_COSTS[triplePeelLevel];
      if (triplePeelLevel < TRIPLE_PEEL_UPGRADE_COSTS.length && currency >= currentCost) {
          setCurrency(prev => prev - currentCost);
          setTriplePeelLevel(prev => prev + 1);
      }
  }, [currency, triplePeelLevel]);

  const handleUpgradeQuadruplePeel = useCallback(() => {
      const currentCost = QUADRUPLE_PEEL_UPGRADE_COSTS[quadruplePeelLevel];
      if (quadruplePeelLevel < QUADRUPLE_PEEL_UPGRADE_COSTS.length && currency >= currentCost) {
          setCurrency(prev => prev - currentCost);
          setQuadruplePeelLevel(prev => prev + 1);
      }
  }, [currency, quadruplePeelLevel]);

  const handleUpgradeBurningTime = useCallback(() => {
    const currentCost = BURNING_TIME_UPGRADE_COSTS[burningTimeLevel];
    if (burningTimeLevel < BURNING_TIME_UPGRADE_COSTS.length && currency >= currentCost) {
      setCurrency(prev => prev - currentCost);
      setBurningTimeLevel(prev => prev + 1);
    }
  }, [currency, burningTimeLevel]);
  
  const handleUpgradeAwakenedBurning = useCallback(() => {
    const currentCost = AWAKENED_BURNING_UPGRADE_COSTS[awakenedBurningLevel];
    if (awakenedBurningLevel < AWAKENED_BURNING_UPGRADE_COSTS.length && currency >= currentCost) {
      setCurrency(prev => prev - currentCost);
      setAwakenedBurningLevel(prev => prev + 1);
    }
  }, [currency, awakenedBurningLevel]);

  const handleUpgradeTranscendentPeel = useCallback(() => {
    const currentCost = TRANSCENDENT_PEEL_UPGRADE_COSTS[transcendentPeelLevel];
    if (transcendentPeelLevel < TRANSCENDENT_PEEL_UPGRADE_COSTS.length && currency >= currentCost) {
      setCurrency(prev => prev - currentCost);
      setTranscendentPeelLevel(prev => prev + 1);
    }
  }, [currency, transcendentPeelLevel]);

  const handleUpgradeInfinitePeel = useCallback(() => {
    const cost = Math.floor(INFINITE_UPGRADE_BASE_COST * Math.pow(INFINITE_UPGRADE_COST_MULTIPLIER, infiniteUpgradeLevel));
    if (currency < cost) {
        alert("코인이 부족합니다!");
        return;
    }

    setCurrency(prev => prev - cost);

    const successRate = Math.max(
        INFINITE_UPGRADE_MIN_SUCCESS_RATE,
        INFINITE_UPGRADE_BASE_SUCCESS_RATE - (infiniteUpgradeLevel * INFINITE_UPGRADE_SUCCESS_RATE_DECAY)
    );

    if (Math.random() < successRate) {
        setInfiniteUpgradeLevel(prev => prev + 1);
        alert(`강화 성공! (현재 레벨: ${infiniteUpgradeLevel + 1})`);
    } else {
        alert(`강화 실패... (성공 확률: ${(successRate * 100).toFixed(1)}%)`);
    }
  }, [currency, infiniteUpgradeLevel]);

  const handleUpgradeLiftPen = useCallback(() => {
    const currentCost = LIFT_PEN_UPGRADE_COSTS[liftPenLevel];
    if (liftPenLevel < LIFT_PEN_UPGRADE_COSTS.length && currency >= currentCost) {
      setCurrency(prev => prev - currentCost);
      setLiftPenLevel(prev => prev + 1);
    }
  }, [currency, liftPenLevel]);
  
  const handleUpgradeGodTangerine = useCallback(() => {
    const currentCost = GOD_TANGERINE_UPGRADE_COSTS[godTangerineLevel];
    if (godTangerineLevel < GOD_TANGERINE_UPGRADE_COSTS.length && currency >= currentCost) {
      setCurrency(prev => prev - currentCost);
      setGodTangerineLevel(prev => prev + 1);
    }
  }, [currency, godTangerineLevel]);
  
  const handleUpgradeTempleBackground = useCallback(() => {
    const currentCost = TEMPLE_BACKGROUND_UPGRADE_COSTS[templeBackgroundLevel];
    if (templeBackgroundLevel < TEMPLE_BACKGROUND_UPGRADE_COSTS.length && currency >= currentCost) {
      setCurrency(prev => prev - currentCost);
      setTempleBackgroundLevel(prev => prev + 1);
    }
  }, [currency, templeBackgroundLevel]);

  const handleCouponSubmit = useCallback((code: string): string => {
    const couponKey = code.toUpperCase();

    if (usedCoupons.includes(couponKey)) {
        return "이미 사용한 쿠폰입니다.";
    }

    const coupon = COUPONS[couponKey];
    if (!coupon) {
        return "유효하지 않은 쿠폰입니다.";
    }

    if (coupon.type === 'currency') {
        addCurrency(coupon.value as number);
        setUsedCoupons(prev => [...prev, couponKey]);
        return `성공! ${coupon.value} 코인을 받았습니다!`;
    }

    if (coupon.type === 'skin') {
        const skinId = coupon.value as string;
        if (!ownedSkins.includes(skinId)) {
            setOwnedSkins(prev => [...prev, skinId]);
            setUsedCoupons(prev => [...prev, couponKey]);
            const skin = skins.find(s => s.id === skinId);
            return `성공! "${skin?.name}" 스킨을 받았습니다!`;
        } else {
            return "이미 보유하고 있는 스킨입니다.";
        }
    }
    return "알 수 없는 쿠폰 타입입니다.";
  }, [addCurrency, ownedSkins, skins, usedCoupons]);
  
  const handleGameReset = useCallback(() => {
    if (window.confirm("정말로 모든 진행 상황을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('tangerine-')) {
                localStorage.removeItem(key);
            }
        });
        window.location.reload();
    }
  }, []);
  
  const userHighScore = useMemo(() => {
    const userNormalRankings = userRankings.filter(r => r.gameMode === 'speed' && r.name === nickname);
    if (userNormalRankings.length === 0) return 0;
    return Math.max(...userNormalRankings.map(r => r.score));
  }, [userRankings, nickname]);

  const activeBackground = useMemo(() => {
    let bgId = currentBackgroundId;
    if (view === 'speed-high-rank') {
      if (highRankerHighScore >= 30 && ownedBackgrounds.includes('temple')) bgId = 'temple';
      else if (highRankerHighScore >= 20 && ownedBackgrounds.includes('shining-moon')) bgId = 'shining-moon';
      else if (highRankerHighScore >= 15 && ownedBackgrounds.includes('castle')) bgId = 'castle';
    }
    return backgrounds.find(b => b.id === bgId) ?? backgrounds[0];
  }, [backgrounds, currentBackgroundId, view, highRankerHighScore, ownedBackgrounds]);

  const renderView = () => {
    const currentSkin = skins.find(s => s.id === currentSkinId) ?? skins[0];
    const transcendentBonus = TRANSCENDENT_PEEL_CHANCE_BONUS[transcendentPeelLevel] ?? 0;
    const effectiveDoublePeelChance = Math.min(DOUBLE_PEEL_CHANCES[doublePeelLevel] + transcendentBonus, 1);
    const effectiveTriplePeelChance = Math.min(TRIPLE_PEEL_CHANCES[triplePeelLevel] + transcendentBonus, 1);
    const effectiveQuadruplePeelChance = Math.min(QUADRUPLE_PEEL_CHANCES[quadruplePeelLevel] + transcendentBonus, 1);
    const quintuplePeelChance = QUINTUPLE_PEEL_CHANCE_PER_LEVEL[godTangerineLevel] ?? 0;
    const instaPeelChance = infiniteUpgradeLevel * INFINITE_UPGRADE_CHANCE_PER_LEVEL;

    const baseTimeBonus = activeBackground.timeBonus || 0;
    const templeExtraBonus = activeBackground.id === 'temple' ? (TEMPLE_TIME_BONUS_PER_LEVEL[templeBackgroundLevel] ?? 0) : 0;
    const timeBonus = baseTimeBonus + templeExtraBonus;
    
    const speedDuration = SPEED_MODE_DURATION_S + timeBonus;
    const highRankDuration = HIGH_RANK_MODE_DURATION_S + timeBonus;

    switch (view) {
      case 'creative':
        return <CreativePeeling 
                  setView={setView} 
                  addCurrency={addCurrency} 
                  addToGallery={addToGallery}
                  currentSkin={currentSkin}
                  liftPenCount={LIFT_PEN_COUNTS[liftPenLevel]}
                />;
      case 'speed':
        return <SpeedPeeling 
                  setView={setView} 
                  addCurrency={addCurrency}
                  addRanking={addRanking}
                  currentSkin={currentSkin}
                  nickname={nickname}
                  doublePeelChance={effectiveDoublePeelChance}
                  triplePeelChance={effectiveTriplePeelChance}
                  quadruplePeelChance={effectiveQuadruplePeelChance}
                  quintuplePeelChance={quintuplePeelChance}
                  burningTimeUses={BURNING_TIME_USES[burningTimeLevel]}
                  awakenedBurningTouches={AWAKENED_BURNING_TOUCHES[awakenedBurningLevel]}
                  duration={speedDuration}
                  gameMode="speed"
                  instaPeelChance={instaPeelChance}
                />;
      case 'speed-high-rank':
        return <SpeedPeeling 
                  setView={setView} 
                  addCurrency={addCurrency}
                  addRanking={addRanking}
                  currentSkin={currentSkin}
                  nickname={nickname}
                  doublePeelChance={effectiveDoublePeelChance}
                  triplePeelChance={effectiveTriplePeelChance}
                  quadruplePeelChance={effectiveQuadruplePeelChance}
                  quintuplePeelChance={quintuplePeelChance}
                  burningTimeUses={BURNING_TIME_USES[burningTimeLevel]}
                  awakenedBurningTouches={AWAKENED_BURNING_TOUCHES[awakenedBurningLevel]}
                  duration={highRankDuration}
                  gameMode="speed-high-rank"
                  instaPeelChance={instaPeelChance}
                />;
      case 'shop':
        return <Shop 
                  setView={setView} 
                  skins={skins}
                  ownedSkins={ownedSkins}
                  currentSkinId={currentSkinId}
                  currency={currency}
                  onPurchase={handlePurchase}
                  onSelect={handleSelectSkin}
                  userHighScore={userHighScore}
                  highRankerHighScore={highRankerHighScore}
                  backgrounds={backgrounds}
                  ownedBackgrounds={ownedBackgrounds}
                  currentBackgroundId={currentBackgroundId}
                  onPurchaseBackground={handlePurchaseBackground}
                  onSelectBackground={handleSelectBackground}
                  doublePeelLevel={doublePeelLevel}
                  triplePeelLevel={triplePeelLevel}
                  liftPenLevel={liftPenLevel}
                  transcendentPeelLevel={transcendentPeelLevel}
                />;
      case 'upgrades':
        return <Upgrades
                  setView={setView}
                  currency={currency}
                  doublePeelLevel={doublePeelLevel}
                  onUpgradeDoublePeel={handleUpgradeDoublePeel}
                  triplePeelLevel={triplePeelLevel}
                  onUpgradeTriplePeel={handleUpgradeTriplePeel}
                  quadruplePeelLevel={quadruplePeelLevel}
                  onUpgradeQuadruplePeel={handleUpgradeQuadruplePeel}
                  burningTimeLevel={burningTimeLevel}
                  onUpgradeBurningTime={handleUpgradeBurningTime}
                  awakenedBurningLevel={awakenedBurningLevel}
                  onUpgradeAwakenedBurning={handleUpgradeAwakenedBurning}
                  transcendentPeelLevel={transcendentPeelLevel}
                  onUpgradeTranscendentPeel={handleUpgradeTranscendentPeel}
                  liftPenLevel={liftPenLevel}
                  onUpgradeLiftPen={handleUpgradeLiftPen}
                  godTangerineLevel={godTangerineLevel}
                  onUpgradeGodTangerine={handleUpgradeGodTangerine}
                  templeBackgroundLevel={templeBackgroundLevel}
                  onUpgradeTempleBackground={handleUpgradeTempleBackground}
                  ownedSkins={ownedSkins}
                  ownedBackgrounds={ownedBackgrounds}
                  infiniteUpgradeLevel={infiniteUpgradeLevel}
                  onUpgradeInfinitePeel={handleUpgradeInfinitePeel}
                />;
      case 'gallery':
        return <Gallery setView={setView} items={galleryItems} />;
      case 'ranking':
        return <Ranking 
                  setView={setView} 
                  rankings={rankings} 
                  highRankerRankings={highRankerRankings} 
                />;
      case 'settings':
        return <Settings 
                 setView={setView} 
                 currentNickname={nickname}
                 onSaveNickname={handleSetNickname}
                 onCouponSubmit={handleCouponSubmit}
                 onGameReset={handleGameReset}
               />;
      case 'menu':
      default:
        return <MainMenu setView={setView} userHighScore={userHighScore} />;
    }
  };

  const showHeader = !['creative', 'speed', 'speed-high-rank'].includes(view);

  return (
    <div className={`min-h-screen text-slate-800 flex flex-col items-center justify-center p-4 transition-all duration-500 ${activeBackground.style}`}>
      <div className="w-full max-w-md mx-auto bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative border-4 border-white">
        {showHeader && (
            <header className="absolute top-4 right-4 bg-orange-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border-2 border-white z-20">
              <CoinIcon />
              <span className="font-bold text-lg">{currency.toLocaleString()}</span>
            </header>
        )}
        <main className="p-4 sm:p-6">{renderView()}</main>
      </div>
       <footer className="text-center mt-4 text-orange-400 drop-shadow-md">
        <p>귤 까기 게임 &copy; 2024</p>
      </footer>
    </div>
  );
}