'use client'; 

import { useState, useEffect, useMemo } from 'react';
import './globals.css'; 
import { dreamData } from './dream_data'; 
import Link from 'next/link'; 

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
    dreamTitle: '🔮 Tua Pek Kong Dream Dictionary',
    dreamDesc: 'Type a dream or keyword (e.g. snake, gold, accident) to discover its lucky 3D/4D numbers.',
    dreamPlaceholder: 'Enter dream keyword...',
    dreamNoMatch: 'Custom pick generated for "{query}"',
    dreamResultTitle: 'Matching Dictionary Pick',
    footerDisclaimer: 'Data aggregated securely in real-time from independent digital broadcasts. All drawings are independent verification check points and not affiliated with official lotteries.'
  },
  zh: {
    title: 'NEO',
    subtitle: '.LIVE',
    blessing: '🧧 發啊！(Huat Liao!)',
    drawLive: '现场开彩进行中',
    drawStandby: '开彩已结束 / 待机中',
    selectRegion: '选择区域',
    feeds: '实时动态开彩数据',
    playground: '财神福地',
    hideFeatures: '收起福地',
    showFeatures: '开启福地',
    zodiacTitle: '生肖幸运吉数 (Zodiac Lucky Pick)',
    zodiacDesc: '选择您的生肖，获取今日专属4D吉数。',
    zodiacLuck: '今日 {name} 专属吉数',
    fortuneTitle: '财神爷送福袋 (Red Packet Fortune)',
    fortuneDesc: '点击红包进行摇号，迎请财神爷降临赐您中奖吉数！',
    fortuneButton: '开启福包',
    fortuneShaking: '迎请吉数中...',
    fortunePick: '财神赐号',
    drawNo: '期号',
    pending: '等待开彩',
    prize1: '🏆 首獎 1ST PRIZE',
    prize2: '🥈 二獎 2ND PRIZE',
    prize3: '🥉 三獎 3RD PRIZE',
    special: '特别奖 (Special Prizes)',
    consolation: '安慰奖 (Consolation Prizes)',
    showAll: '展开全部奖项',
    hideSpecials: '收起奖项',
    statusActive: '开彩中',
    statusStandby: '待机',
    calcZodiac: '正在推算吉数...',
    tabAll: '全部开彩结果',
    tabWest: '西马结果',
    tabEast: '东马结果',
    tabSg: '新加坡博彩',
    copied: '已将开彩结果复制至剪贴板！',
    secFortune: '🧧 财神福地',
    dreamTitle: '🔮 大伯公千字图 (Dream Dictionary)',
    dreamDesc: '输入您的梦境或遇到的事物（如：蛇、黄金、车祸）来查询专属吉数。',
    dreamPlaceholder: '输入梦境关键字...',
    dreamNoMatch: '为您生成 “{query}” 专属吉数',
    dreamResultTitle: '千字图吉数结果',
    footerDisclaimer: '数据源自独立数位广播安全聚合。所有开彩结果仅供参考，与官方博彩机构无关。'
  }
};

export default function HomeClient({ initialResults }) {
  const [results, setResults] = useState(initialResults);
  const [isDrawTime, setIsDrawTime] = useState(false);
  const [loading, setLoading] = useState(!initialResults);

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

  const [searchVal, setSearchVal] = useState('');
  const [dreamQuery, setDreamQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDreamQuery(searchVal);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const dreamResults = useMemo(() => {
    if (!dreamQuery.trim()) return [];
    const queryLower = dreamQuery.toLowerCase().trim();
    return dreamData.filter(item => 
      item.keywords.some(kw => kw.toLowerCase().includes(queryLower)) ||
      item.titleEn.toLowerCase().includes(queryLower) ||
      item.titleZh.toLowerCase().includes(queryLower)
    );
  }, [dreamQuery]);

  const getDeterministicDreamNumber = (query) => {
    let hash = 0;
    const normalized = query.trim().toLowerCase();
    for (let i = 0; i < normalized.length; i++) {
      hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 10000).toString().padStart(4, '0');
  };

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
    // Register PWA Service Worker for offline support and instant shell loading
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('NEO4D Service Worker registered:', reg.scope))
        .catch((err) => console.error('NEO4D Service Worker registration failed:', err));
    }

    if (!initialResults) {
      fetchResults();
    }
    
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
  }, [initialResults]);

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

  const shareZodiacWhatsApp = () => {
    const text = `我刚刚在 NEO4D.LIVE 摇出了生肖【${selectedZodiac}】的今日吉数：【${zodiacLuckyNum}】！🧧 全马首个无广告4D开彩，大字粗体超清晰，你也来测测手气：https://neo4d.live`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareFortuneWhatsApp = () => {
    const text = `我在 NEO4D.LIVE 财神福地摇出了今日吉数：【${fortuneLuckyNum}】！🧧 全马首个无广告4D网站，大字粗体超清晰，你也来迎请你的吉数：https://neo4d.live`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Format and Copy all today's results for easy messaging
  const getFormattedShareText = () => {
    if (!results) return '';
    const dateStr = results.date || new Date().toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });
    let text = `🏆 *NEO4D LIVE - 今日最新 4D 开彩结果 (无广告)* 🧧\n📅 *日期:* ${dateStr}\n\n`;
    
    const mapping = {
      magnum: '萬能 4D (MAGNUM)',
      toto: '多多 4D (SPORTS TOTO)',
      damacai: '大馬彩 1+3D (DA MA CAI)',
      singapore: '新加坡博彩 (SINGAPORE POOLS)',
      sabah: '沙巴 88 (SABAH 88)',
      sarawak: '砂拉越特別大彩 (SPECIAL CASHSWEEP)',
      sandakan: '山打根 4D (SANDAKAN 4D)'
    };
    
    for (const [id, label] of Object.entries(mapping)) {
      const opData = results[id];
      if (!opData) continue;
      text += `【${label}】\n`;
      text += `1ST: *${opData.numbers?.first || '----'}*\n`;
      text += `2ND: *${opData.numbers?.second || '----'}*\n`;
      text += `3RD: *${opData.numbers?.third || '----'}*\n\n`;
    }
    
    text += `查看完整特别奖、安慰奖与大伯公梦境吉数解析：\n👉 https://neo4d.live`;
    return text;
  };

  const copyShareTextToClipboard = () => {
    const text = getFormattedShareText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert(lang === 'zh' ? '已成功复制今日开彩结果分享文案！' : 'Copied formatted results description to clipboard!');
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
      {/* Thematic Background Watermark Overlay (Famous Lucky Numbers & Hanzi) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.025] select-none z-0">
        {/* Lucky Numbers */}
        <div className="absolute top-[12%] left-[4%] font-black text-[13vw] text-amber-600 font-mono tracking-tighter">8888</div>
        <div className="absolute top-[32%] right-[8%] font-black text-[12vw] text-red-600 font-mono">發</div>
        <div className="absolute top-[58%] left-[6%] font-black text-[15vw] text-amber-600 font-mono tracking-tighter">1688</div>
        <div className="absolute top-[82%] right-[4%] font-black text-[13vw] text-red-600 font-mono">吉</div>
        <div className="absolute top-[45%] left-[45%] font-black text-[9vw] text-amber-600 font-mono tracking-tighter">7777</div>
      </div>

      <main className="min-h-screen text-slate-800 pb-16 relative z-10">
        
        {/* Header Section (Agency-Grade Redesign) */}
        <div className="relative py-8 border-b-2 border-amber-500/20 bg-gradient-to-b from-red-800 via-red-900 to-red-950 text-white shadow-xl overflow-hidden">
          
          {/* Decorative Crimson/Gold Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>

          {/* Premium Dragon Background Watermark Image */}
          <div className="absolute inset-0 bg-[url('/images/header_dragon_bg.png')] bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none z-0"></div>

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

          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center relative z-10">
            {/* Agency-Grade Logo Branding */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap text-white">
                <span className="text-3xl md:text-5xl font-black tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow">NEO</span>
                <span className="text-7xl md:text-9xl font-black px-8 py-3.5 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-[2rem] shadow-2xl border-4 border-amber-400 tracking-normal transform hover:scale-105 transition-all duration-200">4D</span>
                <span className="text-2xl md:text-4xl font-light tracking-[0.25em] text-slate-300">LIVE</span>
              </div>
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
          
          {/* Quick Navigation SEO Links */}
          <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto relative z-10">
            <Link 
              href="/predictions" 
              className="flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border border-amber-500/20 font-black text-[10px] md:text-xs uppercase tracking-wider shadow-md hover:scale-102 hover:border-amber-400/50 transition-all cursor-pointer text-center"
            >
              <span>📈</span> {lang === 'zh' ? '万字预测' : 'AI Predictions'}
            </Link>
            <Link 
              href="/analysis" 
              className="flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border border-amber-500/20 font-black text-[10px] md:text-xs uppercase tracking-wider shadow-md hover:scale-102 hover:border-amber-400/50 transition-all cursor-pointer text-center"
            >
              <span>📊</span> {lang === 'zh' ? '频数分析' : 'Stats Analyzer'}
            </Link>
            <Link 
              href="/dreams" 
              className="flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border border-amber-500/20 font-black text-[10px] md:text-xs uppercase tracking-wider shadow-md hover:scale-102 hover:border-amber-400/50 transition-all cursor-pointer text-center"
            >
              <span>🔮</span> {lang === 'zh' ? '千字图' : 'Dream Dict'}
            </Link>
          </div>

          {/* Formatted Today's Results Copy Tool */}
          <div className="max-w-2xl mx-auto relative z-10">
            <button
              onClick={copyShareTextToClipboard}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-2xl border border-emerald-500/20 font-black text-xs uppercase tracking-wider shadow-md hover:scale-102 hover:border-emerald-400/50 transition-all cursor-pointer active:scale-95 duration-100"
            >
              <span>📋</span> {lang === 'zh' ? '一键复制今日开彩结果 (微信/WhatsApp转发文案)' : 'Copy Today\'s 4D Results (Share to WhatsApp/WeChat)'}
            </button>
          </div>

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
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-center animate-pulse-subtle max-w-xs mx-auto space-y-3">
                  <div>
                    <span className="text-[10px] text-amber-300 uppercase font-black tracking-widest block mb-1">
                      {t[lang].fortunePick}
                    </span>
                    <div className="font-number text-5xl text-amber-400 tracking-[0.2em] font-black drop-shadow-md">{fortuneLuckyNum}</div>
                  </div>
                  <button
                    onClick={shareFortuneWhatsApp}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow border border-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>💬</span> {lang === 'zh' ? '分享至 WhatsApp' : 'Share on WhatsApp'}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Interactive Dream Dictionary Component */}
          <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden bg-white border border-slate-200 shadow-md max-w-2xl mx-auto w-full">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="text-xl">🔮</span>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  {t[lang].dreamTitle}
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t[lang].dreamDesc}
              </p>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={t[lang].dreamPlaceholder}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 transition-all font-medium pr-10"
                />
                {searchVal && (
                  <button 
                    onClick={() => { setSearchVal(''); setDreamQuery(''); }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {dreamQuery.trim() && (
                <div className="space-y-3 mt-4 animate-fade-in">
                  {dreamResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                      {dreamResults.map(item => (
                        <div key={item.id} className="p-4 rounded-2xl bg-amber-50/30 border border-amber-100 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-800">
                              {lang === 'zh' ? item.titleZh : item.titleEn}
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-normal">
                              {lang === 'zh' ? item.descZh : item.descEn}
                            </p>
                          </div>
                          <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <span className="font-number text-2xl text-amber-600 tracking-wider font-black">
                              {item.number}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(item.number);
                                  alert(t[lang].copied);
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[9px] font-bold rounded text-slate-600 transition-colors cursor-pointer"
                              >
                                {lang === 'zh' ? '复制' : 'Copy'}
                              </button>
                              <button
                                onClick={() => {
                                  const shareText = `我在 NEO4D.LIVE 梦境/万字图查到【${lang === 'zh' ? item.titleZh : item.titleEn}】的吉数是【${item.number}】！🧧 全马首个无广告4D网站，大字粗体超清晰，你也来查查你的梦境吉数：https://neo4d.live`;
                                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                                }}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded transition-colors cursor-pointer"
                              >
                                💬
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback Deterministic Generator */
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-700">
                          {t[lang].dreamNoMatch.replace('{query}', dreamQuery)}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {lang === 'zh' ? '这是根据您的关键字专属算出的今日好运吉数。' : 'This is your custom fortune lucky number calculated for today based on your search keyword.'}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <span className="font-number text-2xl text-slate-700 tracking-wider font-black">
                          {getDeterministicDreamNumber(dreamQuery)}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getDeterministicDreamNumber(dreamQuery));
                              alert(t[lang].copied);
                            }}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-[9px] font-bold rounded text-slate-700 transition-colors cursor-pointer"
                          >
                            {lang === 'zh' ? '复制' : 'Copy'}
                          </button>
                          <button
                            onClick={() => {
                              const calculatedNum = getDeterministicDreamNumber(dreamQuery);
                              const shareText = `我在 NEO4D.LIVE 摇出了“${dreamQuery}”的专属好运吉数：【${calculatedNum}】！🧧 全马首个无广告4D网站，你也来测试你的关键字吉数：https://neo4d.live`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded transition-colors cursor-pointer"
                          >
                            💬
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                          loading="lazy"
                          decoding="async"
                          className="h-14 md:h-16 w-auto object-contain rounded border border-white bg-white p-0.5 shadow-sm shrink-0" 
                        />
                      ) : (
                        /* Circular SVG Singapore Pools Badge */
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex flex-col items-center justify-center text-sky-800 font-black text-xs md:text-sm border border-slate-200 shadow-sm leading-tight shrink-0">
                          <span>SG</span>
                          <span className="text-[8px] md:text-[9px] font-black opacity-90">POOL</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-sm md:text-base tracking-tight uppercase">
                          <span className="font-black">{operatorName}</span>
                        </h3>
                        <p className="text-[10px] md:text-[11px] opacity-90 font-bold uppercase tracking-wider">
                          {t[lang].drawNo}: <span className="font-mono font-black">{data?.drawNo || t[lang].pending}</span>
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-[10px] md:text-[11px] font-mono font-black bg-white/20 border border-white/30 px-2.5 py-1 rounded text-inherit shadow-sm shrink-0">
                      {data?.date || results?.date || t[lang].pending}
                    </span>
                  </div>

                  {/* High-Contrast Bold Prize Display */}
                  <div className="p-5 space-y-3 bg-white">
                    
                    {/* 1st Prize - Super Sized */}
                    <div className={`flex flex-col p-4 rounded-xl border bg-gradient-to-br ${op.p1Gradient} relative overflow-hidden group/prize`}>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-black text-[12px] md:text-[14px] font-black uppercase tracking-wider flex items-center gap-1">
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
                      <span className="font-number text-5xl md:text-6xl text-center text-black tracking-[0.05em] py-2 drop-shadow-sm">
                        {data?.numbers?.first || '----'}
                      </span>
                    </div>

                    {/* 2nd & 3rd Prize Side-by-Side - Super Sized */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* 2nd Prize */}
                      <div className="flex flex-col p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                        <span className="text-black text-[10px] md:text-[12px] font-black uppercase tracking-wider">
                          {t[lang].prize2}
                        </span>
                        <span className="font-number text-3xl md:text-4xl text-center text-black tracking-[0.05em] mt-1.5">
                          {data?.numbers?.second || '----'}
                        </span>
                      </div>

                      {/* 3rd Prize */}
                      <div className="flex flex-col p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                        <span className="text-black text-[10px] md:text-[12px] font-black uppercase tracking-wider">
                          {t[lang].prize3}
                        </span>
                        <span className="font-number text-3xl md:text-4xl text-center text-black tracking-[0.05em] mt-1.5">
                          {data?.numbers?.third || '----'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Drawers for Specials/Consolation - Color-Coded & Enlarged */}
                  <div className="px-5 pb-5 border-t border-slate-100 bg-slate-50/20 pt-4 space-y-4">
                    
                    {/* Special Numbers */}
                    <div>
                      <h4 className="text-[12px] font-black text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                                    : 'text-black ' +
                                      `${op.id === 'magnum' ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400' : ''}` +
                                      `${op.id === 'toto' ? 'bg-rose-50/70 border-rose-200 hover:border-rose-400' : ''}` +
                                      `${op.id === 'damacai' ? 'bg-blue-50/70 border-blue-200 hover:border-blue-400' : ''}` +
                                      `${op.id === 'singapore' ? 'bg-sky-50/70 border-sky-200 hover:border-sky-400' : ''}` +
                                      `${op.id === 'sabah' ? 'bg-orange-50/70 border-orange-200 hover:border-orange-400' : ''}` +
                                      `${op.id === 'sarawak' ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400' : ''}` +
                                      `${op.id === 'sandakan' ? 'bg-purple-50/70 border-purple-200 hover:border-purple-400' : ''}`
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
                      <h4 className="text-[12px] font-black text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                                    : 'text-black ' +
                                      `${op.id === 'magnum' ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400' : ''}` +
                                      `${op.id === 'toto' ? 'bg-rose-50/70 border-rose-200 hover:border-rose-400' : ''}` +
                                      `${op.id === 'damacai' ? 'bg-blue-50/70 border-blue-200 hover:border-blue-400' : ''}` +
                                      `${op.id === 'singapore' ? 'bg-sky-50/70 border-sky-200 hover:border-sky-400' : ''}` +
                                      `${op.id === 'sabah' ? 'bg-orange-50/70 border-orange-200 hover:border-orange-400' : ''}` +
                                      `${op.id === 'sarawak' ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400' : ''}` +
                                      `${op.id === 'sandakan' ? 'bg-purple-50/70 border-purple-200 hover:border-purple-400' : ''}`
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
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 text-center animate-pulse-subtle max-w-md mx-auto mt-4 space-y-3">
                  {isZodiacSpinning ? (
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">{t[lang].calcZodiac}</div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                          {t[lang].zodiacLuck.replace('{name}', selectedZodiac)}
                        </span>
                        <div className="font-number text-4xl text-amber-600 tracking-[0.2em] font-black">{zodiacLuckyNum}</div>
                      </div>
                      <button
                        onClick={shareZodiacWhatsApp}
                        className="mx-auto w-48 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow border border-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>💬</span> {lang === 'zh' ? '分享至 WhatsApp' : 'Share on WhatsApp'}
                      </button>
                    </>
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
