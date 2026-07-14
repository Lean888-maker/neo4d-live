'use client'; 

import { useState, useEffect, useMemo } from 'react';
import './globals.css'; 

// Translation dictionary for EN / ZH
const t = {
  en: {
    title: 'NEO',
    subtitle: '.LIVE',
    blessing: '🧧 Huat Liao!',
    drawLive: 'Live Draw in Progress',
    drawStandby: 'Draw Completed / Standby',
    selectRegion: 'Select Region',
    feeds: 'Real-time dynamic feeds',
    playground: 'Fortune Playground',
    hideFeatures: 'Hide Features',
    showFeatures: 'Show Features',
    zodiacTitle: 'Zodiac Lucky Pick',
    zodiacDesc: 'Select your sign to draw today\'s lucky 4D number.',
    zodiacLuck: 'Lucky 4D for Zodiac {name} today',
    fortuneTitle: 'Red Packet Fortune Shake',
    fortuneDesc: 'Tap the red packet envelope to shake the fortune cylinder and extract your random winning ticket numbers.',
    fortuneButton: 'Open Red Packet',
    fortuneShaking: 'Shaking Cylinder...',
    fortunePick: 'Your Fortune Pick Number',
    drawNo: 'Draw',
    pending: 'PENDING',
    prize1: '🏆 首獎 1ST PRIZE',
    prize2: '🥈 二獎 2ND PRIZE',
    prize3: '🥉 三獎 3RD PRIZE',
    special: '特別獎 (Special Prizes)',
    consolation: '安慰獎 (Consolation Prizes)',
    showAll: 'Show All Prizes',
    hideSpecials: 'Hide Specials',
    statusActive: 'Active',
    statusStandby: 'Standby',
    calcZodiac: 'Calculating Lucky Fortune...',
    tabAll: 'All Results',
    tabWest: 'West Malaysia',
    tabEast: 'East Malaysia',
    tabSg: 'Singapore Pools',
    copied: 'Copied results description to clipboard!',
    secFortune: '🧧 Fortune Playground',
    footerDisclaimer: 'Data aggregated securely in real-time from independent digital broadcasts. All drawings are independent verification check points and not affiliated with official lotteries.'
  },
  zh: {
    title: 'NEO',
    subtitle: '.LIVE',
    blessing: '🧧 發啊！(Huat Liao!)',
    drawLive: '現場開彩進行中',
    drawStandby: '開彩已結束 / 待機中',
    selectRegion: '選擇區域',
    feeds: '實時動態開彩數據',
    playground: '財神福地',
    hideFeatures: '收起福地',
    showFeatures: '開啟福地',
    zodiacTitle: '生肖幸運吉數 (Zodiac Lucky Pick)',
    zodiacDesc: '选择您的生肖，获取今日专属4D吉数。',
    zodiacLuck: '今日 {name} 專屬吉數',
    fortuneTitle: '財神爺送福袋 (Red Packet Fortune)',
    fortuneDesc: '点击红包进行摇号，迎请财神爷降临赐您中奖吉数！',
    fortuneButton: '開啓福包',
    fortuneShaking: '迎请吉数中...',
    fortunePick: '財神賜號',
    drawNo: '期號',
    pending: '等待開彩',
    prize1: '🏆 首獎 1ST PRIZE',
    prize2: '🥈 二獎 2ND PRIZE',
    prize3: '🥉 三獎 3RD PRIZE',
    special: '特別獎 (Special Prizes)',
    consolation: '安慰獎 (Consolation Prizes)',
    showAll: '展開全部獎項',
    hideSpecials: '收起獎項',
    statusActive: '開彩中',
    statusStandby: '待機',
    calcZodiac: '正在推算吉數...',
    tabAll: '全部開彩結果',
    tabWest: '西馬結果',
    tabEast: '東馬結果',
    tabSg: '新加坡博彩',
    copied: '已将开彩结果复制至剪贴板！',
    secFortune: '🧧 財神福地',
    footerDisclaimer: '數據源自獨立數位廣播安全聚合。所有開彩結果僅供參考，與官方博彩機構無關。'
  }
};

export default function Home() {
  const [results, setResults] = useState(null);
  const [isDrawTime, setIsDrawTime] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Language state (defaults to Chinese 'zh' for target audience)
  const [lang, setLang] = useState('zh');

  // Tab state
  const [activeRegion, setActiveRegion] = useState('all');

  // Interactive Features State
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [zodiacLuckyNum, setZodiacLuckyNum] = useState('');
  const [isZodiacSpinning, setIsZodiacSpinning] = useState(false);

  const [fortuneLuckyNum, setFortuneLuckyNum] = useState('');
  const [isFortuneShaking, setIsFortuneShaking] = useState(false);

  // List of operators with solid brand colors and Chinese translations
  const operators = [
    { 
      id: 'magnum', 
      name: 'MAGNUM 4D', 
      jpName: '萬能 4D', 
      logoImg: '/images/logo_magnum.gif',
      color: 'text-slate-900', // Dark text for yellow background
      headerBg: 'bg-[#FFCC00]', // Solid official yellow
      borderColor: 'group-hover:border-[#FFCC00] border-slate-200 border-t-8 border-t-[#FFCC00]',
      p1Gradient: 'from-yellow-100/50 via-yellow-50/10 to-white border-yellow-300'
    },
    { 
      id: 'toto', 
      name: 'SPORTS TOTO', 
      jpName: '多多 4D', 
      logoImg: '/images/logo_toto.gif',
      color: 'text-white', 
      headerBg: 'bg-[#E11D48]', // Solid official red
      borderColor: 'group-hover:border-[#E11D48] border-slate-200 border-t-8 border-t-[#E11D48]',
      p1Gradient: 'from-red-100/50 via-red-50/10 to-white border-red-300'
    },
    { 
      id: 'damacai', 
      name: 'DA MA CAI 1+3D', 
      jpName: '大馬彩 1+3D', 
      logoImg: '/images/logo_damacai.gif',
      color: 'text-white', 
      headerBg: 'bg-[#1D4ED8]', // Solid official blue
      borderColor: 'group-hover:border-[#1D4ED8] border-slate-200 border-t-8 border-t-[#1D4ED8]',
      p1Gradient: 'from-blue-100/50 via-blue-50/10 to-white border-blue-300'
    },
    { 
      id: 'singapore', 
      name: 'SINGAPORE POOLS', 
      jpName: '新加坡博彩', 
      logoImg: null, // Custom SVG fallback
      color: 'text-white', 
      headerBg: 'bg-[#0369A1]', // Solid official cyan-blue
      borderColor: 'group-hover:border-[#0369A1] border-slate-200 border-t-8 border-t-[#0369A1]',
      p1Gradient: 'from-sky-100/50 via-sky-50/10 to-white border-cyan-300'
    },
    { 
      id: 'sabah', 
      name: 'SABAH 88', 
      jpName: '沙巴 88', 
      logoImg: '/images/logo_sabah88.gif',
      color: 'text-white', 
      headerBg: 'bg-[#EA580C]', // Solid official orange
      borderColor: 'group-hover:border-[#EA580C] border-slate-200 border-t-8 border-t-[#EA580C]',
      p1Gradient: 'from-orange-100/50 via-orange-50/10 to-white border-orange-300'
    },
    { 
      id: 'sarawak', 
      name: 'SPECIAL CASHSWEEP', 
      jpName: '砂拉越特別大彩', 
      logoImg: '/images/logo_cashsweep.gif',
      color: 'text-white', 
      headerBg: 'bg-[#15803D]', // Solid official green
      borderColor: 'group-hover:border-[#15803D] border-slate-200 border-t-8 border-t-[#15803D]',
      p1Gradient: 'from-green-100/50 via-green-50/10 to-white border-green-300'
    },
    { 
      id: 'sandakan', 
      name: 'SANDAKAN 4D', 
      jpName: '山打根 4D', 
      logoImg: '/images/logo_stc4d.gif',
      color: 'text-white', 
      headerBg: 'bg-[#6B21A8]', // Solid official purple
      borderColor: 'group-hover:border-[#6B21A8] border-slate-200 border-t-8 border-t-[#6B21A8]',
      p1Gradient: 'from-purple-100/50 via-purple-50/10 to-white border-purple-300'
    },
  ];

  // Zodiac list with translation compatibility
  const zodiacList = [
    { name: { en: 'Rat', zh: '鼠' }, raw: 'Rat', emoji: '🐭' },
    { name: { en: 'Ox', zh: '牛' }, raw: 'Ox', emoji: '🐮' },
    { name: { en: 'Tiger', zh: '虎' }, raw: 'Tiger', emoji: '🐯' },
    { name: { en: 'Rabbit', zh: '兔' }, raw: 'Rabbit', emoji: '🐰' },
    { name: { en: 'Dragon', zh: '龍' }, raw: 'Dragon', emoji: '🐲' },
    { name: { en: 'Snake', zh: '蛇' }, raw: 'Snake', emoji: '🐍' },
    { name: { en: 'Horse', zh: '馬' }, raw: 'Horse', emoji: '🐴' },
    { name: { en: 'Goat', zh: '羊' }, raw: 'Goat', emoji: '🐑' },
    { name: { en: 'Monkey', zh: '猴' }, raw: 'Monkey', emoji: '🐵' },
    { name: { en: 'Rooster', zh: '雞' }, raw: 'Rooster', emoji: '🐔' },
    { name: { en: 'Dog', zh: '狗' }, raw: 'Dog', emoji: '🐶' },
    { name: { en: 'Pig', zh: '豬' }, raw: 'Pig', emoji: '🐷' }
  ];

  const checkIsDrawTime = () => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
    const day = now.getDay(); 
    const hour = now.getHours();
    const minute = now.getMinutes();
    const isDrawDay = day === 0 || day === 3 || day === 6 || day === 2; // Sun, Wed, Sat, Tue
    const isDrawHour = (hour === 19 && minute >= 0) || (hour === 20 && minute <= 30); // 7:00 PM - 8:30 PM
    return isDrawDay && isDrawHour;
  };

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/get-4d', { cache: 'no-store' });
      const data = await response.json();
      if (data && !data.error) {
        setResults(data);
      } else {
        console.error("API returned error payload:", data);
      }
    } catch (error) {
      console.error("UI fetch execution failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    
    // Dynamically adjust polling frequency: 4 seconds during active draws, 45 seconds during off-peak hours
    const getPollInterval = () => {
      return checkIsDrawTime() ? 4000 : 45000;
    };
    
    let intervalId;
    let currentInterval = getPollInterval();
    
    const startInterval = (ms) => {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        const activeDraw = checkIsDrawTime();
        setIsDrawTime(activeDraw);
        fetchResults();
        
        // Re-clock interval dynamically if draw state changes
        const nextInterval = getPollInterval();
        if (nextInterval !== currentInterval) {
          currentInterval = nextInterval;
          startInterval(currentInterval);
        }
      }, ms);
    };
    
    startInterval(currentInterval);
    
    return () => clearInterval(intervalId);
  }, []);

  const getProviderData = (providerId) => {
    if (!results) return null;
    return results[providerId] || null;
  };

  // Filtering operators based on active tab
  const filteredOperators = useMemo(() => {
    return operators.filter(op => {
      if (activeRegion === 'all') return true;
      if (activeRegion === 'west') return ['magnum', 'toto', 'damacai'].includes(op.id);
      if (activeRegion === 'east') return ['sabah', 'sarawak', 'sandakan'].includes(op.id);
      if (activeRegion === 'sg') return ['singapore'].includes(op.id);
      return true;
    });
  }, [activeRegion]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(t[lang].copied);
  };

  // Deterministic daily lucky number for Zodiac
  const getZodiacLuckyNumber = (zodiacName) => {
    setIsZodiacSpinning(true);
    setSelectedZodiac(zodiacName);
    
    setTimeout(() => {
      const todayStr = new Date().toDateString();
      const seed = zodiacName + todayStr;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      }
      const num = Math.abs(hash % 10000).toString().padStart(4, '0');
      setZodiacLuckyNum(num);
      setIsZodiacSpinning(false);
    }, 850);
  };

  // Randomized lucky number for Red Packet Shaker
  const triggerFortuneShaker = () => {
    setIsFortuneShaking(true);
    setFortuneLuckyNum('');
    
    setTimeout(() => {
      const num = Math.floor(1000 + Math.random() * 9000).toString();
      setFortuneLuckyNum(num);
      setIsFortuneShaking(false);
    }, 850);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-600 font-medium bg-[#faf8f5]">
        <div className="relative flex h-16 w-16 mb-6">
          <span className="draw-ping-ring absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-60"></span>
          <div className="relative inline-flex rounded-full h-16 w-16 bg-white border-2 border-slate-300 items-center justify-center text-slate-700 font-black text-xl tracking-widest">
            4D
          </div>
        </div>
        <p className="tracking-widest uppercase text-xs font-semibold text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "NEO4D LIVE",
            "url": "https://neo4d.live",
            "description": "Fastest real-time live 4D draw results in Malaysia and Singapore. Search winning numbers for Magnum 4D, Sports Toto, Da Ma Cai, Singapore Pools, Sabah 88, Sandakan 4D, and CashSweep.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "All",
            "browserRequirements": "Requires JavaScript. Requires HTML5."
          })
        }}
      />

      {/* Thematic Background Watermark Overlay (Famous Lucky Numbers & Hanzi) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02] select-none z-0">
        <div className="absolute top-[12%] left-[4%] font-black text-[13vw] text-amber-600 font-mono tracking-tighter">8888</div>
        <div className="absolute top-[32%] right-[8%] font-black text-[12vw] text-red-600 font-mono">發</div>
        <div className="absolute top-[58%] left-[6%] font-black text-[15vw] text-amber-600 font-mono tracking-tighter">1688</div>
        <div className="absolute top-[82%] right-[4%] font-black text-[13vw] text-red-600 font-mono">吉</div>
        <div className="absolute top-[45%] left-[45%] font-black text-[9vw] text-amber-600 font-mono tracking-tighter">7777</div>
      </div>

      <main className="min-h-screen text-slate-800 pb-16 relative z-10">
        
        {/* Header Section (Agency-Grade Redesign) */}
        <div className="relative py-8 border-b-2 border-amber-500/20 bg-gradient-to-b from-red-800 via-red-900 to-red-950 text-white shadow-xl">
          
          {/* Decorative Crimson/Gold Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>

          {/* EN / 中文 Switcher Button (Absolute Positioned, Sliding Pill Look) */}
          <div className="absolute top-5 right-5 flex gap-1 bg-black/30 p-1.5 rounded-full border border-white/20 shadow-inner text-xs md:text-sm font-black tracking-wider z-20">
            <button 
              onClick={() => setLang('en')} 
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-black ${lang === 'en' ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('zh')} 
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-black ${lang === 'zh' ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
            >
              中文
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
            {/* Agency-Grade Logo Branding */}
            <div className="space-y-1.5">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-4">
                <img 
                  src="/images/badge_pixiu.png" 
                  alt="Pi Xiu" 
                  className="h-16 md:h-24 w-auto animate-bounce-slow select-none mix-blend-screen" 
                />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow">NEO</span>
                <span className="text-red-500 font-extrabold px-2.5 py-0.5 bg-red-600 text-white rounded-lg shadow-lg border border-red-500 tracking-tighter text-3xl md:text-4xl">4D</span>
                <span className="text-slate-400 font-light tracking-widest">LIVE</span>
                <img 
                  src="/images/badge_dragon.png" 
                  alt="Dragon" 
                  className="h-16 md:h-24 w-auto animate-bounce-slow select-none mix-blend-screen" 
                />
              </h1>
              <p className="text-[10px] md:text-[11px] text-amber-400 font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-1">
                <span>✨</span> {lang === 'zh' ? '全马首家无广告实时4D开彩引擎' : 'MALAYSIA\'S FIRST AD-FREE REAL-TIME 4D ENGINE'} <span>✨</span>
              </p>
            </div>
            
            <p className="text-[10px] text-red-500 font-black tracking-[0.2em] uppercase mt-2.5 bg-red-950/40 px-3 py-0.5 rounded-full border border-red-900/30">
              {t[lang].blessing}
            </p>
            
            {isDrawTime ? (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-1.5 rounded-full flex items-center gap-2.5 shadow-md backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase">{t[lang].drawLive}</span>
              </div>
            ) : (
              <div className="mt-4 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-5 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-extrabold tracking-widest uppercase">{t[lang].drawStandby}</span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
          
          {/* Interactive "Red Envelope Shaker" Hero component at Top */}
          <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-red-950 border-2 border-amber-500/30 shadow-xl text-white text-center max-w-2xl mx-auto">
            {/* Decorative Chinese Gold Cloud Pattern Watermarks */}
            <div className="absolute top-4 left-4 text-white/5 text-6xl select-none pointer-events-none">☁️</div>
            <div className="absolute bottom-4 right-4 text-white/5 text-6xl select-none pointer-events-none">☁️</div>
            
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🧧</span>
                <h2 className="text-base font-black text-amber-300 uppercase tracking-wider">
                  {t[lang].fortuneTitle}
                </h2>
              </div>
              <p className="text-xs text-red-200 leading-relaxed">
                {t[lang].fortuneDesc}
              </p>
              
              <div className="flex flex-col items-center justify-center py-4">
                <button
                  onClick={triggerFortuneShaker}
                  className={`relative text-8xl select-none filter active:scale-95 transition-transform duration-75 cursor-pointer ${
                    isFortuneShaking ? 'animate-bounce' : 'hover:scale-105 duration-200'
                  }`}
                  title="Shake for Luck!"
                >
                  <div className="relative flex flex-col items-center justify-center drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
                    <span>🧧</span>
                    <span className="absolute top-[40%] text-sm font-black text-yellow-400 select-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                      福
                    </span>
                  </div>
                </button>
                
                <button 
                  onClick={triggerFortuneShaker}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-full shadow-lg cursor-pointer border border-amber-300 transition-all duration-150 transform hover:scale-102"
                >
                  {isFortuneShaking ? t[lang].fortuneShaking : t[lang].fortuneButton}
                </button>
              </div>

              {fortuneLuckyNum && (
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-center animate-pulse-subtle max-w-xs mx-auto">
                  <span className="text-[10px] text-amber-300 uppercase font-black tracking-widest block mb-1">
                    {t[lang].fortunePick}
                  </span>
                  <div className="font-number text-5xl text-amber-400 tracking-[0.2em] font-black drop-shadow-md">{fortuneLuckyNum}</div>
                </div>
              )}
            </div>
          </section>
          
          {/* Regional Filter Tabs */}
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-500">{t[lang].selectRegion}</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">{t[lang].feeds}</span>
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: t[lang].tabAll },
                { id: 'west', label: t[lang].tabWest },
                { id: 'east', label: t[lang].tabEast },
                { id: 'sg', label: t[lang].tabSg },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRegion(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    activeRegion === tab.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid for filtered operators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOperators.map((op) => {
              const data = getProviderData(op.id);
              const operatorName = lang === 'zh' ? op.jpName : op.name;
              
              return (
                <div 
                  key={op.id} 
                  className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-200 relative ${op.borderColor} shadow-md`}
                >
                  {/* Operator Header info with Solid Brand Colored Banner */}
                  <div className={`px-5 py-4 flex justify-between items-center border-b border-black/10 ${op.headerBg} ${op.color}`}>
                    <div className="flex items-center gap-3">
                      {op.logoImg ? (
                        <img 
                          src={op.logoImg} 
                          alt={operatorName} 
                          className="h-9 w-auto object-contain rounded border border-white bg-white p-0.5 shadow-sm" 
                        />
                      ) : (
                        /* Circular SVG Singapore Pools Badge */
                        <div className="w-9 h-9 rounded-full bg-white flex flex-col items-center justify-center text-sky-800 font-extrabold text-[9px] border border-slate-200 shadow-sm leading-tight">
                          <span>SG</span>
                          <span className="text-[7px] font-medium opacity-90">POOL</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-sm tracking-tight flex items-center gap-1 uppercase">
                          <span className="text-[12px] font-black">{operatorName}</span>
                        </h3>
                        <p className="text-[9px] opacity-90 font-semibold uppercase tracking-wider">
                          {t[lang].drawNo}: <span className="font-mono font-bold">{data?.drawNo || t[lang].pending}</span>
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-[9px] font-mono font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded text-inherit shadow-sm">
                      {data?.date || results?.date || t[lang].pending}
                    </span>
                  </div>

                  {/* High-Contrast Bold Prize Display */}
                  <div className="p-5 space-y-3 bg-white">
                    
                    {/* 1st Prize - Super Sized */}
                    <div className={`flex flex-col p-4 rounded-xl border bg-gradient-to-br ${op.p1Gradient} relative overflow-hidden group/prize`}>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-slate-500 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                          {t[lang].prize1}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(`${operatorName} 1st: ${data?.numbers?.first || '----'}`)}
                          className="opacity-0 group-hover/prize:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600"
                          title="Copy result"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                          </svg>
                        </button>
                      </div>
                      <span className="font-number text-5xl md:text-6xl text-center text-slate-900 tracking-[0.05em] py-2 drop-shadow-sm">
                        {data?.numbers?.first || '----'}
                      </span>
                    </div>

                    {/* 2nd & 3rd Prize Side-by-Side - Super Sized */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* 2nd Prize */}
                      <div className="flex flex-col p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                        <span className="text-slate-500 text-[8px] font-extrabold uppercase tracking-widest">
                          {t[lang].prize2}
                        </span>
                        <span className="font-number text-3xl md:text-4xl text-center text-slate-800 tracking-[0.05em] mt-1.5">
                          {data?.numbers?.second || '----'}
                        </span>
                      </div>

                      {/* 3rd Prize */}
                      <div className="flex flex-col p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                        <span className="text-slate-500 text-[8px] font-extrabold uppercase tracking-widest">
                          {t[lang].prize3}
                        </span>
                        <span className="font-number text-3xl md:text-4xl text-center text-slate-800 tracking-[0.05em] mt-1.5">
                          {data?.numbers?.third || '----'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Drawers for Specials/Consolation - Color-Coded & Enlarged */}
                  <div className="px-5 pb-5 border-t border-slate-100 bg-slate-50/20 pt-4 space-y-4">
                    
                    {/* Special Numbers */}
                    <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        {t[lang].special}
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-1.5 text-center">
                        {data?.numbers?.special && data.numbers.special.length > 0 ? (
                          data.numbers.special.map((num, i) => {
                            const isPending = num === '----';
                            return (
                              <div 
                                key={i} 
                                className={`font-number text-lg md:text-xl py-2 rounded-xl border transition-all font-black shadow-sm ${
                                  isPending 
                                    ? 'text-slate-300 border-slate-100 bg-slate-50/10' 
                                    : `${op.id === 'magnum' ? 'bg-amber-50/70 border-amber-200 text-amber-700 hover:border-amber-400' : ''}` +
                                      `${op.id === 'toto' ? 'bg-rose-50/70 border-rose-200 text-rose-600 hover:border-rose-400' : ''}` +
                                      `${op.id === 'damacai' ? 'bg-blue-50/70 border-blue-200 text-blue-700 hover:border-blue-400' : ''}` +
                                      `${op.id === 'singapore' ? 'bg-sky-50/70 border-sky-200 text-sky-700 hover:border-sky-400' : ''}` +
                                      `${op.id === 'sabah' ? 'bg-orange-50/70 border-orange-200 text-orange-700 hover:border-orange-400' : ''}` +
                                      `${op.id === 'sarawak' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-700 hover:border-emerald-400' : ''}` +
                                      `${op.id === 'sandakan' ? 'bg-purple-50/70 border-purple-200 text-purple-700 hover:border-purple-400' : ''}`
                                }`}
                              >
                                {num}
                              </div>
                            );
                          })
                        ) : (
                          Array(10).fill('----').map((num, i) => (
                            <div key={i} className="font-number text-lg py-2 rounded-xl border border-slate-50 bg-slate-50/10 text-slate-300">{num}</div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Consolation Numbers (Starters) */}
                    <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                        {t[lang].consolation}
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-1.5 text-center">
                        {data?.numbers?.consolation && data.numbers.consolation.length > 0 ? (
                          data.numbers.consolation.map((num, i) => {
                            const isPending = num === '----';
                            return (
                              <div 
                                key={i} 
                                className={`font-number text-lg md:text-xl py-2 rounded-xl border transition-all font-black shadow-sm ${
                                  isPending 
                                    ? 'text-slate-300 border-slate-100 bg-slate-50/10' 
                                    : `${op.id === 'magnum' ? 'bg-amber-50/70 border-amber-200 text-amber-700 hover:border-amber-400' : ''}` +
                                      `${op.id === 'toto' ? 'bg-rose-50/70 border-rose-200 text-rose-600 hover:border-rose-400' : ''}` +
                                      `${op.id === 'damacai' ? 'bg-blue-50/70 border-blue-200 text-blue-700 hover:border-blue-400' : ''}` +
                                      `${op.id === 'singapore' ? 'bg-sky-50/70 border-sky-200 text-sky-700 hover:border-sky-400' : ''}` +
                                      `${op.id === 'sabah' ? 'bg-orange-50/70 border-orange-200 text-orange-700 hover:border-orange-400' : ''}` +
                                      `${op.id === 'sarawak' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-700 hover:border-emerald-400' : ''}` +
                                      `${op.id === 'sandakan' ? 'bg-purple-50/70 border-purple-200 text-purple-700 hover:border-purple-400' : ''}`
                                }`}
                              >
                                {num}
                              </div>
                            );
                          })
                        ) : (
                          Array(10).fill('----').map((num, i) => (
                            <div key={i} className="font-number text-lg py-2 rounded-xl border border-slate-50 bg-slate-50/10 text-slate-300">{num}</div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Status Footer */}
                  <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-end items-center text-[10px] font-bold text-slate-400 font-mono">
                    <span>{data?.numbers?.special ? t[lang].statusActive : t[lang].statusStandby}</span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Bottom Section: Zodiac Lucky Picker (Relocated to clean up space) */}
          <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden bg-white border border-slate-200 shadow-md">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="text-xl">🔮</span>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  {t[lang].zodiacTitle}
                </h2>
              </div>
              <p className="text-[11px] text-slate-500">
                {t[lang].zodiacDesc}
              </p>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                {zodiacList.map(z => {
                  const localZodiacName = lang === 'zh' ? z.name.zh : z.name.en;
                  return (
                    <button
                      key={z.raw}
                      onClick={() => getZodiacLuckyNumber(localZodiacName)}
                      className={`p-2.5 rounded-2xl text-center border text-[10px] font-extrabold transition-all cursor-pointer ${
                        selectedZodiac === localZodiacName
                          ? 'bg-red-600 border-red-600 text-white shadow-md transform scale-105'
                          : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-red-50/50 hover:border-red-200'
                      }`}
                    >
                      <div className="text-xl mb-0.5">{z.emoji}</div>
                      <div className="truncate">{localZodiacName}</div>
                    </button>
                  );
                })}
              </div>

              {selectedZodiac && (
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 text-center animate-pulse-subtle max-w-md mx-auto mt-4">
                  {isZodiacSpinning ? (
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">{t[lang].calcZodiac}</div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                        {t[lang].zodiacLuck.replace('{name}', selectedZodiac)}
                      </span>
                      <div className="font-number text-4xl text-amber-600 tracking-[0.2em] font-black">{zodiacLuckyNum}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* System footer */}
          <footer className="mt-12 text-center text-[10px] text-slate-400 font-medium tracking-widest border-t border-slate-200 pt-8 space-y-2">
            <p>&copy; {new Date().getFullYear()} NEO4D LIVE ENGINE. ALL RIGHTS RESERVED.</p>
            <p className="max-w-md mx-auto leading-relaxed">
              {t[lang].footerDisclaimer}
            </p>
          </footer>

        </div>
      </main>
    </>
  );
}