'use client'; 

import { useState, useEffect, useMemo } from 'react';
import './globals.css'; 

export default function Home() {
  const [results, setResults] = useState(null);
  const [isDrawTime, setIsDrawTime] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchNum, setSearchNum] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Tab state
  const [activeRegion, setActiveRegion] = useState('all');
  
  // Collapsible cards state
  const [expandedCards, setExpandedCards] = useState({});

  // List of operators with rich design configurations
  const operators = [
    { 
      id: 'magnum', 
      name: 'MAGNUM 4D', 
      jpName: '萬能', 
      logo: 'M',
      color: 'text-yellow-400', 
      bgGradient: 'from-yellow-500/10 via-yellow-500/2 to-transparent',
      borderColor: 'group-hover:border-yellow-400/50 border-yellow-400/20',
      badgeBg: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
      p1Gradient: 'from-yellow-400/15 via-yellow-500/5 to-transparent border-yellow-400/30'
    },
    { 
      id: 'toto', 
      name: 'SPORTS TOTO', 
      jpName: '多多', 
      logo: 'T',
      color: 'text-red-500', 
      bgGradient: 'from-red-500/10 via-red-500/2 to-transparent',
      borderColor: 'group-hover:border-red-500/50 border-red-500/20',
      badgeBg: 'bg-red-500/10 text-red-500 border-red-500/20',
      p1Gradient: 'from-red-500/15 via-red-500/5 to-transparent border-red-500/30'
    },
    { 
      id: 'damacai', 
      name: 'DA MA CAI 1+3D', 
      jpName: '大馬彩', 
      logo: 'D',
      color: 'text-blue-400', 
      bgGradient: 'from-blue-400/10 via-blue-400/2 to-transparent',
      borderColor: 'group-hover:border-blue-400/50 border-blue-400/20',
      badgeBg: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
      p1Gradient: 'from-blue-400/15 via-blue-500/5 to-transparent border-blue-400/30'
    },
    { 
      id: 'singapore', 
      name: 'SINGAPORE POOLS', 
      jpName: '新加坡', 
      logo: 'SG',
      color: 'text-cyan-400', 
      bgGradient: 'from-cyan-400/10 via-cyan-400/2 to-transparent',
      borderColor: 'group-hover:border-cyan-400/50 border-cyan-400/20',
      badgeBg: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
      p1Gradient: 'from-cyan-400/15 via-cyan-500/5 to-transparent border-cyan-400/30'
    },
    { 
      id: 'sabah', 
      name: 'SABAH 88', 
      jpName: '沙巴', 
      logo: 'S8',
      color: 'text-orange-500', 
      bgGradient: 'from-orange-500/10 via-orange-500/2 to-transparent',
      borderColor: 'group-hover:border-orange-500/50 border-orange-500/20',
      badgeBg: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      p1Gradient: 'from-orange-500/15 via-orange-500/5 to-transparent border-orange-500/30'
    },
    { 
      id: 'sarawak', 
      name: 'SPECIAL CASHSWEEP', 
      jpName: '掃描', 
      logo: 'CS',
      color: 'text-green-500', 
      bgGradient: 'from-green-500/10 via-green-500/2 to-transparent',
      borderColor: 'group-hover:border-green-500/50 border-green-500/20',
      badgeBg: 'bg-green-500/10 text-green-500 border-green-500/20',
      p1Gradient: 'from-green-500/15 via-green-500/5 to-transparent border-green-500/30'
    },
    { 
      id: 'sandakan', 
      name: 'SANDAKAN 4D', 
      jpName: '山打根', 
      logo: 'ST',
      color: 'text-purple-400', 
      bgGradient: 'from-purple-400/10 via-purple-400/2 to-transparent',
      borderColor: 'group-hover:border-purple-400/50 border-purple-400/20',
      badgeBg: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
      p1Gradient: 'from-purple-400/15 via-purple-500/5 to-transparent border-purple-400/30'
    },
  ];

  const checkIsDrawTime = () => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
    const day = now.getDay(); 
    const hour = now.getHours();
    const minute = now.getMinutes();
    const isDrawDay = day === 0 || day === 3 || day === 6 || day === 2; // Sun, Wed, Sat, Tue (Special Draw)
    const isDrawHour = (hour === 19 && minute >= 0) || (hour === 20 && minute <= 30); // 7:00 PM - 8:30 PM Live Draw
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

  // 4D checker logic
  const searchResults = useMemo(() => {
    if (!searchNum || searchNum.length !== 4 || !results) return [];
    
    const matches = [];
    for (const op of operators) {
      const data = getProviderData(op.id);
      if (!data || !data.numbers) continue;
      
      const { first, second, third, special, consolation } = data.numbers;
      
      if (first === searchNum) {
        matches.push({ operator: op.name, prize: '1st Prize 🏆', color: op.color });
      }
      if (second === searchNum) {
        matches.push({ operator: op.name, prize: '2nd Prize 🥈', color: op.color });
      }
      if (third === searchNum) {
        matches.push({ operator: op.name, prize: '3rd Prize 🥉', color: op.color });
      }
      if (special && special.includes(searchNum)) {
        matches.push({ operator: op.name, prize: 'Special Prize 🎫', color: op.color });
      }
      if (consolation && consolation.includes(searchNum)) {
        matches.push({ operator: op.name, prize: 'Consolation Prize 🎟️', color: op.color });
      }
    }
    return matches;
  }, [searchNum, results]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-300 font-medium bg-[#030712]">
        <div className="relative flex h-16 w-16 mb-6">
          <span className="draw-ping-ring absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-70"></span>
          <div className="relative inline-flex rounded-full h-16 w-16 bg-yellow-500/10 border-2 border-yellow-400/80 items-center justify-center text-yellow-400 font-black text-xl tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.25)]">
            4D
          </div>
        </div>
        <p className="tracking-widest uppercase text-xs font-semibold text-slate-400">Loading Live Data Streams...</p>
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
      <main className="min-h-screen text-slate-200 pb-16">
      
      {/* Header and Live indicator */}
      <div className="relative py-8 md:py-12 overflow-hidden border-b border-slate-900 bg-slate-950/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-yellow-400 font-bold bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full tracking-widest uppercase">
              v2.0 Premium
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2">
            NEO<span className="text-yellow-400 font-extrabold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">4D</span><span className="text-slate-600 font-light">.LIVE</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium tracking-[0.25em] uppercase mb-6">
            Real-Time Aggregate Lottery Dashboard
          </p>

          {isDrawTime ? (
            <div className="bg-red-950/30 border border-red-500/40 text-red-400 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse-subtle">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-black tracking-widest uppercase">Live Draw in Progress</span>
            </div>
          ) : (
            <div className="border border-slate-800 bg-slate-950/40 text-slate-400 px-6 py-2.5 rounded-full flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">System Standby / Results Live</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Interactive 4D Number Checker */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 glow-brand relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="max-w-xl mx-auto text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Quick 4D Number Search
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Type your 4-digit number below to check if it has won any prizes in today's draw.
            </p>
            
            <div className="relative mt-2">
              <input
                type="text"
                maxLength="4"
                pattern="\d*"
                value={searchNum}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setSearchNum(val);
                }}
                placeholder="Enter 4-Digit No."
                className="w-full max-w-[280px] bg-slate-950/80 border border-slate-800 focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40 text-center text-4xl font-number tracking-[0.3em] py-3 rounded-2xl text-yellow-400 transition-all outline-none"
              />
              {searchNum && (
                <button 
                  onClick={() => setSearchNum('')}
                  className="absolute right-[calc(50%-130px)] top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Checker Results */}
            {searchNum.length === 4 && (
              <div className="mt-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-900 animate-pulse-subtle">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <span className="inline-block text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest mb-1 animate-bounce">
                      🎉 Winning Number Found!
                    </span>
                    <div className="grid gap-2">
                      {searchResults.map((match, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-800">
                          <span className={`font-black ${match.color} tracking-wider`}>{match.operator}</span>
                          <span className="text-white font-bold bg-slate-800/80 px-3 py-1 rounded-lg text-sm">{match.prize}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 py-2 flex flex-col items-center gap-1.5">
                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">No match found on this draw</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Regional Filter Tabs */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Select Region</span>
            <span className="text-[10px] text-slate-500 font-mono">Drawing live Wed, Sat, Sun & Special Tue</span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'west', label: 'West Malaysia' },
              { id: 'east', label: 'East Malaysia' },
              { id: 'sg', label: 'Singapore Pools' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id)}
                className={`px-6 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider border whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeRegion === tab.id
                    ? 'bg-yellow-400 text-slate-950 border-yellow-400 font-black shadow-[0_0_15px_rgba(234,179,8,0.25)]'
                    : 'bg-slate-950/45 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800'
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
                className={`group bg-slate-950/40 rounded-3xl overflow-hidden border border-slate-900 hover:border-slate-800 transition-all duration-300 relative ${op.borderColor}`}
              >
                {/* Brand border gradient background */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${op.bgGradient.includes('yellow') ? 'from-yellow-400 to-amber-500' : op.bgGradient.includes('red') ? 'from-red-500 to-rose-600' : op.bgGradient.includes('blue') ? 'from-blue-500 to-cyan-500' : op.bgGradient.includes('cyan') ? 'from-cyan-400 to-teal-500' : op.bgGradient.includes('orange') ? 'from-orange-500 to-amber-500' : op.bgGradient.includes('green') ? 'from-green-500 to-emerald-500' : 'from-purple-500 to-indigo-500'}`}></div>

                {/* Operator Header info */}
                <div className="px-6 pt-5 pb-4 flex justify-between items-center border-b border-slate-900/60 bg-slate-950/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center bg-slate-900 border border-slate-800/80 ${op.color}`}>
                      {op.logo}
                    </div>
                    <div>
                      <h3 className="font-black text-sm tracking-wide text-white flex items-center gap-1.5 uppercase">
                        {op.name}
                        <span className="text-[10px] text-slate-500 font-semibold">{op.jpName}</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        Draw: <span className="font-mono text-slate-200">{data?.drawNo || 'PENDING'}</span>
                      </p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-slate-400 shadow-inner">
                    {data?.date || results?.date || 'PENDING'}
                  </span>
                </div>

                {/* Podium Prize Display */}
                <div className="p-6 space-y-3.5 bg-slate-950/10">
                  
                  {/* 1st Prize */}
                  <div className={`flex flex-col p-4 rounded-2xl border bg-gradient-to-br ${op.p1Gradient} relative overflow-hidden group/prize`}>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                        <span className="text-amber-500">🏆</span> 1ST PRIZE
                      </span>
                      <button 
                        onClick={() => copyToClipboard(`${op.name} 1st: ${data?.numbers?.first || '----'}`)}
                        className="opacity-0 group-hover/prize:opacity-100 transition-opacity p-1 text-slate-500 hover:text-slate-300"
                        title="Copy results"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                        </svg>
                      </button>
                    </div>
                    <span className="font-number text-4xl text-center text-white tracking-[0.25em] py-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                      {data?.numbers?.first || '----'}
                    </span>
                  </div>

                  {/* 2nd & 3rd Prize Side-by-Side */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* 2nd Prize */}
                    <div className="flex flex-col p-3 rounded-2xl border border-slate-900 bg-slate-950/40 relative overflow-hidden">
                      <span className="text-slate-400 text-[9px] font-extrabold uppercase tracking-widest">
                        🥈 2nd Prize
                      </span>
                      <span className="font-number text-2xl text-center text-slate-100 tracking-[0.15em] py-1.5 mt-0.5">
                        {data?.numbers?.second || '----'}
                      </span>
                    </div>

                    {/* 3rd Prize */}
                    <div className="flex flex-col p-3 rounded-2xl border border-slate-900 bg-slate-950/40 relative overflow-hidden">
                      <span className="text-slate-500 text-[9px] font-extrabold uppercase tracking-widest">
                        🥉 3rd Prize
                      </span>
                      <span className="font-number text-2xl text-center text-slate-300 tracking-[0.15em] py-1.5 mt-0.5">
                        {data?.numbers?.third || '----'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Drawers for Specials/Consolation */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-slate-900 bg-slate-950/30 pt-5 space-y-5 animate-pulse-subtle">
                    
                    {/* Special Numbers */}
                    <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                        Special Prizes
                      </h4>
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        {data?.numbers?.special && data.numbers.special.length > 0 ? (
                          data.numbers.special.map((num, i) => (
                            <div 
                              key={i} 
                              className={`font-number text-xs py-1.5 rounded-lg border bg-slate-950/80 transition-all ${
                                num === '----' 
                                  ? 'text-slate-700 border-slate-950/80 bg-slate-950/20' 
                                  : 'text-slate-300 border-slate-900 group-hover:border-slate-800'
                              }`}
                            >
                              {num}
                            </div>
                          ))
                        ) : (
                          Array(10).fill('----').map((num, i) => (
                            <div key={i} className="font-number text-xs py-1.5 rounded-lg border border-slate-950/80 bg-slate-950/20 text-slate-800">{num}</div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Consolation Numbers */}
                    <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                        Consolation Prizes
                      </h4>
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        {data?.numbers?.consolation && data.numbers.consolation.length > 0 ? (
                          data.numbers.consolation.map((num, i) => (
                            <div 
                              key={i} 
                              className={`font-number text-xs py-1.5 rounded-lg border bg-slate-950/80 transition-all ${
                                num === '----' 
                                  ? 'text-slate-700 border-slate-950/80 bg-slate-950/20' 
                                  : 'text-slate-300 border-slate-900 group-hover:border-slate-800'
                              }`}
                            >
                              {num}
                            </div>
                          ))
                        ) : (
                          Array(10).fill('----').map((num, i) => (
                            <div key={i} className="font-number text-xs py-1.5 rounded-lg border border-slate-950/80 bg-slate-950/20 text-slate-800">{num}</div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Toggle Footer */}
                <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-900/60 flex justify-between items-center text-[11px]">
                  <button 
                    onClick={() => toggleExpand(op.id)}
                    className={`font-bold uppercase tracking-wider flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                      isExpanded 
                        ? 'text-yellow-400 bg-yellow-400/5' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {isExpanded ? (
                      <>
                        Collapse Prizes
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"/>
                        </svg>
                      </>
                    ) : (
                      <>
                        View All Prizes (+20)
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-slate-600 font-mono">
                    {data?.numbers?.special ? 'Data Secure' : 'Standby'}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* System footer */}
        <footer className="mt-16 text-center text-[10px] text-slate-600 font-medium tracking-widest border-t border-slate-950 pt-8 space-y-2">
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