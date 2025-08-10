

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameView, Skin } from '../types';
import { TANGERINE_SEGMENTS, REWARD_PER_TANGERINE } from '../constants';
import Tangerine from './Tangerine';
import BackIcon from './icons/BackIcon';
import FireIcon from './icons/FireIcon';

type GameModeState = 'normal' | 'burning' | 'awakened';

interface SpeedPeelingProps {
  setView: (view: GameView) => void;
  addCurrency: (amount: number) => void;
  addRanking: (name: string, score: number, gameMode: 'speed' | 'speed-high-rank') => void;
  currentSkin: Skin;
  nickname: string;
  doublePeelChance: number;
  triplePeelChance: number;
  quadruplePeelChance: number;
  quintuplePeelChance: number;
  burningTimeUses: number;
  awakenedBurningTouches: number;
  duration: number;
  gameMode: 'speed' | 'speed-high-rank';
  instaPeelChance: number;
}

const SpeedPeeling: React.FC<SpeedPeelingProps> = ({ 
    setView, addCurrency, addRanking, currentSkin, nickname, 
    doublePeelChance, triplePeelChance, quadruplePeelChance, quintuplePeelChance,
    burningTimeUses, awakenedBurningTouches, duration, gameMode,
    instaPeelChance
}) => {
  const [timer, setTimer] = useState(duration);
  const [score, setScore] = useState(0);
  const [earnedCurrency, setEarnedCurrency] = useState(0);
  const [segments, setSegments] = useState<boolean[]>(new Array(TANGERINE_SEGMENTS).fill(false));
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(true);
  const [playerName, setPlayerName] = useState(nickname);

  // Mode & State Management
  const [mode, setMode] = useState<GameModeState>('normal');
  const [tangerinesCompleted, setTangerinesCompleted] = useState(0);
  const [burningTimeTriggers, setBurningTimeTriggers] = useState(0);
  const [burningTimeUsesLeft, setBurningTimeUsesLeft] = useState(burningTimeUses);
  const [burningTouchStep, setBurningTouchStep] = useState(0);
  const [awakenedTouchesLeft, setAwakenedTouchesLeft] = useState(0);
  
  const startNewNormalTangerine = useCallback(() => {
    const freshSegments = new Array(TANGERINE_SEGMENTS).fill(false);
    const available = freshSegments.map((isPeeled, i) => isPeeled ? -1 : i).filter(i => i !== -1);
    const randomIndex = Math.floor(Math.random() * available.length);
    setActiveSegment(available[randomIndex]);
    setSegments(freshSegments);
  }, []);

  useEffect(() => {
    startNewNormalTangerine();
  }, [startNewNormalTangerine]);
  
  useEffect(() => {
    if (!isGameActive) return;
    const intervalId = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isGameActive]);

  const peelExtraSegments = (targetSegments: boolean[], count: number) => {
    let available = targetSegments.map((isPeeled, idx) => (isPeeled ? -1 : idx)).filter(idx => idx !== -1);
    for (let i = 0; i < count; i++) {
        if (available.length > 0) {
            const extraSegmentIndex = Math.floor(Math.random() * available.length);
            const extraSegmentToPeel = available[extraSegmentIndex];
            targetSegments[extraSegmentToPeel] = true;
            available = available.filter(idx => idx !== extraSegmentToPeel);
        }
    }
  };
  
  const finishCurrentTangerine = useCallback(() => {
    const newScore = score + 1;
    setScore(newScore);
    const multiplier = currentSkin.goldMultiplier || 1;
    const reward = REWARD_PER_TANGERINE * multiplier;
    addCurrency(reward);
    setEarnedCurrency(prev => prev + reward);

    const newCompletionCount = tangerinesCompleted + 1;
    setTangerinesCompleted(newCompletionCount);

    if (burningTimeUsesLeft > 0 && newCompletionCount % 3 === 0) {
      if (burningTimeTriggers >= 2 && awakenedBurningTouches > 0) {
        setMode('awakened');
        setAwakenedTouchesLeft(awakenedBurningTouches);
        setBurningTimeTriggers(0);
      } else {
        setMode('burning');
        setBurningTouchStep(0);
        setBurningTimeTriggers(prev => prev + 1);
      }
      setBurningTimeUsesLeft(prev => prev - 1);
    } else {
      setMode('normal');
      startNewNormalTangerine();
    }
  }, [score, addCurrency, currentSkin.goldMultiplier, tangerinesCompleted, burningTimeUsesLeft, burningTimeTriggers, awakenedBurningTouches, startNewNormalTangerine]);


  const handleSegmentClick = useCallback((index: number) => {
    if (!isGameActive || mode !== 'normal' || segments[index] || index !== activeSegment) return;

    if (instaPeelChance > 0 && Math.random() < instaPeelChance) {
        finishCurrentTangerine();
        return;
    }

    let newSegments = [...segments];
    newSegments[index] = true;

    const rand = Math.random();
    if (rand < quintuplePeelChance) peelExtraSegments(newSegments, 4);
    else if (rand < quadruplePeelChance) peelExtraSegments(newSegments, 3);
    else if (rand < triplePeelChance) peelExtraSegments(newSegments, 2);
    else if (rand < doublePeelChance) peelExtraSegments(newSegments, 1);
    
    const remainingSegments = newSegments.filter(s => !s).length;
    if (remainingSegments === 0) {
      setTimeout(() => finishCurrentTangerine(), 100);
    } else {
      setSegments(newSegments);
      const available = newSegments.map((isPeeled, i) => isPeeled ? -1 : i).filter(i => i !== -1);
      if (available.length > 0) {
        const randomIndex = Math.floor(Math.random() * available.length);
        setActiveSegment(available[randomIndex]);
      } else {
        setActiveSegment(null);
      }
    }
  }, [isGameActive, mode, segments, activeSegment, instaPeelChance, quintuplePeelChance, quadruplePeelChance, triplePeelChance, doublePeelChance, finishCurrentTangerine]);
  
  const handleBurningTangerineClick = useCallback(() => {
    if (!isGameActive || mode !== 'burning') return;
    if (burningTouchStep === 0) {
        setBurningTouchStep(1);
    } else {
        setTimeout(() => finishCurrentTangerine(), 150);
    }
  }, [isGameActive, mode, burningTouchStep, finishCurrentTangerine]);

  const handleAwakenedTangerineClick = useCallback(() => {
    if (!isGameActive || mode !== 'awakened' || awakenedTouchesLeft <= 0) return;

    setScore(prev => prev + 1);
    const multiplier = currentSkin.goldMultiplier || 1;
    const reward = REWARD_PER_TANGERINE * multiplier;
    addCurrency(reward);
    setEarnedCurrency(prev => prev + reward);

    const newTouchesLeft = awakenedTouchesLeft - 1;
    setAwakenedTouchesLeft(newTouchesLeft);
    
    if (newTouchesLeft <= 0) {
      setTimeout(() => {
        setMode('normal');
        startNewNormalTangerine();
      }, 300);
    }
  }, [isGameActive, mode, awakenedTouchesLeft, addCurrency, currentSkin.goldMultiplier, startNewNormalTangerine]);


  const handleRegisterScore = () => {
    if (playerName.trim()) {
      addRanking(playerName.trim(), score, gameMode);
    }
  };
  
  const nextSpecialModeIn = 3 - (tangerinesCompleted % 3);

  const backgroundClass = useMemo(() => {
    switch (mode) {
      case 'burning': return 'bg-red-500/20';
      case 'awakened': return 'bg-yellow-400/30';
      default: return '';
    }
  }, [mode]);

  if (!isGameActive && timer === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] gap-4 text-center">
        <h2 className="text-5xl font-bold text-orange-500">시간 종료!</h2>
        <p className="text-3xl text-slate-700">
          깐 귤: <span className="font-bold text-yellow-500">{score}</span>개
        </p>
        <p className="text-2xl text-slate-600">
          획득한 코인: <span className="font-bold text-yellow-500">{earnedCurrency.toLocaleString()}</span>
        </p>
        <div className="w-full max-w-xs mt-4">
            <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="이름을 입력하세요" maxLength={10} className="w-full text-center text-xl p-3 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-400 focus:outline-none shadow-inner"/>
            <button onClick={handleRegisterScore} disabled={!playerName.trim()} className="mt-3 w-full bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform text-xl disabled:bg-gray-400 disabled:scale-100">
                랭킹 등록
            </button>
        </div>
        <button onClick={() => setView('menu')} className="mt-2 text-slate-500 hover:text-orange-500 transition-colors">
          메인 메뉴로
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-between h-[500px] text-center transition-all duration-300 rounded-2xl ${backgroundClass}`}>
      <div className="w-full flex justify-between items-center">
         <button onClick={() => setView('menu')} className="p-2 rounded-full hover:bg-orange-100 transition-colors z-10">
          <BackIcon />
        </button>
        <div className="text-xl sm:text-2xl font-bold text-white bg-red-400 px-3 py-1 rounded-full shadow-md">시간: {timer}</div>
        <div className="text-xl sm:text-2xl font-bold text-white bg-yellow-400 px-3 py-1 rounded-full shadow-md">점수: {score}</div>
      </div>
      
      {mode === 'burning' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-none">
            <p className="text-4xl font-extrabold text-red-500 drop-shadow-lg animate-pulse">버닝 타임!</p>
            <p className="text-lg font-bold text-white bg-black/50 rounded-lg px-2 mt-1">
                {burningTouchStep === 0 ? '첫 번째 터치!' : '마지막 터치!'}
            </p>
        </div>
      )}

      {mode === 'awakened' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-none">
            <p className="text-4xl font-extrabold text-yellow-500 drop-shadow-lg animate-bounce">각성 버닝!</p>
            <p className="text-lg font-bold text-white bg-black/50 rounded-lg px-2 mt-1">
                남은 터치: {awakenedTouchesLeft}
            </p>
        </div>
      )}
      
      <div className="flex-grow flex items-center justify-center my-4" onClick={mode === 'awakened' ? handleAwakenedTangerineClick : undefined}>
        <Tangerine
          skin={currentSkin}
          mode="speed"
          gameMode={gameMode}
          segments={segments}
          activeSegment={activeSegment}
          onSegmentClick={handleSegmentClick}
          isBurning={mode === 'burning'}
          isAwakened={mode === 'awakened'}
          burningTouchStep={burningTouchStep}
          onBurningTangerineClick={handleBurningTangerineClick}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-2 h-20">
        <p className="text-slate-600 text-lg h-6">
          {mode === 'normal' && '빛나는 부분을 빠르게 클릭하세요!'}
          {mode === 'burning' && '거대 귤을 빠르게 터치하세요!'}
          {mode === 'awakened' && '아무 곳이나 터치해 귤을 까세요!'}
        </p>
        {burningTimeUses > 0 && mode === 'normal' && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 font-bold text-red-500">
              <FireIcon />
              <span>
                {burningTimeTriggers >= 2 && awakenedBurningTouches > 0 
                  ? `다음 각성까지: ${nextSpecialModeIn}개` 
                  : `다음 버닝까지: ${nextSpecialModeIn}개`
                }
              </span>
            </div>
            <p className="text-sm text-slate-500">남은 버닝 횟수: {burningTimeUsesLeft} / {burningTimeUses}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedPeeling;