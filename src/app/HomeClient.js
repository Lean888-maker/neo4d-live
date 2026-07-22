'use client'; 

import { useState, useEffect, useMemo } from 'react';
import './globals.css'; 
import { dreamData } from './dream_data'; 
import Link from 'next/link'; 
import { useRouter } from 'next/navigation'; 

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
    jackpot: '💰 Jackpot',
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
    tabSg: 'Singapore',
    tabCambodia: 'Cambodia',
    copied: 'Results copied to clipboard!',
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
    jackpot: '💰 积宝 (Jackpot)',
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
    tabCambodia: '柬埔寨开彩',
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

export default function HomeClient({ initialResults, initialLang = 'zh' }) {
  const [results, setResults] = useState(initialResults);
  const [isDrawTime, setIsDrawTime] = useState(false);
  const [loading, setLoading] = useState(!initialResults);

  // Language state (defaults to route param)
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  // Tab state
  const [activeRegion, setActiveRegion] = useState('all');

  // Search state
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.length === 4 && !isNaN(searchQuery)) {
      router.push(`/${lang}/number/${searchQuery}`);
    }
  };

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

  const shareToWhatsApp = (text) => {
    const encodedText = encodeURIComponent(text + '\n\nCheck live at: https://neo4d.live');
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
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
    { 
      id: 'granddragon', 
      name: 'GRAND DRAGON LOTTO', 
      jpName: '豪龙 (Hao Long)', 
      logoImg: '/images/logo_granddragon.png',
      color: 'text-slate-900', 
      headerBg: 'bg-[#FACC15]',
      borderColor: 'group-hover:border-[#FACC15] border-slate-200 border-t-8 border-t-[#FACC15]',
      p1Gradient: 'from-yellow-100/50 via-yellow-50/10 to-white border-yellow-300'
    },
    { 
      id: 'ninelotto', 
      name: '9 LOTTO', 
      jpName: '9Lotto (Hari Hari)', 
      logoImg: '/images/logo_ninelotto.png',
      color: 'text-white', 
      headerBg: 'bg-[#DC2626]',
      borderColor: 'group-hover:border-[#DC2626] border-slate-200 border-t-8 border-t-[#DC2626]',
      p1Gradient: 'from-red-100/50 via-red-50/10 to-white border-red-300'
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
      if (activeRegion === 'cambodia') return ['granddragon', 'ninelotto'].includes(op.id);
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
    const text = `我刚刚在 NEO4D.LIVE 摇出了生肖【${selectedZodiac}】的今日吉数：【${zodiacLuckyNum}】！🧧 全马首个无广告4D开彩，大字粗体超清晰，你也来测测手气：\nhttps://neo4d.live/`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareFortuneWhatsApp = () => {
    const text = `我在 NEO4D.LIVE 财神福地摇出了今日吉数：【${fortuneLuckyNum}】！🧧 全马首个无广告4D网站，大字粗体超清晰，你也来迎请你的吉数：\nhttps://neo4d.live/`;
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
      sandakan: '山打根 4D (SANDAKAN 4D)',
      granddragon: '豪龙 (GRAND DRAGON)',
      ninelotto: '9Lotto (HARI HARI)'
    };
    
    for (const [id, label] of Object.entries(mapping)) {
      const opData = results[id];
      if (!opData) continue;
      text += `【${label}】\n`;
      text += `1ST: *${opData.numbers?.first || '----'}*\n`;
      text += `2ND: *${opData.numbers?.second || '----'}*\n`;
      text += `3RD: *${opData.numbers?.third || '----'}*\n`;
      if (opData.jackpots?.jp1 || opData.jackpots?.jp2) {
        text += `💰 Jackpot 1: *${opData.jackpots?.jp1 || '-'}*\n`;
        if (opData.jackpots?.jp2) text += `💰 Jackpot 2: *${opData.jackpots?.jp2}*\n`;
      }
      text += `\n`;
    }
  
  text += `查看完整特别奖、安慰奖与大伯公梦境吉数解析：\n👉 https://neo4d.live/`;
  return text;
};

  const forwardShareTextToWhatsApp = () => {
    const text = getFormattedShareText();
    if (!text) return;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400 font-medium bg-slate-950">
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 select-none z-0">
        {/* Lucky Numbers */}
        <div className="absolute top-[12%] left-[4%] font-black text-[13vw] text-amber-600 font-mono tracking-tighter">8888</div>
        <div className="absolute top-[32%] right-[8%] font-black text-[12vw] text-red-600 font-mono">發</div>
        <div className="absolute top-[58%] left-[6%] font-black text-[15vw] text-amber-600 font-mono tracking-tighter">1688</div>
        <div className="absolute top-[82%] right-[4%] font-black text-[13vw] text-red-600 font-mono">吉</div>
        <div className="absolute top-[45%] left-[45%] font-black text-[9vw] text-amber-600 font-mono tracking-tighter">7777</div>
      </div>

      <main className="min-h-screen bg-slate-950 text-slate-200 pb-16 relative z-10">
        
        {/* Header Section (Agency-Grade Redesign) */}
        <div className="relative py-8 border-b-2 border-amber-500/20 bg-gradient-to-b from-red-800 via-red-900 to-red-950 text-white shadow-xl overflow-hidden">
          
          {/* Decorative Crimson/Gold Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>

          {/* Premium Dragon Background Watermark Image */}
          <div className="absolute inset-0 bg-[url('/images/header_dragon_bg.png')] bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none z-0"></div>

          {/* EN / 中文 Switcher Button (Absolute Positioned, Sliding Pill Look) */}
          <div className="absolute top-5 right-5 flex gap-1 bg-black/30 p-1.5 rounded-full border border-white/20 shadow-inner text-xs md:text-sm font-black tracking-wider z-20">
            <Link 
              href="/en"
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-black ${lang === 'en' ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
            >
              EN
            </Link>
            <Link 
              href="/zh"
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-black ${lang === 'zh' ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
            >
              中文
            </Link>
          </div>

          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center relative z-10 pt-16 md:pt-4">
            {/* Agency-Grade Logo Branding */}
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center justify-center gap-2 md:gap-6 text-white whitespace-nowrap">
                <span className="text-3xl sm:text-4xl md:text-6xl font-black tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow">NEO</span>
                <span className="text-5xl sm:text-6xl md:text-9xl font-black px-4 py-2 md:px-10 md:py-4 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-4 border-amber-400 tracking-normal transform hover:scale-105 transition-all duration-200">4D</span>
                <span className="text-2xl sm:text-3xl md:text-5xl font-light tracking-[0.25em] text-amber-200">LIVE</span>
              </div>
              <p className="text-xs sm:text-sm md:text-lg text-amber-400 font-black tracking-[0.1em] md:tracking-[0.2em] uppercase flex items-center justify-center gap-1 md:gap-1.5 pt-2 md:pt-4">
                <span>✨</span> {lang === 'zh' ? '全马首家无广告实时4D开彩引擎' : 'MALAYSIA\'S FIRST AD-FREE REAL-TIME 4D ENGINE'} <span>✨</span>
              </p>
            </div>

            
            {isDrawTime ? (
              <div className="mt-5 bg-red-500/20 border border-red-400/50 text-red-300 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-lg backdrop-blur-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                </span>
                <span className="text-sm md:text-base font-black tracking-widest uppercase text-white drop-shadow-md">{t[lang].drawLive}</span>
              </div>
            ) : (
              <div className="mt-5 border border-emerald-400/30 bg-emerald-900/40 text-emerald-300 px-6 py-2.5 rounded-full flex items-center gap-2.5 shadow-lg backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="text-sm md:text-base font-black tracking-widest uppercase">{t[lang].drawStandby}</span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-5xl mx-auto relative z-10">
            <Link 
              href={`/${lang}/scanner`}
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border-2 border-amber-500/30 font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 hover:border-amber-400/70 transition-all cursor-pointer text-center min-h-[64px]"
            >
              <span className="text-lg">📷</span> <span className="whitespace-nowrap">{lang === 'zh' ? '扫票对奖' : 'Scan Ticket'}</span>
            </Link>
            <Link 
              href={`/${lang}/predictions`}
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border-2 border-amber-500/30 font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 hover:border-amber-400/70 transition-all cursor-pointer text-center min-h-[64px]"
            >
              <span className="text-lg">📈</span> <span className="whitespace-nowrap">{lang === 'zh' ? '万字预测' : 'AI Predictions'}</span>
            </Link>
            <Link 
              href={`/${lang}/analysis`}
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border-2 border-amber-500/30 font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 hover:border-amber-400/70 transition-all cursor-pointer text-center min-h-[64px]"
            >
              <span className="text-lg">📊</span> <span className="whitespace-nowrap">{lang === 'zh' ? '频数分析' : 'Stats Analyzer'}</span>
            </Link>
            <Link 
              href={`/${lang}/dreams`}
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border-2 border-amber-500/30 font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 hover:border-amber-400/70 transition-all cursor-pointer text-center min-h-[64px]"
            >
              <span className="text-lg">🔮</span> <span className="whitespace-nowrap">{lang === 'zh' ? '千字图' : 'Dream Dict'}</span>
            </Link>
            <Link 
              href={`/${lang}/zodiac`}
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border-2 border-amber-500/30 font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 hover:border-amber-400/70 transition-all cursor-pointer text-center min-h-[64px] col-span-2 sm:col-span-1"
            >
              <span className="text-lg">🧧</span> <span className="whitespace-nowrap">{lang === 'zh' ? '生肖吉数' : 'Zodiac'}</span>
            </Link>
          </div>

          {/* pSEO Search Number Input */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative z-10 flex gap-2">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder={lang === 'zh' ? "搜索任意4D号码 (例: 8888)" : "Search any 4D number (e.g., 8888)"}
              className="flex-1 bg-slate-900 border-2 border-amber-500/50 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner text-center font-black tracking-widest text-lg md:text-xl"
            />
            <button 
              type="submit"
              disabled={searchQuery.length !== 4}
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-8 py-4 rounded-2xl font-black text-sm md:text-base uppercase tracking-wider hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
            >
              {lang === 'zh' ? "分析查询" : "Analyze"}
            </button>
          </form>

          {/* Formatted Today's Results Copy Tool */}
          <div className="max-w-2xl mx-auto relative z-10">
            <button
              onClick={forwardShareTextToWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl border-2 border-emerald-400/40 font-black text-sm md:text-base uppercase tracking-wider shadow-lg hover:scale-102 hover:border-emerald-300 transition-all cursor-pointer active:scale-95 duration-100"
            >
              <span className="text-xl">💬</span> {lang === 'zh' ? '一键转发今日开彩结果 (WhatsApp)' : 'Forward Today\'s 4D Results (WhatsApp)'}
            </button>
          </div>

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
                { id: 'cambodia', label: t[lang].tabCambodia },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRegion(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    activeRegion === tab.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white/5 backdrop-blur-md border-white/10 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Masonry for filtered operators to prevent empty space clutter */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 w-full max-w-7xl mx-auto">
            {filteredOperators.map((op) => {
              const data = getProviderData(op.id);
              const operatorName = lang === 'zh' ? op.jpName : op.name;
              
              return (
                <div 
                  key={op.id} 
                  className={`group bg-slate-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/60 relative break-inside-avoid mb-6 ${op.borderColor}`}
                >
                  {/* Operator Header info with Uniformed Sleek Dark Glass Banner */}
                  <div className="px-5 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/40 text-white relative z-10">
                    <div className="flex items-center gap-3">
                      {op.logoImg ? (
                        <img 
                          src={op.logoImg} 
                          alt={operatorName} 
                          loading="lazy"
                          decoding="async"
                          className="h-14 md:h-16 w-auto object-contain rounded border border-white/20 bg-white/10 backdrop-blur-sm p-0.5 shadow-sm shrink-0" 
                        />
                      ) : (
                        /* Circular SVG Singapore Pools Badge */
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-sky-400 font-black text-xs md:text-sm border border-white/20 shadow-inner leading-tight shrink-0">
                          <span>SG</span>
                          <span className="text-[8px] md:text-[9px] font-black opacity-90">POOL</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-base md:text-lg tracking-tight uppercase flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                            op.id === 'magnum' ? 'bg-[#FFCC00] shadow-[0_0_8px_#FFCC00]' :
                            op.id === 'toto' ? 'bg-[#E11D48] shadow-[0_0_8px_#E11D48]' :
                            op.id === 'damacai' ? 'bg-[#1D4ED8] shadow-[0_0_8px_#1D4ED8]' :
                            op.id === 'singapore' ? 'bg-[#0369A1] shadow-[0_0_8px_#0369A1]' :
                            op.id === 'sabah' ? 'bg-[#EA580C] shadow-[0_0_8px_#EA580C]' :
                            op.id === 'sarawak' ? 'bg-[#15803D] shadow-[0_0_8px_#15803D]' :
                            op.id === 'sandakan' ? 'bg-[#6B21A8] shadow-[0_0_8px_#6B21A8]' :
                            op.id === 'granddragon' ? 'bg-[#FACC15] shadow-[0_0_8px_#FACC15]' :
                            op.id === 'ninelotto' ? 'bg-[#DC2626] shadow-[0_0_8px_#DC2626]' : 'bg-slate-400'
                          }`}></span>
                          <span className="font-black">{operatorName}</span>
                        </h3>
                        <p className="text-xs md:text-sm opacity-95 font-bold uppercase tracking-wider mt-0.5">
                          {t[lang].drawNo}: <span className="font-mono font-black">{data?.drawNo || t[lang].pending}</span>
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-[10px] md:text-[11px] font-mono font-black bg-black/30 border border-white/10 px-2.5 py-1 rounded text-white shadow-sm shrink-0">
                      {data?.date || results?.date || t[lang].pending}
                    </span>
                  </div>

                  {/* High-Contrast Bold Prize Display */}
                  <div className="p-5 space-y-3 bg-transparent">
                    {/* 1st Prize - Clean Dark theme with glowing gold numbers */}
                    <div className="flex flex-col p-4 rounded-xl border border-amber-500/40 bg-slate-950/60 relative overflow-hidden group/prize">
                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-amber-500 text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-1.5">
                          {t[lang].prize1}
                        </span>
                        <button 
                          onClick={() => shareToWhatsApp(`*${operatorName} 1st Prize:*\n${data?.numbers?.first || '----'}`)}
                          className="opacity-0 group-hover/prize:opacity-100 transition-opacity p-2 text-green-600 hover:text-green-700"
                          title="Share to WhatsApp"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                          </svg>
                        </button>
                      </div>
                      <span className="font-number text-6xl md:text-[5.5rem] text-center text-amber-400 tracking-[0.05em] py-3 drop-shadow-md font-black">
                        {data?.numbers?.first || '----'}
                      </span>
                    </div>

                    {/* 2nd & 3rd Prize Side-by-Side - Super Sized */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* 2nd Prize */}
                      <div className="flex flex-col p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-inner">
                        <span className="text-slate-300 text-xs md:text-sm font-black uppercase tracking-widest">
                          {t[lang].prize2}
                        </span>
                        <span className="font-number text-4xl md:text-5xl text-center text-white tracking-[0.05em] mt-2 font-black">
                          {data?.numbers?.second || '----'}
                        </span>
                      </div>

                      {/* 3rd Prize */}
                      <div className="flex flex-col p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-inner">
                        <span className="text-slate-300 text-xs md:text-sm font-black uppercase tracking-widest">
                          {t[lang].prize3}
                        </span>
                        <span className="font-number text-4xl md:text-5xl text-center text-white tracking-[0.05em] mt-2 font-black">
                          {data?.numbers?.third || '----'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Jackpot Display Layout - Clean & Uncluttered */}
                  {(data?.jackpots?.jp1 || data?.jackpots?.jp2 || data?.jackpots?.jp3) && (
                    <div className="px-5 pb-3">
                      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-amber-600/10 p-4 shadow-sm backdrop-blur-sm relative overflow-hidden group/jp">
                        <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"></span>
                          {t[lang].jackpot}
                        </h4>
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                          {data?.jackpots?.jp1 && (
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] md:text-[10px] text-amber-600/80 uppercase font-bold tracking-widest truncate">
                                {op.id === 'magnum' ? 'Magnum 4D Jackpot 1' : op.id === 'toto' ? 'Toto 4D Jackpot 1' : op.id === 'damacai' ? 'Da Ma Cai 1+3D JP1' : 'Jackpot 1'}
                              </span>
                              <span className="text-lg md:text-2xl font-black text-amber-500 drop-shadow-sm mt-0.5 break-all">{data.jackpots.jp1}</span>
                            </div>
                          )}
                          {data?.jackpots?.jp2 && (
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] md:text-[10px] text-amber-600/80 uppercase font-bold tracking-widest truncate">
                                {op.id === 'magnum' ? 'Magnum 4D Jackpot 2' : op.id === 'toto' ? 'Toto 4D Jackpot 2' : op.id === 'damacai' ? 'Da Ma Cai 1+3D JP2' : 'Jackpot 2'}
                              </span>
                              <span className="text-lg md:text-2xl font-black text-amber-500 drop-shadow-sm mt-0.5 break-all">{data.jackpots.jp2}</span>
                            </div>
                          )}
                          {data?.jackpots?.jp3 && (
                            <div className="flex flex-col min-w-0 col-span-1 sm:col-span-2 border-t border-amber-500/10 pt-2 mt-1">
                              <span className="text-[9px] md:text-[10px] text-amber-600/80 uppercase font-bold tracking-widest truncate">
                                {op.id === 'damacai' ? 'Da Ma Cai 3D Jackpot' : 'Jackpot 3'}
                              </span>
                              <span className="text-lg md:text-2xl font-black text-amber-500 drop-shadow-sm mt-0.5 break-all">{data.jackpots.jp3}</span>
                            </div>
                          )}
                        </div>
                        {/* WhatsApp share for jackpot */}
                        <button 
                          onClick={() => shareToWhatsApp(`*${operatorName} Jackpot!*\n${data.jackpots.jp1 ? `JP1: ${data.jackpots.jp1}\n` : ''}${data.jackpots.jp2 ? `JP2: ${data.jackpots.jp2}` : ''}`)}
                          className="absolute right-3 top-3 opacity-0 group-hover/jp:opacity-100 transition-opacity p-2 text-green-600 hover:text-green-700"
                          title="Share to WhatsApp"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Additional Jackpot Games (Lotto, Life, etc) */}
                  {data?.jackpotGames && Object.values(data.jackpotGames).filter(Boolean).length > 0 && (
                    <div className="px-5 pb-3">
                      <div className="flex flex-col gap-3">
                        {Object.values(data.jackpotGames).filter(Boolean).map((game, i) => (
                          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm relative group/lotto">
                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-1.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
                              <span>{game.name}</span>
                            </h4>
                            
                            {/* Render JP1, JP2, and JP3 for additional games like Da Ma Cai 3D/Lottos in a clean list to prevent overlapping */}
                            {(game.jp1 || game.jp2 || game.jp3) && (
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-[11px] font-bold text-amber-500 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2.5">
                                {game.jp1 && <div>Jackpot 1: <span className="text-white font-mono">{game.jp1}</span></div>}
                                {game.jp2 && <div>Jackpot 2: <span className="text-white font-mono">{game.jp2}</span></div>}
                                {game.jp3 && <div>Jackpot 3: <span className="text-white font-mono">{game.jp3}</span></div>}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {game.numbers.map((num, idx) => (
                                <span key={idx} className="w-auto px-3 h-8 md:h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-white text-sm md:text-base shadow-inner">
                                  {num}
                                </span>
                              ))}
                              {game.bonus?.map((num, idx) => (
                                <span key={`bonus-${idx}`} className="w-auto px-3 h-8 md:h-10 rounded-full bg-amber-600 border border-amber-400 flex items-center justify-center font-black text-white text-sm md:text-base shadow-[0_0_8px_rgba(217,119,6,0.6)]">
                                  {num}
                                </span>
                              ))}
                            </div>
                            
                            {/* WhatsApp share for lotto games */}
                            <button 
                              onClick={() => shareToWhatsApp(`*${operatorName} ${game.name}*\nNumbers: ${game.numbers.join(', ')}\n${game.jp1 ? `Jackpot: ${game.jp1}` : ''}`)}
                              className="absolute right-3 top-3 opacity-0 group-hover/lotto:opacity-100 transition-opacity p-2 text-green-600 hover:text-green-700"
                              title="Share to WhatsApp"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Drawers for Specials/Consolation - Color-Coded & Enlarged */}
                  <div className="px-5 pb-5 border-t border-white/10 bg-transparent pt-4 space-y-4">
                    
                    {/* Special Numbers */}
                    <div>
                      <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm"></span>
                        {t[lang].special}
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 text-center">
                        {data?.numbers?.special && data.numbers.special.length > 0 ? (
                          data.numbers.special.map((num, i) => {
                            const isPending = num === '----';
                            return (
                              <div 
                                key={i} 
                                className={`font-number text-[1.1rem] md:text-xl py-1.5 md:py-2 tracking-tight rounded-lg border-2 transition-all font-black shadow-sm ${
                                  isPending 
                                    ? 'text-slate-400 border-white/5 bg-slate-800/50' 
                                    : 'text-slate-900 ' +
                                      `${op.id === 'magnum' ? 'bg-amber-100 border-amber-300 hover:border-amber-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'toto' ? 'bg-rose-100 border-rose-300 hover:border-rose-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'damacai' ? 'bg-blue-100 border-blue-300 hover:border-blue-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'singapore' ? 'bg-sky-100 border-sky-300 hover:border-sky-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'sabah' ? 'bg-orange-100 border-orange-300 hover:border-orange-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'sarawak' ? 'bg-emerald-100 border-emerald-300 hover:border-emerald-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'sandakan' ? 'bg-purple-100 border-purple-300 hover:border-purple-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'granddragon' ? 'bg-yellow-100 border-yellow-300 hover:border-yellow-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'ninelotto' ? 'bg-red-100 border-red-300 hover:border-red-500 hover:shadow-md' : ''}`
                                }`}
                              >
                                {num}
                              </div>
                            );
                          })
                        ) : (
                          Array(10).fill('----').map((num, i) => (
                            <div key={i} className="font-number text-[1.1rem] py-1.5 md:py-2 rounded-lg border-2 border-white/5 bg-slate-800/50 text-slate-400 font-black">{num}</div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Consolation Numbers (Starters) */}
                    <div>
                      <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-400 shadow-sm"></span>
                        {t[lang].consolation}
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 text-center">
                        {data?.numbers?.consolation && data.numbers.consolation.length > 0 ? (
                          data.numbers.consolation.map((num, i) => {
                            const isPending = num === '----';
                            return (
                              <div 
                                key={i} 
                                className={`font-number text-[1.1rem] md:text-xl py-1.5 md:py-2 tracking-tight rounded-lg border-2 transition-all font-black shadow-sm ${
                                  isPending 
                                    ? 'text-slate-400 border-white/5 bg-slate-800/50' 
                                    : 'text-slate-900 ' +
                                      `${op.id === 'magnum' ? 'bg-amber-100 border-amber-300 hover:border-amber-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'toto' ? 'bg-rose-100 border-rose-300 hover:border-rose-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'damacai' ? 'bg-blue-100 border-blue-300 hover:border-blue-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'singapore' ? 'bg-sky-100 border-sky-300 hover:border-sky-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'sabah' ? 'bg-orange-100 border-orange-300 hover:border-orange-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'sarawak' ? 'bg-emerald-100 border-emerald-300 hover:border-emerald-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'sandakan' ? 'bg-purple-100 border-purple-300 hover:border-purple-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'granddragon' ? 'bg-yellow-100 border-yellow-300 hover:border-yellow-500 hover:shadow-md' : ''}` +
                                      `${op.id === 'ninelotto' ? 'bg-red-100 border-red-300 hover:border-red-500 hover:shadow-md' : ''}`
                                }`}
                              >
                                {num}
                              </div>
                            );
                          })
                        ) : (
                          Array(10).fill('----').map((num, i) => (
                            <div key={i} className="font-number text-[1.1rem] py-1.5 md:py-2 rounded-lg border-2 border-white/5 bg-slate-800/50 text-slate-400 font-black">{num}</div>
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

          {/* Moved Fortune Interactive Components Below Results */}

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
                  className={`relative text-9xl select-none filter active:scale-95 transition-transform duration-75 cursor-pointer ${
                    isFortuneShaking ? 'animate-bounce' : 'hover:scale-105 duration-200'
                  }`}
                  title="Shake for Luck!"
                >
                  <div className="relative flex flex-col items-center justify-center drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
                    <span>🧧</span>
                    <span className="absolute top-[40%] text-2xl font-black text-yellow-400 select-none drop-shadow-[0_3px_4px_rgba(0,0,0,0.9)]">
                      福
                    </span>
                  </div>
                </button>
                
                <button 
                  onClick={triggerFortuneShaker}
                  className="mt-6 px-10 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm md:text-base uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)] cursor-pointer border-2 border-amber-200 transition-all duration-150 transform hover:scale-105"
                >
                  {isFortuneShaking ? t[lang].fortuneShaking : t[lang].fortuneButton}
                </button>
              </div>

              {fortuneLuckyNum && (
                <div className="p-5 rounded-2xl bg-amber-400/10 border-2 border-amber-400/40 text-center animate-pulse-subtle max-w-sm mx-auto space-y-4 shadow-inner">
                  <div>
                    <span className="text-sm md:text-base text-amber-300 uppercase font-black tracking-widest block mb-2">
                      {t[lang].fortunePick}
                    </span>
                    <div className="font-number text-6xl text-amber-400 tracking-[0.2em] font-black drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">{fortuneLuckyNum}</div>
                  </div>
                  <button
                    onClick={shareFortuneWhatsApp}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm md:text-base rounded-xl shadow border-2 border-emerald-400 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <span className="text-xl">💬</span> {lang === 'zh' ? '分享至 WhatsApp' : 'Share on WhatsApp'}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Interactive Dream Dictionary Component */}
          <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg max-w-2xl mx-auto w-full">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="text-xl">🔮</span>
                <h2 className="text-sm font-black text-slate-200 uppercase tracking-tight">
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
                  className="w-full bg-slate-800/50 border border-white/10 text-white rounded-2xl px-5 py-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner placeholder-slate-400 font-medium"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                {searchVal && (
                  <button 
                    onClick={() => { setSearchVal(''); setDreamQuery(''); }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
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
                        <div key={item.id} className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white">
                              {lang === 'zh' ? item.titleZh : item.titleEn}
                            </h4>
                            <p className="text-sm text-slate-400 italic text-center">
                              {lang === 'zh' ? item.descZh : item.descEn}
                            </p>
                          </div>
                          <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <span className="font-number text-2xl text-amber-400 tracking-wider font-black">
                              {item.number}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(item.number);
                                  alert(t[lang].copied);
                                }}
                                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-[9px] font-bold rounded text-white transition-colors cursor-pointer"
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
                    <div className="mt-4 p-5 rounded-2xl bg-slate-800/80 border border-white/10 text-center shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/images/badge_pixiu.png')] bg-cover opacity-5 mix-blend-overlay"></div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200">
                          {t[lang].dreamNoMatch.replace('{query}', dreamQuery)}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {lang === 'zh' ? '这是根据您的关键字专属算出的今日好运吉数。' : 'This is your custom fortune lucky number calculated for today based on your search keyword.'}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 shrink-0 mt-3">
                        <span className="font-number text-2xl text-amber-400 tracking-wider font-black">
                          {getDeterministicDreamNumber(dreamQuery)}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getDeterministicDreamNumber(dreamQuery));
                              alert(t[lang].copied);
                            }}
                            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-[9px] font-bold rounded text-white transition-colors cursor-pointer"
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

          {/* Bottom Section: Zodiac Lucky Picker */}
          <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="text-xl">🔮</span>
                <h2 className="text-sm font-black text-slate-200 uppercase tracking-tight">
                  {t[lang].zodiacTitle}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400">
                {t[lang].zodiacDesc}
              </p>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                {zodiacList.map(z => {
                  const localZodiacName = lang === 'zh' ? z.name.zh : z.name.en;
                  return (
                    <button
                      key={z.raw}
                      onClick={() => getZodiacLuckyNumber(localZodiacName)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedZodiac === localZodiacName 
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md scale-105 border-0' 
                          : 'bg-slate-800/50 border border-white/5 hover:border-white/20 hover:bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      <div className="text-xl mb-0.5">{z.emoji}</div>
                      <div className="truncate text-[10px] font-bold">{localZodiacName}</div>
                    </button>
                  );
                })}
              </div>

              {selectedZodiac && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center animate-pulse-subtle max-w-md mx-auto mt-4 space-y-3">
                  {isZodiacSpinning ? (
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">{t[lang].calcZodiac}</div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
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
