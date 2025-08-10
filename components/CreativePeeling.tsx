import React, { useState, useCallback } from 'react';
import { GameView, Skin, GalleryItem } from '../types';
import { REWARD_CREATIVE_SUBMIT } from '../constants';
import { generateTangerineName } from '../services/geminiService';
import Tangerine from './Tangerine';
import BackIcon from './icons/BackIcon';
import GalleryIcon from './icons/GalleryIcon';

interface CreativePeelingProps {
  setView: (view: GameView) => void;
  addCurrency: (amount: number) => void;
  addToGallery: (item: GalleryItem) => void;
  currentSkin: Skin;
  liftPenCount: number;
}

const CreativePeeling: React.FC<CreativePeelingProps> = ({ setView, addCurrency, addToGallery, currentSkin, liftPenCount }) => {
  const [drawnPaths, setDrawnPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrawEnd = useCallback((pathData: string) => {
    if (drawnPaths.length < liftPenCount) {
        setDrawnPaths(prev => [...prev, pathData]);
    }
  }, [liftPenCount, drawnPaths.length]);

  const handleSubmit = async () => {
    if (drawnPaths.length === 0) return;
    setIsLoading(true);
    try {
      const aiName = await generateTangerineName(currentSkin.name);
      addCurrency(REWARD_CREATIVE_SUBMIT);
      const newItem: GalleryItem = {
        id: new Date().toISOString(),
        skin: currentSkin,
        name: aiName,
        createdAt: new Date(),
        peelShape: drawnPaths.join(' '),
      };
      addToGallery(newItem);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDrawnPaths([]);
  };

  const remainingLifts = liftPenCount - drawnPaths.length;
  const isDrawingDisabled = remainingLifts <= 0;

  return (
    <div className="flex flex-col items-center justify-between h-[500px] text-center">
      <div className="w-full flex justify-between items-center">
        <button onClick={() => setView('menu')} className="p-2 rounded-full hover:bg-orange-100 transition-colors">
          <BackIcon />
        </button>
        <h2 className="text-3xl font-bold text-orange-500">개성있게 까기</h2>
        <button onClick={() => setView('gallery')} className="p-2 rounded-full hover:bg-orange-100 transition-colors">
          <GalleryIcon />
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center w-full my-4">
        <Tangerine
          skin={currentSkin}
          mode={'creative-draw'}
          onDrawEnd={handleDrawEnd}
          drawnPaths={drawnPaths}
          isDrawingDisabled={isDrawingDisabled}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <div className="text-slate-600 text-lg h-12 flex flex-col justify-center items-center">
          <p>{isDrawingDisabled ? "모든 선을 다 그렸어요! 작품을 제출하세요." : "귤 위에 그림을 그려 껍질을 까주세요."}</p>
          <p className="font-bold">남은 선 긋기: <span className={remainingLifts === 0 ? 'text-red-500' : 'text-green-500'}>{remainingLifts}</span> / {liftPenCount}</p>
        </div>
        
        <div className="w-full min-h-[76px] flex flex-col justify-center items-center">
          {drawnPaths.length > 0 && (
            isDrawingDisabled ? (
              <div className="w-full grid grid-cols-2 gap-3">
                <button
                  onClick={handleReset}
                  className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-xl"
                >
                  다시 까기
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed text-xl"
                >
                  {isLoading ? '이름 생성 중...' : '갤러리 제출'}
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-2">
                <button
                  onClick={handleReset}
                  className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-xl"
                >
                  다시 까기
                </button>
                <p className="text-sm text-slate-500">모든 선을 사용해야 제출할 수 있습니다.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativePeeling;