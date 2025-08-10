
import React, { useState } from 'react';
import { GameView, RankingItem } from '../types';

interface RankingProps {
  setView: (view: GameView) => void;
  rankings: RankingItem[];
  highRankerRankings: RankingItem[];
}

const RankingList: React.FC<{ rankings: RankingItem[] }> = ({ rankings }) => {
    const rankColor = (index: number) => {
        if (index === 0) return 'text-yellow-400';
        if (index === 1) return 'text-gray-400';
        if (index === 2) return 'text-yellow-600';
        return 'text-slate-500';
    }

    if (rankings.length === 0) {
        return (
            <div className="flex-grow flex items-center justify-center text-center text-slate-500">
              <p className="text-xl">아직 등록된 랭킹이 없어요.</p>
            </div>
        );
    }

    return (
        <div className="flex-grow overflow-y-auto pr-2">
          <ol className="space-y-2">
            {rankings.map((rank, index) => (
              <li key={rank.id} className="bg-white/70 p-3 rounded-xl shadow-md flex items-center gap-4 border-2 border-white">
                <div className={`font-bold text-2xl w-10 text-center ${rankColor(index)}`}>{index + 1}</div>
                <div className="flex-grow">
                  <p className="font-bold text-xl text-slate-800">{rank.name}</p>
                </div>
                <div className="text-xl font-bold text-yellow-500 pr-2">
                  {rank.score} <span className="text-sm text-slate-500">개</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
    );
};


const Ranking: React.FC<RankingProps> = ({ setView, rankings, highRankerRankings }) => {
    const [activeTab, setActiveTab] = useState<'normal' | 'highRanker'>('normal');

    return (
        <div className="flex flex-col h-[500px]">
            <div className="w-full flex flex-col items-center justify-center mb-4">
                <h2 className="text-3xl font-bold text-orange-500">명예의 전당</h2>
                <div className="mt-4 w-full max-w-xs grid grid-cols-2 gap-2 bg-orange-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('normal')}
                        className={`py-2 px-4 rounded-md font-bold text-lg transition-colors ${activeTab === 'normal' ? 'bg-orange-400 text-white shadow' : 'text-orange-600 hover:bg-orange-200'}`}
                    >
                        일반
                    </button>
                    <button 
                        onClick={() => setActiveTab('highRanker')}
                        className={`py-2 px-4 rounded-md font-bold text-lg transition-colors ${activeTab === 'highRanker' ? 'bg-red-500 text-white shadow' : 'text-red-700 hover:bg-red-200'}`}
                    >
                        하이랭커
                    </button>
                </div>
            </div>

            {activeTab === 'normal' 
                ? <RankingList rankings={rankings} /> 
                : <RankingList rankings={highRankerRankings} />
            }

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

export default Ranking;