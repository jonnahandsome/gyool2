import React from 'react';
import { GameView, GalleryItem } from '../types';
import BackIcon from './icons/BackIcon';

interface GalleryProps {
  setView: (view: GameView) => void;
  items: GalleryItem[];
}

const Gallery: React.FC<GalleryProps> = ({ setView, items }) => {
  return (
    <div className="flex flex-col h-[500px]">
      <div className="w-full flex items-center mb-4">
        <button onClick={() => setView('menu')} className="p-2 rounded-full hover:bg-orange-100 transition-colors">
          <BackIcon />
        </button>
        <h2 className="text-3xl font-bold text-orange-500 mx-auto">갤러리</h2>
      </div>

      {items.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-center text-slate-500">
          <p className="text-xl">아직 제출된 작품이 없어요.<br/>'개성있게 까기'에서 첫 작품을 만들어보세요!</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto pr-2 grid grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white/70 p-4 rounded-xl shadow-md border-2 border-white flex flex-col items-center text-center aspect-square justify-center">
              <div className="w-24 h-24 mb-3">
                 <svg viewBox="-10 -10 120 120" preserveAspectRatio="xMidYMid meet" className="w-full h-full drop-shadow-md">
                    {item.peelShape ? (
                        <path d={item.peelShape} fill={item.skin.peelColor} stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
                    ) : (
                        // Fallback for items without a shape (e.g. from creative mode before update)
                        <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill={item.skin.peelColor} />
                    )}
                 </svg>
              </div>
              <h3 className="font-bold text-base text-slate-800 leading-tight">"{item.name}"</h3>
              <p className="text-xs text-slate-500 mt-1">{item.createdAt.toLocaleDateString()} 제출</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
