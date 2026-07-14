'use client'; 

import { useState, useEffect, useMemo } from 'react';
import './globals.css'; 

export default function Home() {
  const [results, setResults] = useState(null);
  const [isDrawTime, setIsDrawTime] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Tab state
  const [activeRegion, setActiveRegion] = useState('all');
  
  // Collapsible cards state
  const [expandedCards, setExpandedCards] = useState({});

  // Interactive Features State
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(true);
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [zodiacLuckyNum, setZodiacLuckyNum] = useState('');
  const [isZodiacSpinning, setIsZodiacSpinning] = useState(false);

  const [fortuneLuckyNum, setFortuneLuckyNum] = useState('');
  const [isFortuneShaking, setIsFortuneShaking] = useState(false);

  // List of operators with light mode configurations, local logo paths, and solid brand colors
  const operators = [
    { 
      id: 'magnum', 
      name: 'MAGNUM 4D', 
      jpName: '萬能', 
      logoImg: '/images/logo_magnum.gif',
      color: 'text-slate-900', // Dark text for yellow background
      headerBg: 'bg-[#FFCC00]', // Solid official yellow
      borderColor: 'group-hover:border-[#FFCC00] border-slate-200 border-t-8 border-t-[#FFCC00]',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      p1Gradient: 'from-yellow-100/50 via-yellow-50/10 to-white border-yellow-300'
    },
    { 
      id: 'toto', 
      name: 'SPORTS TOTO', 
      jpName: '多多', 
      logoImg: '/images/logo_toto.gif',
      color: 'text-white', 
      headerBg: 'bg-[#E11D48]', // Solid official red
      borderColor: 'group-hover:border-[#E11D48] border-slate-200 border-t-8 border-t-[#E11D48]',
      badgeBg: 'bg-red-50 text-red-800 border-red-200',
      p1Gradient: 'from-red-100/50 via-red-50/10 to-white border-red-300'
    },
    { 
      id: 'damacai', 
      name: 'DA MA CAI 1+3D', 
      jpName: '大馬彩', 
      logoImg: '/images/logo_damacai.gif',
      color: 'text-white', 
      headerBg: 'bg-[#1D4ED8]', // Solid official blue
      borderColor: 'group-hover:border-[#1D4ED8] border-slate-200 border-t-8 border-t-[#1D4ED8]',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      p1Gradient: 'from-blue-100/50 via-blue-50/10 to-white border-blue-300'
    },
    { 
      id: 'singapore', 
      name: 'SINGAPORE POOLS', 
      jpName: '新加坡', 
      logoImg: null, // Custom SVG fallback
      color: 'text-white', 
      headerBg: 'bg-[#0369A1]', // Solid official cyan-blue
      borderColor: 'group-hover:border-[#0369A1] border-slate-200 border-t-8 border-t-[#0369A1]',
      badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      p1Gradient: 'from-sky-100/50 via-sky-50/10 to-white border-cyan-300'
    },
    { 
      id: 'sabah', 
      name: 'SABAH 88', 
      jpName: '沙巴', 
      logoImg: '/images/logo_sabah88.gif',
      color: 'text-white', 
      headerBg: 'bg-[#EA580C]', // Solid official orange
      borderColor: 'group-hover:border-[#EA580C] border-slate-200 border-t-8 border-t-[#EA580C]',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
      p1Gradient: 'from-orange-100/50 via-orange-50/10 to-white border-orange-300'
    },
    { 
      id: 'sarawak', 
      name: 'SPECIAL CASHSWEEP', 
      jpName: '掃描', 
      logoImg: '/images/logo_cashsweep.gif',
      color: 'text-white', 
      headerBg: 'bg-[#15803D]', // Solid official green
      borderColor: 'group-hover:border-[#15803D] border-slate-200 border-t-8 border-t-[#15803D]',
      badgeBg: 'bg-green-50 text-green-800 border-green-200',
      p1Gradient: 'from-green-100/50 via-green-50/10 to-white border-green-300'
    },
    { 
      id: 'sandakan', 
      name: 'SANDAKAN 4D', 
      jpName: '山打根', 
      logoImg: '/images/logo_stc4d.gif',
      color: 'text-white', 
      headerBg: 'bg-[#6B21A8]', // Solid official purple
      borderColor: 'group-hover:border-[#6B21A8] border-slate-200 border-t-8 border-t-[#6B21A8]',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      p1Gradient: 'from-purple-100/50 via-purple-50/10 to-white border-purple-300'
    },
  ];

  const zodiacList = [
    { name: 'Rat', emoji: '🐭' },
    { name: 'Ox', emoji: '🐮' },
    { name: 'Tiger', emoji: '🐯' },
    { name: 'Rabbit', emoji: '🐰' },
    { name: 'Dragon', emoji: '🐲' },
    { name: 'Snake', emoji: '🐍' },
    { name: 'Horse', emoji: '🐴' },
    { name: 'Goat', emoji: '🐐' },
    { name: 'Monkey', emoji: '🐵' },
    { name: 'Rooster', emoji: '🐔' },
    { name: 'Dog', emoji: '🐶' },
    { name: 'Pig', emoji: '🐷' }
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
    const intervalId = setInterval(() => {
      const activeDraw = checkIsDrawTime();
      setIsDrawTime(activeDraw);
      fetchResults();
    }, 25000); // Check every 25 seconds
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

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied results description to clipboard!');
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
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-600 font-medium bg-[#f8fafc]">
        <div className="relative flex h-16 w-16 mb-6">
          <span className="draw-ping-ring absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-60"></span>
          <div className="relative inline-flex rounded-full h-16 w-16 bg-slate-100 border-2 border-slate-300 items-center justify-center text-slate-700 font-black text-xl tracking-widest">
            4D
          </div>
        </div>
        <p className="tracking-widest uppercase text-xs font-semibold text-slate-500">Loading Live Drawings...</p>
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
      <main className="min-h-screen text-slate-800 pb-16">
        
        {/* Header (Clean, Compact, Minimal) */}
        <div className="relative py-6 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              NEO<span className="text-amber-500 font-black bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent">4D</span><span className="text-slate-400 font-light">.LIVE</span>
            </h1>
            
            {isDrawTime ? (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-600 px-4 py-1.5 rounded-full flex items-center gap-2.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase">Live Draw in Progress</span>
              </div>
            ) : (
              <div className="mt-3 border border-slate-200 bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600">Draw Completed / Standby</span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
          
          {/* Interactive "Crowd Attractor" Section (At the Very Top for Accessibility) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Fortune Playground</span>
              <button 
                onClick={() => setIsPlaygroundOpen(!isPlaygroundOpen)}
                className="text-[10px] font-extrabold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              >
                {isPlaygroundOpen ? 'Hide Features' : 'Show Features'}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isPlaygroundOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}/>
                </svg>
              </button>
            </div>
            
            {isPlaygroundOpen && (
              <section className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden bg-white border border-slate-200/80 shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  
                  {/* Feature 1: Zodiac Lucky Picker */}
                  <div className="space-y-4 pb-6 lg:pb-0 lg:pr-8">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔮</span>
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Horoscope Lucky Pick (星座/十二生肖)</h2>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Select your Chinese Zodiac sign below to calculate your personalized 4D lucky number for today.
                    </p>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {zodiacList.map(z => (
                        <button
                          key={z.name}
                          onClick={() => getZodiacLuckyNumber(z.name)}
                          className={`p-2 rounded-xl text-center border text-[10px] font-extrabold transition-all cursor-pointer ${
                            selectedZodiac === z.name
                              ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-lg mb-0.5">{z.emoji}</div>
                          <div>{z.name}</div>
                        </button>
                      ))}
                    </div>

                    {selectedZodiac && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center animate-pulse-subtle">
                        {isZodiacSpinning ? (
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Calculating Lucky Fortune...</div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                              Lucky 4D for Zodiac {selectedZodiac} today
                            </span>
                            <div className="font-number text-4xl text-amber-500 tracking-[0.25em]">{zodiacLuckyNum}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feature 2: Fortune Red Packet Shaker */}
                  <div className="space-y-4 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🧧</span>
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Red Packet Fortune Shake (搖一搖搖好運)</h2>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-6">
                        Tap the red packet envelope to shake the fortune cylinder and extract your random winning ticket numbers.
                      </p>
                      
                      <div className="flex flex-col items-center justify-center py-4">
                        <button
                          onClick={triggerFortuneShaker}
                          className={`relative text-7xl select-none filter active:scale-95 transition-transform duration-75 cursor-pointer ${
                            isFortuneShaking ? 'animate-bounce' : ''
                          }`}
                          title="Shake for Luck!"
                        >
                          🧧
                        </button>
                        
                        <button 
                          onClick={triggerFortuneShaker}
                          className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer border border-red-700 transition-colors"
                        >
                          {isFortuneShaking ? 'Shaking Cylinder...' : 'Open Red Packet'}
                        </button>
                      </div>
                    </div>

                    {fortuneLuckyNum && (
                      <div className="mt-4 p-4 rounded-xl bg-red-50/50 border border-red-100 text-center animate-pulse-subtle">
                        <span className="text-[10px] text-red-500 uppercase font-black tracking-widest block mb-0.5">
                          Your Fortune Pick Number
                        </span>
                        <div className="font-number text-4xl text-red-600 tracking-[0.25em]">{fortuneLuckyNum}</div>
                      </div>
                    )}
                  </div>

                </div>
              </section>
            )}
          </div>
          
          {/* Regional Filter Tabs */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Select Region</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">Real-time dynamic feeds</span>
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All Results' },
                { id: 'west', label: 'West Malaysia' },
                { id: 'east', label: 'East Malaysia' },
                { id: 'sg', label: 'Singapore Pools' },
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
              const isExpanded = expandedCards[op.id];
              
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
                          alt={op.name} 
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
                          {op.name}
                          <span className="text-[10px] opacity-75 font-semibold">{op.jpName}</span>
                        </h3>
                        <p className="text-[9px] opacity-90 font-semibold uppercase tracking-wider">
                          Draw: <span className="font-mono font-bold">{data?.drawNo || 'PENDING'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-[9px] font-mono font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded text-inherit shadow-sm">
                      {data?.date || results?.date || 'PENDING'}
                    </span>
                  </div>

                  {/* High-Contrast Bold Prize Display */}
                  <div className="p-5 space-y-3 bg-white">
                    
                    {/* 1st Prize */}
                    <div className={`flex flex-col p-4 rounded-xl border bg-gradient-to-br ${op.p1Gradient} relative overflow-hidden group/prize`}>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-slate-500 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                          🏆 1ST PRIZE
                        </span>
                        <button 
                          onClick={() => copyToClipboard(`${op.name} 1st: ${data?.numbers?.first || '----'}`)}
                          className="opacity-0 group-hover/prize:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600"
                          title="Copy result"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                          </svg>
                        </button>
                      </div>
                      <span className="font-number text-4xl text-center text-slate-900 tracking-[0.1em] py-1 drop-shadow-sm">
                        {data?.numbers?.first || '----'}
                      </span>
                    </div>

                    {/* 2nd & 3rd Prize Side-by-Side */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* 2nd Prize */}
                      <div className="flex flex-col p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                        <span className="text-slate-500 text-[8px] font-extrabold uppercase tracking-widest">
                          🥈 2nd Prize
                        </span>
                        <span className="font-number text-2xl text-center text-slate-800 tracking-[0.08em] mt-1">
                          {data?.numbers?.second || '----'}
                        </span>
                      </div>

                      {/* 3rd Prize */}
                      <div className="flex flex-col p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                        <span className="text-slate-500 text-[8px] font-extrabold uppercase tracking-widest">
                          🥉 3rd Prize
                        </span>
                        <span className="font-number text-2xl text-center text-slate-800 tracking-[0.08em] mt-1">
                          {data?.numbers?.third || '----'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Drawers for Specials/Consolation */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-slate-100 bg-slate-50/20 pt-4 space-y-4">
                      
                      {/* Special Numbers */}
                      <div>
                        <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                          Special Prizes
                        </h4>
                        <div className="grid grid-cols-5 gap-1 text-center">
                          {data?.numbers?.special && data.numbers.special.length > 0 ? (
                            data.numbers.special.map((num, i) => (
                              <div 
                                key={i} 
                                className={`font-number text-xs py-1 rounded-md border text-slate-700 bg-white transition-all ${
                                  num === '----' 
                                    ? 'text-slate-300 border-slate-100 bg-slate-50/10' 
                                    : 'border-slate-100 hover:border-slate-200'
                                }`}
                              >
                                {num}
                              </div>
                            ))
                          ) : (
                            Array(10).fill('----').map((num, i) => (
                              <div key={i} className="font-number text-xs py-1 rounded-md border border-slate-50 bg-slate-50/10 text-slate-300">{num}</div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Consolation Numbers */}
                      <div>
                        <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                          Consolation Prizes
                        </h4>
                        <div className="grid grid-cols-5 gap-1 text-center">
                          {data?.numbers?.consolation && data.numbers.consolation.length > 0 ? (
                            data.numbers.consolation.map((num, i) => (
                              <div 
                                key={i} 
                                className={`font-number text-xs py-1 rounded-md border text-slate-700 bg-white transition-all ${
                                  num === '----' 
                                    ? 'text-slate-300 border-slate-100 bg-slate-50/10' 
                                    : 'border-slate-100 hover:border-slate-200'
                                }`}
                              >
                                {num}
                              </div>
                            ))
                          ) : (
                            Array(10).fill('----').map((num, i) => (
                              <div key={i} className="font-number text-xs py-1 rounded-md border border-slate-50 bg-slate-50/10 text-slate-300">{num}</div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Toggle Footer */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px]">
                    <button 
                      onClick={() => toggleExpand(op.id)}
                      className={`font-extrabold uppercase tracking-wider flex items-center gap-1 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        isExpanded 
                          ? 'text-amber-600 bg-amber-50 border border-amber-200' 
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isExpanded ? (
                        <>
                          Hide Specials
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"/>
                          </svg>
                        </>
                      ) : (
                        <>
                          Show All Prizes
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                          </svg>
                        </>
                      )}
                    </button>

                    <span className="text-[9px] text-slate-400 font-mono font-bold">
                      {data?.numbers?.special ? 'Active' : 'Standby'}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* System footer */}
          <footer className="mt-12 text-center text-[10px] text-slate-400 font-medium tracking-widest border-t border-slate-200 pt-8 space-y-2">
            <p>&copy; {new Date().getFullYear()} NEO4D LIVE ENGINE. ALL RIGHTS RESERVED.</p>
            <p className="max-w-md mx-auto leading-relaxed">
              Data aggregated securely in real-time from independent digital broadcasts. 
              All drawings are independent verification check points and not affiliated with official lotteries.
            </p>
          </footer>

        </div>
      </main>
    </>
  );
}