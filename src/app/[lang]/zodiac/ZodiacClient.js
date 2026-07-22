'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const zodiacList = [
  { id: 'rat', name: '鼠', pinyin: 'Shǔ', icon: '🐭', element: '水 (Water)', color: '金、白、蓝', direction: '正北', hours: '23:00 - 01:00' },
  { id: 'ox', name: '牛', pinyin: 'Niú', icon: '🐮', element: '土 (Earth)', color: '红、黄、紫', direction: '东北', hours: '01:00 - 03:00' },
  { id: 'tiger', name: '虎', pinyin: 'Hǔ', icon: '🐯', element: '木 (Wood)', color: '蓝、灰、绿', direction: '东北', hours: '03:00 - 05:00' },
  { id: 'rabbit', name: '兔', pinyin: 'Tù', icon: '🐰', element: '木 (Wood)', color: '绿、蓝、黄', direction: '正东', hours: '05:00 - 07:00' },
  { id: 'dragon', name: '龙', pinyin: 'Lóng', icon: '🐲', element: '土 (Earth)', color: '金、银、白', direction: '东南', hours: '07:00 - 09:00' },
  { id: 'snake', name: '蛇', pinyin: 'Shé', icon: '🐍', element: '火 (Fire)', color: '红、绿、黑', direction: '东南', hours: '09:00 - 11:00' },
  { id: 'horse', name: '马', pinyin: 'Mǎ', icon: '🐴', element: '火 (Fire)', color: '绿、红、紫', direction: '正南', hours: '11:00 - 13:00' },
  { id: 'goat', name: '羊', pinyin: 'Yáng', icon: '🐐', element: '土 (Earth)', color: '绿、红、紫', direction: '西南', hours: '13:00 - 15:00' },
  { id: 'monkey', name: '猴', pinyin: 'Hóu', icon: '🐵', element: '金 (Metal)', color: '白、金、蓝', direction: '西南', hours: '15:00 - 17:00' },
  { id: 'rooster', name: '鸡', pinyin: 'Jī', icon: '🐔', element: '金 (Metal)', color: '金、黄、褐', direction: '正西', hours: '17:00 - 19:00' },
  { id: 'dog', name: '狗', pinyin: 'Gǒu', icon: '🐶', element: '土 (Earth)', color: '红、黄、紫', direction: '西北', hours: '19:00 - 21:00' },
  { id: 'pig', name: '猪', pinyin: 'Zhū', icon: '🐷', element: '水 (Water)', color: '黑、灰、金', direction: '西北', hours: '21:00 - 23:00' },
];

