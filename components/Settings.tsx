
import React, { useState } from 'react';
import { GameView } from '../types';

interface SettingsProps {
    setView: (view: GameView) => void;
    currentNickname: string;
    onSaveNickname: (name: string) => void;
    onCouponSubmit: (code: string) => string;
    onGameReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ setView, currentNickname, onSaveNickname, onCouponSubmit, onGameReset }) => {
    const [nickname, setNickname] = useState(currentNickname);
    const [couponCode, setCouponCode] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
    
    const handleSave = () => {
        const newName = nickname.trim();
        if (newName && newName !== currentNickname) {
            onSaveNickname(newName);
            setSaveMessage('성공적으로 저장되었습니다!');
            setTimeout(() => setSaveMessage(''), 2500);
        }
    };

    const handleCouponRedeem = () => {
        if (!couponCode.trim()) return;
        const message = onCouponSubmit(couponCode);
        alert(message); // Simple feedback for the user
        setCouponCode('');
    };

    const handleGameReset = () => {
        onGameReset();
    };

    const canSave = nickname.trim() && nickname !== currentNickname;

    return (
        <div className="flex flex-col h-[500px]">
            <div className="w-full flex items-center justify-center mb-6">
                <h2 className="text-3xl font-bold text-orange-500">설정</h2>
            </div>

            <div className="flex-grow flex flex-col items-center justify-start gap-4 px-4 overflow-y-auto">
                <div>
                    <label htmlFor="nickname-input" className="font-bold text-xl text-slate-700">닉네임 변경</label>
                    <input
                        id="nickname-input"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="사용할 닉네임"
                        maxLength={10}
                        className="w-full max-w-xs text-center text-2xl p-3 mt-2 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-400 focus:outline-none shadow-inner"
                    />
                    <p className="text-sm text-slate-500 mt-1 text-center">랭킹에 표시될 이름입니다. (최대 10자)</p>
                </div>
                
                <div className="mt-8 pt-6 border-t-2 border-orange-200/50 w-full max-w-xs text-center">
                    <label htmlFor="coupon-input" className="font-bold text-xl text-slate-700">쿠폰 코드 입력</label>
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            id="coupon-input"
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.trim())}
                            placeholder="쿠폰 코드"
                            className="w-full text-center text-lg p-2 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-400 focus:outline-none shadow-inner"
                        />
                        <button
                            onClick={handleCouponRedeem}
                            disabled={!couponCode.trim()}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 flex-shrink-0"
                        >
                            입력
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="w-full p-4 sm:p-6 mt-auto">
                 <div className="h-6 text-center mb-2">
                    {saveMessage && <p className="text-green-600 font-bold">{saveMessage}</p>}
                </div>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setView('menu')}
                            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-xl"
                        >
                            뒤로가기
                        </button>
                        <button
                            onClick={handleSave}
                            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-xl disabled:bg-green-300/80 disabled:scale-100 disabled:cursor-not-allowed"
                            disabled={!canSave}
                        >
                            저장하기
                        </button>
                    </div>
                    <button
                        onClick={handleGameReset}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-xl"
                    >
                        게임 초기화
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;