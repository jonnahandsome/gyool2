import React from 'react';
import { GameView } from '../types';
import PaletteIcon from './icons/PaletteIcon';
import TrophyIcon from './icons/TrophyIcon';
import ShopIcon from './icons/ShopIcon';
import GalleryIcon from './icons/GalleryIcon';
import LeaderboardIcon from './icons/LeaderboardIcon';
import UpgradeIcon from './icons/UpgradeIcon';
import SettingsIcon from './icons/SettingsIcon';
import FireIcon from './icons/FireIcon';
import { HIGH_RANK_MODE_UNLOCK_SCORE } from '../constants';


interface MainMenuProps {
  setView: (view: GameView) => void;
  userHighScore: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ setView, userHighScore }) => {
  const menuOptions = [
    { view: 'creative', label: '개성있게 까기', icon: <PaletteIcon />, color: 'bg-yellow-400 hover:bg-yellow-500' },
    { view: 'speed', label: '빨리 까기', icon: <TrophyIcon />, color: 'bg-red-400 hover:bg-red-500' },
  ];
  
  const utilityOptions = [
    { view: 'upgrades', label: '업그레이드', icon: <UpgradeIcon />, color: 'bg-blue-400 hover:bg-blue-500' },
    { view: 'shop', label: '상점', icon: <ShopIcon />, color: 'bg-green-400 hover:bg-green-500' },
    { view: 'ranking', label: '랭킹', icon: <LeaderboardIcon />, color: 'bg-indigo-400 hover:bg-indigo-500' },
    { view: 'gallery', label: '갤러리', icon: <GalleryIcon />, color: 'bg-purple-400 hover:bg-purple-500' },
    { view: 'settings', label: '설정', icon: <SettingsIcon />, color: 'bg-gray-400 hover:bg-gray-500' },
  ];

  const showHighRankMode = userHighScore >= HIGH_RANK_MODE_UNLOCK_SCORE;

  return (
    <div className="flex flex-col items-center justify-center h-[500px] gap-2 text-center">
      <h1 className="text-6xl font-bold text-orange-500 drop-shadow-lg">귤 까기 게임</h1>
      <p className="text-xl text-slate-600 mb-4">궁극의 귤 까기 장인이 되어보세요!</p>
      <div className="w-full max-w-xs flex flex-col gap-3">
        {menuOptions.map(opt => (
          <button
            key={opt.view}
            onClick={() => setView(opt.view as GameView)}
            className={`${opt.color} text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-3 text-xl border-2 border-white/50`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}

        {showHighRankMode && (
             <button
                onClick={() => setView('speed-high-rank')}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-3 text-xl border-2 border-white/50 animate-pulse"
              >
                <FireIcon />
                하이랭커 모드
              </button>
        )}

        <hr className="my-2 border-orange-200/50"/>

        <div className="grid grid-cols-2 gap-3">
            {utilityOptions.map(opt => (
              <button
                key={opt.view}
                onClick={() => setView(opt.view as GameView)}
                className={`${opt.color} text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-md`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