export default function ZodiacClient({ lang }) {
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [cacheVersion, setCacheVersion] = useState('');

  useEffect(() => {
    setCacheVersion(Date.now().toString());
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to generate a deterministic 4D number based on date and zodiac ID
  const getDeterministic4D = (zodiacId) => {
    const seed = `${todayStr}-${zodiacId}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash) % 10000;
    return String(num).padStart(4, '0');
  };

  // Helper to generate a deterministic wealth rating (1-5 stars)
  const getWealthRating = (zodiacId) => {
    const seed = `${todayStr}-${zodiacId}-stars`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % 3) + 3; // Returns 3, 4, or 5 stars for high excitement
  };

  return (
    <main className="min-h-screen text-slate-200 pb-16 bg-slate-950 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.015] select-none z-0">
        <div className="absolute top-[20%] right-[10%] font-black text-[12vw] text-amber-600 font-mono tracking-tighter">8888</div>
        <div className="absolute top-[50%] left-[5%] font-black text-[15vw] text-red-600 font-mono">发</div>
      </div>

      {/* Header Section */}
      <div className="relative py-12 border-b-2 border-amber-500/20 bg-gradient-to-b from-red-800 via-red-900 to-red-950 text-white shadow-xl overflow-hidden text-center z-10">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
        <div className="max-w-4xl mx-auto px-4 relative space-y-3">
          <Link href="/" className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-amber-400 hover:text-amber-300 transition-colors bg-black/30 px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner">
            ⬅️ 返回 NEO4D 首页
          </Link>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            十二生肖 <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">今日发财吉数</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-wider">
            ✨ 根据今日天干地支推算 · 获取专属生肖 4D 发财红字 ✨
          </p>
        </div>
      </div>

      {/* Grid of Zodiacs */}
      <div className="max-w-4xl mx-auto px-4 mt-10 relative z-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {zodiacList.map((zodiac) => {
            const num = getDeterministic4D(zodiac.id);
            const stars = getWealthRating(zodiac.id);
            return (
              <div
                key={zodiac.id}
                onClick={() => setSelectedZodiac({ ...zodiac, num, stars })}
                className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:border-amber-400 shadow-sm hover:shadow-lg transition-all duration-300 text-center cursor-pointer group flex flex-col justify-between items-center"
              >
                <span className="text-4xl md:text-5xl mb-2 filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">{zodiac.icon}</span>
                <div>
                  <h3 className="font-black text-lg text-white group-hover:text-amber-400 transition-colors">
                    生肖{zodiac.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{zodiac.pinyin}</p>
                </div>
                <div className="mt-3 bg-red-500/20 border border-red-500/30 rounded-xl px-3 py-1 text-red-400 font-mono font-bold text-sm tracking-wide">
                  {num}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal Component */}
      {selectedZodiac && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative animate-[pop_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)] animate-duration-300">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-b from-red-800 to-red-950 text-white p-6 text-center relative">
              <button 
                onClick={() => setSelectedZodiac(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all text-sm"
              >
                ✕
              </button>
              <span className="text-6xl block mb-2 filter drop-shadow-lg">{selectedZodiac.icon}</span>
              <h2 className="text-2xl font-black tracking-wide">生肖【{selectedZodiac.name}】今日发财运势</h2>
              <p className="text-xs text-amber-400 font-bold mt-1 tracking-widest">Zodiac {selectedZodiac.pinyin} Lucky Forecast</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Lucky Numbers Box */}
              <div className="bg-gradient-to-b from-slate-950/70 to-slate-950/40 border border-amber-500/30 rounded-2xl p-4 text-center">
                <div className="text-[10px] text-amber-500/90 font-black tracking-widest uppercase mb-1">今日推荐 4D 发财红字</div>
                <div className="text-4xl md:text-5xl font-black text-yellow-300 drop-shadow-sm font-mono tracking-widest my-2 animate-pulse">
                  {selectedZodiac.num}
                </div>
                <div className="text-[10px] text-slate-500">已根据今日天干地支五行磁场计算锁定</div>
              </div>

              {/* Luck Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-200">
                <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">财运指数 (Wealth Index)</span>
                  <span className="text-amber-500 text-base">{'★'.repeat(selectedZodiac.stars)}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">五行属性 (Elements)</span>
                  <span className="text-white">{selectedZodiac.element}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">发财吉色 (Lucky Colors)</span>
                  <span className="text-white">{selectedZodiac.color}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">发财方位 (Lucky Direction)</span>
                  <span className="text-white">{selectedZodiac.direction}</span>
                </div>
              </div>

              <div className="bg-red-950/30 border border-red-900/30 rounded-xl p-3.5 text-xs text-red-300 font-medium leading-relaxed">
                📢 <strong>发财吉时建议：</strong> 今日在 <strong>{selectedZodiac.hours}</strong> 期间打开发财箱或前往投注，获取好运磁场加持效果最佳。
              </div>

              {/* Action Button */}
              <Link 
                href={`/${lang}/telegram-supervip${cacheVersion ? `?v=${cacheVersion}` : ''}`}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95 text-center uppercase tracking-wider text-sm"
              >
                🧧 打开发财箱求取第二组吉数
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick link Back */}
      <div className="max-w-4xl mx-auto px-4 mt-8 text-center">
        <Link href="/" className="text-xs font-bold text-amber-600 hover:underline">
          查看最新开彩结果首页 ➡️
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </main>
  );
}
